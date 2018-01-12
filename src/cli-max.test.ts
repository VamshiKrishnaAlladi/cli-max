describe('Module cli-max:', () => {
    test('should export a class named CLIMax', () => {
        const { CLIMax } = require('./cli-max');

        expect(CLIMax).toBeInstanceOf(Function);
    });
});
