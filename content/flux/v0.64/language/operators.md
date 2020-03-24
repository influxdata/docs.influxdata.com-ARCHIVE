---
title: Operators in the Flux language
description: Flux supports many types of operators including arithmetic operators, comparison operators, function operators, and others.
menu:
  flux_0_64:
    name: Operators
    parent: Language reference
    weight: 130
---

Flux includes the following types of operators:

- [Arithmetic operators](#arithmetic-operators)
- [Comparison operators](#comparison-operators)
- [Logical operators](#logical-operators)
- [Assignment operators](#assignment-operators)
- [Function operators](#function-operators)
- [String Operators](#string-operators)
- [Literal constructors](#literal-constructors)
- [Miscellaneous operators](#miscellaneous-operators)

_Also see:_

- [Operator precedence](#operator-precedence)

## Arithmetic operators
Arithmetic operators take two numerical values (either literals or variables) and
perform a calculation that returns a single numerical value.

| Operator | Description    | Example  | Result |
|:--------:|:-----------    | -------  | ------ |
| `+`      | Addition       | `1 + 1`  | `2`    |
| `-`      | Subtraction    | `3 - 2`  | `1`    |
| `*`      | Multiplication | `2 * 3`  | `6`    |
| `/`      | Division       | `9 / 3`  | `3`    |
| `^`      | Exponentiation | `2 ^ 3`  | `8`    |
| `%`      | Modulo         | `10 % 5` | `0`    |

{{% note %}}
In the current version of Flux, values used in arithmetic operations must
be of the same numeric type (integer or float).
Operations with values of different numeric types will result in a type error.
{{% /note %}}

## Comparison operators
Comparison operators compare expressions and return true or false based on the comparison.

| Operator | Description                     | Example             | Result  |
|:--------:|:-----------                     | -------             | ------  |
| `==`     | Equal to                        | `"abc" == "abc"`    | `true`  |
| `!=`     | Not equal to                    | `"abc" != "def"`    | `true`  |
| `<`      | Less than                       | `1 < 2`             | `true`  |
| `>`      | Greater than                    | `1 > 2`             | `false` |
| `<=`     | Less than or equal              | `1 <= 2`            | `true`  |
| `>=`     | Greater than or equal           | `1 >= 2`            | `false` |
| `=~`     | Equal to regular expression     | `"abc" =~ /[a-z]*/` | `true`  |
| `!~`     | Not equal to regular expression | `"abc" !~ /[0-9]*/` | `true`  |

{{% note %}}
The `>` and `<` operators also [compare the lexicographic order of strings](#string-operators).
{{% /note %}}

## Logical operators
| Operator | Description                                                           |
|:--------:|:-----------                                                           |
| `and`    | Returns `true` if both operands are true. Otherwise, returns `false`. |
| `or`     | Returns `true` if any operand is true. Otherwise, returns `false`.    |

#### Short-circuit evaluation
Flux logical operators observe the short-circuiting behavior seen in other programming languages.
The evaluation of the left-hand (LH) operand  determines if the right-hand (RH) operand is evaluated.

- When the operator is `and` and the LH operand evaluates to `false`, the evaluation
  returns `false` without evaluating the RH operand.
- When the operator is `or` and the LH operand evaluates to `true`, the evaluation
  returns `true` without evaluating the RH operand.

## Assignment operators
An assignment operator assigns a value to its left operand based on the value of its right operand.

| Operator | Description                                         | Example | Meaning |
|:--------:|:-----------                                         | ------- | ------- |
| `=`      | Assign value of left expression to right expression | `x = y` | x = y   |


## Function operators
Function operators facilitate the creation of functions and control the flow of data through operations.

| Operator             | Description        | Examples                             | Meaning                                                                                                                                                                 |
|:--------:            |:-----------        | --------                             | -------                                                                                                                                                                 |
| <code>&#124;></code> | Pipe&#8209;forward | <code>data &#124;> function()</code> | Tables contained in the "data" variable are piped into the function.                                                                                                    |
| `<-`                 | Pipe&#8209;receive | `tables=<-`                          | The "tables" variable or parameter is assigned to data piped into the operation. _This operator is used for any data type passed into a function; not just table data._ |
| `=>`                 | Arrow              | `(r) => r.tag1 == "tagvalue"`        | The arrow passes an object or parameters into function operations.                                                                                                      |
| `()`                 | Function call      | `top(n:10)`                          | Call the `top` function setting the `n` parameter to `10` and perform the associated operations.                                                                        |

---

_See [Custom functions](/flux/v0.64/stdlib/custom-functions/) for examples of function operators is use._

---

## String Operators
String operators concatenate or compare string values.

| Operator | Description                         | Examples        | Result  |
|:--------:|:-----------                         | --------        | ------  |
| `+`      | Concatenation                       | `"ab" + "c"`    | `"abc"` |
| `<`      | Less than in lexicographic order    | `"ant" < "bee"` | `true`  |
| `>`      | Greater than in lexicographic order | `"ant" > "bee"` | `false` |

## Literal constructors
Literal constructors define fixed values.

| Operator | Description  |
|:--------:| -----------  |
| `[ ]`    | List / array |
| `{ }`    | Object       |
| `""`     | String       |

## Miscellaneous operators
| Operator | Description                   | Example                     |
|:--------:|:-----------                   | -------                     |
| `( )`    | Logical grouping              | `r._value / (r._value * 2)` |
| `,`      | Sequence delimiter            | `item1, item2, item3`       |
| `:`      | Key-value separator           | `{name: "Bob"}`             |
| `.`      | Member access / dot reference | `r._measurement`            |

## Operator precedence
The table below outlines operator precedence.
Operators with a lower number have higher precedence.

| Precedence | Operator           | Description               |
|:----------:|:--------:          |:--------------------------|
| 1          | `a()`              | Function call             |
|            | `a[]`              | Member or index access    |
|            | `.`                | Member access             |
| 2          | `*` `/`            |Multiplication and division|
| 3          | `+` `-`            | Addition and subtraction  |
| 4          |`==` `!=`           | Comparison operators      |
|            | `<` `<=`           |                           |
|            | `>` `>=`           |                           |
|            |`=~` `!~`           |                           |
| 5          | `not`              | Unary logical operator    |
|            | `exists`           | Null check operator       |
| 6          | `and`              | Logical AND               |
| 7          | `or`               | Logical OR                |
| 8          | `if` `then` `else` | Conditional               |
