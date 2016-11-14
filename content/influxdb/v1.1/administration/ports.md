---
title: Ports

menu:
  influxdb_1_1:
    weight: 20
    parent: administration
---

## HTTP API PORT
By default the [InfluxDB HTTP API](/influxdb/v1.1/concepts/api/) listens on port
`8086`.
The `/ping`, `/write`, and `/query` endpoints are all part of the HTTP API.

## Admin interface port
The [admin interface](/influxdb/v1.1/tools/web_admin/) for InfluxDB runs on port
`8083` and exposes web UI for the server.

## Secondary Ports
InfluxDB also supports communication through
[UDP](/influxdb/v1.1/write_protocols/udp/),
[Graphite](/influxdb/v1.1/write_protocols/graphite/),
[Collectd](/influxdb/v1.1/write_protocols/collectd/),
and
[OpenTSDB](/influxdb/v1.1/write_protocols/opentsdb/).

Default ports:

* UDP: `8089`
* Graphite: `2003`
* Collectd: `25826`
* OpenTSDB: `4242`
