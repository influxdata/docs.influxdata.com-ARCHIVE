---
title: Telegraf data serializer
description: About the Telegraf data serializer, configuration, and a sample configuration.
menu:
  telegraf_1_8:
    name: Serializer
    weight: 20
    parent: data_formats
---

This description explains at a high level what the serializer does and
provides links to where additional information about the format can be found.

## Configuration

This section contains the sample configuration for the serializer.  Since the
configuration for a serializer is not have a standalone plugin, use the `file`
or `http` outputs as the base configuration.

```toml
[[inputs.file]]
  files = ["stdout"]

  ## Describe variables using the standard SampleConfig style.
  ##   https://github.com/influxdata/telegraf/wiki/SampleConfig
  example_option = "example_value"

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ##   https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "example"
```

### example_option

If an option requires a more expansive explanation than can be included inline
in the sample configuration, it may be described here.

## Metrics section

The optional Metrics section contains details about how the serializer converts
Telegraf metrics into output.

## Example section

The optional Example section can show an example conversion to the output
format using InfluxDB Line Protocol as the reference format.

For line delimited text formats a diff may be appropriate:
```diff
- cpu,host=localhost,source=example.org value=42
+ cpu|host=localhost|source=example.org|value=42
```
