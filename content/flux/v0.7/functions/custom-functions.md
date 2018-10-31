---
title: Create custom Flux functions
description:
menu:
  flux_0_7:
    name: Custom functions
    parent: Functions
    weight: 1
---

## Syntax for creating functions

```js
// Basic function definition structure
functionName = (functionParameters) => functionOperations
```

## Creating a pipe-able functions
```js
functionName = (table=<-) => table |> functionOperation
```

## Setting parameter defaults
```js
functionName = (param1=defaultValue, param2=defaultValue) => table |> functionOperation
```

## Examples

```js
multByX = (table=<-, x) => table |> map(fn: (row) => row._value * x)
```
