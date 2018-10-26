---
title: set() function
description: placeholder
menu:
  flux_0_7:
    name: set
    parent: Functions
    weight: 1
---

The `set()` function assigns a static value to each record in the input table.
The key may modify an existing column or add a new column to the tables.
If the modified column is part of the group key, the output tables are regrouped as needed.

_**Function type:** transformation_  
_**Output data type:** table(s)_

```js
set(key: "myKey",value: "myValue")
```

## Parameters

### key
The label of the column to modify or set.

_**Data type:** string_

### value
The string value to set.

_**Data type:** string_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> set(key: "host", value: "prod-node-1")
```
