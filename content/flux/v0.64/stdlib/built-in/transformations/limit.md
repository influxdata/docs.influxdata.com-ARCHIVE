---
title: limit() function
description: The `limit()` function limits each output table to the first `n` records.
aliases:
  - /flux/v0.64/functions/transformations/limit
  - /flux/v0.64/functions/built-in/transformations/limit/
menu:
  flux_0_64:
    name: limit
    parent: Transformations
    weight: 1
---

The `limit()` function limits each output table to the first [`n`](#n) records.
The function produces one output table for each input table.
Each output table contains the first `n` records after the [`offset`](#offset).
If the input table has less than `offset + n` records, `limit()` outputs all records after the `offset`.

_**Function type:** Filter_  

```js
limit(
  n:10,
  offset: 0
)
```

## Parameters

### n
The maximum number of records to output.

_**Data type:** Integer_

### offset
The number of records to skip per table before limiting to `n`.
Defaults to `0`.

_**Data type:** Integer_

## Examples

##### Output the first ten records in each table
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> limit(n:10)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[LIMIT](/influxdb/latest/query_language/data_exploration/#the-limit-and-slimit-clauses)  
