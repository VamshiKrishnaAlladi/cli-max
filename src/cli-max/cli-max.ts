import { mandate } from '@vka/ts-utils';

import { Command } from '../command';
import { ExecuteFn, createExecuteFn } from '../execute-function';

export type CLI = {
    name: string;
    description: string,
    execute: ExecuteFn;
};

export function isCLI(cli: any): cli is CLI {
    return (
        cli instanceof Object &&
        cli.hasOwnProperty('name') &&
        !!cli.name &&
        cli.hasOwnProperty('description') &&
        !!cli.description &&
        cli.hasOwnProperty('execute') &&
        cli.execute instanceof Function
    );
}

export interface CLIConfig {
    name: string;
    description: string;
    commands: Command[];
}

export function createCLI(
    {
        name = mandate('name'),
        description = mandate('description'),
        commands = mandate('commands'),
    }: CLIConfig = mandate('config'),
): CLI {
    return {
        name,
        description,
        execute: createExecuteFn(commands),
    };
}
