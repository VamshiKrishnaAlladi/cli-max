import { mandate } from '@vka/ts-utils';
import * as minimist from 'minimist';

import { Command, Option, RuntimeFlags } from '../command';
import { createGetHelpFn, defaultHelpConfig, HelpConfig } from '../get-help-function';

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
    const defaultValuesMap = options.reduce((defaultValuesMap, option) => (
        defaultValuesMap[option.name] = option.defaultValue, defaultValuesMap
    ), {});

    const deAliasedOptionNamesMap = options.reduce((deAliasedOptionNamesMap, option) => option.aliases.reduce(
        (deAliasedOptionNamesMap, alias) => (deAliasedOptionNamesMap[alias] = option.name, deAliasedOptionNamesMap),
        deAliasedOptionNamesMap,
    ), {});

    return Object.entries(flags).reduce((processedFlags, [flag, value]) => {
        const deAliasedOptionName = deAliasedOptionNamesMap[flag] || flag;

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

        const [defaultCommand] = subCommands.filter(command => command.isDefault);

        const [commandToExecute = defaultCommand] = subCommands.filter(({ name, aliases = [] }) => {
            return name === commandName || aliases.includes(commandName);
        });

        if (handleHelp && runtimeFlags.help) {
            const commandToUse = commandToExecute || command;

            if (commandToUse.help) {
                console.log(commandToUse.help());
                return;
            }

            console.log(createGetHelpFn(commandToUse, helpConfig)());
            return;
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

            return;
        }

        return commandToExecute.action({
            parameters: remainingParameters,
            flags: processFlags(commandToExecute.options, runtimeFlags),
            ...(generateHelp && { getHelp: createGetHelpFn(commandToExecute, helpConfig) }),
        });
    };
}
