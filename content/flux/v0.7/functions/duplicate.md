---
title: duplicate() function
description: The duplicate() function duplicates a specified column in a table.
menu:
  flux_0_7:
    name: duplicate
    parent: Functions
    weight: 1
---

The `duplicate()` function duplicates a specified column in a table.

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

## Examples
```js
from(bucket: "telegraf/autogen")
	|> range(start:-5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> duplicate(column: "host", as: "server")
```
