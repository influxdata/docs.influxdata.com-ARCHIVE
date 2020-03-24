---
title: geo.groupByArea() function
description: >
  The geo.groupByArea() function groups rows by geographic area.
menu:
  flux_0_64:
    name: geo.groupByArea
    parent: Geo
weight: 1
---

The `geo.groupByArea()` function groups rows by geographic area.
Area sizes are determined by the specified [`level`](#level).
Each geographic area is assigned a unique identifier which is stored in the [`newColumn`](#newcolumn).
Results are grouped by `newColumn`.

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.groupByArea(
  newColumn: "geoArea",
  level: 3,
  s2cellIDLevel: -1
)
```

## Parameters

### newColumn
Name of the new column that stores the unique identifier for a geographic area.

_**Data type:** String_

### level
[S2 Cell level](https://s2geometry.io/resources/s2cell_statistics.html) used
to determine the size of each geographic area.

_**Data type:** Integer_

### s2cellIDLevel
[S2 Cell level](https://s2geometry.io/resources/s2cell_statistics.html) used in `s2_cell_id` tag.
Default is `-1`.

_**Data type:** Integer_

{{% note %}}
When set to `-1`, `geo.groupByArea()` attempts to automatically detect the S2 Cell ID level.
{{% /note %}}

## Examples
```js
import "experimental/geo"

region = {
  minLat: 40.51757813,
  maxLat: 40.86914063,
  minLon: -73.65234375,
  maxLon: -72.94921875
}

from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.gridFilter(region: region)
  |> geo.toRows()
  |> geo.groupByArea(newColumn: "geoArea", level: 3)
```
