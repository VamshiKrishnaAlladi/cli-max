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
    const { defaultValuesMap, deAliasMap } = options.reduce(
        ({ deAliasMap, defaultValuesMap }, option) => {
            defaultValuesMap[option.name] = option.defaultValue || true;

            return {
                defaultValuesMap,
                deAliasMap: option.aliases.reduce(
                    (deAliasMap, alias) => (deAliasMap[alias] = option.name, deAliasMap),
                    deAliasMap,
                ),
            };
        },
        { deAliasMap: {}, defaultValuesMap: {} },
    );

    return Object.entries(args).reduce((processedArgs, [key, value]) => {
        const deAliasedKey = deAliasMap[key] || key;

        processedArgs[deAliasedKey] = value === true
            ? (defaultValuesMap[deAliasedKey] || true)
            : value;

        return processedArgs;
    }, defaultValuesMap);
}
