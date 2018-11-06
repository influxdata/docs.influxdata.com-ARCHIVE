---
title: Assignment and scope
description:
menu:
  flux_0_7:
    parent: Language reference
    name: Assignment and scope
    weight: 20
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is an issue number tracking discussion and progress towards implementation.


An assignment binds an identifier to a variable or function.
Every identifier in a program must be assigned.
An identifier may not change type via assignment within the same block.
An identifier may change value via assignment within the same block.

Flux is lexically scoped using blocks:

1. The scope of an option identifier is the options block.
2. The scope of a preassigned (non-option) identifier is in the universe block.
3. The scope of an identifier denoting a variable or function at the top level (outside any function) is the package block.
4. The scope of the name of an imported package is the file block of the file containing the import declaration.
5. The scope of an identifier denoting a function argument is the function body.
6. The scope of a variable assigned inside a function is the innermost containing block.

An identifier assigned in a block may be reassigned in an inner block with the exception of option identifiers.
While the identifier of the inner assignment is in scope, it denotes the entity assigned by the inner assignment.

Option identifiers have default assignments that are automatically defined in the _options block_.
Because the _options block_ is the top-level block of a Flux program, options are visible and available to any and all other blocks.

The package clause is not a assignment.
The package name does not appear in any scope.
Its purpose is to identify the files belonging to the same package and to specify the default package name for import declarations.


> To be implemented: [IMPL#247](https://github.com/influxdata/platform/issues/247) Add package/namespace support.

## Variable assignment

A variable assignment creates a variable bound to the identifier and gives it a type and value.
When the identifier was previously assigned within the same block the identifier now holds the new value.
An identifier cannot change type within the same block.

```
VarAssignment = identifier "=" Expression
```

##### Examples of variable assignment

```
n = 1
n = 2
f = 5.4
r = z()
```
