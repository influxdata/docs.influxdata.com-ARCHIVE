---
title: rename() function
description: The rename() function renames specified columns in a table.
aliases:
  - /flux/v0.x/functions/transformations/rename
menu:
  flux_0_x:
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

```js
rename(columns: {host: "server", facility: "datacenter"})

// OR

rename(fn: (column) => "{column}_new")
```

## Parameters

### columns
A map of columns to rename and their corresponding new names.
Cannot be used with `fn`.

_**Data type:** Object_

### fn
A function mapping between old and new column names.
Cannot be used with `columns`.

_**Data type:** Function_

{{% note %}}
Make sure `fn` parameter names match each specified parameter.
To learn why, see [Match parameter names](/flux/v0.x/language/data-model/#match-parameter-names).
{{% /note %}}

## Examples

##### Rename a single column
```js
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> rename(columns: {host: "server"})
```

##### Rename all columns using a function
```js
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> rename(fn: (column) => column + "_new")
```
