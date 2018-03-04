import { ForbiddenActionError } from '@vka/ts-utils/errors/forbidden-action-error';

describe('Class CLIMax:', () => {
    test('should have a constructor', () => {
        const { CLIMax } = require('./cli-max');

        expect(CLIMax).toBeInstanceOf(Function);
    });

    describe('CLIMax ==> constructor()', () => {
        test('should throw a "ForbiddenActionError" error when tried to instantiate', () => {
            const { CLIMax } = require('./cli-max');

            try {
                const climax = new CLIMax();
            } catch (error) {
                expect(error).toBeInstanceOf(ForbiddenActionError);
            }

            expect(() => { new CLIMax(); }).toThrowError(ForbiddenActionError);

            expect.assertions(2);
        });
    });
});
