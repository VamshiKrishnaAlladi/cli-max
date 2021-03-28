/* eslint-disable no-console */
import { mandate } from '@vka/ts-utils';
import minimist from 'minimist';

import { Command, Option, RuntimeFlags, SubCommand } from '../command';
import { createGetHelpFn, defaultHelpConfig, HelpConfig } from '../get-help-function';

// eslint-disable-next-line no-unused-vars
export type ExecuteFn = (args?: string[]) => any;

export interface ExecuteConfig extends HelpConfig {
    handleHelp?: boolean;
}

export const defaultExecuteConfig: ExecuteConfig = {
    ...defaultHelpConfig,
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

function runCommand(
    commandToRun: Command | SubCommand,
    parameters: string[],
    flags: RuntimeFlags,
    config: ExecuteConfig,
) {
    const { handleHelp, ...helpConfig } = config;
    const getHelp = commandToRun.getHelp || createGetHelpFn(commandToRun, helpConfig);

    // show help when explicitly asked for
    if (handleHelp && flags.help) {
        console.log(getHelp());
        return true;
    }

    // run the action for the command
    if (commandToRun.action) {
        return commandToRun.action({
            parameters,
            flags: processFlags(commandToRun.options, flags),
            ...(handleHelp && { getHelp }),
        });
    }

    // show help when action is unavailable
    if (handleHelp) {
        console.log(getHelp());
        return true;
    }

    return false;
}

export function createExecuteFn(
    command: Command = mandate('command'),
    config: ExecuteConfig = defaultExecuteConfig,
): ExecuteFn {
    const { subCommands = [] } = command;
    const [defaultSubCommand] = subCommands.filter((subCommand) => subCommand.isDefault);

    return (processArgs: string[] = mandate('processArgs')) => {
        const { _: parameters, ...runtimeFlags } = minimist(processArgs.slice(2));

        const [commandName, ...remainingParameters] = parameters;

        const [subCommandToExecute = defaultSubCommand] = subCommands.filter(
            ({ name, aliases = [] }) => name === commandName || aliases.includes(commandName),
        );

        if (subCommandToExecute) {
            return runCommand(
                subCommandToExecute,
                remainingParameters,
                processFlags(subCommandToExecute.options, runtimeFlags),
                { ...defaultExecuteConfig, ...config },
            );
        }

        return runCommand(
            command,
            parameters,
            processFlags(command.options, runtimeFlags),
            { ...defaultExecuteConfig, ...config },
        );
    };
}
