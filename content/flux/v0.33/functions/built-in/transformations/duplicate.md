---
title: duplicate() function
description: The duplicate() function duplicates a specified column in a table.
aliases:
  - /flux/v0.33/functions/transformations/duplicate
menu:
  flux_0_33:
    name: duplicate
    parent: Transformations
    weight: 1
---

The `duplicate()` function duplicates a specified column in a table.
If the specified column is part of the group key, it will be duplicated, but will
not be part of the output table's group key.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
duplicate(column: "column-name", as: "duplicate-name")
```

## Parameters

### column
The column to duplicate.

_**Data type:** String_

### as
The name assigned to the duplicate column.

_**Data type:** String_

{{% note %}}
If the `as` column already exists, this function will overwrite the existing values.
{{% /note %}}

## Examples
```js
from(bucket: "telegraf/autogen")
	|> range(start:-5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> duplicate(column: "host", as: "server")
```
