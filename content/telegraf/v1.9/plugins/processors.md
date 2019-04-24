---
title: Telegraf processor plugins
description: Use Telegraf processor plugins in the InfluxData time series platform to process metrics and emit results based on the values processed.
menu:
  telegraf_1_9:
    name: Processor
    identifier: processors
    weight: 40
    parent: Plugins
---

Processor plugins process metrics as they pass through and immediately emit results based on the values they process.


## Supported Telegraf processor plugins


### Converter

Plugin ID: `converter`

The [Converter processor plugin](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/processors/converter/README.md) is used to change the type of tag or field values. In addition to changing field types, it can convert between fields and tags. Values that cannot be converted are dropped.

### Enum

Plugin ID: `enum`

The [Enum processor plugin](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/processors/enum/README.md) allows the configuration of value mappings for metric fields. The main use case for this is to rewrite status codes such as `red`, `amber`, and `green` by numeric values such as `0`, `1`, `2`. The plugin supports string and bool types for the field values. Multiple Fields can be configured with separate value mappings for each field. Default mapping values can be configured to be used for all values, which are not contained in the value_mappings. The processor supports explicit configuration of a destination field. By default the source field is overwritten.

### Override

Plugin ID: `override`

The [Override processor plugin](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/processors/override/README.md) allows overriding all modifications that are supported by input plugins and aggregator plugins:

* `name_override`
* `name_prefix`
* `name_suffix`
* tags

All metrics passing through this processor will be modified accordingly. Select the metrics to modify using the standard measurement filtering options.

Values of `name_override`, `name_prefix`, `name_suffix`, and already present tags with conflicting keys will be overwritten. Absent tags will be created.

Use case of this plugin encompass ensuring certain tags or naming conventions are adhered to irrespective of input plugin configurations, e.g., by `taginclude`.

### Parser

Plugin ID: `parser`

The [Parser processor plugin](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/processors/parser/README.md) parses defined fields containing the specified data format and creates new metrics based on the contents of the field.

### Printer

Plugin ID: `printer`

The [Printer processor plugin](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/processors/printer/README.md) simply prints every metric passing through it.

### Regex

Plugin ID: `regex`

The [Regex processor plugin](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/processors/regex/README.md) transforms  tag and field values using a regular expression (regex) pattern. If `result_key `parameter is present, it can produce new tags and fields from existing ones.

### Rename

Plugin ID: `rename`

The [Rename processor plugin](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/processors/rename/README.md) renames InfluxDB measurements, fields, and tags.

### Strings

Plugin ID: `strings`

The [Strings processor plugin](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/processors/strings/README.md) maps certain Go string functions onto InfluxDB measurement, tag, and field values. Values can be modified in place or stored in another key.

Implemented functions are:

* `lowercase`
* `uppercase`
* `trim`
* `trim_left`
* `trim_right`
* `trim_prefix`
* `trim_suffix`

Note that in this implementation these are processed in the order that they appear above. You can specify the `measurement`, `tag` or `field` that you want processed in each section and optionally a `dest` if you want the result stored in a new tag or field. You can specify lots of transformations on data with a single strings processor.

### TopK

Plugin ID: `topk`

The [TopK processor plugin](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/processors/topk/README.md) is a filter designed to get the top series over a period of time. It can be tweaked to do its top `K` computation over a period of time, so spikes can be smoothed out.

This processor goes through the following steps when processing a batch of metrics:

1. Groups metrics in buckets using their tags and name as key.
2. Aggregates each of the selected fields for each bucket by the selected aggregation function (sum, mean, etc.).
3. Orders the buckets by one of the generated aggregations, returns all metrics in the top `K` buckets, then reorders the buckets by the next of the generated aggregations, returns all metrics in the top `K` buckets, etc, etc, etc, until it runs out of fields.

The plugin makes sure not to duplicate metrics.

Note that depending on the amount of metrics on each computed bucket, more than `K` metrics may be returned.
