#!/usr/bin/env node

const { createCLI } = require('./../src');

const execute = createCLI({
    name: 'give',
    description: 'Greetings made easy!',
    subCommands: [
        {
            name: 'greetings',
            action: ({ flags: { to } }) => {
                console.log(`Hello ${to}! How are you?`);
            },
            options:[
                {
                    name: 'to',
                    aliases: ['t'],
                    description: 'this option specifies whom to greet',
                    required: false,
                    defaultValue: 'there',
                },
            ],
            isDefault: true,
        },
        {
            name: 'compliment',
            action: ({ flags: { to } }) => {
                console.log(`Hey ${to}, You look good! :)`);
            },
            options:[
                {
                    name: 'to',
                    aliases: ['t'],
                    description: 'this option specifies whom to complient',
                    required: false,
                    defaultValue: 'there',
                },
            ],
        }
    ],
});

execute(process.argv);

/*
Output:

$ give greetings
Hello there! How are you?

$ give greetings --to John
Hello John! How are you?

$ give compliment
Hey there, You look good! :)

$ give greetings --to John
Hey John, You look good! :)
*/
