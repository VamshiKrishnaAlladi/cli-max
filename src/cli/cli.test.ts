describe('Class CLI', () => {
    test('should have a constructor', () => {
        const { CLI } = require('.');

        expect(CLI).toBeInstanceOf(Function);
    });
});
