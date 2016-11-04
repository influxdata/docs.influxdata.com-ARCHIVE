---
title: Differences between Telegraf 1.1 and 1.0

menu:
  telegraf_1_1:
    name: Differences between Telegraf 1.1 and 1.0
    weight: 0
    parent: administration
---

This page aims to ease the transition from Telegraf 1.0 to Telegraf 1.1.
It is not intended to be a comprehensive list of the differences between the
versions.
See
[Telegraf's Changelog](https://github.com/influxdata/telegraf/blob/master/CHANGELOG.md)
for detailed release notes.

### Release Notes

Telegraf 1.1 supports [processor](/telegraf/v1.1/administration/configuration/#processor-configuration) and [aggregator](/telegraf/v1.1/administration/configuration/#aggregator-configuration) plugins.

On systemd Telegraf will no longer redirect it's stdout to `/var/log/telegraf/telegraf.log`.
On most systems, the logs will be directed to the systemd journal and can be accessed by `journalctl -u telegraf.service`.
Consult the systemd journal documentation for configuring journald.
There is also a [logfile config option](https://github.com/influxdata/telegraf/blob/master/etc/telegraf.conf#L70) available in version 1.1, which will allow users to easily configure `telegraf` to continue sending logs to `/var/log/telegraf/telegraf.log`.

### New Plugins

* [HTTP Listener service input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/http_listener)
* [IPtables input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/iptables)
* [Kubernetes input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/kubernetes)
* [NATS output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/nats)
