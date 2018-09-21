---
title: Telegraf input data formats
description: Telegraf supports parsing input data formats into metrics for InfluxDB Line Protocol, CollectD, CSV, Dropwizard, Graphite, Grok, JSON, Logfmt, Nagios, Value, and Wavefront.
menu:
  telegraf_1_8:
    name: Input data formats
    weight: 10
    parent: data_formats
---

Telegraf contains many general purpose plugins that support parsing input data
using a configurable parser into [metrics][].  This allows, for example, the
`kafka_consumer` input plugin to process messages in either InfluxDB Line
Protocol or in JSON format.

- [InfluxDB Line Protocol](/telegraf/v1.8/plugins/data_formats/internal/influx)
- [Collectd](/telegraf/v1.8/plugins/data_formats/internal/collectd)
- [CSV](/telegraf/v1.8/plugins/data_formats/internal/csv)
- [Dropwizard](/telegraf/v1.8/plugins/data_formats/internal/dropwizard)
- [Graphite](/telegraf/v1.8/plugins/data_formats/internal/graphite)
- [Grok](/telegraf/v1.8/plugins/data_formats/internal/grok)
- [JSON](//telegraf/v1.8/plugins/data_formats/internal/json)
- [Logfmt](/telegraf/v1.8/plugins/data_formats/internal/logfmt)
- [Nagios](/telegraf/v1.8/plugins/data_formats/internal/nagios)
- [Value](/telegraf/v1.8/plugins/data_formats/internal/value), ie: 45 or "booyah"
- [Wavefront](/telegraf/v1.8/plugins/data_formats/internal/wavefront)

Any input plugin containing the `data_format` option can use it to select the
desired parser:

```toml
[[inputs.exec]]
  ## Commands array
  commands = ["/tmp/test.sh", "/usr/bin/mycollector --foo=bar"]

  ## measurement name suffix (for separating different commands)
  name_suffix = "_mycollector"

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "json"
```

[metrics]: /telegraf/v1.8/concepts/metrics/
