---
title: InfluxQL query management

menu:
  influxdb_1_7:
    name: Query management
    weight: 20
    parent: Troubleshooting
---

Manage your InfluxQL queries using the following:

- [SHOW QUERIES](#list-currently-running-queries-with-show-queries) to identify currently-running queries
- [KILL QUERIES](#stop-currently-running-queries-with-kill-query) to stop queries overloading your system
- [Configuration settings](#configuration-settings-for-query-management) to prevent and halt the execution of inefficient queries

> The commands and configurations provided on this page are for **Influx Query Language (InfluxQL) only** -- **no equivalent set of Flux commands and configurations currently exists**. For the most current Flux documentation, see [Get started with Flux](/flux/v0.50/introduction/getting-started/).

## List currently-running queries with `SHOW QUERIES`

`SHOW QUERIES` lists the query id, query text, relevant database, and duration
of all currently-running queries on your InfluxDB instance.

#### Syntax

```sql
SHOW QUERIES
```

#### Example

```
> SHOW QUERIES
qid	  query                              database   duration   status
---   -----                              --------   --------   ------
37    SHOW QUERIES                                  100368u    running
36    SELECT mean(myfield) FROM mymeas   mydb       3s         running
```

##### Explanation of the output

- `qid`: The id number of the query. Use this value with [`KILL - QUERY`](/influxdb/v1.7/troubleshooting/query_management/#stop-currently-running-queries-with-kill-query).  
- `query`: The query text.  
- `database`: The database targeted by the query.  
- `duration`: The length of time that the query has been running.
  See [Query Language Reference](/influxdb/v1.7/query_language/spec/#durations)
  for an explanation of time units in InfluxDB databases.

    {{% note %}}
`SHOW QUERIES` may output a killed query and continue to increment its duration
until the query record is cleared from memory.
    {{% /note %}}

- `status`: The current status of the query.

## Stop currently-running queries with `KILL QUERY`

`KILL QUERY` tells InfluxDB to stop running the relevant query.

#### Syntax

Where `qid` is the query ID, displayed in the [`SHOW QUERIES`](/influxdb/v1.3/troubleshooting/query_management/#list-currently-running-queries-with-show-queries) output:

```sql
KILL QUERY <qid>
```

***InfluxDB Enterprise clusters:*** To kill queries on a cluster, you need to specify the query ID (qid) and the TCP host (for example, `myhost:8088`),
available in the `SHOW QUERIES` output.

```sql
KILL QUERY <qid> ON "<host>"
```

A successful `KILL QUERY` query returns no results.

#### Examples

```sql
-- kill query with qid of 36 on the local host
> KILL QUERY 36
>
```

```sql
-- kill query on InfluxDB Enterprise cluster
> KILL QUERY 53 ON "myhost:8088"
>
```

## Configuration settings for query management

The following configuration settings are in the
[coordinator](/influxdb/v1.7/administration/config/#query-management-settings) section of the
configuration file.

### `max-concurrent-queries`

The maximum number of running queries allowed on your instance.
The default setting (`0`) allows for an unlimited number of queries.

If you exceed `max-concurrent-queries`, InfluxDB does not execute the query and
outputs the following error:

```
ERR: max concurrent queries reached
```

### `query-timeout`

The maximum time for which a query can run on your instance before InfluxDB
kills the query.
The default setting (`"0"`) allows queries to run with no time restrictions.
This setting is a [duration literal](/influxdb/v1.7/query_language/spec/#durations).

If your query exceeds the query timeout, InfluxDB kills the query and outputs
the following error:

```
ERR: query timeout reached
```

### `log-queries-after`

The maximum time a query can run after which InfluxDB logs the query with a
`Detected slow query` message.
The default setting (`"0"`) will never tell InfluxDB to log the query.
This setting is a [duration literal](/influxdb/v1.7/query_language/spec/#durations).

Example log output with `log-queries-after` set to `"1s"`:

```
[query] 2016/04/28 14:11:31 Detected slow query: SELECT mean(usage_idle) FROM cpu WHERE time >= 0 GROUP BY time(20s) (qid: 3, database: telegraf, threshold: 1s)
```

`qid` is the id number of the query.
Use this value with [`KILL QUERY`](/influxdb/v1.7/troubleshooting/query_management/#stop-currently-running-queries-with-kill-query).

The default location for the log output file is `/var/log/influxdb/influxdb.log`. However on systems that use systemd (most modern Linux distributions) those logs are output to `journalctl`. You should be able to view the InfluxDB logs using the following command: `journalctl -u influxdb`

### `max-select-point`

The maximum number of [points](/influxdb/v1.7/concepts/glossary/#point) that a
`SELECT` statement can process.
The default setting (`0`) allows the `SELECT` statement to process an unlimited
number of points.

If your query exceeds `max-select-point`, InfluxDB kills the query and outputs
the following error:

```
ERR: max number of points reached
```

### `max-select-series`

The maximum number of [series](/influxdb/v1.7/concepts/glossary/#series) that a
`SELECT` statement can process.
The default setting (`0`) allows the `SELECT` statement to process an unlimited
number of series.

If your query exceeds `max-select-series`, InfluxDB does not execute the query
and outputs the following error:

```
ERR: max select series count exceeded: <query_series_count> series
```

### `max-select-buckets`

The maximum number of `GROUP BY time()` buckets that a query can process.
The default setting (`0`) allows a query to process an unlimited number of
buckets.

If your query exceeds `max-select-buckets`, InfluxDB does not execute the query
and outputs the following error:

```
ERR: max select bucket count exceeded: <query_bucket_count> buckets
```
