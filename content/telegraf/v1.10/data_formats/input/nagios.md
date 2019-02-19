---
title: Nagios input data format
description: Use the Nagios input data format to parse the output of Nagios plugins into Telegraf metrics.
menu:
  telegraf_1_10:
    name: Nagios
    weight: 90
    parent: Input data formats
---

# Nagios

The Nagios input data format parses the output of
[Nagios plugins](https://www.nagios.org/downloads/nagios-plugins/) into
Telegraf metrics.

## Configuration

```toml
[[inputs.exec]]
  ## Commands array
  commands = ["/usr/lib/nagios/plugins/check_load -w 5,6,7 -c 7,8,9"]

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ##   https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "nagios"
```
