---
title: InfluxDB tools
aliases:
    - /influxdb/v1.7/clients/
    - /influxdb/v1.7/write_protocols/json/
menu:
  influxdb_1_7:
    name: Tools
    weight: 60

---

This section covers the available tools for interacting with InfluxDB.

## [InfluxDB command line interface (CLI/Shell)](/influxdb/v1.7/tools/shell/)

The InfluxDB command line interface (`influx`) is an interactive shell for the
InfluxDB API that comes with every InfluxDB package.
Use `influx` to write data (manually or from a file), query data interactively,
and view query output in different formats:

![CLI GIF](/img/influxdb/cli-1.0-beta.gif)

Go straight to the documentation on:

* [Launching `influx`](/influxdb/v1.7/tools/shell/#launch-influx)
* [Writing data with `influx`](/influxdb/v1.7/tools/shell/#write-data-to-influxdb-with-insert)

## [InfluxDB API Reference](/influxdb/v1.7/tools/api/)

Reference documentation for the InfluxDB API.

Go straight to the reference documentation on:

* [Writing data with the InfluxDB API](/influxdb/v1.7/tools/api/#write-http-endpoint)
* [Querying data with the InfluxDB API](/influxdb/v1.7/tools/api/#query-http-endpoint)

For friendlier documentation, see the guides on
[writing data](/influxdb/v1.7/guides/writing_data/) and
[querying data](/influxdb/v1.7/guides/querying_data/) with the InfluxDB API.

## [InfluxDB API client libraries](/influxdb/v1.7/tools/api_client_libraries/)

The list of client libraries for interacting with the InfluxDB API.

## [Influx Inspect disk shard utility](/influxdb/v1.7/tools/influx_inspect/)

Influx Inspect is a tool designed to view detailed information about on disk shards, as well as export data from a shard to line protocol that can be inserted back into the database.

## [Grafana graphs and dashboards](http://docs.grafana.org/datasources/influxdb/)

Grafana is a convenient dashboard tool for visualizing time series data.
It was originally built for Graphite, modeled after Kibana, and since been updated to support InfluxDB.

> **Tip:** If you use Grafana template variables, you can limit results (for example, a list of hosts) by a specified period of time.

### Limit results for Grafana template variables

Use the WHERE clause to limit results for a specified time period. The example below shows how to limit hosts retrieving data for a specified period.

##### Example limiting results for Grafana

```
// Create a retention policy for a specified duration.
CREATE RETENTION POLICY "lookup" ON "prod" DURATION 2d REPLICATION 1

// Obtain a distinct list of hosts currently retrieving data, and then add information to "group by" into a measurement.
CREATE CONTINUOUS QUERY "lookupquery" ON "prod" BEGIN SELECT mean(value) as value INTO "your.system"."host_info" FROM "cpuload" WHERE time > now() - 1h GROUP BY time(1h), host, team, status, location END;

// In your Grafana templates, include your tag values.
SHOW TAG VALUES FROM "your.system"."host_info" WITH KEY = “host” 
```
