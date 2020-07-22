---
title: Telegraf input data formats
description: Telegraf supports parsing input data formats into Telegraf metrics for InfluxDB Line Protocol, CollectD, CSV, Dropwizard, Graphite, Grok, JSON, Logfmt, Nagios, Value, and Wavefront.
menu:
  telegraf_1_15:
    name: Input data formats
    weight: 1
    parent: Data formats
---

Telegraf contains many general purpose plugins that support parsing input data
using a configurable parser into [metrics][].  This allows, for example, the
`kafka_consumer` input plugin to process messages in either InfluxDB Line
Protocol or in JSON format. Telegraf supports the following input data formats:

- [InfluxDB Line Protocol](/telegraf/v1.15/data_formats/input/influx/)
- [collectd](/telegraf/v1.15/data_formats/input/collectd/)
- [CSV](/telegraf/v1.15/data_formats/input/csv/)
- [Dropwizard](/telegraf/v1.15/data_formats/input/dropwizard/)
- [Graphite](/telegraf/v1.15/data_formats/input/graphite/)
- [Grok](/telegraf/v1.15/data_formats/input/grok/)
- [JSON](/telegraf/v1.15/data_formats/input/json/)
- [logfmt](/telegraf/v1.15/data_formats/input/logfmt/)
- [Nagios](/telegraf/v1.15/data_formats/input/nagios/)
- [Value](/telegraf/v1.15/data_formats/input/value/), ie: 45 or "booyah"
- [Wavefront](/telegraf/v1.15/data_formats/input/wavefront/)

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

[metrics]: /telegraf/v1.15/concepts/metrics/
