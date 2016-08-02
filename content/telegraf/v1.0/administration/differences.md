---
title: Differences between Telegraf 1.0 and 0.13

menu:
  telegraf_1_0:
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

Telegraf 1.0 offers several new input plugins:

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
[logparser plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/logparser)
streams and parses logfiles.
* [Webhooks](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/webhooks)
is a Telegraf service plugin that starts an HTTP server and registers multiple webhook listeners. Webhooks includes the
[Rollbar Webhook plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/webhooks/rollbar)
and the [Mandrill Webhook plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/webhooks/mandrill).
* The [CGroup plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/cgroup)
captures specific statistics per CGroup.
* The [NSQ consumer plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/nsq_consumer)
polls a specific NSQD topic and adds messages to InfluxDB.
