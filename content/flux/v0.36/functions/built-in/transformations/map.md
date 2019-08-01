---
title: map() function
description: The map() function applies a function to each record in the input tables.
aliases:
  - /flux/v0.36/functions/transformations/map
menu:
  flux_0_36:
    name: map
    parent: Transformations
    weight: 1
---

The `map()` function applies a function to each record in the input tables.
The modified records are assigned to new tables based on the group key of the input table.
The output tables are the result of applying the map function to each record of the input tables.

When the output record contains a different value for the group key, the record is regrouped into the appropriate table.
When the output record drops a column that was part of the group key, that column is removed from the group key.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
map(fn: (r) => r._value * r._value), mergeKey: true)
```

## Parameters

### fn
A single argument function that to apply to each record.
The return value must be an object.

_**Data type:** Function_

> Objects evaluated in `fn` functions are represented by `r`, short for "record" or "row".

### mergeKey
Indicates if the record returned from `fn` should be merged with the group key.
When merging, all columns on the group key will be added to the record giving precedence to any columns already present on the record.
When not merging, only columns defined on the returned record will be present on the output records.
Defaults to `true`.

_**Data type:** Boolean_

## Important notes

#### Preserve columns
By default, `map()` drops any columns that:

1. Are not part of the input table's group key.
2. Are not explicitly mapped in the `map()` function.

This often results in the `_time` column being dropped.
To preserve the `_time` column and other columns that do not meet the criteria above,
use the `with` operator to map values in the `r` object.
The `with` operator updates a column if it already exists,
creates a new column if it doesn't exist, and includes all existing columns in
the output table.

```js
map(fn: (r) => ({ r with newColumn: r._value * 2 }))
```

## Examples

###### Square the value of each record
```js
from(bucket:"telegraf/autogen")
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system" and
    r.cpu == "cpu-total"
  )
  |> range(start:-12h)
  |> map(fn: (r) => r._value * r._value)
```

###### Create a new table with new format
```js
from(bucket:"telegraf/autogen")
    |> filter(fn: (r) =>
      r._measurement == "cpu" and
      r._field == "usage_system"
    )
    |> range(start:-12h)
    // create a new table by copying each row into a new format
    |> map(fn: (r) => ({
      time: r._time,
      app_server: r.host
    }))
```

###### Add new columns and preserve existing columns
```js
from(bucket:"example-bucket")
    |> filter(fn: (r) =>
      r._measurement == "cpu" and
      r._field == "usage_system"
    )
    |> range(start:-12h)
    // create a new table by copying each row into a new format
    |> map(fn: (r) => ({
      r with
      app_server: r.host,
      valueInt: int(v: r._value)
    }))
```
