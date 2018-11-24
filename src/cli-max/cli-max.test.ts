
import { MissingMandatoryParamError } from '@vka/ts-utils';

import { createCLI, isCLI, Command } from './cli-max';

const cliName = 'test';

const defaultCommand: Command = {
    name: 'deafult',
    description: 'this is the default command',
    action: ({ subCommands, args }) => { return { subCommands, args }; },
    isDefault: true,
};
const helloCommand: Command = {
    name: 'hello',
    description: 'displays hello',
    action: () => {
        console.log('hello');
    },
};
const helpCommand: Command = {
    name: 'help',
    description: 'some help text',
    action: () => {
        console.log('displays some help text');

        return 'help';
    },
};

describe('CLIMax module', () => {
    it('should export a createCLI factory method', () => {
        const climax = require('./cli-max');

        expect(climax).toHaveProperty('createCLI');
    });

    describe('createCLI() method [factory]:', () => {
        it('should throw "MissingMandatoryParamError" when "name" param is not passed', () => {
            try {
                createCLI();
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('name');
            }

            expect.assertions(2);
        });

        it('should throw "MissingMandatoryParamError" when "commands" param is not passed', () => {
            try {
                createCLI({ name: '' });
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('commands');
            }

            expect.assertions(2);
        });

        it('should return a CLI object', () => {
            const cli = createCLI({ name: '', commands: [] });

            expect(isCLI(cli)).toBe(true);
        });
    });

    describe('CLI object', () => {
        it('should have a "execute" method on it', () => {
            const cli = createCLI({ name: '', commands: [] });

            expect(cli).toHaveProperty('execute');
        });

        describe('CLI#execute() method: ', () => {
            it('should throw "MissingMandatoryParamError" when "args" is not passed', () => {
                const cli = createCLI({ name: '', commands: [] });

                try {
                    cli.execute();
                }
                catch (error) {
                    expect(error).toBeInstanceOf(MissingMandatoryParamError);
                    expect(error.missingParam).toEqual('args');
                }

                expect.assertions(2);
            });

            it('should run the command configured while creating the cli', () => {
                const cli = createCLI({ name: '', commands: [{
                    name: 'test',
                    description: 'a test command',
                    action: ({ subCommands, args }) => ({ subCommands, args }),
                }] });

                const result = cli.execute(['test', 'something', '-a', '--bar', '--no-clue', '-d=testing 1 2 3']);

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
                const cli = createCLI({
                    name: '',
                    commands: [
                        {
                            name: 'some-command',
                            action: () => 'some-command',
                        },
                        {
                            name: 'default',
                            action: () => 'default',
                            isDefault: true,
                        },
                    ],
                });

                const result = cli.execute([]);

                expect(result).toBe('default');
            });

            it(
                'should run the first default command found, if there are multiple default commands configured',
                () => {
                    const cli = createCLI({
                        name: '',
                        commands: [
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
                        ],
                    });

                    const result = cli.execute([]);

                    expect(result).toBe('first-default');
                },
            );

            it(
                'should run the default command configured, if the command specified while executing is not configured',
                () => {
                    const cli = createCLI({
                        name: '',
                        commands: [
                            {
                                name: 'some-command',
                                action: () => 'some-command',
                            },
                            {
                                name: 'default',
                                action: () => 'default',
                                isDefault: true,
                            },
                        ],
                    });

                    const result = cli.execute(['something-else']);

                    expect(result).toBe('default');
                },
            );
        });
    });
});
