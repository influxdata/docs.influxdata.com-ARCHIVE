---
title: rename() function
description: The rename() function renames specified columns in a table.
menu:
  flux_0_7:
    name: rename
    parent: Transformations
    weight: 1
---

The `rename()` function renames specified columns in a table.
If a column is renamed and is part of the group key, the column name in the group key will be updated.

There are two variants:

- one which maps old column names to new column names
- one which takes a mapping function.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
rename(columns: {host: "server", facility: "datacenter"})

// OR

rename(fn: (col) => "{col}_new")
```

## Parameters

### columns
A map of columns to rename and their corresponding new names.
Cannot be used with `fn`.

_**Data type:** Map_

### fn
A function which takes a single string parameter (the old column name) and returns a string representing the new column name.
Cannot be used with `columns`.

_**Data type:** Function_

## Examples

##### Rename a single column
```js
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> rename(columns:{host: "server"})
```

##### Rename all columns using a function
```js
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> rename(fn: (col) => "{col}_new")
```
