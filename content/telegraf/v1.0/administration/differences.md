---
title: Differences between Telegraf 1.0 and 0.13

menu:
  telegraf_1:
    name: Differences between Telegraf 1.0 and 0.13
    weight: 0
    parent: administration
---

This page aims to ease the transition from Telegraf 0.13 to Telegraf 1.0.
It is not intended to be a comprehensive list of the differences between the
versions.
See
[Telegraf's Changelog](https://github.com/influxdata/telegraf/blob/master/CHANGELOG.md)
for detailed release notes.

### New plugins

Telegraf 1.0 offers five new input plugins:

* The
[Graylog plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/graylog)
collects data from remote Graylog service URLs.
* The
[Consul plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/consul)
collects statistics about all health checks registered in the Consul.
* The
[Conntrack plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/conntrack)
collects stats from Netfilter's conntrack-tools.
* The
[VMStat plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/KERNEL_VMSTAT_README.md)
gathers virtual memory statistics by reading /proc/vmstat.
* The
[Rollbar plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/rollbar_webhooks)
is a Telegraf service plugin that listens for events kicked off by Rollbar
Webhooks service and persists data from them into configured outputs.
