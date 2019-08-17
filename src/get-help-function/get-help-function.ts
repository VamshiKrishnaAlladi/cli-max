import chalk from 'chalk';

import { Command, Option, SubCommand } from '../command';

export interface HelpConfig {
    prettyHelp?: boolean;
}

const defaultConfig: HelpConfig = {
    prettyHelp: true,
};

export function createGetHelpFn(command: Command | SubCommand, { prettyHelp }: HelpConfig = defaultConfig) {
    const { options = [] } = command;

    const title = prettyHelp ? chalk.yellowBright.bold.underline : x => x;
    const subtitle = prettyHelp ? chalk.greenBright.bold : x => x;
    const key = prettyHelp ? chalk.magentaBright.bold : x => x;

    const nl = '\n';
    const tab = '\t';

    const defaultHelp = ({ name, description, usage }: Command | SubCommand) => {
        return `${nl}${title(name)}${nl}${nl}${tab}${description}${nl}${nl}${subtitle('usage:')} ${usage}${nl}`;
    };

    const optionHelp = ({ name, description }: Option) => {
        return `${nl}${tab}${key(`--${name}`)}${tab}${tab}${description}`;
    };

    const getHelpForOptions = (options: Option[], helpText: string) => {
        if (options.length === 0) {
            return helpText;
        }

        return `${helpText}${nl}${subtitle('options:')}${nl}${options.map(optionHelp).join('')}${nl}`;
    };

    return () => getHelpForOptions(options, defaultHelp(command));
}
