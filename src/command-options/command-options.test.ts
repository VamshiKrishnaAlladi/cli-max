import { MissingMandatoryParamError } from '@vka/ts-utils';

import { processArgs, CommandOption } from './command-options';

describe('CommandOptions Module', () => {
    it('should export a function called "processArgs"', () => {
        const exports = require('./command-options');

        expect(exports).toHaveProperty('processArgs');
    });

    describe('processArgs function', () => {
        it('should throw a "MissingMandatoryParamError" when param "args" is NOT passed', () => {
            try {
                processArgs();
            }
            catch (error) {
                expect(error).toBeInstanceOf(MissingMandatoryParamError);
                expect(error.missingParam).toBe('args');
            }

            expect.assertions(2);
        });

        it('should replace the arg aliases with their original arg names', () => {
            const configuredOptions: CommandOption[] =  [
                {
                    name: 'arg1',
                    aliases: ['a', 'alias1'],
                    description: 'this is the description of arg1',
                    defaultValue: true,
                    required: false,
                },
                {
                    name: 'arg2',
                    aliases: ['b', 'alias2'],
                    description: 'this is the description of arg2',
                    defaultValue: Infinity,
                    required: false,
                },
                {
                    name: 'arg3',
                    aliases: ['alias3', 'c'],
                    description: 'this is the description of arg3',
                    defaultValue: 'some-string',
                    required: false,
                },
                {
                    name: 'arg4',
                    aliases: ['alias4', 'd'],
                    description: 'this is the description of arg4',
                    defaultValue: ['some-array-value'],
                    required: false,
                },
            ];
            const expectedProcessedArgs = {
                arg1: true,
                arg2: 3,
                arg3: 'some-value',
                arg4: ['some-other-value'],
            };

            const processedArgs = processArgs({
                arg1: true,
                b: 3,
                alias3: 'some-value',
                alias4: ['some-other-value'],
            }, configuredOptions);

            expect(processedArgs).toEqual(expectedProcessedArgs);
        });
    });
});
