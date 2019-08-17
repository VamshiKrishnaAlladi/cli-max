import { mandate } from '@vka/ts-utils';
import * as minimist from 'minimist';

import { Command, Option, RuntimeFlags } from '../command';
import { createGetHelpFn, HelpConfig } from '../get-help-function';

export type ExecuteFn = (args?: string[]) => any;

export interface ExecuteConfig extends HelpConfig {
    generateHelp?: boolean;
}

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

const defaultConfig: ExecuteConfig = {
    generateHelp: true,
};

export function createExecuteFn(
    command: Command = mandate('command'),
    { generateHelp, prettyHelp }: ExecuteConfig = defaultConfig,
): ExecuteFn {
    const { action, options, subCommands = [] } = command;

    return (processArgs: string[] = mandate('processArgs')) => {

        const { _: parameters, ...runtimeFlags } = minimist(processArgs);

        const [commandName, ...remainingParameters] = parameters;

        const [defaultCommand] = subCommands.filter(command => command.isDefault);

        const [commandToExecute = defaultCommand] = subCommands.filter(({ name, aliases = [] }) => {
            return name === commandName || aliases.includes(commandName);
        });

        if (!commandToExecute && action) {
            return action({
                parameters,
                flags: processFlags(options, runtimeFlags),
                ...(generateHelp && { getHelp: createGetHelpFn(command, { prettyHelp }) }),
            });
        }

        return commandToExecute.action({
            parameters: remainingParameters,
            flags: processFlags(commandToExecute.options, runtimeFlags),
            ...(generateHelp && { getHelp: createGetHelpFn(commandToExecute, { prettyHelp }) }),
        });
    };
}
