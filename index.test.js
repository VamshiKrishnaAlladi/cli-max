/* eslint-disable global-require */

describe('Module cli-max:', () => {
    test('should export an object with a "configure" method', () => {
        const cli = require('./index');

        expect(cli).toHaveProperty('configure');
        expect(cli.configure).toBeInstanceOf(Function);
    });
});
