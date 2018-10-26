---
title: keep() function
description: placeholder
menu:
  flux_0_7:
    name: keep
    parent: Functions
    weight: 1
---

The `keep()` function returns a table containing only the specified columns, ignoring all others.
Only columns in the group key that are also specified in the `keep()` function will be kept in the resulting group key.
_It is the inverse of [`drop`](../drop)._

_**Function type:** transformation_  
_**Output data type:** table(s)_

```js
keep(columns: ["col1", "col2"])

// OR

keep(fn: (col) => col =~ /inodes*/)
```

## Parameters

### columns
Columns that should be included in the resulting table.
Cannot be used with `fn`.

_**Data type:** array of strings_

### fn
A function which takes a column name as a parameter and returns a boolean indicating
whether or not the column should be included in the resulting table.
Cannot be used with `columns`.

_**Data type:** function_

## Examples

##### Keep a list of columns:
```js
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> keep(columns: ["_time", "_value"])
```

##### Keep all columns matching a predicate:
```js
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> keep(fn: (col) => col =~ /inodes*/)
```
