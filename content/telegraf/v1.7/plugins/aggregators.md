---
title: Telegraf aggregator plugins
description: Telegraf aggregator plugins work with the InfluxData time series platfrom to create aggregate metrics (for example, mean, min, max, quantiles, etc.) collected by the input plugins. Aggregator plugins include support for basic statistics, histograms, and min/max values.
menu:
  telegraf_1_7:
    name: Aggregator
    weight: 30
    parent: Plugins
---

Aggregators emit new aggregate metrics based on the metrics collected by the input plugins.

> ***Note:*** Telegraf plugins added in the current release are noted with ` -- NEW in v1.7`.
>The [Release notes and changelog](/telegraf/v1.7/about_the_project/release-notes-changelog) has a list of new plugins and updates for other plugins. See the plugin README files for more details.

## Supported Telegraf aggregator plugins


### [BasicStats (`basicstats`)](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/aggregators/basicstats)

The [BasicStats (`basicstats`) aggregator plugin](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/aggregators/basicstats) gives count, max, min, mean, s2(variance), and stdev for a set of values, emitting the aggregate every period seconds.

### [Histogram (`histogram`)](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/aggregators/histogram)

The [Histogram (`histogram`) aggregator plugin](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/aggregators/histogram) creates histograms containing the counts of field values within a range.

Values added to a bucket are also added to the larger buckets in the distribution. This creates a [cumulative histogram](https://en.wikipedia.org/wiki/Histogram#/media/File:Cumulative_vs_normal_histogram.svg).

Like other Telegraf aggregators, the metric is emitted every period seconds. Bucket counts however are not reset between periods and will be non-strictly increasing while Telegraf is running.

### [MinMax (`minmax`)](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/aggregators/minmax)

The [MinMax (`minmax`) aggregator plugin](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/aggregators/minmax) aggregates min and max values of each field it sees, emitting the aggegrate every period seconds.
