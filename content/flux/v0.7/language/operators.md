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
+   ==   !=   (   )
-   <    !~   [   ]
*   >    =~   {   }
/   <=   =    ,   :
%   >=   <-   .   |>
```


## Mathematical operators

| Operator | Description    |
|:--------:| -----------    |
| +        | Addition       |
| -        | Subtraction    |
| *        | Multiplication |
| /        | Division       |
| %        | Modulus        |

## Comparison operators

| Operator | Description                     |
|:--------:| -----------                     |
| ==       | Equal to                        |
| <        | Less than                       |
| >        | Greater than                    |
| <=       | Less than or equal              |
| >=       | Greater than or equal           |
| !=       | Not equal                       |
| !~       | Not equal to regular expression |
| =~       | Equal to regular expression     |

> The `>` and `<` operators can be used to [compare the lexicographic order of strings](#string-operators).

## Assignment operators

| Operator | Description |
|:--------:| ----------- |
| =        |             |


## Pipe operators

| Operator | Description  |
|:--------:| -----------  |
| &#124;>  | Pipe-forward |
| <-       | Pipe-receive |


## Grouping operators

| Operator | Description |
|:--------:| ----------- |
| ( )      |             |
| [ ]      |             |
| { }      |             |


## Logical operators

| Operator | Description |
|:--------:| ----------- |
| AND      |             |
| OR       |             |

> Logical operators are case-insensitive.

## ???
| Operator | Description |
|:--------:| ----------- |
| =>       |             |
| ,        |             |
| :        |             |
| .        |             |


## String Operators

| Operator | Description                         |
|:--------:| -----------                         |
| +        | Concatenation                       |
| <        | Less than in lexicographic order    |
| >        | Greater than in lexicographic order |
