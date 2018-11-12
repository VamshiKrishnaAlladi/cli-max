import { mandate } from '@vka/ts-utils';
import * as minimist from 'minimist';

export interface CLIArgs {
    [key: string]: any;
}

export type Action = (subCommands: string[], args: CLIArgs) => any;

export interface CommandOption {
    name: string;
    alias: string;
    description: string;
    defaultValue?: any;
    required?: boolean;
}

export interface Command {
    name: string;
    action: Action;
    options?: CommandOption[];
    usage?: string;
    description?: string;
    isDefault?: boolean;
}

interface CommandConfig {
    [commandName: string]: Command;
}

export type ExecuteFn = (args?: string[]) => any;

export type CLI = {
    name: string;
    execute: ExecuteFn;
};

export function isCLI(cli: any): cli is CLI {
    return (
        cli instanceof Object &&
        cli.hasOwnProperty('execute') &&
        cli.execute instanceof Function
    );
}

export interface CLIConfig {
    name: string;
    commands?: Command[];
}

export function createCLI({ name, commands = mandate('commands') }: CLIConfig): CLI {
    let defaultCommand: Command = null;
    const commandConfig: CommandConfig = commands.reduce((config, command) => {
        config[command.name] = command;

        if (command.isDefault) { defaultCommand = command; }

        return config;
    }, {});

    const defaultHelpCommand: Command = {
        name: 'help',
        action: () => {},
        options: [{
            name: 'help',
            alias: 'h',
            description: 'Displays this help content',
        }],
    };

    commandConfig.help = commandConfig.help || defaultHelpCommand;
    defaultCommand = defaultCommand || defaultHelpCommand;

    return {
        name,
        execute: (args: string[] = mandate('args')) => {
            const { _: [commandName = defaultCommand.name, ...subCommands], ...remainingArgs } = minimist(args);

            const command = commandConfig[commandName];

            return command.action(subCommands, remainingArgs);
        },
    };
}
