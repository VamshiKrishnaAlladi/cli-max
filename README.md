# **cli-max**

An opinionated solution for building CLI Applications using Node.js.

---

## **Understanding CLI Application Categories :**

CLI Applications can be categorized into two types

- Single Command Apps
- Multi Command Apps

### **Single Command Apps :**
Single Command Apps are usually just one main action.

**Examples:** `mkdir`, `touch`, `ls`, etc.,

### **Multi Command Apps :**
Multi Command Apps are usually a collection of actions.

They have sub-commands that perform different operations.

**Examples:** `git`, `npm`, etc.,

---

## **Understanding CLI Command invocation :**

### **Structure :**

```shell
$ command sub-command <...[--options]> <...parameters>
```

**Examples :**

```shell
$ mkdir "New Folder"
```

- `mkdir` here is a command
- the value `New Folder` is called a parameter or an argument.

```shell
$ git pull --quiet origin master
```

 - `git` is the command
 - `pull` is the sub-command
 - `--quiet` is an option
 - `origin` and `master` are the parameters


---

## **Introduction to `cli-max` :**

`cli-max` is a library that tries to make the experience of building a CLI app easy an pleasant.

`cli-max`'s API conciously tries to make your code more declarative and thus be easier to build, understand and maintain.


### **Features :**

- Can be used to build both Single and Multi Command CLI Apps
- Ability to configure a command as default which will be executed when no valid command name is passed at runtime
- Sub-Commands can have aliases, making it easy for end-users to pass alternative command names
- Options can have aliases too (supports both short flags and long alternatives)
- Auto-generates "help" for every command using the details provided in the configuration

---

##<a name="getting-started"></a> **Getting Started :**

`cli-max`'s approach to building CLI apps can broadly be described as a two step process:

1. _**Configure**_
1. _**Compute**_

**Step 1 - _Configure_ :**

With the idea of your cli app ready, you prepare a mental model of the app which is either a single main command or a command with a list of multiple sub-commands.

Now you configure this structure you prepared as a structure required by the `cli-max`'s configuration API `createCLI`

```typescript
function createCLI(command: Command, config: CLIConfig): ExecuteFn {}
```

The `createCLI` API takes two parameters of types `Command` and `CLIConfig`

**_Command_** is of the structure
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

and _**CLIConfig**_ is of the structure

```typescript
{
    generateHelp?: boolean;
    prettyHelp?: boolean;
    paddingInDetails?: number;
}
```

If invoked with proper configuration as mentioned above `createCLI` API return a function.

This function is what is used in the computation step.

**Step 2 - _Compute_ :**

The function returned by the `createCLI` API is what actually triggers the functionality.

One can call the function returned by `createCLI` as `execute` or `run` or `parse` or `compute` or anything similar.

This function encapsulates the idea of processing and evaluating the actual arguments and flags passed at runtime and hence all the above names.

> **Note :** For the purpose of explaining, this document will from now on refer this function as `executeFn` but remember it can be called anything per you convenience.

This API looks like

```typescript
function executeFn(processArgs: string[]) {}
```

The `executeFn` expects the arguments received by the Node.js process at runtime.

One can access these arguments passed to a Node.js program from the global property `process.argv`. (read more about [process.argv][process-argv])

### Some inisight on `process.argv` :
`process.argv` is an array of the command line arguments received by the Node.js process

Launching a Node.js process as :
```shell
$ node process-args.js one two=three four
```

would generate the `process.argv` with the following values:
```
0: /path/to/the/node/executable
1: /path/to/the/file/process-args.js
2: one
3: two=three
4: four
```

Invoking `executeFn` with runtime arguments properly will parse the arguments and execute the corresponding command configured in the 1st step.

```typescript
const result = executeFn(process.argv);
```

`executeFn` also returns the output value of the command executed from the configured commands.

---

## **API in detail:**

**API:**
- [createCLI( )](#create-cli)

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

### <a name="create-cli"></a> **createCLI( ) :**

This API is used to configure the command, sub-commands, options and actions

```typescript
function createCLI(command: Command, config: CLIConfig): ExecuteFn
```

**params :**

Expects two arguments

- `command` - an object of type [Command](#command)
- `config` - an object of type [CLIConfig](#cli-config)

**return value:**

returns a function of type [ExecuteFn](#execute-fn)

---

### <a name="execute-fn"></a> **ExecuteFn :**

This is the type of function returned by [createCLI()](#create-cli) API

```typescript
type ExecuteFn = function (processArgs: string[]): any
```

**params :**

Expects one argument

- `processArgs` - an array of strings

`processArgs` is supposed to be [process.argv][process-argv] i.e, the list of arguments received by the process

**return value :**

returns the output of the command executed from the list of sub-commands configured

---

### <a name="action"></a> **Action :**

This is the type for the callback function that is configured in a [Command](#command) or a [SubCommand](#sub-command) to implement its functionality.

An `action` callback configured in a `Command` or a `SubCommand` gets invoked automatically when `executeFn` receives the command-name in the `processArgs`.


```typescript
type Action = function (params: ActionParams): any;
```

**params :**

Receives one argument

- `params` - an object of type [ActionParams](#action-params)

---

### <a name="get-help-fn"></a> **GetHelpFn :**

This is the type for the function that is passed in the [ActionParams](#action-params) to an `action`. the `getHelp` function fetches the auto-generated "help" details for a `command` the action is being configured to.

If you want to display "help" for a `command` you can just invoke this function (available as a property in the object received by the `action` configured for the `command`) and this would return the "help" details generated specifically for the `command` in context.

```typescript
type GetHelpFn = function (): string;
```

---

### <a name="command"></a> **Command :**

This type encapsulates the details needed to configure a command

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

> **Note :** To auto-generate "help" details for a command, it is assumed that at the least the `name`, `description` and `usage` properties are assigned non-empty values.

To create a Single Command CLI App one can just implement the action property in the Command object being passed to `createCLI` API.

To create a Multi Command CLI App one has to configure subCommands property in the Command object that is passed to `createCLI` API. For these Apps the main action property is optional but it can be used to handle cases where end-user invokes just the main command

---

### <a name="sub-command"></a> **SubCommand :**

This type encapsulates the details needed to configure a sub-command

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

> **Note :** To auto-generate "help" details for a sub-command, it is assumed that at the least the `name`, `description` and `usage` properties are assigned non-empty values.

---

### <a name="option"></a> **Option :**

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

> **Note :** To auto-generate "help" details for a command or a sub-command, it is assumed that at the least the `name` and `description` for individual options are assigned non-empty values.

---

### <a name="action-params"></a> **ActionParams :**

This type represents the object passed to an `action` of a command or a sub-command

```typescript
{
    parameters: string[];
    flags: RuntimeFlags;
    getHelp: GetHelpFn;
}
```

---

### <a name="runtime-flags"></a> **RuntimeFlags :**

This type represents the collection of flags received at runtime.

each flag and its value received at runtime is assigned as a property and the corresponding value in this object

```typescript
{
    [key: string]: any;
}
```

---

### <a name="cli-config"></a> **CLIConfig :**

This type encapsulates the customization options that can be passed to the [createCLI( )](#create-cli) API

```typescript
{
    generateHelp?: boolean;
    prettyHelp?: boolean;
    paddingInDetails?: number;
}
```

[process-argv]: https://nodejs.org/api/process.html#process_process_argv
