
import { MissingMandatoryParamError } from '@vka/ts-utils';

import { createCLI, isCLI, Command } from './cli-max';

const fakeCommands: Command[] = [{
    name: 'test',
    action: () => { console.log('Hello World!'); },
}];

describe('CLIMax module', () => {
    it('should export a createCLI factory method', () => {
        const climax = require('./cli-max');

        expect(climax).toHaveProperty('createCLI');
    });

    describe('createCLI factory method', () => {
        it('should throw "MissingMandatoryParamError" when "commands" param is not passed', () => {
            const { createCLI } = require('./cli-max');

            try {
                const cli = createCLI();
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('commands');
            }

            expect.assertions(2);
        });

        it('should return a CLI object', () => {
            const cli = createCLI(fakeCommands);

            expect(isCLI(cli)).toBe(true);
        });

        describe('CLI object', () => {
            it('should have a "parse" method on it', () => {
                const cli = createCLI(fakeCommands);

                expect(cli).toHaveProperty('parse');
            });
        });
    });
});
