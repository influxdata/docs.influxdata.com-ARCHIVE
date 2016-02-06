---
title: Upgrading from previous versions

menu:
  influxdb_010:
    weight: 30
    parent: administration
---

InfluxDB version 0.10.0 uses a new default storage engine, `tsm1`. 
The data storage format change requires a manual conversion for data written using the `b1` or `bz1` engines. 
Full documentation on this conversion is available as a [README.md](https://github.com/influxdata/influxdb/tree/master/cmd/influx_tsm) on Github.
