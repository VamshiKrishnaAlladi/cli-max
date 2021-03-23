import chalk from 'chalk';
import { pipe } from '@vka/ts-utils';

import { Command, Option, SubCommand, HelpFn } from '../command';

export interface HelpConfig {
    prettyHelp?: boolean;
    paddingInDetails?: number;
}

export const defaultHelpConfig: HelpConfig = {
    prettyHelp: true,
    paddingInDetails: 20,
};

const nl = '\n';
const tab = '\t';

const identity = (x: any) => x;
const append = (x: string) => (y: string) => `${y}${x}`;
const appendNL = append(nl);
const append2NLs = append(`${nl}${nl}`);
const appendTab = append(tab);

export const createGetHelpFn = (
    command: Command | SubCommand,
    config: HelpConfig = defaultHelpConfig,
): HelpFn => {
    const { aliases = [], options = [], subCommands = [] } = <Command & SubCommand>command;
    const { prettyHelp, paddingInDetails } = { ...defaultHelpConfig, ...config };

    const title = prettyHelp ? chalk.yellowBright.bold.underline : identity;
    const subtitle = prettyHelp ? chalk.greenBright.bold : identity;
    const key = prettyHelp ? chalk.magentaBright.bold : identity;

    const defaultHelp = ({ name, description, usage }: Command | SubCommand) => pipe(
        appendNL,
        append(`${title(name)} - ${description}`),
        append2NLs,
        append(`${subtitle('usage:')} ${usage}`),
        appendNL,
    )('');

    const getHelpForCommandAliases = (commandAliases: string[]) => (helpText: string) => {
        if (commandAliases.length === 0) {
            return helpText;
        }

        return pipe(
            appendNL,
            append(`${subtitle('aliases:')} ${commandAliases.map((alias) => key(alias)).join(', ')}`),
            appendNL,
        )(helpText);
    };

    const optionHelp = ({ name, description, aliases: optionAliases }: Option) => {
        const names = [name, ...optionAliases].map((optionName) => key(`--${optionName}`)).join(' | ');

        return pipe(
            appendNL,
            appendTab,
            append(`[ ${names} ] - ${description}`),
            appendNL,
        )('');
    };

    const getHelpForOptions = (opts: Option[]) => (helpText: string) => {
        if (opts.length === 0) {
            return helpText;
        }

        return pipe(
            appendNL,
            append(subtitle('options:')),
            appendNL,
            append(opts.map(optionHelp).join('')),
        )(helpText);
    };

    const subCommandHelp = ({ name, description }: SubCommand) => pipe(
        appendNL,
        appendTab,
        append(key(name.padEnd(paddingInDetails, ' '))),
        append(description),
    )('');

    const getHelpForSubCommands = (subCmds: SubCommand[]) => (helpText: string) => {
        if (subCmds.length === 0) {
            return helpText;
        }

        return pipe(
            appendNL,
            append(subtitle('commands:')),
            appendNL,
            append(subCmds.map(subCommandHelp).join('')),
            appendNL,
        )(helpText);
    };

    return () => pipe(
        defaultHelp,
        getHelpForCommandAliases(aliases),
        getHelpForOptions(options),
        getHelpForSubCommands(subCommands),
    )(command);
};
