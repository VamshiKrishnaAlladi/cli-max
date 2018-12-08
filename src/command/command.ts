export interface CLIArgs {
    [key: string]: any;
}

export interface ActionParams {
    subCommands: string[];
    args: CLIArgs;
}

export type Action = (params: ActionParams) => any;

export interface CommandOption {
    name: string;
    alias: string;
    description: string;
    defaultValue: any;
    required: boolean;
}

export interface Command {
    name: string;
    action: Action;
    options?: CommandOption[];
    usage?: string;
    description?: string;
    isDefault?: boolean;
}
