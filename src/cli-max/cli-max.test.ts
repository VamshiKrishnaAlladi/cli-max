
import { MissingMandatoryParamError } from '@vka/ts-utils';

import { createCLI } from './cli-max';
import { Action, Command } from './../command';

const fakeCommand: Command = {
    name: 'fake-command',
    description: 'this command is for testing purposes',
    usage: 'fake-command <sub-command> <params>',
    action: () => {},
    subCommands: [],
};

const checkHelpAction: Action = ({ getHelp }) => (!!getHelp);

const fakeCommandWithCheckHelp: Command = {
    ...fakeCommand,
    action: checkHelpAction,
};

describe('cli-max module', () => {
    it('should export a factory method called "createCLI"', () => {
        const exports = require('./cli-max');

        expect(exports).toHaveProperty('createCLI');
        expect(exports.createCLI).toBeInstanceOf(Function);
    });

    describe('"createCLI" function', () => {
        it('should throw "MissingMandatoryParamError" when "command" is NOT passed', () => {
            try {
                createCLI();
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('command');
            }

            expect.assertions(2);
        });

        it('should return an "execute" function', () => {
            const execute = createCLI(fakeCommand);

            expect(execute).toBeInstanceOf(Function);
        });

        it('should use default config when not configured and generate Help', () => {
            const execute = createCLI(fakeCommandWithCheckHelp);

            const result = execute([]);

            expect(result).toBe(true);
        });

        it('should not generate Help when configured not to', () => {
            const execute = createCLI(fakeCommandWithCheckHelp, { generateHelp: false });

            const result = execute([]);

            expect(result).toBe(false);
        });
    });
});
