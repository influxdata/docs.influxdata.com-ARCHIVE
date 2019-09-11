---
title: Assignment and scope
description: An assignment binds an identifier to a variable, option, or function. Every identifier in a program must be assigned.
menu:
  flux_0_36:
    parent: Language reference
    name: Assignment and scope
    weight:
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is an issue number tracking discussion and progress towards implementation.


An assignment binds an identifier to a variable, option, or function.
Every identifier in a program must be assigned.

Flux is lexically scoped using blocks:

1. The scope of a preassigned identifier is in the universe block.
2. The scope of an identifier denoting a variable, option, or function at the top level (outside any function) is the package block.
3. The scope of the name of an imported package is the file block of the file containing the import declaration.
4. The scope of an identifier denoting a function argument is the function body.
5. The scope of an identifier assigned inside a function is the innermost containing block.

An identifier assigned in a block may be reassigned in an inner block with the exception of option identifiers.
While the identifier of the inner assignment is in scope, it denotes the entity assigned by the inner assignment.

Note that the package clause is not an assignment.
The package name does not appear in any scope.
Its purpose is to identify the files belonging to the same package and to specify the default package name for import declarations.

> [IMPL#247](https://github.com/influxdata/platform/issues/247) Add package/namespace support.

## Variable assignment
A variable assignment creates a variable bound to an identifier and gives it a type and value.
A variable keeps the same type and value for the remainder of its lifetime.
An identifier assigned to a variable in a block cannot be reassigned in the same block.
An identifier can be reassigned or shadowed in an inner block.

```js
VariableAssignment = identifier "=" Expression
```

##### Examples of variable assignment

```js
n = 1
m = 2
x = 5.4
f = () => {
    n = "a"
    m = "b"
    return n + m
}
```

## Option assignment
```js
OptionAssignment = "option" [ identifier "." ] identifier "=" Expression
```

An option assignment creates an option bound to an identifier and gives it a type and a value.
Options may only be assigned in a package block.
Once declared, an option may not be redeclared in the same package block.
An option declared in one package may be reassigned a new value in another.
An option keeps the same type for the remainder of its lifetime.

###### Examples
```js
// alert package
option severity = ["low", "moderate", "high"]
// foo package
import "alert"
option alert.severity = ["low", "critical"]  // qualified option
option n = 1
option n = 2
f = (a, b) => a + b + n
x = f(a:1, b:1) // x = 4
```
