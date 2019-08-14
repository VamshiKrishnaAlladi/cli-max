export interface RuntimeFlags {
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
    arguments: string[];
    flags: RuntimeFlags;
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
    action?: Action;
    options?: Option[];
    subCommands?: SubCommand[];
}
