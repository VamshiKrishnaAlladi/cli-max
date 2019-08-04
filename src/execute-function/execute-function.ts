import { mandate } from '@vka/ts-utils';
import * as minimist from 'minimist';

import { Command, CLIArgs, CommandOption } from '../command';

export type ExecuteFn = (args?: string[]) => any;

function processArgs(args: CLIArgs, options: CommandOption[] = []): CLIArgs {
    const defaultValues = options.reduce((defaultValuesMap, option) => (
        defaultValuesMap[option.name] = option.defaultValue, defaultValuesMap
    ), {});

    const deAliasedOptionNames = options.reduce((deAliasedOptionNamesMap, option) => option.aliases.reduce(
        (deAliasedOptionNamesMap, alias) => {
            deAliasedOptionNamesMap[alias] = option.name;
            return deAliasedOptionNamesMap;
        },
        deAliasedOptionNamesMap,
    ), {});

    return Object.entries(args).reduce((processedArgs, [key, value]) => {
        const deAliasedOptionName = deAliasedOptionNames[key] || key;

        processedArgs[deAliasedOptionName] = value === true
            ? (defaultValues[deAliasedOptionName] || true)
            : value;

        return processedArgs;
    }, defaultValues);
}

export function createExecuteFn(commands: Command[] = mandate('commands')): ExecuteFn {
    return (args: string[] = mandate('args')) => {
        const [defaultCommand] = commands.filter(command => command.isDefault);

        const {
            _: [commandName = defaultCommand.name, ...subCommands],
            ...remainingArgs
        } = minimist(args);

        const [commandToExecute = defaultCommand] = commands.filter(({ name, aliases = [] }) => {
            return name === commandName || aliases.includes(commandName);
        });

        const processedArgs = processArgs(remainingArgs, commandToExecute.options);

        return commandToExecute.action({ subCommands, args: processedArgs });
    };
}
