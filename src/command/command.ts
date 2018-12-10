import { CommandOption, CLIArgs } from '../command-options';

export interface ActionParams {
    subCommands: string[];
    args: CLIArgs;
}

export type Action = (params: ActionParams) => any;

export interface Command {
    name: string;
    action: Action;
    options?: CommandOption[];
    usage?: string;
    description?: string;
    isDefault?: boolean;
}
