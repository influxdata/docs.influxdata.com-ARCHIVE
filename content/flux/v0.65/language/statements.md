---
title: Statements
description: Statements control execution in the Flux functional data scripting language.
menu:
  flux_0_65:
    parent: Language reference
    name: Statements
    weight: 100
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is an issue number tracking discussion and progress towards implementation.

A _statement_ controls execution.

```js
Statement = OptionAssignment
          | BuiltinStatement
          | VariableAssignment
          | ReturnStatement
          | ExpressionStatement .
```

## Import declaration

```js
ImportDeclaration = "import" [identifier] string_lit .
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
A package may reassign a new value to an option identifier declared in one of its imported packages.
A package cannot access nor modify the identifiers belonging to the imported packages of its imported packages.
Every statement contained in an imported package is evaluated.

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

## Named types

A named type can be created using a type assignment statement.
A named type is equivalent to the type it describes and may be used interchangeably.

```js
TypeAssignement   = "type" identifier "=" TypeExpression
TypeExpression    = identifier
                  | TypeParameter
                  | ObjectType
                  | ArrayType
                  | GeneratorType
                  | FunctionType .
TypeParameter     = "'" identifier .
ObjectType        = "{" PropertyTypeList [";" ObjectUpperBound ] "}" .
ObjectUpperBound  = "any" | PropertyTypeList .
PropertyTypeList  = PropertyType [ "," PropertyType ] .
PropertyType      = identifier ":" TypeExpression
                  | string_lit ":" TypeExpression .
ArrayType         = "[]" TypeExpression .
GeneratorType     = "[...]" TypeExpression .
FunctionType      = ParameterTypeList "->" TypeExpression
ParameterTypeList = "(" [ ParameterType { "," ParameterType } ] ")" .
ParameterType     = identifier ":" [ pipe_receive_lit ] TypeExpression .
```

Named types are a separate namespace from values.
It is possible for a value and a type to have the same identifier.
The following named types are built-in.

```js
bool     // boolean
int      // integer
uint     // unsigned integer
float    // floating point number
duration // duration of time
time     // time
string   // utf-8 encoded string
regexp   // regular expression
type     // a type that itself describes a type
```

When an object's upper bound is not specified, it is assumed to be equal to its lower bound.

Parameters to function types define whether the parameter is a pipe forward
parameter and whether the parameter has a default value.
The `<-` indicates the parameter is the pipe forward parameter.

###### Examples
```js
    // alias the bool type
    type boolean = bool

    // define a person as an object type
    type person = {
        name: string,
        age: int,
    }

    // Define addition on ints
    type intAdd = (a: int, b: int) -> int

    // Define polymorphic addition
    type add = (a: 'a, b: 'a) -> 'a

    // Define funcion with pipe parameter
    type bar = (foo: <-string) -> string

    // Define object type with an empty lower bound and an explicit upper bound
    type address = {
        ;
        street: string,
        city: string,
        state: string,
        country: string,
        province: string,
        zip: int,
    }
```
