---
title: sort() function
description: placeholder
menu:
  flux_0_7:
    name: sort
    parent: Functions
    weight: 1
---

The `sort()` function orders the records within each table.
One output table is produced for each input table.
The output tables will have the same schema as their corresponding input tables.

_**Function type:** Tranformation_  
_**Output data type:** Object_

```js
sort(columns: ["_value"], desc: false)
```

## Parameters

### columns
List of columns by which to sort.
Sort precedence is determined by list order (left to right).
Default is `["_value"]`.

_**Data type:** Array of strings_

### desc
Sort results in descending order.
Default is `false`.

_**Data type:** Boolean_

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" AND
    r._field == "uptime")
  |> sort(columns:["region", "host", "_value"])
```
