import { mandate } from '@vka/ts-utils';
import * as minimist from 'minimist';

import { Command } from '../command';
import { processArgs } from '../command-options';

interface CommandMap {
    [commandName: string]: Command;
}

export type ExecuteFn = (args?: string[]) => any;

export function createExecuteFn(commands: Command[] = mandate('commands')): ExecuteFn {
    const [defaultCommand] = commands.filter(command => command.isDefault);

    const commandMap: CommandMap = commands.reduce((commandMap, command) => {
        commandMap[command.name] = command;
        return commandMap;
    }, {});

    return (args: string[] = mandate('args')) => {
        const {
            _: [commandName = defaultCommand.name, ...subCommands],
            ...remainingArgs
        } = minimist(args);

        const commandToExecute = commandMap[commandName] || defaultCommand;

        const processedArgs = processArgs(remainingArgs, commandToExecute.options);

        return commandToExecute.action({ subCommands, args: processedArgs });
    };
}
