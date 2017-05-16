---
title: Differences between Telegraf 1.3 and 1.2

menu:
  telegraf_1_3:
    name: Differences between Telegraf 1.3 and 1.2
    weight: 0
    parent: administration
---

This page aims to ease the transition from Telegraf 1.2 to Telegraf 1.3.
It is not intended to be a comprehensive list of the differences between the
versions.
See
[Telegraf's Changelog](/telegraf/v1.3/about_the_project/release-notes-changelog/)
for more details.

## Release Notes

### Changes to the Windows ping plugin

Users of the windows [ping plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ping) will need to drop or migrate their measurements to continue using the plugin.
The reason for this is that the windows plugin was outputting a different type than the linux plugin.
This made it impossible to use the `ping` plugin for both windows and linux machines.

### Changes to the Ceph plugin

For the [Ceph plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ceph), the `ceph_pgmap_state` metric content has been modified to use a unique field `count`, with each state expressed as a `state` tag.

Telegraf < 1.3:

```
# field_name             value
active+clean             123
active+clean+scrubbing   3
```

Telegraf >= 1.3:

```
# field_name    value       tag
count           123         state=active+clean
count           3           state=active+clean+scrubbing
```

### Rewritten Riemann plugin

The [Riemann output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/riemann) has been rewritten
and the [previous riemann plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/riemann_legacy) is _incompatible_ with the new one.
The reasons for this are outlined in issue [#1878](https://github.com/influxdata/telegraf/issues/1878).
The previous Riemann output will still be available using `outputs.riemann_legacy` if needed, but that will eventually be deprecated.
It is highly recommended that all users migrate to the new Riemann output plugin.

### New Socket Listener and Socket Writer plugins

Generic [Socket Listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/socket_listener) and [Socket Writer](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/socket_writer) plugins have been implemented for receiving and sending UDP, TCP, unix, & unix-datagram data.
These plugins will replace [udp_listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/udp_listener) and [tcp_listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/tcp_listener), which are still available but will be deprecated eventually.

## New Plugins

### Input plugins

* [AMQP Consumer](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/amqp_consumer)
* [DMCache](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/dmcache)
* [Interrupts](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/interrupts)
* [Socket Listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/socket_listener) (replacement for [udp_listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/udp_listener) and [tcp_listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/tcp_listener))

### Output plugins

* [Elasticsearch](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/elasticsearch)
* [Riemann](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/riemann) (rewritten from [Riemann Legacy](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/riemann_legacy))
* [Socket Writer](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/socket_writer) (replacement for [udp_listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/udp_listener) and [tcp_listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/tcp_listener))
