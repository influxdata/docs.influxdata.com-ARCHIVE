---
title: unique() function
description: The unique() function returns all records containing unique values in
  a specified column.
aliases:
  - /flux/v0.65/functions/transformations/selectors/unique
  - /flux/v0.65/functions/built-in/transformations/selectors/unique/
menu:
  flux_0_65:
    name: unique
    parent: Selectors
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
