---
title: Differences between Telegraf 1.2 and 1.1

menu:
  telegraf_1_3:
    name: Differences between Telegraf 1.2 and 1.1
    weight: 0
    parent: administration
---

This page aims to ease the transition from Telegraf 1.1 to Telegraf 1.2.
It is not intended to be a comprehensive list of the differences between the
versions.
See
[Telegraf's Changelog](https://github.com/influxdata/telegraf/blob/master/CHANGELOG.md)
for detailed release notes.

### Release Notes

The
[StatsD plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/statsd)
now sets all `delete_` configuration options to `true` by default.
This changes the default behavior for users who are not specifying those
parameters in their [configuration file](/telegraf/v1.3/administration/configuration/).

The StatsD plugin also no longer save its state on a service reload.
Essentially we have reverted PR [#887](https://github.com/influxdata/telegraf/pull/887).
The reason for this is that saving the state in a global variable is not
thread-safe (see [#1975](https://github.com/influxdata/telegraf/issues/1975) & [#2102](https://github.com/influxdata/telegraf/issues/2102)),
and this creates issues if users want to define multiple instances
of the StatsD plugin.
Saving state on reload may be considered in the future,
but this would need to be implemented at a higher level and applied to all
plugins, not just StatsD.

### New Plugins

* [Internal Input Plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/internal)
* [Discard Output Plugin](https://github.com/influxdata/telegraf/tree/release-1.2/plugins/outputs/discard)
