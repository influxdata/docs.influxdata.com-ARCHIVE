---
title: top() function
description: The top() function sorts a table by columns and keeps only the top n records.
aliases:
  - /flux/v0.24/functions/transformations/selectors/top
menu:
  flux_0_24:
    name: top
    parent: Selectors
    weight: 1
---

The `top()` function sorts a table by columns and keeps only the top `n` records.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
top(n:10, columns: ["_value"])
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
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
  |> top(n:10)
```

## Function definition
```js
// _sortLimit is a helper function, which sorts and limits a table.
_sortLimit = (n, desc, columns=["_value"], tables=<-) =>
  tables
    |> sort(columns:columns, desc:desc)
    |> limit(n:n)

top = (n, columns=["_value"], tables=<-) => _sortLimit(n:n, columns:columns, desc:true)
```
