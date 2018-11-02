---
title: unique() function
description: placeholder
menu:
  flux_0_7:
    name: unique
    parent: Functions
    weight: 1
---

The `unique()` function returns all records containing unique values in a specified column.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
unique(column: "_value")
```

## Parameters

### column
The column searched for unique values.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from("telegraf/autogen")
 |> range(start: -15m)
 |> filter(fn: (r) => r._measurement == "syslog")
 |> unique(column: "message")
```
