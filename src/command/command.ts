import { CommandOption, CLIArgs } from '../command-options';

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
