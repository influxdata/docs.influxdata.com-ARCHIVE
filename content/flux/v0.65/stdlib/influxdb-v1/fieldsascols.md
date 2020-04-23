---
title: v1.fieldsAsCols() function
description: The v1.fieldsAsCols() function is pivots a table and automatically aligns
  fields within each input table that have the same timestamp.
aliases:
  - /flux/v0.65/functions/inputs/fromrows
  - /flux/v0.65/functions/transformations/influxfieldsascols
  - /flux/v0.65/functions/influxdb-v1/fieldsascols/
menu:
  flux_0_65:
    name: v1.fieldsAsCols
    parent: InfluxDB v1
weight: 1
---

The `v1.fieldsAsCols()` function is a special application of the `pivot()` function that
automatically aligns fields within each input table that have the same timestamp.

_**Function type:** Transformation_

```js
import "influxdata/influxdb/v1"

v1.fieldsAsCols()
```

## Examples
```js
import "influxdata/influxdb/v1"

from(bucket:"telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> v1.fieldsAsCols()
  |> keep(columns: ["_time", "cpu", "usage_idle", "usage_user"])
```

## Function definition
```js
fieldsAsCols = (tables=<-) =>
  tables
    |> pivot(
      rowKey:["_time"],
      columnKey: ["_field"],
      valueColumn: "_value"
    )
```

_**Used functions:**
[pivot()](/flux/v0.65/stdlib/built-in/transformations/pivot)_
