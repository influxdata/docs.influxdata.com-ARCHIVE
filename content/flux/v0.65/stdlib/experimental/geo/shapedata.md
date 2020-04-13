---
title: geo.shapeData() function
description: >
    The `geo.shapeData()` function renames existing latitude and longitude fields to
    **lat** and **lon** and adds an **s2_cell_id** tag.
    Use `geo.shapeData()` to ensure geo-temporal data meets the requirements of the Geo package.
menu:
  flux_0_65:
    name: geo.shapeData
    parent: Geo
weight: 1
---

The `geo.shapeData()` function renames existing latitude and longitude fields to
**lat** and **lon** and adds an **s2_cell_id** tag.
Use `geo.shapeData()` to ensure geo-temporal data meets the
[requirements of the Geo package](/flux/v0.65/stdlib/experimental/geo/#geo-schema-requirements):

1. Rename existing latitude and longitude fields to `lat` and `lon`.
2. Pivot data into row-wise sets based on the [`correlationKey`](#correlationkey).
3. Generate `s2_cell_id` tags using `lat` and `lon` values and a specified
   [S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html).

_**Function type:** Transformation_

```js
import "experimental/geo"

geo.shapeData(
  latField: "latitude",
  lonField: "longitude",
  level: 10,
  correlationKey: ["_time"]
)
```

## Parameters

### latField
Name of the existing field that contains the latitude value in **decimal degrees** (WGS 84).
Field is renamed to `lat`.

_**Data type:** String_

### lonField
Name of the existing field that contains the longitude value in **decimal degrees** (WGS 84).
Field is renamed to `lon`.

_**Data type:** String_

### level
[S2 cell level](https://s2geometry.io/resources/s2cell_statistics.html) to use
when generating the S2 cell ID token.

_**Data type:** Integer_

### correlationKey
List of columns used to uniquely identify a row for output.
Default is `["_time"]`.

_**Data type:** Array of strings_

## Examples

##### Shape data to meet the requirements of the Geo package
```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.shapeData(
    latField: "latitude",
    lonField: "longitude",
    level: 10
  )
```

### geo.shapeData input and output

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time | _field    | _value |
|:----- |:------:   | ------:|
| 0001  | latitude  | 30.0   |
| 0002  | latitude  | 30.5   |
| 0003  | latitude  | 30.7   |
| 0004  | latitude  | 31.1   |
| • • • |   • • •   | • • •  |
| 0001  | longitude | 20.0   |
| 0002  | longitude | 19.8   |
| 0003  | longitude | 19.2   |
| 0004  | longitude | 19.5   |
{{% /flex-content %}}
{{% flex-content %}}

**The following function would output:**

```js
|> geo.shapeData(
  latField: "latitude",
  lonField: "longitude",
  level: 5
)
```

| _time | lat      | lon       | s2_cell_id |
|:----- |:--------:|:---------:| ----------:|
| 0001  | 30.0     | 20.0      | 138c       |
| 0002  | 30.5     | 19.8      | 1384       |
| 0003  | 30.7     | 19.2      | 139c       |
| 0004  | 31.1     | 19.5      | 139c       |
{{% /flex-content %}}
{{< /flex >}}
