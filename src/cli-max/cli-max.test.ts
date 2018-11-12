
import { MissingMandatoryParamError } from '@vka/ts-utils';

import { createCLI, isCLI, Command } from './cli-max';

const fakeCLIName = 'test';
const fakeTestCommand: Command = {
    name: 'test',
    action: (subCommands, args) => { return { subCommands, args }; },
    description: 'some help text',
};
const fakeArgsToPass = ['test', 'second', '-a', '--b', '--no-c', '-d=test string'];
const expectedFakeOutput = {
    subCommands: ['second'],
    args: {
        a: true,
        b: true,
        c: false,
        d: 'test string',
    },
};

const fakeCommands: Command[] = [fakeTestCommand];

describe('CLIMax module', () => {
    it('should export a createCLI factory method', () => {
        const climax = require('./cli-max');

        expect(climax).toHaveProperty('createCLI');
    });

    describe('createCLI() method [factory]:', () => {
        it('should throw "MissingMandatoryParamError" when "commands" param is not passed', () => {
            try {
                const cli = createCLI({ name: fakeCLIName });
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('commands');
            }

            expect.assertions(2);
        });

        it('should return a CLI object', () => {
            const cli = createCLI({ name: fakeCLIName, commands: fakeCommands });

            expect(isCLI(cli)).toBe(true);
        });
    });

    describe('CLI object', () => {
        it('should have a "execute" method on it', () => {
            const cli = createCLI({ name: fakeCLIName, commands: fakeCommands });

            expect(cli).toHaveProperty('execute');
        });

        describe('CLI#execute() method: ', () => {
            it('should throw "MissingMandatoryParamError" when "args" is not passed', () => {
                const cli = createCLI({ name: fakeCLIName, commands: fakeCommands });

                try {
                    cli.execute();
                }
                catch (error) {
                    expect(error).toBeInstanceOf(MissingMandatoryParamError);
                    expect(error.missingParam).toEqual('args');
                }

                expect.assertions(2);
            });

            it('should return what the specified action returns', () => {
                const cli = createCLI({ name: fakeCLIName, commands: fakeCommands });
                const result = cli.execute(fakeArgsToPass);

                expect(result).toEqual(expectedFakeOutput);
            });
        });
    });
});
