---
title: Tools
---
## [InfluxDB Shell(CLI)](/influxdb/v0.12/tools/shell/)

The Influx shell is an interactive shell for InfluxDB and the recommended *ad hoc* method of using the HTTP API.

## [InfluxDB Web Admin](/influxdb/v0.12/tools/web_admin/)

The built-in web administration GUI is a simple way to interact with InfluxDB.
For any significant use, whether writing or querying data, the HTTP API is the preferred method.

## [Grafana Graphs and Dashboards](http://docs.grafana.org/datasources/influxdb/)

Grafana is a convenient dashboard tool for visualizing time series data.
It was originally built for Graphite, modeled after Kibana, and since been updated to support InfluxDB.

<dt> Because of the [changes](/influxdb/v0.12/concepts/010_vs_011/#breaking-api-changes) to the `SHOW SERIES` and `SHOW TAG VALUES` formats, InfluxDB 0.11 will not work with the Query Editor in Grafana 2.6. This issue does not affect existing queries and dashboards. </dt>

## [Chronograf Dashboards](/chronograf/v0.12/)

## [Kapacitor Monitoring](/kapacitor/v0.12/)

## [Telegraf](/telegraf/v0.12)

Telegraf is an open source tool for metrics collection (e.g. CollectD) built and maintained by the InfluxDB team.
