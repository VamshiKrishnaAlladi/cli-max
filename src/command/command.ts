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

export interface ActionParams {
    subCommands: string[];
    args: CLIArgs;
}

export type Action = (params: ActionParams) => any;

export interface Command {
    name: string;
    action: Action;
    aliases?: string[];
    options?: CommandOption[];
    description?: string;
    usage?: string;
    isDefault?: boolean;
}
