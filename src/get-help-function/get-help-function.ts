import chalk from 'chalk';
import { pipe } from '@vka/ts-utils';

import { Command, Option, SubCommand } from '../command';

export interface HelpConfig {
    prettyHelp?: boolean;
}

export const defaultHelpConfig: HelpConfig = {
    prettyHelp: true,
};

const nl = '\n';
const tab = '\t';

const identity = (x:any) => x;
const append = (x: string) => (y: string) => `${y}${x}`;
const appendNL = append(nl);
const append2NLs = append(`${nl}${nl}`);
const appendTab = append(tab);
const append2Tabs = append(`${tab}${tab}`);

export function createGetHelpFn(command: Command | SubCommand, config: HelpConfig = defaultHelpConfig) {
    const { options = [], subCommands = [] } = <Command & SubCommand>command;
    const { prettyHelp } = { ...defaultHelpConfig, ...config };

    const title = prettyHelp ? chalk.yellowBright.bold.underline : identity;
    const subtitle = prettyHelp ? chalk.greenBright.bold : identity;
    const key = prettyHelp ? chalk.magentaBright.bold : identity;

    const defaultHelp = ({ name, description, usage }: Command | SubCommand) => {
        return pipe(
            appendNL,
            append(title(name)),
            append2NLs,
            appendTab,
            append(description),
            append2NLs,
            append(`${subtitle('usage:')} ${usage}`),
            appendNL,
        )('');
    };

    const optionHelp = ({ name, description }: Option) => {
        return pipe(
            appendNL,
            appendTab,
            append(key(`--${name}`.padEnd(20, ' '))),
            append(description),
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
            appendNL,
        )(helpText);
    };

    const subCommmandHelp = ({ name, description }: SubCommand) => pipe(
        appendNL,
        appendTab,
        append(key(name.padEnd(20, ' '))),
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
        getHelpForOptions(options),
        getHelpForSubCommands(subCommands),
    )(command);
}
