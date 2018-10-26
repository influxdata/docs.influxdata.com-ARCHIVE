---
title: duplicate() function
description: placeholder
menu:
  flux_0_7:
    name: duplicate
    parent: Functions
    weight: 1
---

The `duplicate()` function duplicates a specified column in a table.

_**Function type:** transformation_  
_**Output data type:** table(s)_

```js
duplicate(column: "column-name", as: "duplicate-name")
```

## Parameters

### column
The column to duplicate.

_**Data type:** string_

### as
The name assigned to the duplicate column.

_**Data type:** string_

## Examples
```js
from(bucket: "telegraf/autogen")
	|> range(start:-5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> duplicate(column: "host", as: "server")
```
