
import { MissingMandatoryParamError } from '@vka/ts-utils';

import { createCLI, isCLI, CLIConfig } from './cli-max';

describe('cli-max module', () => {
    it('should export a factory method called "createCLI"', () => {
        const exports = require('./cli-max');

        expect(exports).toHaveProperty('createCLI');
        expect(exports.createCLI).toBeInstanceOf(Function);
    });

    describe('"createCLI" function', () => {
        it('should throw "MissingMandatoryParamError" when "config" is NOT passed', () => {
            try {
                createCLI();
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('config');
            }

            expect.assertions(2);
        });

        it('should throw "MissingMandatoryParamError" when "name" is NOT passed', () => {
            try {
                createCLI(<CLIConfig>{ description: '', commands: [] });
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('name');
            }

            expect.assertions(2);
        });

        it('should throw "MissingMandatoryParamError" when "description" is NOT passed', () => {
            try {
                createCLI(<CLIConfig>{ name: '', commands: [] });
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('description');
            }

            expect.assertions(2);
        });

        it('should throw "MissingMandatoryParamError" when "commands" is NOT passed', () => {
            try {
                createCLI(<CLIConfig>{ name: '', description: '' });
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('commands');
            }

            expect.assertions(2);
        });

        it('should return a CLI object', () => {
            const cli = createCLI({
                name: 'some name',
                commands: [],
                description: 'some description',
            });

            expect(isCLI(cli)).toBe(true);
        });
    });
});
