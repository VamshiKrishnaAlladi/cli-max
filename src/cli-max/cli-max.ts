import { mandate } from '@vka/ts-utils';

import { Command } from '../command';
import { createExecuteFn, ExecuteConfig, ExecuteFn } from '../execute-function';

export interface CLIConfig extends ExecuteConfig {}

export function createCLI(command: Command = mandate('command'), config?: CLIConfig): ExecuteFn {
    return createExecuteFn(command, config);
}
