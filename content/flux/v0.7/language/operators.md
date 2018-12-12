---
title: Operators in the Flux language
description: Flux supports many types of operators including arithmetic operators, comparison operators, function operators, and others.
menu:
  flux_0_7:
    name: Operators
    parent: Language reference
    weight: 130
---

Flux includes the following types of operators:

- [Arithmetic operators](#arithmetic-operators)
- [Comparison operators](#comparison-operators)
- [Assignment operators](#assignment-operators)
- [Function operators](#function-operators)
- [String Operators](#string-operators)
- [Literal constructors](#literal-constructors)
- [Miscellaneous operators](#miscellaneous-operators)

## Arithmetic operators
Arithmetic operators take two numerical values (either literals or variables) and
perform a calculation that returns a single numerical value.

| Operator | Description    | Example  | Result |
|:--------:| -----------    | -------  | ------ |
| `+`      | Addition       | `1 + 1`  | `2`    |
| `-`      | Subtraction    | `3 - 2`  | `1`    |
| `*`      | Multiplication | `2 * 3`  | `6`    |
| `/`      | Division       | `9 / 3`  | `3`    |
| `%`      | Modulus        | `10 % 5` | `0`    |

> In the current version of Flux, values used in arithmetic operations must
> be of the same numeric type (integer or float).
> Operations with values of different numeric types will result in a type error.

## Comparison operators
Comparison operators compare expressions and return true or false based on the comparison.

| Operator | Description                     | Example             | Result  |
|:--------:| -----------                     | -------             | ------  |
| `==`     | Equal to                        | `"abc" == "abc"`    | `true`  |
| `!=`     | Not equal to                    | `"abc" != "def"`    | `true`  |
| `<`      | Less than                       | `1 < 2`             | `true`  |
| `>`      | Greater than                    | `1 > 2`             | `false` |
| `<=`     | Less than or equal              | `1 <= 2`            | `true`  |
| `>=`     | Greater than or equal           | `1 >= 2`            | `false` |
| `=~`     | Equal to regular expression     | `"abc" =~ /[a-z]*/` | `true`  |
| `!~`     | Not equal to regular expression | `"abc" !~ /[0-9]*/` | `true`  |


> The `>` and `<` operators can be used to [compare the lexicographic order of strings](#string-operators).

## Assignment operators
An assignment operator assigns a value to its left operand based on the value of its right operand.

| Operator | Description                                         | Example | Meaning |
|:--------:| -----------                                         | ------- | ------- |
| `=`      | Assign value of left expression to right expression | `x = y` | x = y   |


## Function operators
Function operators are used to create functions and control the flow of data through function operations.

| Operator             | Description        | Examples                             | Meaning                                                                                                                                                                 |
|:--------:            | -----------        | --------                             | -------                                                                                                                                                                 |
| <code>&#124;></code> | Pipe&#8209;forward | <code>data &#124;> function()</code> | Tables contained in the "data" variable are piped into the function.                                                                                                    |
| `<-`                 | Pipe&#8209;receive | `tables=<-`                          | The "tables" variable or parameter is assigned to data piped into the operation. _This operator is used for any data type passed into a function; not just table data._ |
| `=>`                 | Arrow              | `(r) => r.tag1 == "tagvalue"`        | The arrow passes an object or parameters into function operations.                                                                                                      |
| `()`                 | Function call      | `top(n:10)`                          | Call the `top` function setting the `n` parameter to `10` and perform the associated operations.                                                                        |

---

_See [Custom functions](/flux/v0.7/functions/custom-functions/) for examples of function operators is use._

---

## String Operators
String operators concatenate or compare string values.

| Operator | Description                         | Examples        | Result  |
|:--------:| -----------                         | --------        | ------  |
| `+`      | Concatenation                       | `"ab" + "c"`    | `"abc"` |
| `<`      | Less than in lexicographic order    | `"ant" < "bee"` | `true`  |
| `>`      | Greater than in lexicographic order | `"ant" > "bee"` | `false` |

## Literal constructors
Literal constructors are used to define fixed values.

| Operator | Description  |
|:--------:| -----------  |
| `[ ]`    | List / array |
| `{ }`    | Object       |
| `""`     | String       |

## Miscellaneous operators
| Operator | Description         | Example                     |
|:--------:| -----------         | -------                     |
| `( )`    | Logical grouping    | `r._value / (r._value * 2)` |
| `,`      | Sequence delimiter  | `item1, item2, item3`       |
| `:`      | Key-value separator | `{name: "Bob"}`             |
| `.`      | Dot reference       | `r._measurement`            |
