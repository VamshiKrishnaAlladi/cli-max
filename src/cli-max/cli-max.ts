import { mandate } from '@vka/ts-utils';

import { Command } from '../command';
import { ExecuteFn, createExecuteFn } from '../execute-function';

export function createCLI(command: Command = mandate('command')): ExecuteFn {
    return createExecuteFn(command);
}
