---
title: geo.strictFilter() function
description: >
  The geo.strictFilter() function filters data by latitude and longitude.
menu:
  flux_0_65:
    name: geo.strictFilter
    parent: Geo
weight: 1
---

The `geo.strictFilter()` function filters data by latitude and longitude in a specified region.
This filter is more strict than [`geo.gridFilter()`](/flux/v0.65/stdlib/experimental/geo/gridfilter/),
but for the best performance, use `geo.strictFilter()` **after** `geo.gridFilter()`.

{{% note %}}
`geo.strictFilter()` requires `lat` and `lon` columns in each row.
Use [`geo.toRows()`](/flux/v0.65/stdlib/experimental/geo/gridfilter/)
to pivot `lat` and `lon` fields into each row **before** using `geo.strictFilter()`.
{{% /note %}}

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.strictFilter(
  region: {lat: 40.69335938, lon: -73.30078125, radius: 20.0}
)
```

## Parameters

### region
The region containing the desired data points.
Specify object properties for the shape.
_See [Region definitions](/flux/v0.65/stdlib/experimental/geo/#region-definitions)._

_**Data type:** Object_

## Examples

##### Filter data in a box-shaped region
```js
import "experimental/geo"

from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.toRows()
  |> geo.strictFilter(
    region: {
      minLat: 40.51757813,
      maxLat: 40.86914063,
      minLon: -73.65234375,
      maxLon: -72.94921875
    }
  )
```

##### Filter data in a circular region
```js
import "experimental/geo"

from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.toRows()
  |> geo.strictFilter(
    region: {
      lat: 40.69335938,
      lon: -73.30078125,
      radius: 20.0
    }
  )
```

##### Filter data in a custom polygon region
```js
import "experimental/geo"

from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.toRows()
  |> geo.strictFilter(
    region: {
      points: [
        {lat: 40.671659, lon: -73.936631},
        {lat: 40.706543, lon: -73.749177},
        {lat: 40.791333, lon: -73.880327}
      ]
    }
  )
```
