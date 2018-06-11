---
title: Telegraf processor plugins
description: Telegraf processor plugins work with InfluxData time series platform to process metrics and emit results based on the values processed.
menu:
  telegraf_1_7:
    name: Processor
    identifier: processors
    weight: 40
    parent: Plugins
---

Processor plugins process metrics as they pass through and immediately emit results based on the values they process.

> ***Note:*** Telegraf plugins added in the current release are noted with ` -- NEW in v1.6`.
>The [Release Notes/Changelog](/telegraf/v1.7/about_the_project/release-notes-changelog) has a list of new plugins and updates for other plugins. See the plugin README files for more details.


## Supported Telegraf processor plugins


### [Converter (`converter`)](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/processors/converter) -- NEW in v.1.7

The [Converter (`converter`) processor plugin](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/processors/converter) is used to change the type of tag or field values. In addition to changing field types, it can convert between fields and tags. Values that cannot be converted are dropped.

### [Override (`override`)](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/processors/override)

The [Override (`override`) processor plugin](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/processors/override) allows overriding all modifications that are supported by input plugins and aggregator plugins:

* `name_override`
* `name_prefix`
* `name_suffix`
* tags

All metrics passing through this processor will be modified accordingly. Select the metrics to modify using the standard measurement filtering options.

Values of `name_override`, `name_prefix`, `name_suffix`, and already present tags with conflicting keys will be overwritten. Absent tags will be created.

Use case of this plugin encompass ensuring certain tags or naming conventions are adhered to irrespective of input plugin configurations, e.g., by `taginclude`.

### [Printer (`printer`)](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/processors/printer)

The [Printer (`printer`) processor plugin](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/processors/printer) simply prints every metric passing through it.

### [Regex (`regex`)](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/processors/regex) -- NEW in v.1.7

The [Regex (`regex`)](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/processors/regex) transforms tag and field values using a regular expression (regex) pattern. If `result_key `parameter is present, it can produce new tags and fields from existing ones.

### [TopK (`topk`)](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/processors/topk) -- NEW in v.1.7

The [TopK (`topk`) processor plugin](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/processors/topk) is a filter designed to get the top series over a period of time. It can be tweaked to do its top `K` computation over a period of time, so spikes can be smoothed out.

This processor goes through the following steps when processing a batch of metrics:

1. Groups metrics in buckets using their tags and name as key.
2. Aggregates each of the selected fields for each bucket by the selected aggregation function (sum, mean, etc.).
3. Orders the buckets by one of the generated aggregations, returns all metrics in the top `K` buckets, then reorders the buckets by the next of the generated aggregations, returns all metrics in the top `K` buckets, etc, etc, etc, until it runs out of fields.

The plugin makes sure not to duplicate metrics.

Note that depending on the amount of metrics on each computed bucket, more than `K` metrics may be returned.
