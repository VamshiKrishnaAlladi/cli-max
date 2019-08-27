import chalk from 'chalk';

import { Command, Option, SubCommand } from '../command';
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

const fakeSubCommands: SubCommand[] = [{
    name: 'sub-command-1',
    description: 'a fake description of sub-command-1',
    usage: 'fake-command sub-command-1',
    action: () => {},
}];

const fakeCommandWithOptions: Command = {
    ...fakeCommand,
    options: fakeOptions,
};

const fakeCommandWithSubCommands: Command = {
    ...fakeCommand,
    subCommands: fakeSubCommands,
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

${tab}${key(prettyHelp)('--opt               ')}this option is used to specify some flag
`;

const expectedHelpTextWithSubCommands = prettyHelp => `
${title(prettyHelp)('fake-name')}

${tab}a fake description the fake command

${subtitle(prettyHelp)('usage:')} fake-command

${subtitle(prettyHelp)('commands:')}

${tab}${key(prettyHelp)('sub-command-1       ')}a fake description of sub-command-1
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

    it('should return the help text for a command with sub-commands', () => {
        const helpText = createGetHelpFn(fakeCommandWithSubCommands)();

        expect(helpText).toEqual(expectedHelpTextWithSubCommands(true));
    });

    it('should return the help text for a command with sub-commands in plain text format when configured so', () => {
        const prettyHelp = false;
        const helpText = createGetHelpFn(fakeCommandWithSubCommands, { prettyHelp })();

        expect(helpText).toEqual(expectedHelpTextWithSubCommands(prettyHelp));
    });
});
