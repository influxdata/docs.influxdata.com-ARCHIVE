---
title: Query Management

menu:
  influxdb_1_4:
    weight: 20
    parent: troubleshooting
---

With InfluxDB's query management features, users are able to
identify currently-running queries,
kill queries that are overloading their system,
and prevent and halt the execution of inefficient queries with several configuration settings.

<table style="width:100%">
  <tr>
    <td><a href="#list-currently-running-queries-with-show-queries">SHOW QUERIES</a></td>
    <td><a href="#stop-currently-running-queries-with-kill-query-or-ctrlc">KILL QUERY</a></td>
    <td><a href="#configuration-settings-for-query-management">Configuration Settings</a></td>
  </tr>
</table>

## List currently-running queries with `SHOW QUERIES`
`SHOW QUERIES` lists the query id, query text, relevant database, and duration
of all currently-running queries on your InfluxDB instance.

#### Syntax:
```
SHOW QUERIES
```

#### Example:
```
> SHOW QUERIES
qid	  query															               database		  duration
37	   SHOW QUERIES																                	  100368u
36	   SELECT mean(myfield) FROM mymeas   mydb        3s
```

##### Explanation of the output:
<br>
`qid`&emsp;&emsp;&emsp;&nbsp;The id number of the query. Use this value with [`KILL QUERY`](/influxdb/v1.4/troubleshooting/query_management/#stop-currently-running-queries-with-kill-query).  
`query`&emsp;&emsp;&thinsp;&thinsp;The query text.  
`database`&emsp;The database targeted by the query.  
`duration`&emsp;The length of time that the query has been running.
See [Query Language Reference](/influxdb/v1.4/query_language/spec/#durations)
for an explanation of InfluxDB's time units.

## Stop currently-running queries with `KILL QUERY` or `Ctrl+C`
Use the `KILL QUERY` command to stop any currently-running InfluxDB queries that are causing performance issues or running for too long. To stop an interactive query entered in the CLI, use `Ctrl+C`.

#### Syntax:
Where `qid` is the id of the query from the [`SHOW QUERIES`](/influxdb/v1.4/troubleshooting/query_management/#list-currently-running-queries-with-show-queries) output:
```
KILL QUERY <qid>
```

#### Example:
<br>
```
> KILL QUERY 36
>
```

A successful `KILL QUERY` query returns no results.

## Configuration settings for query management

The following configuration settings are in the
[[coordinator]](/influxdb/v1.4/administration/config/#coordinator) section of the
configuration file.

### max-concurrent-queries

The maximum number of running queries allowed on your instance.
The default setting (`0`) allows for an unlimited number of queries.

If you exceed `max-concurrent-queries`, InfluxDB does not execute the query and
outputs the following error:

```
ERR: max concurrent queries reached
```

### query-timeout

The maximum time for which a query can run on your instance before InfluxDB
kills the query.
The default setting (`"0"`) allows queries to run with no time restrictions.
This setting is a [duration literal](/influxdb/v1.4/query_language/spec/#durations).

If your query exceeds the query timeout, InfluxDB kills the query and outputs
the following error:

```
ERR: query timeout reached
```

### log-queries-after

The maximum time a query can run after which InfluxDB logs the query with a
`Detected slow query` message.
The default setting (`"0"`) will never tell InfluxDB to log the query.
This setting is a [duration literal](/influxdb/v1.4/query_language/spec/#durations).

Example log output with `log-queries-after` set to `"1s"`:

```
[query] 2016/04/28 14:11:31 Detected slow query: SELECT mean(usage_idle) FROM cpu WHERE time >= 0 GROUP BY time(20s) (qid: 3, database: telegraf, threshold: 1s)
```

`qid` is the id number of the query.
Use this value with [`KILL QUERY`](/influxdb/v1.4/troubleshooting/query_management/#stop-currently-running-queries-with-kill-query).

The default location for the log output file is `/var/log/influxdb/influxdb.log`. However on systems that use systemd (most modern Linux distributions) those logs are output to `journalctl`. You should be able to view the InfluxDB logs using the following command: `journalctl -u influxdb`


### max-select-point

The maximum number of [points](/influxdb/v1.4/concepts/glossary/#point) that a
`SELECT` statement can process.
The default setting (`0`) allows the `SELECT` statement to process an unlimited
number of points.

If your query exceeds `max-select-point`, InfluxDB kills the query and outputs
the following error:

```
ERR: max number of points reached
```

### max-select-series

The maximum number of [series](/influxdb/v1.4/concepts/glossary/#series) that a
`SELECT` statement can process.
The default setting (`0`) allows the `SELECT` statement to process an unlimited
number of series.

If your query exceeds `max-select-series`, InfluxDB does not execute the query
and outputs the following error:

```
ERR: max select series count exceeded: <query_series_count> series
```

### max-select-buckets

The maximum number of `GROUP BY time()` buckets that a query can process.
The default setting (`0`) allows a query to process an unlimited number of
buckets.

If your query exceeds `max-select-buckets`, InfluxDB does not execute the query
and outputs the following error:

```
ERR: max select bucket count exceeded: <query_bucket_count> buckets
```
