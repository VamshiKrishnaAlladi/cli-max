import { mandate } from '@vka/ts-utils';

export interface Command {
    name: string;
    action: Function;
    help?: string;
}

export type CLI = {
    parse: Function;
};

export function isCLI(cli: any): cli is CLI {
    return cli.parse instanceof Function;
}

export function createCLI(commands: Command[] = mandate('commands')): CLI {
    return {
        parse: () => {},
    };
}
