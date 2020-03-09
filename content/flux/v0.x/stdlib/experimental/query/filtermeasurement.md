---
title: query.filterMeasurement() function
description: >
  The `query.filterMeasurement()` function filters input data by measurement.
menu:
  flux_0_x:
    name: query.filterMeasurement
    parent: Query
weight: 1
---

The `query.filterMeasurement()` function filters input data by measurement.

_**Function type:** Transformation_

```js
import "experimental/query"

query.filterMeasurement(
  measurement: "example-measurement"
)
```

## Parameters

### measurement
The name of the measurement to filter by.
Must be an exact string match.

_**Data type:** String_

## Examples

```js
import "experimental/query"

query.fromRange(bucket: "telegraf/autogen", start: -1h)
  |> query.filterMeasurement(
    measurement: "mem"
  )
```

## Function definition
```js
package query

filterMeasurement = (tables=<-, measurement) =>
  tables
    |> filter(fn: (r) => r._measurement == measurement)
```

_**Used functions:**_  
[filter()](/flux/v0.x/stdlib/built-in/transformations/filter/)
