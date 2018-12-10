import { mandate } from '@vka/ts-utils';

import { Command } from '../command';
import { ExecuteFn, createExecuteFn } from '../execute-function';

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
    return {
        name,
        execute: createExecuteFn(commands),
    };
}
