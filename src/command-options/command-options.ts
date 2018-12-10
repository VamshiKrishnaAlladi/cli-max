import { mandate } from '@vka/ts-utils';

export interface CLIArgs {
    [key: string]: any;
}

export interface CommandOption {
    name: string;
    aliases: string[];
    description: string;
    defaultValue: any;
    required: boolean;
}

export function processArgs(args: CLIArgs = mandate('args'), options: CommandOption[] = []): CLIArgs {
    const deAliasMap = options.reduce(
        (deAliasMap, option) => option.aliases.reduce(
            (deAliasMap, alias) => {
                deAliasMap[alias] = option.name;
                return deAliasMap;
            },
            deAliasMap,
        ),
        {},
    );

    return Object.entries(args).reduce((processedArgs, [key, value]) => {
        processedArgs[deAliasMap[key] || key] = value;

        return processedArgs;
    }, {});
}
