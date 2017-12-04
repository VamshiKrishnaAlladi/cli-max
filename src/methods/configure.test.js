/* eslint-disable global-require */
describe('Module methods/configure:', () => {
    test('should export a method', () => {
        const configure = require('./configure');

        expect(configure).toBeInstanceOf(Function);
    });

    test('should expect one parameter', () => {
        const configure = require('./configure');

        expect(configure).toBeInstanceOf(Function);
        expect(configure.length).toBe(1);
    });
});
