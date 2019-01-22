---
title: Statements
description: Statements control execution in the Flux functional data scripting language.
menu:
  flux_0_x:
    parent: Language reference
    name: Statements
    weight: 100
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is an issue number tracking discussion and progress towards implementation.

A _statement_ controls execution.

```
Statement = OptionStatement
          | VarAssignment
          | ReturnStatement
          | ExpressionStatement .
```

## Package clause
A _package clause_ defines the name for the current package.
Package names must be valid Flux identifiers.
The package statement must be the first statement of every Flux source file.
If a file does not declare a package statement, all identifiers in that file will belong to the special `main` package.

```
PackageClause = "package" identifier .
```

> To be implemented: [IMPL#247](https://github.com/influxdata/platform/issues/247) Add package/namespace support.

### Package main

The `main` package is special for a few reasons:

1. It defines the entry point of a Flux program.
2. It cannot be imported.
3. All query specifications produced after evaluating the _main_ package are coerced into producing side effects.

## Import declaration

```
ImportDeclaration = "import" [identifier] string_lit
```

A package name and an import path is associated with every package.
The import statement takes a package's import path and brings all of the identifiers
defined in that package into the current scope under a namespace.
The import statement defines the namespace through which to access the imported identifiers.
By default the identifier of this namespace is the package name unless otherwise specified.
For example, given a variable `x` declared in package `foo`, importing `foo` and referencing `x` would look like this:

```js
import "import/path/to/package/foo"

foo.x
```

Or this:

```js
import bar "import/path/to/package/foo"

bar.x
```

A package's import path is always absolute.
Flux does not support relative imports.
Assignment into the namespace of an imported package is not allowed.
A package cannot access nor modify the identifiers belonging to the imported packages of its imported packages.
Every statement contained in an imported package is evaluated.

## Option statement

Options specify a context in which a Flux query is to be run.
They define variables that describe how to execute a Flux query.
For example, the following Flux script sets the `task` option to schedule a query to run periodically every hour:

```js
option task = {
    name: "mean",
    every: 1h,
}

from(bucket:"metrics/autogen")
    |> range(start:-task.every)
    |> group(columns:["level"])
    |> mean()
    |> yield(name:"mean")
```

All options are designed to be completely optional and have default values to be used when not specified.
Grammatically, an _option statement_ is just a variable assignment preceded by the `option` keyword.

```
OptionStatement = "option" VariableAssignment
```

Below is a list of all options that are currently implemented in the Flux language:

* now
* task
* location

### now

The `now` option is a function that returns a time value to be used as a proxy for the current system time.

```js
// Query should execute as if the below time is the current system time
option now = () => 2006-01-02T15:04:05-07:00
```

### task

The `task` option is used by a scheduler to schedule the execution of a Flux query.

```js
option task = {
    name: "foo",        // name is required
    every: 1h,          // task should be run at this interval
    delay: 10m,         // delay scheduling this task by this duration
    cron: "0 2 * * *",  // cron is a more sophisticated way to schedule. every and cron are mutually exclusive
    retry: 5,           // number of times to retry a failed query
    }
```

### location

The `location` option is used to set the default time zone of all times in the script.
The location maps the UTC offset in use at that location for a given time.
The default value is set using the time zone of the running process.

```js
option location = fixedZone(offset:-5h) // set timezone to be 5 hours west of UTC
option location = loadLocation(name:"America/Denver") // set location to be America/Denver
```

> To be implemented: [IMPL#660](https://github.com/influxdata/platform/issues/660) Implement Location option.

## Return statements

A terminating statement prevents execution of all statements that appear after it in the same block.
A return statement is a terminating statement.

```
ReturnStatement = "return" Expression .
```
## Expression statements

An _expression statement_ is an expression where the computed value is discarded.

```
ExpressionStatement = Expression .
```

##### Examples of expression statements

```js
1 + 1
f()
a
```
