---
title: Wavefront output data format
description: The Wavefront serializer formats and outputs data to the Wavefront Data Format.
menu:
  telegraf_1_14:
    name: Wavefront serializer
    weight: 60
    parent: Output data formats (serializers)
---

The Wavefront serializer formats and outputs data to the [Wavefront Data Format](https://docs.wavefront.com/wavefront_data_format.html).

### Configuration

```toml
[[outputs.file]]
  files = ["stdout"]

  ## Use Strict rules to sanitize metric and tag names from invalid characters
  ## When enabled forward slash (/) and comma (,) will be accpeted
  # wavefront_use_strict = false

  ## point tags to use as the source name for Wavefront (if none found, host will be used)
  # wavefront_source_override = ["hostname", "address", "agent_host", "node_host"]

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "wavefront"
```

### Metrics

A Wavefront metric is equivalent to a single field value in a Telegraf measurement. The Wavefront metric name is: `<measurement_name>.<field_name>`. If a prefix is specified, it's honored. Only boolean and numeric metrics are serialized, other metric types generate an error.

### Example

The following Telegraf metric:

```sh
cpu,cpu=cpu0,host=testHost user=12,idle=88,system=0 1234567890
```

Serializes into the following Wavefront metrics:

```sh
"cpu.user" 12.000000 1234567890 source="testHost" "cpu"="cpu0"
"cpu.idle" 88.000000 1234567890 source="testHost" "cpu"="cpu0"
"cpu.system" 0.000000 1234567890 source="testHost" "cpu"="cpu0"
```