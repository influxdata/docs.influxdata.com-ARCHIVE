---
title: JSON Protocol

menu:
  influxdb_011:
    weight: 20
    parent: write_protocols
---

The JSON write protocol is deprecated as of InfluxDB 0.9.1.
It is disabled by default in InfluxDB 0.11 and will be removed in the next release.
You can [turn it back on](https://github.com/influxdata/influxdb/pull/5512) in 0.11.
[Line Protocol](/influxdb/v0.11/write_protocols/line/) is the only recommended write protocol for InfluxDB 0.11.

For reasons behind the deprecation, please see the comments on the line protocol pull request, particularly the comments on JSON serialization [CPU costs](https://github.com/influxdb/influxdb/pull/2696#issuecomment-106968181) and on the [ease of use](https://github.com/influxdb/influxdb/pull/2696#issuecomment-107043910) concerns.
