---
title: geo.gridFilter() function
description: >
  The geo.gridFilter() function filters data by a specified geographic region.
menu:
  flux_0_x:
    name: geo.gridFilter
    parent: Geo
weight: 1
---

The `geo.gridFilter()` function filters data by a specified geographic region.
It compares input data to a set of S2 Cell ID tokens located in the specified [region](#region).

{{% note %}}
S2 Grid cells may not perfectly align with the defined region, so results may include
data with coordinates outside the region, but inside S2 grid cells partially covered by the region.
Use [`toRows()`](/flux/v0.x/stdlib/experimental/geo/toRows/) and
[`geo.strictFilter()`](/flux/v0.x/stdlib/experimental/geo/strictfilter/)
after `geo.gridFilter()` to precisely filter points.
{{% /note %}}

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.gridFilter(
  region: {lat: 40.69335938, lon: -73.30078125, radius: 20.0}
  minSize: 24,
  maxSize: -1,
  level: -1,
  s2cellIDLevel: -1
)
```

## Parameters

### region
The region containing the desired data points.
Specify object properties for the shape.
_See [Region definitions](/flux/v0.x/stdlib/experimental/geo/#region-definitions)._

_**Data type:** Object_

### minSize
Minimum number of cells that cover the specified region.
Default is `24`.

_**Data type:** Integer_

### maxSize
Maximum number of cells that cover the specified region.
Default is `-1`.

_**Data type:** Integer_

### level
[S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html) of grid cells.
Default is `-1`.

_**Data type:** Integer_

{{% warn %}}
`level` is mutually exclusive with `minSize` and `maxSize` and must be less than
or equal to `s2cellIDLevel`.
{{% /warn %}}

### s2cellIDLevel
[S2 Cell level](https://s2geometry.io/resources/s2cell_statistics.html) used in `s2_cell_id` tag.
Default is `-1`.

_**Data type:** Integer_

{{% note %}}
When set to `-1`, `gridFilter()` attempts to automatically detect the S2 Cell ID level.
{{% /note %}}

## Examples

##### Filter data in a box-shaped region
```js
import "experimental/geo"

from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.gridFilter(
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
  |> geo.gridFilter(
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
  |> geo.gridFilter(
    region: {
      points: [
        {lat: 40.671659, lon: -73.936631},
        {lat: 40.706543, lon: -73.749177},
        {lat: 40.791333, lon: -73.880327}
      ]
    }
  )
```
