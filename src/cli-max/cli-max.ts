import { mandate } from '@vka/ts-utils';

import { Command } from '../command';
import { createExecuteFn, defaultExecuteConfig, ExecuteConfig, ExecuteFn } from '../execute-function';

export interface CLIConfig extends ExecuteConfig {}

export const defaultCLIConfig: CLIConfig = defaultExecuteConfig;

export function createCLI(
    command: Command = mandate('command'),
    config: CLIConfig = defaultCLIConfig,
): ExecuteFn {
    return createExecuteFn(command, config);
}
