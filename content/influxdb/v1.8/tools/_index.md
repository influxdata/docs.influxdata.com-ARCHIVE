---
title: InfluxDB tools
aliases:
    - /influxdb/v1.8/clients/
    - /influxdb/v1.8/write_protocols/json/
menu:
  influxdb_1_8:
    name: Tools
    weight: 60

---

This section covers the available tools for interacting with InfluxDB.

## [`influx` command line interface (CLI)](/influxdb/v1.8/tools/influx-cli/)

The InfluxDB command line interface (`influx`) includes commands to manage many aspects of InfluxDB, including databases, organizations, users, and tasks.

## [`influxd` command](/influxdb/v1.8/tools/influxd)

The `influxd` command starts and runs all the processes necessary for InfluxDB to function.

## [InfluxDB API client libraries](/influxdb/v1.8/tools/api_client_libraries/)

The list of client libraries for interacting with the InfluxDB API.

## [Influx Inspect disk shard utility](/influxdb/v1.8/tools/influx_inspect/)

Influx Inspect is a tool designed to view detailed information about on disk shards, as well as export data from a shard to line protocol that can be inserted back into the database.

## [InfluxDB inch tool](/influxdb/v1.8/tools/inch/)

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
