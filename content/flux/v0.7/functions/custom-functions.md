---
title: Create custom Flux functions
description:
menu:
  flux_0_7:
    name: Custom functions
    parent: Functions
    weight: 1
---

Flux's functional syntax allows for custom functions.
This guide walks through the basics of creating your own function.

## Function definition structure
The basic structure for defining functions in Flux is as follows:

```js
// Basic function definition structure
functionName = (functionParameters) => functionOperations
```

##### `functionName`
The name used to call the function in your Flux script.  

##### `functionParameters`
A comma-separated list of parameters passed into the function and used in its operations.
[Parameter defaults](#define-parameter-defaults) can be defined for each.  

##### `functionOperations`
Operations and functions that manipulate the input into the desired output.

#### Basic function examples

###### Example square function
```js
// Function definition
square = (n) => n * n

// Function usage
> square(n:3)
9
```

###### Example multiply function
```js
// Function definition
multiply = (x, y) => x * y

// Function usage
> multiply(x:2, y:15)
30
```

## Functions that manipulate pipe-forwarded data
Most Flux functions manipulate data pipe-forwarded into the function.
In order for a custom function to process pipe-forwarded data, one of the function
parameters must capture the input tables using the `<-` pipe expression.

In the example below, the `table` parameter is assigned to the `<-` expression,
which represents all data pipe-forwarded into the function.
`table` is then pipe-forwarded into other operations in the function definition.

```js
functionName = (table=<-) => table |> functionOperations
```

#### Pipe-forwardable function example

###### Multiply row values by x
The example below defines a `multByX` function that multiplies the `_value` column
of each row in the input table by the `x` parameter.
It uses the [`map()` function](../map) to modify each `_value`.

```js
// Function definition
multByX = (table=<-, x) => table |> map(fn: (row) => row._value * x)

// Function usage
from(bucket: "telegraf/autogen")
  |> range(start: -1m)
  |> filter(fn: (row) => row._measurement == "mem" AND row._field == "used_percent" )
  |> multByX(x:2.0)
```

## Define parameter defaults
To define parameters with default values, use the `=` assignment operator to assign
a default in your function definition:

```js
functionName = (param1=defaultValue1, param2=defaultValue2) => functionOperation
```

Defaults are overridden by explicitly defining the parameter in the function call.

#### Example functions with defaults

###### Get the winner or the "winner"
The example below defines a `getWinner` function that returns the record with the highest
or lowest `_value` (winner versus "winner") depending on the `noSarcasm` parameter which defaults to `true`.
It uses the [`sort()` function](../sort) to sort records in either descending or ascending order.
It then uses the [`limit()` function](../limit) to return the first record from the sorted table.

```js
// Function definition
getWinner = (table=<-, noSarcasm:true) => table |> sort(desc: noSarcasm) |> limit(n:1)

// Function usage
// Get the winner
from(bucket: "telegraf/autogen")
  |> range(start: -1m)
  |> filter(fn: (row) => row._measurement == "mem" AND row._field == "used_percent" )
  |> getWinner()

// Get the "winner"
from(bucket: "telegraf/autogen")
  |> range(start: -1m)
  |> filter(fn: (row) => row._measurement == "mem" AND row._field == "used_percent" )
  |> getWinner(noSarcasm: false)
```
