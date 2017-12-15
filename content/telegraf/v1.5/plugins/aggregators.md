---
title: Telegraf aggregator plugins

menu:
  telegraf_1_5:
    name: Aggregator
    identifier: aggregators
    weight: 30
    parent: plugins
---

Aggregators emit new aggregate metrics based on the metrics collected by the input plugins.

> ***Note:*** Telegraf plugins added in the current release are noted with ` -- NEW in v1.5`.
>The [Release Notes/Changelog](/telegraf/v1.5/about_the_project/release-notes-changelog) has a list of new plugins and updates for other plugins. See the plugin README files for more details.

## Supported aggregator plugins


### [BasicStats (basicstats)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/aggregators/basicstats) -- NEW in v1.5

The BasicStats aggregator plugin gives count, max, min, mean, s2(variance), and stdev for a set of values, emitting the aggregate every period seconds.

### [Histogram (histogram)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/aggregators/histogram)

The Histogram aggregator plugin creates histograms containing the counts of field values within a range.

Values added to a bucket are also added to the larger buckets in the distribution. This creates a [cumulative histogram](https://en.wikipedia.org/wiki/Histogram#/media/File:Cumulative_vs_normal_histogram.svg).

Like other Telegraf aggregators, the metric is emitted every period seconds. Bucket counts however are not reset between periods and will be non-strictly increasing while Telegraf is running.

### [MinMax (minmax)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/aggregators/minmax)

The MinMax aggregator plugin aggregates min and max values of each field it sees, emitting the aggegrate every period seconds.
