---
title: JSON Protocol

menu:
  influxdb_013:
    weight: 20
    parent: write_protocols
---

The JSON write protocol is no longer a valid write protocol for InfluxDB.

The protocol was deprecated as of InfluxDB 0.9.1 and was [disabled](https://github.com/influxdata/influxdb/pull/5512) by default in
InfluxDB 0.11.
[Line Protocol](/influxdb/v0.13/write_protocols/line/) is the only recommended write protocol for InfluxDB 0.12.

For reasons behind its removal, please see the comments on the line protocol pull request, particularly the comments on JSON serialization [CPU costs](https://github.com/influxdb/influxdb/pull/2696#issuecomment-106968181) and on the [ease of use](https://github.com/influxdb/influxdb/pull/2696#issuecomment-107043910) concerns.
