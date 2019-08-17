import chalk from 'chalk';

import { Command, Option } from '../command';
import { createGetHelpFn } from './get-help-function';

const fakeCommand: Command = {
    name: 'fake-name',
    description: 'a fake description the fake command',
    usage: 'fake-command',
};

const fakeOptions: Option[] = [{
    name: 'opt',
    description: 'this option is used to specify some flag',
    aliases: ['o'],
    defaultValue: false,
    required: false,
}];

const fakeCommandWithOptions: Command = {
    ...fakeCommand,
    options: fakeOptions,
};

const tab = '\t';

const title = prettyHelp => prettyHelp ? chalk.yellowBright.bold.underline : x => x;
const subtitle = prettyHelp => prettyHelp ? chalk.greenBright.bold : x => x;
const key = prettyHelp => prettyHelp ? chalk.magentaBright.bold : x => x;

const expectedHelpText = prettyHelp => `
${title(prettyHelp)('fake-name')}

${tab}a fake description the fake command

${subtitle(prettyHelp)('usage:')} fake-command
`;

const expectedHelpTextWithOptions = prettyHelp => `
${title(prettyHelp)('fake-name')}

${tab}a fake description the fake command

${subtitle(prettyHelp)('usage:')} fake-command

${subtitle(prettyHelp)('options:')}

${tab}${key(prettyHelp)('--opt')}${tab}${tab}this option is used to specify some flag
`;

describe('get-help-function Module:', () => {
    it('should return the help text for a base command', () => {
        const helpText = createGetHelpFn(fakeCommand)();

        expect(helpText).toEqual(expectedHelpText(true));
    });

    it('should return the help text in plain text format when configured so', () => {
        const prettyHelp = false;
        const helpText = createGetHelpFn(fakeCommand, { prettyHelp })();

        expect(helpText).toEqual(expectedHelpText(prettyHelp));
    });

    it('should return the help text for a command with options', () => {
        const helpText = createGetHelpFn(fakeCommandWithOptions)();

        expect(helpText).toEqual(expectedHelpTextWithOptions(true));
    });

    it('should return the help text for a command with options in plain text format when configured so', () => {
        const prettyHelp = false;
        const helpText = createGetHelpFn(fakeCommandWithOptions, { prettyHelp })();

        expect(helpText).toEqual(expectedHelpTextWithOptions(prettyHelp));
    });
});
