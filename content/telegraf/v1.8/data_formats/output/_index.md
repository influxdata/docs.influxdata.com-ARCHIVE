---
title: Telegraf output data formats
description: Telegraf, the plugin-driven server agent component of the InfluxData time series platform, can serialize metrics into output data formats for InfluxDB Line Protocol, JSON, Graphite, and SplunkMetric.
menu:
  telegraf_1_8:
    name: Output data formats
    weight: 30
    parent: data_formats
---

In addition to output-specific data formats, Telegraf supports the following standard data formats that can be selected when configuring many of the Telegraf output plugins.

* [InfluxDB Line Protocol](/telegraf/v1.8/data_formats/influx-data-format)
* [JSON](/telegraf/v1.8/data_formats/json-data-format)
* [Graphite](/telegraf/v1.8/data_formats/graphite-data-format)
* [SplunkMetric](/telegraf/v1.8/data_formats/splunkmetric-data-format)

To identify the output data formats supported by a specific Telegraf output plugin, see the `data_format` configuration setting options.
For example, in the File (`file`) output plugin, the configuration option specifies that the output data format is the InfluxDB Line Protocol format (`influx`).

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
