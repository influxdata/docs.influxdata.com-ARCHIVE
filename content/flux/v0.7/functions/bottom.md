---
title: bottom() function
description: placeholder
menu:
  flux_0_7:
    name: bottom
    parent: Functions
    weight: 1
---

The `bottom()` function sorts a table by columns and keeps only the bottom `n` records.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
bottom(n:10, cols: ["_value"])
```

## Parameters

### n
Number of records to return.

_**Data type:** Integer_

### columns
List of columns by which to sort.
Sort precedence is determined by list order (left to right).
Default is `["_value"]`.

_**Data type:** Array of strings_

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) => r._measurement == "mem" AND r._field == "used_percent")
  |> bottom(n:10)
```

## Function definition
```js
// _sortLimit is a helper function, which sorts and limits a table.
_sortLimit = (n, desc, cols=["_value"], table=<-) =>
  table
    |> sort(cols:cols, desc:desc)
    |> limit(n:n)

bottom = (n, cols=["_value"], table=<-) => _sortLimit(table:table, n:n, cols:cols, desc:false)
```
