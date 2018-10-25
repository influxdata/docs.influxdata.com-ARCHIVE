---
title: count() function
description: placeholder
menu:
  flux_0_7:
    name: count
    parent: Functions
    weight: 1
---

The `count()` function outputs the number of non-null records in each aggregated column.

**Output data type:** integer  
**Function type:** aggregate

```js
count(columns: ["_value"])
```

## Parameters

### columns
A list of columns on which to operate
Defaults to `["_value"]`.

_**Data type: array of strings**_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> count()
```

```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> count(["_value"])
```
