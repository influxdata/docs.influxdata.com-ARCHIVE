---
title: Telegraf aggregator plugins
description: Use the Telegraf aggregator plugins with the InfluxData time series platfrom to create aggregate metrics (for example, mean, min, max, quantiles, etc.) collected by the input plugins. Aggregator plugins support basic statistics, histograms, and min/max values.
menu:
  telegraf_1_10:
    name: Aggregator
    weight: 30
    parent: Plugins
---

Aggregators emit new aggregate metrics based on the metrics collected by the input plugins.


## Supported Telegraf aggregator plugins


### BasicStats

Plugin ID: `basicstats`

The [BasicStats aggregator plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/aggregators/basicstats/README.md) gives `count`, `max`, `min`, `mean`, `s2`(variance), and `stdev` for a set of values, emitting the aggregate every period seconds.

### Histogram

Plugin ID: `histogram`

The [Histogram aggregator plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/aggregators/histogram/README.md) creates histograms containing the counts of field values within a range.

Values added to a bucket are also added to the larger buckets in the distribution. This creates a [cumulative histogram](https://upload.wikimedia.org/wikipedia/commons/5/53/Cumulative_vs_normal_histogram.svg).

Like other Telegraf aggregator plugins, the metric is emitted every period seconds. Bucket counts, however, are not reset between periods and will be non-strictly increasing while Telegraf is running.

### MinMax

Plugin ID: `minmax`

The [MinMax aggregator plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/aggregators/minmax/README.md) aggregates `min` and `max` values of each field it sees, emitting the aggregrate every period seconds.

### ValueCounter

Plugin ID: `valuecounter`

The [ValueCounter aggregator plugin](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/aggregators/valuecounter/README.md) counts the occurrence of values in fields and emits the counter once every 'period' seconds.

A use case for the ValueCounter aggregator plugin is when you are processing an HTTP access log with the [Logparser input plugin](/telegraf/v1.8/plugins/inputs/#logparser) and want to count the HTTP status codes.

The fields which will be counted must be configured with the fields configuration directive. When no fields are provided, the plugin will not count any fields.
The results are emitted in fields, formatted as `originalfieldname_fieldvalue = count`.

ValueCounter only works on fields of the type `int`, `bool`, or `string`. Float fields are being dropped to prevent the creating of too many fields.
