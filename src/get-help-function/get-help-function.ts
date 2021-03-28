import chalk from 'chalk';
import { pipe } from '@vka/ts-utils';

import { Command, Option, SubCommand, GetHelpFn } from '../command';

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
const append = (suffix: string) => (str: string) => `${str}${suffix}`;
const appendNL = append(nl);
const append2NLs = append(`${nl}${nl}`);
const appendTab = append(tab);

const getPrettifiers = ({ prettyHelp, ...remainingProps }: HelpConfig) => {
    const title = prettyHelp ? chalk.yellowBright.bold.underline : identity;
    const subtitle = prettyHelp ? chalk.greenBright.bold : identity;
    const key = prettyHelp ? chalk.magentaBright.bold : identity;

    return {
        fns: { title, subtitle, key },
        props: { prettyHelp, ...remainingProps },
    };
};

const getMainHelpStr = (prettifiers) => (command: Command | SubCommand) => pipe(
    appendNL,
    append(`${prettifiers.fns.title(command.name)} - ${command.description}`),
    append2NLs,
    append(`${prettifiers.fns.subtitle('usage:')} ${command.usage}`),
    appendNL,
)('');

const appendAliasesHelpStr = (prettifiers) => (aliases: string[]) => (helpStr: string) => {
    if (aliases.length === 0) {
        return helpStr;
    }

    return pipe(
        appendNL,
        append(`${prettifiers.fns.subtitle('aliases:')} ${aliases.map((alias) => prettifiers.fns.key(alias)).join(', ')}`),
        appendNL,
    )(helpStr);
};

const getOptionHelpStr = (prettifiers) => (option: Option) => {
    const names = [option.name, ...option.aliases].map((optionName) => prettifiers.fns.key(`--${optionName}`)).join(' | ');

    return pipe(
        appendNL,
        appendTab,
        append(`[ ${names} ] - ${option.description}`),
        appendNL,
    )('');
};

const appendOptionsHelpStr = (prettifiers) => (opts: Option[]) => (helpText: string) => {
    if (opts.length === 0) {
        return helpText;
    }

    return pipe(
        appendNL,
        append(prettifiers.fns.subtitle('options:')),
        appendNL,
        append(opts.map(getOptionHelpStr(prettifiers)).join('')),
    )(helpText);
};

const getSubCommandHelpStr = (prettifiers) => ({ name, description }: SubCommand) => pipe(
    appendNL,
    appendTab,
    append(prettifiers.fns.key(name.padEnd(prettifiers.props.paddingInDetails, ' '))),
    append(description),
)('');

const appendSubCommandsHelpStr = (prettifiers) => (subCmds: SubCommand[]) => (helpText: string) => {
    if (subCmds.length === 0) {
        return helpText;
    }

    return pipe(
        appendNL,
        append(prettifiers.fns.subtitle('commands:')),
        appendNL,
        append(subCmds.map(getSubCommandHelpStr(prettifiers)).join('')),
        appendNL,
    )(helpText);
};

export const createGetHelpFn = (
    command: Command | SubCommand,
    config: HelpConfig = defaultHelpConfig,
): GetHelpFn => {
    const { aliases = [], options = [], subCommands = [] } = <Command & SubCommand>command;
    const prettifiers = getPrettifiers({ ...defaultHelpConfig, ...config });

    return () => pipe(
        getMainHelpStr(prettifiers),
        appendAliasesHelpStr(prettifiers)(aliases),
        appendOptionsHelpStr(prettifiers)(options),
        appendSubCommandsHelpStr(prettifiers)(subCommands),
    )(command);
};
