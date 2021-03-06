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

export type GetHelpFn = () => string;

export interface ActionParams {
    parameters: string[];
    flags: RuntimeFlags;
    getHelp: GetHelpFn;
}

// eslint-disable-next-line no-unused-vars
export type Action = (params: ActionParams) => any;

export interface SubCommand {
    name: string;
    description: string;
    usage: string;
    action: Action;
    getHelp?: GetHelpFn;
    aliases?: string[];
    options?: Option[];
    isDefault?: boolean;
}

export interface Command {
    name: string;
    description: string;
    usage: string;
    action?: Action;
    getHelp?: GetHelpFn;
    options?: Option[];
    subCommands?: SubCommand[];
}
