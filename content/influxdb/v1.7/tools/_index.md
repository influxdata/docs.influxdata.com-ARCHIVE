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

## [`influx` command line interface (CLI)](/influxdb/v1.7/tools/influx-cli/)

The InfluxDB command line interface (`influx`) includes commands to manage many aspects of InfluxDB, including databases, organizations, users, and tasks.

## [`influxd` command line interface (CLI)](/influxdb/v1.7/tools/influxd-cli/)

The `influxd` command line interface (CLI) starts and runs all the processes necessary for InfluxDB to function.

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

Use [Chronograf](/chronograf/latest/) or [Grafana](https://grafana.com/docs/grafana/latest/features/datasources/influxdb/) dashboards to visualize your time series data.

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
