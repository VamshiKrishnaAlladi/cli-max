
import { MissingMandatoryParamError } from '@vka/ts-utils';

import { createCLI } from './cli-max';
import { Command } from './../command';

const fakeCommand: Command = {
    name: 'fake-command',
    description: 'this command is for testing purposes',
    usage: 'fake-command <sub-command> <params>',
    action: () => {},
    subCommands: [],
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

        it('should return a CLI object', () => {
            const cli = createCLI(fakeCommand);

            expect(cli).toBeInstanceOf(Function);
        });
    });
});
