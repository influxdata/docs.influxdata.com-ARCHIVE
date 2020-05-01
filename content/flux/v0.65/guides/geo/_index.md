---
title: Work with geo-temporal data
list_title: Geo-temporal data
description: >
  Use the Flux Geo package to filter geo-temporal data and group by geographic location or track.
menu:
  flux_0_65:
    name: Geo-temporal data
    parent: Query with Flux
weight: 20
list_code_example: |
  ```js
  import "experimental/geo"

  sampleGeoData
    |> geo.filterRows(region: {lat: 30.04, lon: 31.23, radius: 200.0})
    |> geo.groupByArea(newColumn: "geoArea", level: 5)
  ```
---

Use the [Flux Geo package](/flux/v0.65/stdlib/experimental/geo) to
filter geo-temporal data and group by geographic location or track.

{{% warn %}}
The Geo package is experimental and subject to change at any time.
By using it, you agree to the [risks of experimental functions](/flux/v0.65/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

**To work with geo-temporal data:**

1. Import the `experimental/geo` package.

    ```js
    import "experimental/geo"
    ```

2. Load geo-temporal data. _See below for [sample geo-temporal data](#sample-data)._
3. Do one or more of the following:

    - [Shape data to work with the Geo package](#shape-data-to-work-with-the-geo-package)
    - [Filter data by region](#filter-geo-temporal-data-by-region) (using strict or non-strict filters)
    - [Group data by area or by track](#group-geo-temporal-data)

{{< children >}}

---

## Sample data
Many of the examples in this section use a `sampleGeoData` variable that represents
a sample set of geo-temporal data.
The [Bird Migration Sample Data](https://github.com/influxdata/influxdb2-sample-data/tree/master/bird-migration-data)
available on GitHub provides sample geo-temporal data that meets the
[requirements of the Flux Geo package](/flux/v0.65/stdlib/experimental/geo/#geo-schema-requirements).

### Load annotated CSV sample data
Use the [experimental `csv.from()` function](/flux/v0.65/stdlib/experimental/csv/from/)
to load the sample bird migration annotated CSV data from GitHub:

```js
import `experimental/csv`

sampleGeoData = csv.from(
  url: "https://github.com/influxdata/influxdb2-sample-data/blob/master/bird-migration-data/bird-migration.csv"
)
```

{{% note %}}
`csv.from(url: ...)` downloads sample data each time you execute the query **(~1.3 MB)**.
If bandwidth is a concern, use the [`to()` function](/flux/v0.65/stdlib/built-in/outputs/to/)
to write the data to a bucket, and then query the bucket with [`from()`](/flux/v0.65/stdlib/built-in/inputs/from/).
{{% /note %}}

### Write sample data to InfluxDB with line protocol
Use `curl` and the `influx write` command to write bird migration line protocol to InfluxDB.
Replace `db/rp` with your destination bucket:

```sh
curl https://raw.githubusercontent.com/influxdata/influxdb2-sample-data/master/bird-migration-data/bird-migration.line --output ./tmp-data
influx write -b db/rp @./tmp-data
rm -f ./tmp-data
```

Use Flux to query the bird migration data and assign it to the `sampleGeoData` variable:

```js
sampleGeoData = from(bucket: "db/rp")
  |> range(start: 2019-01-01T00:00:00Z, stop: 2019-12-31T23:59:59Z)
  |> filter(fn: (r) => r._measurement == "migration")
```
