---
title: Nagios input data format
description: ???
menu:
  telegraf_1_8:
    name: Nagios
    weight: 40
    parent: input
---

# Nagios

The `nagios` data format parses the output of nagios plugins.

### Configuration

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
