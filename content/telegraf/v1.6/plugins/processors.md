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

### [Override (`override`)](https://github.com/influxdata/telegraf/tree/release-1.6/plugins/processors/override) -- NEW in v1.6

The [Override (`override`) processor plugin](https://github.com/influxdata/telegraf/tree/release-1.6/plugins/processors/override) allows overriding all modifications that are supported by input plugins and aggregator plugins:

* name_override
* name_prefix
* name_suffix
* tags

All metrics passing through this processor will be modified accordingly. Select the metrics to modify using the standard measurement filtering options.

Values of `name_override`, `name_prefix`, `name_suffix`, and already present tags with conflicting keys will be overwritten. Absent tags will be created.

Use case of this plugin encompass ensuring certain tags or naming conventions are adhered to irrespective of input plugin configurations, e.g., by `taginclude`.

### [Printer (printer)](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/processors/printer)

The [Printer (printer) processor plugin](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/processors/printer) simply prints every metric passing through it.
