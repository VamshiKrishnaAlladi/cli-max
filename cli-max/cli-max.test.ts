describe('Module cli-max:', () => {
    test('should export a class named CLIMax', () => {
        const { CLIMax } = require('./cli-max');

        expect(CLIMax).toBeInstanceOf(Function);
    });

    describe('Class CLIMax:', () => {
        test('should throw an error when tried to instantiate', () => {
            const { CLIMax } = require('./cli-max');

            try {
                const climax = new CLIMax();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            expect(CLIMax).toThrowError();

            expect.assertions(2);
        });
    });
});
