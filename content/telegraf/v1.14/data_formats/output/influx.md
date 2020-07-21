---
title: InfluxDB Line Protocol output data format
description: The "influx" data format outputs metrics into the InfluxDB Line Protocol format.
menu:
  telegraf_1_14:
    name: InfluxDB Line Protocol output
    weight: 30
    parent: Output data formats (serializers)
---

The `influx` output data format outputs metrics into [InfluxDB Line Protocol][line protocol]. InfluxData recommends this data format unless another format is required for interoperability.

## Configuration

```toml
[[outputs.file]]
  ## Files to write to, "stdout" is a specially handled file.
  files = ["stdout", "/tmp/metrics.out"]

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "influx"

  ## Maximum line length in bytes.  Useful only for debugging.
  influx_max_line_bytes = 0

  ## When true, fields will be output in ascending lexical order.  Enabling
  ## this option will result in decreased performance and is only recommended
  ## when you need predictable ordering while debugging.
  influx_sort_fields = false

  ## When true, Telegraf will output unsigned integers as unsigned values,
  ## i.e.: `42u`.  You will need a version of InfluxDB supporting unsigned
  ## integer values.  Enabling this option will result in field type errors if
  ## existing data has been written.
  influx_uint_support = false
```

[line protocol]: /influxdb/latest/write_protocols/line_protocol_tutorial/
