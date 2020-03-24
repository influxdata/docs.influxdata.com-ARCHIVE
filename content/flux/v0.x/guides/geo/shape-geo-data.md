---
title: Shape data to work with the Geo package
description: >
  Functions in the Flux Geo package require **lat** and **lon** fields and an **s2_cell_id** tag.
  Rename latitude and longitude fields and generate S2 cell ID tokens.
menu:
  flux_0_x:
    name: Shape geo-temporal data
    parent: Geo-temporal data
weight: 1
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
    |> map(fn: (r) => ({ r with
      _field:
        if r._field == "latitude" then "lat"
        else if r._field == "longitude" then "lon"
        else r._field
      }))
    |> map(fn: (r) => ({ r with
      s2_cell_id: geo.s2CellIDToken(point: {lon: r.lon, lat: r.lat}, level: 10)
    }))  
  ```
---

Functions in the Geo package require the following data schema:

- an **s2_cell_id** tag containing the [S2 Cell ID](https://s2geometry.io/devguide/s2cell_hierarchy.html#s2cellid-numbering)
  **as a token**
- a **`lat` field** field containing the **latitude in decimal degrees** (WGS 84)
- a **`lon` field** field containing the **longitude in decimal degrees** (WGS 84)

<!--  -->
- [Rename latitude and longitude fields](#rename-latitude-and-longitude-fields)
- [Generate S2 cell ID tokens](#generate-s2-cell-id-tokens)  

## Rename latitude and longitude fields
Use [`map()`](/flux/v0.x/stdlib/built-in/transformations/map/) to rename
existing latitude and longitude fields using other names.

```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> map(fn: (r) => ({ r with
    _field:
      if r._field == "existingLatitudeField" then "lat"
      else if r._field == "existingLongitudeField" then "lon"
      else r._field
  }))
```

## Generate S2 cell ID tokens
The Geo package uses the [S2 Geometry Library](https://s2geometry.io/) to represent
geographic coordinates on a three-dimensional sphere.
The sphere is divided into [cells](https://s2geometry.io/devguide/s2cell_hierarchy),
each with a unique 64-bit identifier (S2 cell ID).
Grid and S2 cell ID accuracy are defined by a [level](https://s2geometry.io/resources/s2cell_statistics).

{{% note %}}
To filter more quickly, use higher S2 Cell ID levels,
but know that that higher levels increase [series cardinality](/influxdb/latest/concepts/glossary/#series-cardinality).
{{% /note %}}

The Geo package requires S2 cell IDs as tokens.
To generate add S2 cell IDs tokens to your data, use one of the following options:

- [Generate S2 cell ID tokens with Telegraf](#generate-s2-cell-id-tokens-with-telegraf)
- [Generate S2 cell ID tokens language-specific libraries](#generate-s2-cell-id-tokens-language-specific-libraries)
- [Generate S2 cell ID tokens with Flux](#generate-s2-cell-id-tokens-with-flux)

### Generate S2 cell ID tokens with Telegraf
Enable the [Telegraf S2 Geo (`s2geo`) processor](https://github.com/influxdata/telegraf/tree/master/plugins/processors/s2geo)
to generate S2 cell ID tokens at a specified `cell_level` using `lat` and `lon` field values.

Add the `processors.s2geo` configuration to your Telegraf configuration file (`telegraf.conf`):

```toml
[[processors.s2geo]]
  ## The name of the lat and lon fields containing WGS-84 latitude and
  ## longitude in decimal degrees.
  lat_field = "lat"
  lon_field = "lon"

  ## New tag to create
  tag_key = "s2_cell_id"

  ## Cell level (see https://s2geometry.io/resources/s2cell_statistics.html)
  cell_level = 9
```

Telegraf stores the S2 cell ID token in the `s2_cell_id` tag.

### Generate S2 cell ID tokens language-specific libraries
Many programming languages offer S2 Libraries with methods for generating S2 cell ID tokens.
Use latitude and longitude with the `s2.CellID.ToToken` endpoint of the S2 Geometry
Library to generate `s2_cell_id` tags. For example:

- **Go:** [s2.CellID.ToToken()](https://godoc.org/github.com/golang/geo/s2#CellID.ToToken)
- **Python:** [s2sphere.CellId.to_token()](https://s2sphere.readthedocs.io/en/latest/api.html#s2sphere.CellId)
- **JavaScript:** [s2.cellid.toToken()](https://github.com/mapbox/node-s2/blob/master/API.md#cellidtotoken---string)

### Generate S2 cell ID tokens with Flux
Use the [`geo.s2CellIDToken()` function](/flux/v0.x/stdlib/experimental/geo/s2cellidtoken/)
with existing longitude (`lon`) and latitude (`lat`) field values to generate and add the S2 cell ID token.
First, use the [`geo.toRows()` function](/flux/v0.x/stdlib/experimental/geo/torows/)
to pivot **lat** and **lon** fields into row-wise sets:

```js
import "experimental/geo"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "example-measurement")
  |> geo.toRows()
  |> map(fn: (r) => ({ r with
    s2_cell_id: geo.s2CellIDToken(point: {lon: r.lon, lat: r.lat}, level: 10)
  }))
```
