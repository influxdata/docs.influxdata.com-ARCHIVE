---
title: Filter geo-temporal data by region
description: >
  Use the `geo.filterRows` function to filter geo-temporal data by box-shaped, circular, or polygonal geographic regions.
menu:
  flux_0_65:
    name: Filter by region
    parent: Geo-temporal data
weight: 302
related:
  - /flux/v0.65/stdlib/experimental/geo/
  - /flux/v0.65/stdlib/experimental/geo/filterrows/
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
    |> geo.filterRows(
      region: {lat: 30.04, lon: 31.23, radius: 200.0},
      strict: true
    )
  ```
---

Use the [`geo.filterRows` function](/flux/v0.65/stdlib/experimental/geo/filterrows/)
to filter geo-temporal data by geographic region:

1. [Define a geographic region](#define-a-geographic-region)
2. [Use strict or non-strict filtering](#strict-and-non-strict-filtering)

The following example uses the [sample bird migration data](/flux/v0.65/guides/geo/#sample-data)
and queries data points **within 200km of Cairo, Egypt**:

```js
import "experimental/geo"

sampleGeoData
  |> geo.filterRows(
    region: {lat: 30.04, lon: 31.23, radius: 200.0},
    strict: true
  )
```

## Define a geographic region
Many functions in the Geo package filter data based on geographic region.
Define a geographic region using one of the the following shapes:

- [box](#box)
- [circle](#circle)
- [polygon](#polygon)

### box
Define a box-shaped region by specifying an object containing the following properties:

- **minLat:** minimum latitude in decimal degrees (WGS 84) _(Float)_
- **maxLat:** maximum latitude in decimal degrees (WGS 84) _(Float)_
- **minLon:** minimum longitude in decimal degrees (WGS 84) _(Float)_
- **maxLon:** maximum longitude in decimal degrees (WGS 84) _(Float)_

##### Example box-shaped region
```js
{
  minLat: 40.51757813,
  maxLat: 40.86914063,
  minLon: -73.65234375,
  maxLon: -72.94921875
}
```

### circle
Define a circular region by specifying an object containing the following properties:

- **lat**: latitude of the circle center in decimal degrees (WGS 84) _(Float)_
- **lon**: longitude of the circle center in decimal degrees (WGS 84) _(Float)_
- **radius**:  radius of the circle in kilometers (km) _(Float)_

##### Example circular region
```js
{
  lat: 40.69335938,
  lon: -73.30078125,
  radius: 20.0
}
```

### polygon
Define a polygonal region with an object containing the latitude and longitude for
each point in the polygon:

- **points**: points that define the custom polygon _(Array of objects)_

    Define each point with an object containing the following properties:

      - **lat**: latitude in decimal degrees (WGS 84) _(Float)_
      - **lon**: longitude in decimal degrees (WGS 84) _(Float)_

##### Example polygonal region
```js
{
  points: [
    {lat: 40.671659, lon: -73.936631},
    {lat: 40.706543, lon: -73.749177},
    {lat: 40.791333, lon: -73.880327}
  ]
}
```

## Strict and non-strict filtering
In most cases, the specified geographic region does not perfectly align with S2 grid cells.

- **Non-strict filtering** returns points that may be outside of the specified region but
  inside S2 grid cells partially covered by the region.
- **Strict filtering** returns only points inside the specified region.

_Strict filtering is less performant, but more accurate than non-strict filtering._

<span class="key-geo-cell"></span> S2 grid cell  
<span class="key-geo-region"></span> Filter region  
<span class="key-geo-point"></span> Returned point

{{< flex >}}
{{% flex-content %}}
**Strict filtering**
{{< svg "/static/img/svgs/geo-strict.svg" >}}
{{% /flex-content %}}
{{% flex-content %}}
**Non-strict filtering**
{{< svg "/static/img/svgs/geo-non-strict.svg" >}}
{{% /flex-content %}}
{{< /flex >}}
