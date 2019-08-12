import { MissingMandatoryParamError } from '@vka/ts-utils';

import { createExecuteFn } from './execute-function';
import { Command, SubCommand, Action, ActionParams } from '../command';

const fakeSubCommands: SubCommand[] = [
    {
        name: 'test',
        description: 'a test command',
        usage: 'test <params>',
        action: ({ arguments: subCommands, flags: args }) => ({ subCommands, args }),
    },
    {
        name: 'default',
        description: 'the default command',
        usage: 'default',
        action: () => 'default',
        isDefault: true,
    },
    {
        name: 'another-default',
        description: 'another default command',
        usage: 'another-default',
        action: () => 'another-default',
        isDefault: true,
    },
    {
        name: 'add',
        description: 'performs addition of two values',
        usage: 'add -a <value1> -b <value2>',
        action: ({ flags: { a, b } }) => a + b,
        aliases: ['sum'],
    },
    {
        name: 'divide',
        description: 'performs division on two values',
        usage: 'divide --divisor <value1> --dividend <value2>',
        action: ({ flags: { dividend, divisor } }) => (dividend / divisor),
        options: [
            {
                name: 'dividend',
                aliases: ['a'],
                description: 'this is what is to be divided',
                defaultValue: 1,
                required: false,
            }, {
                name: 'divisor',
                aliases: ['b'],
                description: 'this is what is divided with',
                defaultValue: 1,
                required: false,
            },
        ],
    },
];

const fakeAction: Action = actionParams => ({ ...actionParams });

const baseCommand: Command = {
    name: 'fake-command',
    description: 'This command is for testing purposes',
    usage: 'fake-command <sub-command> <params>',
};

const fakeCommandWithSubCommands: Command = {
    ...baseCommand,
    subCommands: fakeSubCommands,
};

const fakeCommandWithAction: Command = {
    ...baseCommand,
    action: fakeAction,
};

describe('execute-function Module', () => {
    it('should export a method called "createExecuteFn"', () => {
        const exports = require('./execute-function');

        expect(exports).toHaveProperty('createExecuteFn');
        expect(exports.createExecuteFn).toBeInstanceOf(Function);
    });

    describe('createExecuteFn function', () => {
        it('should throw a "MissingMandatoryParamError" when "command" is NOT passed', () => {
            try {
                createExecuteFn();
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('command');
            }

            expect.assertions(2);
        });

        it('should return an "execute" function for commands passed', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            expect(execute).toBeInstanceOf(Function);
        });
    });

    describe('execute function', () => {
        it('should throw "MissingMandatoryParamError" when "processArgs" is not passed', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            try {
                execute();
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toEqual('processArgs');
            }

            expect.assertions(2);
        });

        it('should run the action configured in the command passed when creating the cli', () => {
            const execute = createExecuteFn(fakeCommandWithAction);

            const result = execute(['argument1', 'argument2', '--flag1', '10', '--flag2', '20']);

            expect(result).toEqual({
                arguments: ['argument1', 'argument2'],
                flags: {
                    flag1: 10,
                    flag2: 20,
                },
            });
        });

        it('should run the command configured while creating the cli', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            const result = execute(['test', 'something', '-a', '--bar', '--no-clue', '-d=testing 1 2 3']);

            expect(result).toEqual({
                subCommands: ['something'],
                args: {
                    a: true,
                    bar: true,
                    clue: false,
                    d: 'testing 1 2 3',
                },
            });
        });

        it('should run the default command configured if no command is specified while executing', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            const result = execute([]);

            expect(result).toBe('default');
        });

        it('should run the first default command, when found multiple default commands', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            const result = execute([]);

            expect(result).toBe('default');
        });

        it('should run the default command configured, if the command specified in args is not found', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            const result = execute(['non-existant-command-name']);

            expect(result).toBe('default');
        });

        it('should run the action of the command whose alias is called at runtime', () => {
            const executeFn = createExecuteFn(fakeCommandWithSubCommands);

            const result = executeFn(['sum', '--a=10', '--b=20']);

            expect(result).toBe(30);
        });

        it('should run the action with proper de-aliased args for options', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            const result = execute(['divide', '--a=20', '--b=2']);

            expect(result).toBe(10);
        });
    });
});
