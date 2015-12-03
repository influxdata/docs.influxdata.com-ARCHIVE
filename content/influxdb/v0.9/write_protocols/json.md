---
title: JSON Protocol
aliases:
  - /docs/v0.9/concepts/chunked_responses.html
---

The JSON write protocol is deprecated as of InfluxDB 0.9.1. It is still present but it will be removed when InfluxDB 1.0 is released. The [line protocol](https://influxdb.com/docs/v0.9/write_protocols/line.html) is the primary write protocol for InfluxDB 0.9.1+.

For reasons behind the deprecation, please see the comments on the line protocol pull request, particularly the comments on JSON serialization [CPU costs](https://github.com/influxdb/influxdb/pull/2696#issuecomment-106968181) and on the [ease of use](https://github.com/influxdb/influxdb/pull/2696#issuecomment-107043910) concerns.
