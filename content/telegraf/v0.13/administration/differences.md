---
title: Differences between Telegraf 0.13 and 0.12

menu:
  telegraf_013:
    name: Differences between Telegraf 0.13 and 0.12
    weight: 0
    parent: administration
---

This page aims to ease the transition from Telegraf 0.12 to Telegraf 0.13.
It is not intended to be a comprehensive list of the differences between the
versions.
See
[Telegraf's Changelog](https://github.com/influxdata/telegraf/blob/master/CHANGELOG.md)
for detailed release notes.

### Remove tags from measurements on inputs and outputs with `tagexclude` and `taginclude`

The `tagexclude` and `taginclude` filters can be configured per input or output.

Examples:

Only include the `cpu` tag in the measurements for the cpu plugin:

```
[[inputs.cpu]]
  percpu = true
  totalcpu = true
  taginclude = ["cpu"]
```

Exclude the `fstype` tag from the measurements for the disk plugin:

```
[[inputs.disk]]
  tagexclude = ["fstype"]
```

### New filestat plugin

The new filestat input plugin gathers metrics about file existence, size, and
other stats.
See the filestat [README.md](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/filestat)
for more information.

### Configuration file environment variable

With Telegraf 0.13, you can set the environment variable `TELEGRAF_CONFIG_PATH`
to the path of your configuration file and start the process.

Telegraf first checks for the `-config` command line option and then for the
environment variable.
If you do not supply a configuration file, Telegraf uses the internal default
configuration.

### Breaking changes

Telegraf 0.13 makes breaking changes to the jolokia plugin, docker plugin, and
the win_perf_counters plugin.
Please see [Telegraf's
Changelog](https://github.com/influxdata/telegraf/blob/master/CHANGELOG.md) for
more information .
