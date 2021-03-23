/* eslint-disable no-console */
import { MissingMandatoryParamError } from '@vka/ts-utils';

import { Action, Command, SubCommand } from '../command';
import { createExecuteFn } from './execute-function';

const fakeSubCommands: SubCommand[] = [
    {
        name: 'test',
        description: 'a test command',
        usage: 'test <params>',
        action: ({ parameters, flags }) => ({ parameters, flags }),
    },
    {
        name: 'custom-help',
        description: 'a command with custom help fn',
        usage: 'test custom-help < --flags >',
        action: () => {},
        help: () => 'the custom help',
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

const fakeAction: Action = () => 'fake-action-result';

const checkHelpAction: Action = ({ getHelp }) => (!!getHelp);

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

const fakeCommandWithCheckHelpAction: Command = {
    ...baseCommand,
    action: checkHelpAction,
};

const helpForDefaultSubCommand = `
default - the default command

usage: default
`;

const helpForBaseCommand = `
fake-command - This command is for testing purposes

usage: fake-command <sub-command> <params>
`;

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
            } catch (error) {
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
        const originalLog = console.log;

        afterEach(() => { console.log = originalLog; });

        it('should throw "MissingMandatoryParamError" when "processArgs" is not passed', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            try {
                execute();
            } catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toEqual('processArgs');
            }

            expect.assertions(2);
        });

        it('should call the "help" function configure in the command when --help is passed', () => {
            const mockLog = jest.fn();
            console.log = mockLog;

            const execute = createExecuteFn(fakeCommandWithSubCommands, { prettyHelp: false });

            execute(['node-path', 'src-file-path', 'custom-help', '--help']);

            expect(mockLog.mock.calls[0]).toEqual(['the custom help']);
        });

        it('should print auto generated help details when --help flag is passed', () => {
            const mockLog = jest.fn();
            console.log = mockLog;

            const execute = createExecuteFn(fakeCommandWithSubCommands, { prettyHelp: false });

            execute(['node-path', 'src-file-path', '--help']);

            expect(mockLog.mock.calls[0]).toEqual([helpForDefaultSubCommand]);
        });

        it('should print "help" of the main command if default and sub-commands are NOT configured', () => {
            const mockLog = jest.fn();
            console.log = mockLog;

            const execute = createExecuteFn(fakeCommandWithAction, { prettyHelp: false });

            execute(['node-path', 'src-file-path', '--help']);

            expect(mockLog.mock.calls[0]).toEqual([helpForBaseCommand]);
        });

        it('should print "help" when main action is NOT configured and no sub-command is called', () => {
            const mockLog = jest.fn();
            console.log = mockLog;

            const execute = createExecuteFn(baseCommand, { prettyHelp: false });

            execute(['node-path', 'src-file-path']);

            expect(mockLog.mock.calls[0]).toEqual([helpForBaseCommand]);
        });

        it('should NOT show "help" even if main action is not defined when "handleHelp" is configured to false', () => {
            const mockLog = jest.fn();
            console.log = mockLog;

            const execute = createExecuteFn(baseCommand, { prettyHelp: false, handleHelp: false });

            const result = execute(['node-path', 'src-file-path']);

            expect(mockLog.mock.calls.length).toBe(0);
            expect(result).toBe(undefined);
        });

        it('should not show "help" even if --help flag is passed when "handleHelp" is configured to false', () => {
            const mockLog = jest.fn();
            console.log = mockLog;

            const execute = createExecuteFn(fakeCommandWithSubCommands, { handleHelp: false });

            const result = execute(['node-path', 'src-file-path', '--help']);

            expect(mockLog.mock.calls.length).toBe(0);
            expect(result).toEqual('default');
        });

        it('should execute the command configured while creating the cli', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            const result = execute(
                ['node-path', 'src-file-path', 'test', 'something', '-a', '--bar', '--no-clue', '-d=testing 1 2 3'],
            );

            expect(result).toEqual({
                parameters: ['something'],
                flags: {
                    a: true,
                    bar: true,
                    clue: false,
                    d: 'testing 1 2 3',
                },
            });
        });

        it('should execute the default command configured if no command is specified while executing', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            const result = execute(['node-path', 'src-file-path']);

            expect(result).toBe('default');
        });

        it('should execute the first default command, when found multiple default commands', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            const result = execute(['node-path', 'src-file-path']);

            expect(result).toBe('default');
        });

        it('should execute the default command configured, if the command specified in args is not found', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            const result = execute(['node-path', 'src-file-path', 'non-existant-command-name']);

            expect(result).toBe('default');
        });

        it('should execute the action of the command whose alias is called at runtime', () => {
            const executeFn = createExecuteFn(fakeCommandWithSubCommands);

            const result = executeFn(['node-path', 'src-file-path', 'sum', '--a=10', '--b=20']);

            expect(result).toBe(30);
        });

        it('should execute the action with proper de-aliased args for options', () => {
            const execute = createExecuteFn(fakeCommandWithSubCommands);

            const result = execute(['node-path', 'src-file-path', 'divide', '--a=20', '--b=2']);

            expect(result).toBe(10);
        });

        it('should execute the main action if the command given at runtime is invalid & has no default command', () => {
            const execute = createExecuteFn(fakeCommandWithAction);

            const result = execute(
                ['node-path', 'src-file-path', 'argument1', 'argument2', '--flag1', '10', '--flag2', '20'],
            );

            expect(result).toEqual('fake-action-result');
        });

        it('should not generate Help when configured not to', () => {
            const execute = createExecuteFn(
                fakeCommandWithCheckHelpAction,
                { generateHelp: false },
            );

            const result = execute(['node-path', 'src-file-path']);

            expect(result).toBe(false);
        });
    });
});
