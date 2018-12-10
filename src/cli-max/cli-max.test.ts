
import { MissingMandatoryParamError } from '@vka/ts-utils';

import { createCLI, isCLI } from './cli-max';

describe('cli-max module', () => {
    it('should export a factory method called "createCLI"', () => {
        const exports = require('./cli-max');

        expect(exports).toHaveProperty('createCLI');
        expect(exports.createCLI).toBeInstanceOf(Function);
    });

    describe('"createCLI" function', () => {
        it('should throw "MissingMandatoryParamError" when "name" param is NOT passed', () => {
            try {
                createCLI();
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('name');
            }

            expect.assertions(2);
        });

        it('should throw "MissingMandatoryParamError" when "commands" param is NOT passed', () => {
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
});
