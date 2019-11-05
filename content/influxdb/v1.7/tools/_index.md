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

## [InfluxDB inch tool](/influxdb/v1.7/tools/inch/)

Use the InfluxDB inch tool to test InfluxDB performance. Adjust metrics such as the batch size, tag values, and concurrent write streams to test how ingesting different tag cardinalities and metrics affects performance.

## Graphs and dashboards

Use [Chronograf](/chronograf/latest/) or [Grafana](http://docs.grafana.org/datasources/influxdb/) dashboards to visualize your time series data.

> **Tip:** Use template variables in your dashboards to filter meta query results by a specified period of time (see example below).

### Filter meta query results using template variables

The example below shows how to filter hosts retrieving data in the past hour.

##### Example

```sh
# Create a retention policy.
CREATE RETENTION POLICY "lookup" ON "prod" DURATION 1d REPLICATION 1

# Create a continuous query that groups by the tags you want to use in your template variables.
CREATE CONTINUOUS QUERY "lookupquery" ON "prod" BEGIN SELECT mean(value) as value INTO "your.system"."host_info" FROM "cpuload"
WHERE time > now() - 1h GROUP BY time(1h), host, team, status, location END;

# In your Grafana or Chronograf templates, include your tag values.
SHOW TAG VALUES FROM "your.system"."host_info" WITH KEY = “host”
```

> **Note:** In Chronograf, you can also filter meta query results for a specified time range by [creating a `custom meta query` template variable](/chronograf/latest/guides/dashboard-template-variables/#create-custom-template-variables) and adding a time range filter.
