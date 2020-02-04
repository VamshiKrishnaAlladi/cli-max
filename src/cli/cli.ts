#! /usr/bin/env node

import { createCLI } from '../lib';
import { createCommand } from './commands';

const cli = createCLI({
    name: 'cli-max',
    description: 'an opinionated solution to building CLI apps using Node.js',
    usage: 'cli-max <command> <params> <... --flags>',
    subCommands: [createCommand],
});

cli(process.argv);
