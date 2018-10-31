---
title: drop() function
description: placeholder
menu:
  flux_0_7:
    name: drop
    parent: Functions
    weight: 1
---

The `drop()` function removes specified columns from a table.
Columns are specified either through a list or a predicate function.
When a dropped column is part of the group key, it will be removed from the key.

_**Function type:** transformation_  
_**Output data type:** table(s)_

```js
drop(columns: ["col1", "col2"])

// OR

drop(fn: (col) => col =~ /usage*/)
```

## Parameters

### columns
Columns to be removed from the table.
Cannot be used with `fn`.

_**Data type:** array of strings_

### fn
A function which takes a column name as a parameter and returns a boolean indicating
whether or not the column should be removed from the table.
Cannot be used with `columns`.

_**Data type:** function_

## Examples

##### Drop a list of columns
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> drop(columns: ["host", "_measurement"])
```

##### Drop columns matching a predicate
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> drop(fn: (col) => col =~ /usage*/)
```
