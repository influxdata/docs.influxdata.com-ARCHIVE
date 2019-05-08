---
title: influxFieldsAsCols() function
description: The influxFieldsAsCols() function is pivots a table and automatically aligns fields within each input table that have the same timestamp.
aliases:
  - /flux/v0.24/functions/inputs/fromrows
  - /flux/v0.24/functions/transformations/influxfieldsascols
menu:
  flux_0_24:
    name: influxFieldsAsCols
    parent: Transformations
    weight: 1
---

The `influxFieldsAsCols()` function is a special application of the `pivot()` function that
automatically aligns fields within each input table that have the same timestamp.

_**Function type:** Transformation_

```js
influxFieldsAsCols()
```

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> influxFieldsAsCols()
  |> keep(columns: ["_time", "cpu", "usage_idle", "usage_user"])
```

## Function definition
```js
influxFieldsAsCols = (tables=<-) =>
  tables
    |> pivot(
      rowKey:["_time"],
      columnKey: ["_field"],
      valueColumn: "_value"
    )
```
