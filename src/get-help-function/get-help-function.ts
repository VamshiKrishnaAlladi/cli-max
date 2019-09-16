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

export function createGetHelpFn(command: Command | SubCommand, config: HelpConfig = defaultHelpConfig): HelpFn {
    const { aliases = [], options = [], subCommands = [] } = <Command & SubCommand>command;
    const { prettyHelp, paddingInDetails } = { ...defaultHelpConfig, ...config };

    const title = prettyHelp ? chalk.yellowBright.bold.underline : identity;
    const subtitle = prettyHelp ? chalk.greenBright.bold : identity;
    const key = prettyHelp ? chalk.magentaBright.bold : identity;

    const defaultHelp = ({ name, description, usage }: Command | SubCommand) => {
        return pipe(
            appendNL,
            append(`${title(name)} - ${description}`),
            append2NLs,
            append(`${subtitle('usage:')} ${usage}`),
            appendNL,
        )('');
    };

    const getHelpForCommandAliases = (aliases: string[]) => (helpText: string) => {
        if (aliases.length === 0) {
            return helpText;
        }

        return pipe(
            appendNL,
            append(`${subtitle('aliases:')} ${aliases.map(alias => key(alias)).join(', ')}`),
            appendNL,
        )(helpText);
    };

    const optionHelp = ({ name, description, aliases }: Option) => {
        const names = [name, ...aliases].map(name => key(`--${name}`)).join(' | ');

        return pipe(
            appendNL,
            appendTab,
            append(`[ ${names} ] - ${description}`),
            appendNL,
        )('');
    };

    const getHelpForOptions = (options: Option[]) => (helpText: string) => {
        if (options.length === 0) {
            return helpText;
        }

        return pipe(
            appendNL,
            append(subtitle('options:')),
            appendNL,
            append(options.map(optionHelp).join('')),
        )(helpText);
    };

    const subCommmandHelp = ({ name, description }: SubCommand) => pipe(
        appendNL,
        appendTab,
        append(key(name.padEnd(paddingInDetails, ' '))),
        append(description),
    )('');

    const getHelpForSubCommands = (subCommands: SubCommand[]) => (helpText: string) => {
        if (subCommands.length === 0) {
            return helpText;
        }

        return pipe(
            appendNL,
            append(subtitle('commands:')),
            appendNL,
            append(subCommands.map(subCommmandHelp).join('')),
            appendNL,
        )(helpText);
    };

    return () => pipe(
        defaultHelp,
        getHelpForCommandAliases(aliases),
        getHelpForOptions(options),
        getHelpForSubCommands(subCommands),
    )(command);
}
