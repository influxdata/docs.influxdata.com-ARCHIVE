---
title: Telegraf processor plugins

menu:
  telegraf_1_5:
    name: Processor
    identifier: processors
    weight: 40
    parent: plugins
---

Processor plugins process metrics as they pass through and immediately emit results based on the values they process.

## Supported processor plugins

### [Printer (printer)](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/processors/printer)

The printer processor plugin simple prints every metric passing through it.
