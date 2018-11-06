---
title: Expressions
description:
menu:
  flux_0_7:
    parent: Language reference
    name: Expressions
    weight: 40
---

> **Note:** This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a `[IMPL#XXX]` where `XXX` is an issue number tracking discussion and progress towards implementation.

An _expression_ specifies the computation of a value by applying the operators and functions to operands.

## Operands

Operands denote the elementary values in an expression.
An operand may be a literal, identifier denoting a variable, or a parenthesized expression.

> To be added: Expression details.

PEG parsers don't understand operators precedence, so it difficult to express operators in expressions with the grammar.
We should simplify it and use the EBNF grammar.
This requires redoing the parser in something besides PEG.

> To be implemented: [IMPL#246](https://github.com/influxdata/platform/issues/246) Update parser to use formal EBNF grammar.

## Function literals

A _function literal_ defines a new function with a body and parameters.
The function body may be a block or a single expression.
The function body must have a return statement if it is an explicit block, otherwise the expression is the return value.

```
    FunctionLit        = FunctionParameters "=>" FunctionBody .
    FunctionParameters = "(" [ ParameterList [ "," ] ] ")" .
    ParameterList      = ParameterDecl { "," ParameterDecl } .
    ParameterDecl      = identifier [ "=" Expression ] .
    FunctionBody       = Expression | Block .
```

##### Examples of function literals

```js
() => 1 // function returns the value 1
(a, b) => a + b // function returns the sum of a and b
(x=1, y=1) => x * y // function with default values
(a, b, c) => { // function with a block body
    d = a + b
    return d / c
}

```
All function literals are anonymous.
A function may be given a name using a variable assignment.

```
add = (a,b) => a + b
mul = (a,b) => a * b
```

Function literals are _closures_ and may refer to variables defined in a surrounding block.
Those variables are shared between the function literal and the surrounding block.

## Call expressions

A _call expression_ invokes a function with the provided arguments.
Arguments must be specified using the argument name.
Positional arguments are not supported.
Argument order does not matter.
When an argument has a default value, it is not required to be specified.

##### Examples of call expressions

```js
f(a:1, b:9.6)
float(v:1)
```

## Pipe expressions

A _pipe expression_ is a call expression with an implicit piped argument.
Pipe expressions simplify creating long nested call chains.

Pipe expressions pass the result of the left hand expression as the _pipe argument_ to the right hand call expression.
Function literals specify which if any argument is the pipe argument using the _pipe literal_ as the argument's default value.
It is an error to use a pipe expression if the function does not declare a pipe argument.

```js
pipe_lit = "<-" .
```

##### Examples of pipe expressions

```js
foo = () => // function body elided
bar = (x=<-) => // function body elided
baz = (y=<-) => // function body elided
foo() |> bar() |> baz() // equivalent to baz(x:bar(y:foo()))
```
