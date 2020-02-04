import { SubCommand } from '../../../lib';

import { createAction } from './create.action';

export const createCommand: SubCommand = {
    name: 'create',
    description: 'creates a new cli-max project',
    usage: 'cli-max create <project-name>',
    aliases: ['new', 'init', 'setup'],
    action: createAction,
    options: [
        {
            name: 'project-name',
            description: 'name for the project to create',
            aliases: ['name', 'n'],
            required: false,
            defaultValue: 'new-cli',
        },
    ],
};
