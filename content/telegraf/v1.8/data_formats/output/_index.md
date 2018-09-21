---
title: Telegraf output data formats
description: Telegraf, the plugin-driven server agent component of the InfluxData time series platform, can serialize metrics into output data formats for InfluxDB Line Protocol, JSON, Graphite, and SplunkMetric.
menu:
  telegraf_1_8:
    name: Output data formats
    weight: 20
    parent: data_formats
---

In addition to output-specific data formats, Telegraf supports a set of
standard data formats that may be selected from when configuring many output
plugins.

* [InfluxDB Line Protocol](/plugins/serializers/influx)
* [JSON](/plugins/serializers/json)
* [Graphite](/plugins/serializers/graphite)
* [SplunkMetric](/plugins/serializers/splunkmetric)

You will be able to identify the plugins with support by the presence of a
`data_format` configuration option, for example, in the File (`file`) output plugin:

```toml
[[outputs.file]]
  ## Files to write to, "stdout" is a specially handled file.
  files = ["stdout"]

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "influx"
```
