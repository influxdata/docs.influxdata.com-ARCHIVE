---
title: JSON Protocol

menu:
  influxdb_010:
    weight: 20
    parent: write_protocols
---

The JSON write protocol is deprecated as of InfluxDB 0.9.1.
It is still present in InfluxDB 0.10 but it will be removed no later than the InfluxDB 1.0 release.
The [line protocol](/influxdb/v0.10/write_protocols/line/) is the only recommended write protocol for InfluxDB 0.10.

For reasons behind the deprecation, please see the comments on the line protocol pull request, particularly the comments on JSON serialization [CPU costs](https://github.com/influxdb/influxdb/pull/2696#issuecomment-106968181) and on the [ease of use](https://github.com/influxdb/influxdb/pull/2696#issuecomment-107043910) concerns.
