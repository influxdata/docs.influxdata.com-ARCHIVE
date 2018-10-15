---
title: Using the SHOW STATS command to monitor InfluxDB
description: Use the SHOW STATS command to monitor InfluxDB instances.
menu:
  platform:
    name: Using SHOW STATS to monitor InfluxDB
    weight: 90
---

## Using the `SHOW STATS` command

The InfluxQL [`SHOW STATS`](https://docs.influxdata.com/influxdb/v1.6/query_language/spec#show-stats) command returns detailed measurement statistics on InfluxDB servers and available (enabled) components. Each component exporting statistics exports a measurement named after the module and various series that are associated with the measurement. To monitor InfluxDB system measurements over time, you can use the `_internal` database. For details on measurements available in the `_internal` database, see [Measurements for monitoring InfluxDB OSS and InfluxDB Enterprise (`_internal`)](/platform/monitoring/measurements-internal/).

>**Note:** These statistics are all reset to zero when the InfluxDB service starts.

### The `SHOW STATS [FOR <component>]` option

If you are interested in monitoring a specific InfluxDB component, you can use the `SHOW STATS FOR <component>]` to limit the results of the `SHOW STATS` command to a specified module. The `SHOW STATS FOR <component>` command displays detaied measurement statistics about a subsystem within a running `influxd` service.

If a component is specified, it must be single-quoted. In the following example, the available statistics for the `httpd` module are returned.

```
>SHOW STATS FOR 'httpd'
```

### The `SHOW STATS FOR 'indexes'` option

The  `SHOW STATS` command does not list index memory usage unless you use the `SHOW STATS FOR 'indexes'` command. This command returns an estimate of memory use of all indexes.

>**Note:** Index memory usage is not reported with the default `SHOW STATS` command because it is a potentially expensive operation.

## `SHOW STATS` measurement details

The `SHOW STATS` command returns the same statistics captured in the `internal` database, but only for the instant you run the command.

For details on the measurement statistics returned, see [Measurements for monitoring InfluxDB OSS and InfluxDB Enterprise (`_internal`)](/platform/monitoring/measurements-internal/).
