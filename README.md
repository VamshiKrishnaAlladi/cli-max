# **cli-max**

An opinionated solution for building CLI applications using Node.js.

---

## **Contents**

- [Understanding CLI Application Categories](#cli-categories)
- [Understanding CLI Command invocation](#cli-invocation)
- [Introduction to `cli-max`](#climax-intro)
- [Getting Started](#getting-started)
- [`cli-max` in Action (example)](#climax-example)
- [API in detail](#api-in-detail)

---

## <a name="cli-categories"></a> **Understanding CLI Application Categories**

CLI Applications can be categorized into two types

- Single Command Apps
- Multi Command Apps

**Single Command Apps**

Single Command Apps usually have just one main action.

_**Examples:**_ `mkdir`, `touch`, `ls`, etc.,

**Multi Command Apps**

Multi Command Apps are usually a collection of actions.

They have sub-commands that perform different operations.

_**Examples:**_ `git`, `npm`, etc.,

---

## <a name="cli-invocation"></a> **Understanding CLI Command invocation**

### **Structure**

```shell
$ command sub-command <...[--options]> <...parameters>
```

**Examples**

```shell
$ mkdir "New Folder"
```

- `mkdir` is the command
- the value `New Folder` is called a parameter or an argument.

```shell
$ git pull --quiet origin master
```

 - `git` is the command
 - `pull` is the sub-command
 - `--quiet` is an option
 - `origin` and `master` are the parameters

---

## <a name="climax-intro"></a> **Introduction to `cli-max`**

`cli-max` is a library that tries to make the experience of building a CLI app easy and pleasant.

The API of `cli-max` consciously tries to make your code more declarative and thus be easier to build, understand and maintain.

### **Features**

- Single and Multi Command CLI Apps, both can be implemented using `cli-max`
- A Command can be configured as a default. and this will be executed when no valid command name is passed at runtime
- Sub-Commands can have aliases, making it easy for end-users to pass alternative command names
- Options can have aliases too (supports both short flags and long alternatives)
- Options can be configured with default values
- "help" details for every command is auto-generated using the details provided in the configuration

---

## <a name="getting-started"></a> **Getting Started**

The approach to building CLI apps using `cli-max`, can broadly be described as a two-step process:

1. _**Configure**_
2. _**Execute**_

### **Step 1 - _Configure_**

You can configure and implement the functionality of your CLI app using the API `createCLI()`.

```typescript
function createCLI(command: Command, config: CLIConfig): ExecuteFn
```

The `createCLI()` API takes two parameters of types [Command](#command) and [CLIConfig](#cli-config) respectively.

You can build a Single Command CLI App by implementing all its functionality in the `action` property of the `command` argument passed to `createCLI()`.

For building Multi Command CLI App, you can configure sub-commands and implement their functionality in corresponding `action` property of each sub-command.

If invoked with proper configuration as mentioned above `createCLI()` API returns a function.

This function is what is used in the next step.

### **Step 2 - _Execute_**

The function returned by the `createCLI()` API is what invokes the actual functionality.

One can call the function returned by `createCLI()` as `cli` or `execute` or `run` or `parse` or `compute` or anything similar.

This function encapsulates the idea of processing and evaluating the actual arguments and flags passed at runtime and hence any of the above names.

The type for the function returned by `createCLI()` is [ExecuteFn](#execute-fn)

> **Note:** To explain easily, this document will from now on refer this function as `executeFn`. But, remember it can be named anything per your convenience.

```typescript
const executeFn = createCLI(someCommand, someConfig); // step-1

const result = executeFn(process.argv); // step-2
```

The `executeFn` expects the arguments received by the Node.js process at runtime.

One can access these arguments passed to a Node.js process from the global property `process.argv`. (read more about [process.argv][process-argv])

Invoking `executeFn` with runtime arguments properly will parse the arguments and execute the corresponding command configured in the 1st step.

`executeFn` also returns the output value of the command executed from the configured commands.

**Some insight on `process.argv`**

`process.argv` is an array of the command line arguments received by the Node.js process

Launching a Node.js process as
```shell
$ node process-args.js one two=three four
```

would generate the `process.argv` with the following values
```typescript
[
    "/path/to/the/node/executable",
    "/path/to/the/file/process-args.js",
    "one",
    "two=three",
    "four"
]
```

---

## <a name="climax-example"></a> **`cli-max` in Action**

```typescript
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

```

---

## <a name="api-in-detail"></a> **API in detail**

**API:**
- [createCLI()](#create-cli)

**Types:**
- [ExecuteFn](#execute-fn)
- [Action](#action)
- [GetHelpFn](#get-help-fn)

**Interfaces:**
- [Command](#command)
- [SubCommand](#sub-command)
- [Option](#option)
- [ActionParams](#action-params)
- [RuntimeFlags](#runtime-flags)
- [CLIConfig](#cli-config)

---

### <a name="create-cli"></a> **createCLI()**

This API is used to configure the `command`, `sub-commands`, `options` and `actions`

```typescript
function createCLI(command: Command, config: CLIConfig): ExecuteFn
```

**params**

Expects two arguments

- `command` - an object of type [Command](#command)
- `config` - an object of type [CLIConfig](#cli-config)

**return value:**

returns a function of type [ExecuteFn](#execute-fn)

---

### <a name="execute-fn"></a> **ExecuteFn**

This is the type for the function returned by [createCLI()](#create-cli) API

```typescript
type ExecuteFn = function (processArgs: string[]): any
```

**params**

Expects one argument

- `processArgs` - an array of strings

`processArgs` is supposed to be [process.argv][process-argv] i.e, the list of arguments received by the process

**return value**

returns the output of the command executed from the list of sub-commands configured

---

### <a name="action"></a> **Action**

This is the type for the callback function that is configured in a [Command](#command) or a [SubCommand](#sub-command) to implement its functionality.

An `action` callback configured in a `Command` or a `SubCommand` gets invoked automatically when `executeFn` receives the command-name in the `processArgs`.

```typescript
type Action = function (params: ActionParams): any;
```

**params**

Receives one argument

- `params` - an object of type [ActionParams](#action-params)

---

### <a name="get-help-fn"></a> **GetHelpFn**

This is the type for the function that generates "help" details for a `command` or a `sub-command`.

This function `getHelp` can be accessed as a property in the [ActionParams](#action-params) received by the `action`.

If you want to display "help" for a `command`, you can just invoke this function (available as a property in the object received by the `action` configured for the `command`) and it would return the "help" details generated specifically for the `command` in context.

```typescript
type GetHelpFn = function (): string;
```

---

### <a name="command"></a> **Command**

This type encapsulates the details needed to configure a `command`

```typescript
{
    name: string;
    description: string;
    usage: string;
    action?: Action;
    options?: Option[];
    subCommands?: SubCommand[];
}
```

> **Note:** To auto-generate proper "help" details for a `command`, it is assumed that at the least the `name`, `description` and `usage` properties are assigned non-empty values.

To create a Single Command CLI App one can just implement the action property in the Command object being passed to `createCLI()` API.

To create a Multi Command CLI App one has to configure `subCommands` property in the `command` object that is passed to `createCLI()` API. For these Apps the main action property is optional but it can be used to handle cases where end-user invokes just the main command.

---

### <a name="sub-command"></a> **SubCommand**

This type encapsulates the details needed to configure a `sub-command`

```typescript
{
    name: string;
    description: string;
    usage: string;
    action: Action;
    aliases?: string[];
    options?: Option[];
    isDefault?: boolean;
}
```

> **Note:** To auto-generate proper "help" details for a `sub-command`, it is assumed that at the least the `name`, `description` and `usage` properties are assigned non-empty values.

---

### <a name="option"></a> **Option**

This type encapsulates the details needed to configure an option for either a command or a sub-command

```typescript
{
    name: string;
    aliases: string[];
    description: string;
    defaultValue: any;
    required: boolean;
}
```

> **Note:** To auto-generate proper "help" details for `options` in a `command` or a `sub-command`, it is assumed that at the least the `name` and `description` for individual options are assigned non-empty values.

---

### <a name="action-params"></a> **ActionParams**

This type represents the object passed to an `action` of a command or a sub-command

```typescript
{
    parameters: string[];
    flags: RuntimeFlags;
    getHelp: GetHelpFn;
}
```

---

### <a name="runtime-flags"></a> **RuntimeFlags**

This type represents the collection of flags received at runtime.

each flag and its value received at runtime is assigned as a property and the corresponding value in this object

```typescript
{
    [key: string]: any;
}
```

---

### <a name="cli-config"></a> **CLIConfig**

This type encapsulates the customization options that can be passed to the [createCLI()](#create-cli) API

```typescript
{
    generateHelp?: boolean;
    prettyHelp?: boolean;
    paddingInDetails?: number;
}
```

[process-argv]: https://nodejs.org/api/process.html#process_process_argv
