import { mandate } from '@vka/ts-utils';
import * as minimist from 'minimist';

import { Command } from '../command';
import { processArgs } from '../command-options';

export type ExecuteFn = (args?: string[]) => any;

export function createExecuteFn(commands: Command[] = mandate('commands')): ExecuteFn {
    return (args: string[] = mandate('args')) => {
        const [defaultCommand] = commands.filter(command => command.isDefault);

        const {
            _: [commandName = defaultCommand.name, ...subCommands],
            ...remainingArgs
        } = minimist(args);

        const [commandToExecute = defaultCommand] = commands.filter(({ name, aliases = [] }) => {
            return name === commandName || aliases.includes(commandName);
        });

        const processedArgs = processArgs(remainingArgs, commandToExecute.options);

        return commandToExecute.action({ subCommands, args: processedArgs });
    };
}
