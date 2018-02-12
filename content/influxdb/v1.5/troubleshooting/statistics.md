---
title: InfluxDB server monitoring
aliases:
    - influxdb/v1.5/administration/statistics/
menu:
  influxdb_1_5:
    name: Server monitoring
    weight: 10
    parent: troubleshooting
---

InfluxDB can display statistical and diagnostic information about each node.
This information can be very useful for troubleshooting and performance monitoring.

## SHOW STATS
To see node stats execute the command `SHOW STATS`.

The statistics returned by `SHOW STATS` are stored in memory only, and are reset to zero when the node is restarted.

## SHOW DIAGNOSTICS
To see node diagnostics execute the command `SHOW DIAGNOSTICS`.
This returns information such as build information, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics.

## Internal Monitoring
InfluxDB also writes statistical and diagnostic information to database named `_internal`, which records metrics on the internal runtime and service performance.
The `_internal` database can be queried and manipulated like any other InfluxDB database.
Check out the [monitor service README](https://github.com/influxdb/influxdb/blob/master/monitor/README.md) and the [internal monitoring blog post](https://influxdb.com/blog/2015/09/22/monitoring_internal_show_stats.html) for more detail.

## Useful Commands

Below are a collection of commands to find useful performance metrics about your InfluxDB instance.

To find the number of points per second being written to the instance. Must have the `monitor` service enabled:
```bash
$ influx -execute 'select derivative(pointReq, 1s) from "write" where time > now() - 5m' -database '_internal' -precision 'rfc3339'
```

To find the number of writes separated by database since the beginnning of the log file:

```bash
grep 'POST' /var/log/influxdb/influxd.log | awk '{ print $10 }' | sort | uniq -c
```

Or, for systemd systems logging to journald:

```bash
journalctl -u influxdb.service | awk '/POST/ { print $10 }' | sort | uniq -c
```
