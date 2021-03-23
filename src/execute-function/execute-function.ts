/* eslint-disable no-console */
import { mandate } from '@vka/ts-utils';
import minimist from 'minimist';

import { Command, Option, RuntimeFlags } from '../command';
import { createGetHelpFn, defaultHelpConfig, HelpConfig } from '../get-help-function';

// eslint-disable-next-line no-unused-vars
export type ExecuteFn = (args?: string[]) => any;

export interface ExecuteConfig extends HelpConfig {
    generateHelp?: boolean;
    handleHelp?: boolean;
}

export const defaultExecuteConfig: ExecuteConfig = {
    ...defaultHelpConfig,
    generateHelp: true,
    handleHelp: true,
};

function processFlags(options: Option[] = [], flags: RuntimeFlags): RuntimeFlags {
    const defaultValuesMap = options.reduce((valuesMap, option) => {
        // eslint-disable-next-line no-param-reassign
        valuesMap[option.name] = option.defaultValue;
        return valuesMap;
    }, {});

    const deAliasedOptionNamesMap = options.reduce((optionNames, option) => option.aliases.reduce(
        (optNames, alias) => {
            // eslint-disable-next-line no-param-reassign
            optNames[alias] = option.name;
            return optNames;
        },
        optionNames,
    ), {});

    return Object.entries(flags).reduce((processedFlags, [flag, value]) => {
        const deAliasedOptionName = deAliasedOptionNamesMap[flag] || flag;

        // eslint-disable-next-line no-param-reassign
        processedFlags[deAliasedOptionName] = value === true
            ? (defaultValuesMap[deAliasedOptionName] || true)
            : value;

        return processedFlags;
    }, defaultValuesMap);
}

export function createExecuteFn(
    command: Command = mandate('command'),
    config: ExecuteConfig = defaultExecuteConfig,
): ExecuteFn {
    const { action, options, subCommands = [] } = command;
    const { generateHelp, handleHelp, ...helpConfig } = { ...defaultExecuteConfig, ...config };

    return (processArgs: string[] = mandate('processArgs')) => {
        const { _: parameters, ...runtimeFlags } = minimist(processArgs.slice(2));

        const [commandName, ...remainingParameters] = parameters;

        const [defaultCommand] = subCommands.filter((cmd) => cmd.isDefault);

        const [commandToExecute = defaultCommand] = subCommands.filter(
            ({ name, aliases = [] }) => name === commandName || aliases.includes(commandName),
        );

        if (handleHelp && runtimeFlags.help) {
            const commandToUse = commandToExecute || command;

            if (commandToUse.help) {
                console.log(commandToUse.help());
                return undefined;
            }

            console.log(createGetHelpFn(commandToUse, helpConfig)());
            return undefined;
        }

        if (!commandToExecute) {
            if (action) {
                return action({
                    parameters,
                    flags: processFlags(options, runtimeFlags),
                    ...(generateHelp && { getHelp: createGetHelpFn(command, helpConfig) }),
                });
            }

            if (handleHelp) {
                console.log(createGetHelpFn(command, helpConfig)());
            }

            return undefined;
        }

        return commandToExecute.action({
            parameters: remainingParameters,
            flags: processFlags(commandToExecute.options, runtimeFlags),
            ...(generateHelp && { getHelp: createGetHelpFn(commandToExecute, helpConfig) }),
        });
    };
}
