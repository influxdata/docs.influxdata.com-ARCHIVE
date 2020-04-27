---
title: geo.toRows() function
description: >
  The geo.toRows() function ...
menu:
  flux_0_65:
    name: geo.toRows
    parent: Geo
weight: 1
---

The `geo.toRows()` function pivots data into row-wise sets base on time or other correlation columns.
For geo-temporal datasets, output rows include `lat` and `lon` columns required by
many Geo package functions.

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.toRows(
  correlationKey: ["_time"]
)
```

## Parameters

### correlationKey
List of columns used to uniquely identify a row for output.
Default is `["_time"]`.

_**Data type:** Array of strings_

## Examples
```js
import "experimental/geo"

from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.toRows()
```

## Function definition
```js
toRows = (tables=<-, correlationKey=["_time"]) =>
  tables
    |> pivot(
      rowKey: correlationKey,
      columnKey: ["_field"],
      valueColumn: "_value"
    )
```
