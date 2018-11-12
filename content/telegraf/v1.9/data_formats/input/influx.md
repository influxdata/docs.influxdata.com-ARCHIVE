---
title: InfluxDB Line Protocol input data format
description: Use the InfluxDB Line Protocol input data format to parse InfluxDB metrics directly into Telegraf metrics.
menu:
  telegraf_1_9:
    name: InfluxDB Line Protocol input
    weight: 60
    parent: Input data formats
---

There are no additional configuration options for InfluxDB [line protocol][]. The
InfluxDB metrics are parsed directly into Telegraf metrics.

[line protocol]: /influxdb/latest/write_protocols/line/

### Configuration

```toml
[[inputs.file]]
  files = ["example"]

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ##   https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "influx"
```
