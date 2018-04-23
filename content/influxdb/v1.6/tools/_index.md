---
title: Tools
aliases:
    - influxdb/v1.6/clients/
    - influxdb/v1.6/write_protocols/json/
---

This section covers the available tools for interacting with InfluxDB.

## [CLI/Shell](/influxdb/v1.6/tools/shell/)

InfluxDB's Command Line Interface (`influx`) is an interactive shell for the
HTTP API that comes with every InfluxDB package.
Use `influx` to write data (manually or from a file), query data interactively,
and view query output in different formats:

![CLI GIF](/img/influxdb/cli-1.0-beta.gif)

Go straight to the documentation on:

* [Launching `influx`](/influxdb/v1.6/tools/shell/#launch-influx)
* [Writing data with `influx`](/influxdb/v1.6/tools/shell/#write-data-to-influxdb-with-insert)

## [API Reference](/influxdb/v1.6/tools/api/)

Reference documentation for InfluxDB's HTTP API.

Go straight to the reference documentation on:

* [Writing data with the HTTP API](/influxdb/v1.6/tools/api/#write)
* [Querying data with the HTTP API](/influxdb/v1.6/tools/api/#query)

For friendlier documentation, see the guides on
[writing data](/influxdb/v1.6/guides/writing_data/) and
[querying data](/influxdb/v1.6/guides/querying_data/) with the HTTP API.

## [InfluxDB API client libraries](/influxdb/v1.6/tools/api_client_libraries/)

The list of client libraries for interacting with the InfluxDB API.

## [Influx Inspect disk shard utility](/influxdb/v1.6/tools/influx_inspect/)

Influx Inspect is a tool designed to view detailed information about on disk shards, as well as export data from a shard to line protocol that can be inserted back into the database.

## [Grafana graphs and dashboards](http://docs.grafana.org/datasources/influxdb/)

Grafana is a convenient dashboard tool for visualizing time series data.
It was originally built for Graphite, modeled after Kibana, and since been updated to support InfluxDB.

<dt> Because of the [changes](/influxdb/v0.11/concepts/010_vs_011/#breaking-api-changes) to the `SHOW SERIES` and `SHOW TAG VALUES` formats in InfluxDB 0.11, InfluxDB 1.3+ will not work with the Query Editor in Grafana 2.6.
This issue does not affect existing queries and dashboards or users working with Grafana 3.0. </dt>
