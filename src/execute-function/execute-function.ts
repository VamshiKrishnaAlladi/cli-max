import { mandate } from '@vka/ts-utils';
import * as minimist from 'minimist';

import { RuntimeFlags, Option, Command } from '../command';

export type ExecuteFn = (args?: string[]) => any;

function processFlags(flags: RuntimeFlags, options: Option[] = []): RuntimeFlags {
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

export function createExecuteFn(command: Command = mandate('command')): ExecuteFn {
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
                flags: processFlags(runtimeFlags, options),
            });
        }

        return commandToExecute.action({
            parameters: remainingParameters,
            flags: processFlags(runtimeFlags, commandToExecute.options),
        });
    };
}
