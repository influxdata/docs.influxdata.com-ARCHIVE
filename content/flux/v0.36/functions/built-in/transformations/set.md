---
title: set() function
description: The set() function assigns a static value to each record in the input table.
aliases:
  - /flux/v0.36/functions/transformations/set
menu:
  flux_0_36:
    name: set
    parent: Transformations
    weight: 1
---

The `set()` function assigns a static value to each record in the input table.
The key may modify an existing column or add a new column to the tables.
If the modified column is part of the group key, the output tables are regrouped as needed.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
set(key: "myKey",value: "myValue")
```

## Parameters

### key
The label of the column to modify or set.

_**Data type:** String_

### value
The string value to set.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> set(key: "host", value: "prod-node-1")
```
