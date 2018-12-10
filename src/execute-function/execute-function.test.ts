import { MissingMandatoryParamError } from '@vka/ts-utils';

import { createExecuteFn } from './execute-function';

describe('execute-function Module', () => {
    it('should export a method called "createExecuteFn"', () => {
        const exports = require('./execute-function');

        expect(exports).toHaveProperty('createExecuteFn');
        expect(exports.createExecuteFn).toBeInstanceOf(Function);
    });

    describe('createExecuteFn function', () => {
        it('should throw a "MissingMandatoryParamError" when "commands" is NOT passed', () => {
            try {
                createExecuteFn();
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('commands');
            }

            expect.assertions(2);

        });

        it('should return an "execute" function for commands passed', () => {
            const execute = createExecuteFn([]);

            expect(execute).toBeInstanceOf(Function);
        });
    });

    describe('execute function', () => {
        it('should throw "MissingMandatoryParamError" when "args" is not passed', () => {
            const execute = createExecuteFn([]);

            try {
                execute();
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toEqual('args');
            }

            expect.assertions(2);
        });

        it('should run the command configured while creating the cli', () => {
            const execute = createExecuteFn([{
                name: 'test',
                description: 'a test command',
                action: ({ subCommands, args }) => ({ subCommands, args }),
            }]);

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
            const execute = createExecuteFn([
                {
                    name: 'some-command',
                    action: () => 'some-command',
                },
                {
                    name: 'default',
                    action: () => 'default',
                    isDefault: true,
                },
            ]);

            const result = execute([]);

            expect(result).toBe('default');
        });

        it('should run the first default command, when found multiple default commands', () => {
            const execute = createExecuteFn([
                {
                    name: 'first-default',
                    action: () => 'first-default',
                    isDefault: true,
                },
                {
                    name: 'second-default',
                    action: () => 'second-default',
                    isDefault: true,
                },
            ]);

            const result = execute([]);

            expect(result).toBe('first-default');
        });

        it('should run the default command configured, if the command specified in args is not found', () => {
            const execute = createExecuteFn([
                {
                    name: 'some-command',
                    action: () => 'some-command',
                },
                {
                    name: 'default',
                    action: () => 'default',
                    isDefault: true,
                },
            ]);

            const result = execute(['something-else']);

            expect(result).toBe('default');
        });
    });
});
