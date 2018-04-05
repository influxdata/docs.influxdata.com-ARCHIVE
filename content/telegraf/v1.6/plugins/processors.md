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

> ***Note:*** Telegraf plugins added in the current release are noted with ` -- NEW in v1.5`.
>The [Release Notes/Changelog](/telegraf/v1.5/about_the_project/release-notes-changelog) has a list of new plugins and updates for other plugins. See the plugin README files for more details.


## Supported processor plugins

### [Printer (printer)](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/processors/printer)

The [Printer (printer) processor plugin](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/processors/printer) simply prints every metric passing through it.
