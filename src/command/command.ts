export interface CLIArgs {
    [key: string]: any;
}

export interface Option {
    name: string;
    aliases: string[];
    description: string;
    defaultValue: any;
    required: boolean;
}

export interface ActionParams {
    subCommands: string[];
    args: CLIArgs;
}

export type Action = (params: ActionParams) => any;

export interface SubCommand {
    name: string;
    description: string;
    usage: string;
    action: Action;
    aliases?: string[];
    options?: Option[];
    isDefault?: boolean;
}

export interface Command {
    name: string;
    description: string;
    usage: string;
    action: Action;
    subCommands: SubCommand[];
}
