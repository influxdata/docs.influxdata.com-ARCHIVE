---
title: Expressions
description: An expression specifies the computation of a value by applying the operators and functions to operands.
menu:
  flux_0_24:
    parent: Language reference
    name: Expressions
    weight: 40
---

An _expression_ specifies the computation of a value by applying the operators and functions to operands.

## Operands and primary expressions

Operands denote the elementary values in an expression.

Primary expressions are the operands for unary and binary expressions.
A primary expressions may be a literal, an identifier denoting a variable, or a parenthesized expression.

```js
PrimaryExpression = identifier | Literal | "(" Expression ")" .
```

## Literals
Literals construct a value.

```js
Literal = int_lit
        | float_lit
        | string_lit
        | regex_lit
        | duration_lit
        | pipe_receive_lit
        | ObjectLiteral
        | ArrayLiteral
        | FunctionLiteral .
```

### Object literals
Object literals construct a value with the object type.

```js
ObjectLiteral = "{" PropertyList "}" .
PropertyList  = [ Property { "," Property } ] .
Property      = identifier [ ":" Expression ]
              | string_lit ":" Expression .
```

### Array literals

Array literals construct a value with the array type.

```js
ArrayLiteral   = "[" ExpressionList "]" .
ExpressionList = [ Expression { "," Expression } ] .
```

### Function literals

A _function literal_ defines a new function with a body and parameters.
The function body may be a block or a single expression.
The function body must have a return statement if it is an explicit block, otherwise the expression is the return value.

```js
FunctionLiteral    = FunctionParameters "=>" FunctionBody .
FunctionParameters = "(" [ ParameterList [ "," ] ] ")" .
ParameterList      = Parameter { "," Parameter } .
Parameter          = identifier [ "=" Expression ] .
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

```js
CallExpression = "(" PropertyList ")" .
```

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
pipe_receive_lit = "<-" .
```

##### Examples of pipe expressions

```js
foo = () => // function body elided
bar = (x=<-) => // function body elided
baz = (y=<-) => // function body elided
foo() |> bar() |> baz() // equivalent to baz(x:bar(y:foo()))
```

## Index expressions
Index expressions access a value from an array based on a numeric index.

```js
IndexExpression = "[" Expression "]" .
```

## Member expressions
Member expressions access a property of an object.
The property being accessed must be either an identifier or a string literal.
In either case the literal value is the name of the property being accessed, the identifier is not evaluated.
It is not possible to access an object's property using an arbitrary expression.

```js
MemberExpression        = DotExpression  | MemberBracketExpression
DotExpression           = "." identifer
MemberBracketExpression = "[" string_lit "]" .
```

### Operators
Operators combine operands into expressions.
The precedence of the operators is given in the table below.
Operators with a lower number have higher precedence.

|Precedence| Operator |        Description        |
|----------|----------|---------------------------|
|     1    |  `a()`   |       Function call       |
|          |  `a[]`   |  Member or index access   |
|          |   `.`    |       Member access       |
|     2    | `*` `/`  |Multiplication and division|
|     3    | `+` `-`  | Addition and subtraction  |
|     4    |`==` `!=` |   Comparison operators    |
|          | `<` `<=` |                           |
|          | `>` `>=` |                           |
|          |`=~` `!~` |                           |
|     5    |  `not`   | Unary logical expression  |
|     6    |`and` `or`|    Logical AND and OR     |

The operator precedence is encoded directly into the grammar as the following.

```js
Expression               = LogicalExpression .
LogicalExpression        = UnaryLogicalExpression
                         | LogicalExpression LogicalOperator UnaryLogicalExpression .
LogicalOperator          = "and" | "or" .
UnaryLogicalExpression   = ComparisonExpression
                         | UnaryLogicalOperator UnaryLogicalExpression .
UnaryLogicalOperator     = "not" .
ComparisonExpression     = MultiplicativeExpression
                         | ComparisonExpression ComparisonOperator MultiplicativeExpression .
ComparisonOperator       = "==" | "!=" | "<" | "<=" | ">" | ">=" | "=~" | "!~" .
AdditiveExpression       = MultiplicativeExpression
                         | AdditiveExpression AdditiveOperator MultiplicativeExpression .
AdditiveOperator         = "+" | "-" .
MultiplicativeExpression = PipeExpression
                         | MultiplicativeExpression MultiplicativeOperator PipeExpression .
MultiplicativeOperator   = "*" | "/" .
PipeExpression           = PostfixExpression
                         | PipeExpression PipeOperator UnaryExpression .
PipeOperator             = "|>" .
UnaryExpression          = PostfixExpression
                         | PrefixOperator UnaryExpression .
PrefixOperator           = "+" | "-" .
PostfixExpression        = PrimaryExpression
                         | PostfixExpression PostfixOperator .
PostfixOperator          = MemberExpression
                         | CallExpression
                         | IndexExpression .
```

_Also see [Flux Operators](/flux/v0.24/language/operators)._
