---
title: tail() function
description: The `tail()` function limits each output table to the last `n` records.
menu:
  flux_0_64:
    name: tail
    parent: Transformations
    weight: 1
aliases:
  - /flux/v0.64/functions/built-in/transformations/tail/
---

The `tail()` function limits each output table to the last [`n`](#n) records.
The function produces one output table for each input table.
Each output table contains the last `n` records before the [`offset`](#offset).
If the input table has less than `offset + n` records, `tail()` outputs all records before the `offset`.

_**Function type:** Filter_

```js
tail(
  n:10,
  offset: 0
)
```

## Parameters

### n
The maximum number of records to output.

_**Data type:** Integer_

### offset
The number of records to skip at the end of a table table before limiting to `n`.
Defaults to `0`.

_**Data type:** Integer_

## Examples

##### Output the last ten records in each table
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> tail(n:10)
```
