---
title: Wavefront input data format
description: Use the Wavefront input data format to parse Wavefront data into Telegraf metrics.
menu:
  telegraf_1_11:
    name: Wavefront
    weight: 110
    parent: Input data formats
---

The Wavefront input data format parse Wavefront data into Telegraf metrics.
For more information on the Wavefront native data format, see
[Wavefront Data Format](https://docs.wavefront.com/wavefront_data_format.html) in the Wavefront documentation.

## Configuration

There are no additional configuration options for Wavefront Data Format line-protocol.

```toml
[[inputs.file]]
  files = ["example"]

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ##   https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "wavefront"
```
