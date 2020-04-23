---
title: elapsed() function
description: The `elapsed()` function returns the time between subsequent records.
menu:
  flux_0_65:
    name: elapsed
    parent: Transformations
weight: 401
aliases:
  - /flux/v0.65/functions/built-in/transformations/elapsed/
---

The `elapsed()` function returns the time between subsequent records.
Given an input table, `elapsed()` returns the same table without the first record
(as elapsed time is not defined) and an additional column containing the elapsed time.

_**Function type:** Transformation_  

```js
elapsed(
  unit: 1s,
  timeColumn: "_time",
  columnName: "elapsed"
)
```

_`elapsed()` returns an errors if the `timeColumn` is not present in the input table._

## Parameters

### unit
The unit time to returned.
_Defaults to `1s`._

_**Data type:** Duration_

### timeColumn
The column to use to compute the elapsed time.
_Defaults to `"_time"`._

_**Data type:** String_

### columnName
The column to store elapsed times.
_Defaults to `"elapsed"`._

_**Data type:** String_

## Examples

##### Calculate the time between points in seconds
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> elapsed(unit: 1s)
```
