---
title: JSON Protocol

menu:
  influxdb_09:
    weight: 20
    parent: write_protocols
---

The JSON write protocol is deprecated as of InfluxDB 0.9.1.
It is still present but it will be removed when InfluxDB 1.0 is released.
The [line protocol](/influxdb/v0.10/write_protocols/line/) is the primary write protocol for InfluxDB 0.9.1+.

For reasons behind the deprecation, please see the comments on the line protocol pull request, particularly the comments on JSON serialization [CPU costs](https://github.com/influxdb/influxdb/pull/2696#issuecomment-106968181) and on the [ease of use](https://github.com/influxdb/influxdb/pull/2696#issuecomment-107043910) concerns.
