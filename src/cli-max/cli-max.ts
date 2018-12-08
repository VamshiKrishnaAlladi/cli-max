import { mandate } from '@vka/ts-utils';
import * as minimist from 'minimist';

import { Command } from '../command';

interface CommandMap {
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
    name?: string;
    commands?: Command[];
}

export function createCLI(
    { name = mandate('name'), commands = mandate('commands') }: CLIConfig = {},
): CLI {
    let defaultCommand: Command;

    const commandMap: CommandMap = commands.reduce((config, command) => {
        config[command.name] = command;

        if (!defaultCommand && command.isDefault) {
            defaultCommand = command;
        }

        return config;
    }, {});

    return {
        name,
        execute: (args: string[] = mandate('args')) => {
            const {
                _: [commandName = defaultCommand.name, ...subCommands],
                ...remainingArgs
            } = minimist(args);

            const commandToExecute = commandMap[commandName] || defaultCommand;

            return commandToExecute.action({ subCommands, args: remainingArgs });
        },
    };
}
