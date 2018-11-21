---
title: Operators in the Flux language
description:
menu:
  flux_0_7:
    name: Operators
    parent: Language reference
    weight: 130
---

```
+   ==   !=   (   )   =>
-   <    !~   [   ]
*   >    =~   {   }
/   <=   =    ,   :
%   >=   <-   .   |>
```


## Arithmetic operators

| Operator | Description    | Example | Result |
|:--------:| -----------    | ------- | ------ |
| +        | Addition       | 1 + 1   | 2      |
| -        | Subtraction    | 3 - 2   | 1      |
| *        | Multiplication | 2 * 3   | 6      |
| /        | Division       | 9 / 3   | 3      |
| %        | Modulus        | 10 % 5  | 0      |

## Comparison operators
Comparison operators compare expressions and return true or false based on the comparison.

| Operator | Description                     | Example           | Result |
|:--------:| -----------                     | -------           | ------ |
| ==       | Equal to                        | "abc" == "abc"    | true   |
| !=       | Not equal to                    | "abc" != "def"    | true   |
| <        | Less than                       | 1 < 2             | true   |
| >        | Greater than                    | 1 > 2             | false  |
| <=       | Less than or equal              | 1 <= 2            | true   |
| >=       | Greater than or equal           | 1 >= 2            | false  |
| =~       | Equal to regular expression     | "abc" =~ /[a-z]*/ | true   |
| !~       | Not equal to regular expression | "abc" !~ /[0-9]*/ | true   |


> The `>` and `<` operators can be used to [compare the lexicographic order of strings](#string-operators).

## Assignment operators
An assignment operator assigns a value to its left operand based on the value of its right operand.

| Operator | Description                                         | Example | Meaning |
|:--------:| -----------                                         | ------- | ------- |
| =        | Assign value of left expression to right expression | x = y   | x = y   |


## Pipe operators
Pipe operators represent to flow of data or tables through an operation.

| Operator | Description        | Examples                  | Meaning                                                                       |
|:--------:| -----------        | --------                  | -------                                                                       |
| &#124;>  | Pipe&#8209;forward | stream &#124;> function() | Tables contained in the stream variable are piped into the function.          |
| <-       | Pipe&#8209;receive | tables=<-                 | The table variable or parameter is assigned to data piped into the operation. |


## Grouping operators

| Operator | Description   |
|:--------:| -----------   |
| ( )      | Group         |
| [ ]      | List or array |
| { }      | Object        |


## String Operators

| Operator | Description                         | Examples      | Result |
|:--------:| -----------                         | --------      | ------ |
| +        | Concatenation                       | "ab" + "c"    | "abc"  |
| <        | Less than in lexicographic order    | "ant" < "bee" | true   |
| >        | Greater than in lexicographic order | "ant" > "bee" | false  |


## ???
| Operator | Description         |
|:--------:| -----------         |
| =>       |                     |
| ,        | List delimiter      |
| :        | Key-value separator |
| .        | Dot reference       |
