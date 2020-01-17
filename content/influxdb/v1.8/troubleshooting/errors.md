---
title: InfluxDB error messages
description: Covers InfluxDB error messages, their descriptions, and common resolutions.
menu:
  influxdb_1_8:
    name: Error messages
    weight: 30
    parent: Troubleshooting
---

This page documents errors, their descriptions, and, where applicable,
common resolutions.

{{% warn %}}
**Disclaimer:** This document does not contain an exhaustive list of all possible InfluxDB errors.
{{% /warn %}}

## `error: database name required`

The `database name required` error occurs when certain `SHOW` queries do
not specify a [database](/influxdb/v1.8/concepts/glossary/#database).
Specify a database with an `ON` clause in the `SHOW` query, with `USE <database_name>` in the
[CLI](/influxdb/v1.8/tools/shell/), or with the `db` query string parameter in
the [InfluxDB API](/influxdb/v1.8/tools/api/#query-string-parameters) request.

The relevant `SHOW` queries include `SHOW RETENTION POLICIES`, `SHOW SERIES`,
`SHOW MEASUREMENTS`, `SHOW TAG KEYS`, `SHOW TAG VALUES`, and `SHOW FIELD KEYS`.

**Resources:**
[Schema exploration](/influxdb/v1.8/query_language/schema_exploration/),
[InfluxQL reference](/influxdb/v1.8/query_language/spec/)

## `error: max series per database exceeded: < >`

The `max series per database exceeded` error occurs when a write causes the
number of [series](/influxdb/v1.8/concepts/glossary/#series) in a database to
exceed the maximum allowable series per database.
The maximum allowable series per database is controlled by the
`max-series-per-database` setting in the `[data]` section of the configuration
file.

The information in the `< >` shows the measurement and the tag set of the series
that exceeded `max-series-per-database`.

By default `max-series-per-database` is set to one million.
Changing the setting to `0` allows an unlimited number of series per database.

**Resources:**
[Database Configuration](/influxdb/v1.8/administration/config/#max-series-per-database-1000000)

## `error parsing query: found < >, expected identifier at line < >, char < >`

### InfluxQL syntax

The `expected identifier` error occurs when InfluxDB anticipates an identifier
in a query but doesn't find it.
Identifiers are tokens that refer to continuous query names, database names,
field keys, measurement names, retention policy names, subscription names,
tag keys, and user names.
The error is often a gentle reminder to double-check your query's syntax.

**Examples**

*Query 1:*

```sql
> CREATE CONTINUOUS QUERY ON "telegraf" BEGIN SELECT mean("usage_idle") INTO "average_cpu" FROM "cpu" GROUP BY time(1h),"cpu" END
ERR: error parsing query: found ON, expected identifier at line 1, char 25
```

Query 1 is missing a continuous query name between `CREATE CONTINUOUS QUERY` and
`ON`.

*Query 2:*

```sql
> SELECT * FROM WHERE "blue" = true
ERR: error parsing query: found WHERE, expected identifier at line 1, char 15
```

Query 2 is missing a measurement name between `FROM` and `WHERE`.

### InfluxQL keywords

In some cases the `expected identifier` error occurs when one of the
[identifiers](/influxdb/v1.8/concepts/glossary/#identifier) in the query is an
[InfluxQL Keyword](/influxdb/v1.8/query_language/spec/#keywords).
To successfully query an identifier that's also a keyword, enclose that
identifier in double quotes.

**Examples**

*Query 1:*

```sql
> SELECT duration FROM runs
ERR: error parsing query: found DURATION, expected identifier, string, number, bool at line 1, char 8
```

In Query 1, the field key `duration` is an InfluxQL Keyword.
Double quote `duration` to avoid the error:

```sql
> SELECT "duration" FROM runs
```

*Query 2:*

```sql
> CREATE RETENTION POLICY limit ON telegraf DURATION 1d REPLICATION 1
ERR: error parsing query: found LIMIT, expected identifier at line 1, char 25
```

In Query 2, the retention policy name `limit` is an InfluxQL Keyword.
Double quote `limit` to avoid the error:

```sql
> CREATE RETENTION POLICY "limit" ON telegraf DURATION 1d REPLICATION 1
```

While using double quotes is an acceptable workaround, we recommend that you avoid using InfluxQL keywords as identifiers for simplicity's sake.

**Resources:**
[InfluxQL Keywords](/influxdb/v1.8/query_language/spec/#keywords),
[Query Language Documentation](/influxdb/v1.8/query_language/)

## `error parsing query: found < >, expected string at line < >, char < >`

The `expected string` error occurs when InfluxDB anticipates a string
but doesn't find it.
In most cases, the error is a result of forgetting to quote the password
string in the `CREATE USER` statement.

**Example**

```sql
> CREATE USER penelope WITH PASSWORD timeseries4dayz
ERR: error parsing query: found timeseries4dayz, expected string at line 1, char 36
```

The `CREATE USER` statement requires single quotation marks around the password
string:

```sql
> CREATE USER penelope WITH PASSWORD 'timeseries4dayz'
```

Note that you should not include the single quotes when authenticating requests.

**Resources:**
[Authentication and Authorization](/influxdb/v1.8/administration/authentication_and_authorization/)

## `error parsing query: mixing aggregate and non-aggregate queries is not supported`

The `mixing aggregate and non-aggregate` error occurs when a `SELECT` statement
includes both an [aggregate function](/influxdb/v1.8/query_language/functions/)
and a standalone [field key](/influxdb/v1.8/concepts/glossary/#field-key) or
[tag key](/influxdb/v1.8/concepts/glossary/#tag-key).

Aggregate functions return a single calculated value and there is no obvious
single value to return for any unaggregated fields or tags.

**Example**

*Raw data:*

The `peg` measurement has two fields (`square` and `round`) and one tag
(`force`):

```sql
name: peg
---------
time                   square   round   force
2016-10-07T18:50:00Z   2        8       1
2016-10-07T18:50:10Z   4        12      2
2016-10-07T18:50:20Z   6        14      4
2016-10-07T18:50:30Z   7        15      3
```

*Query 1:*

```sql
> SELECT mean("square"),"round" FROM "peg"
ERR: error parsing query: mixing aggregate and non-aggregate queries is not supported
```

Query 1 includes an aggregate function and a standalone field.

`mean("square")` returns a single aggregated value calculated from the four values
of `square` in the `peg` measurement, and there is no obvious single field value
to return from the four unaggregated values of the `round` field.

*Query 2:*

```sql
> SELECT mean("square"),"force" FROM "peg"
ERR: error parsing query: mixing aggregate and non-aggregate queries is not supported
```

Query 2 includes an aggregate function and a standalone tag.

`mean("square")` returns a single aggregated value calculated from the four values
of `square` in the `peg` measurement, and there is no obvious single tag value
to return from the four unaggregated values of the `force` tag.

**Resources:**
[Functions](/influxdb/v1.8/query_language/functions/)

## `invalid operation: time and \*influxql.VarRef are not compatible`

The `time and \*influxql.VarRef are not compatible` error occurs when
date-time strings are double quoted in queries.
Date-time strings require single quotes.

### Examples

Double quoted date-time strings:

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= "2015-08-18T00:00:00Z" AND time <= "2015-08-18T00:12:00Z"
ERR: invalid operation: time and *influxql.VarRef are not compatible
```

Single quoted date-time strings:

```sql
> SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:12:00Z'

name: h2o_feet
time                   water_level
----                   -----------
2015-08-18T00:00:00Z   2.064
2015-08-18T00:06:00Z   2.116
2015-08-18T00:12:00Z   2.028
```

**Resources:**
[Data Exploration](/influxdb/v1.8/query_language/data_exploration/#time-syntax)

## `unable to parse < >: bad timestamp`

### Timestamp syntax

The `bad timestamp` error occurs when the
[line protocol](/influxdb/v1.8/concepts/glossary/#influxdb-line-protocol) includes a
timestamp in a format other than a UNIX timestamp.

**Example**

```sql
> INSERT pineapple value=1 '2015-08-18T23:00:00Z'
ERR: {"error":"unable to parse 'pineapple value=1 '2015-08-18T23:00:00Z'': bad timestamp"}
```

The line protocol above uses an [RFC3339](https://www.ietf.org/rfc/rfc3339.txt)
timestamp.
Replace the timestamp with a UNIX timestamp to avoid the error and successfully
write the point to InfluxDB:

```sql
> INSERT pineapple,fresh=true value=1 1439938800000000000
```

### InfluxDB line protocol syntax

In some cases, the `bad timestamp` error occurs with more general syntax errors
in the InfluxDB line protocol.
Line protocol is whitespace sensitive; misplaced spaces can cause InfluxDB
to assume that a field or tag is an invalid timestamp.

**Example**

*Write 1*

```sql
> INSERT hens location=2 value=9
ERR: {"error":"unable to parse 'hens location=2 value=9': bad timestamp"}
```

The line protocol in Write 1 separates the `hen` measurement from the `location=2`
tag with a space instead of a comma.
InfluxDB assumes that the `value=9` field is the timestamp and returns an error.

Use a comma instead of a space between the measurement and tag to avoid the error:

```sql
> INSERT hens,location=2 value=9
```

*Write 2*

```sql
> INSERT cows,name=daisy milk_prod=3 happy=3
ERR: {"error":"unable to parse 'cows,name=daisy milk_prod=3 happy=3': bad timestamp"}
```

The line protocol in Write 2 separates the `milk_prod=3` field and the
`happy=3` field with a space instead of a comma.
InfluxDB assumes that the `happy=3` field is the timestamp and returns an error.

Use a comma instead of a space between the two fields to avoid the error:

```sql
> INSERT cows,name=daisy milk_prod=3,happy=3
```

**Resources:**
[InfluxDB line protocol tutorial](/influxdb/v1.8/write_protocols/line_protocol_tutorial/),
[InfluxDB line protocol reference](/influxdb/v1.8/write_protocols/line_protocol_reference/)

## `unable to parse < >: time outside range`

The `time outside range` error occurs when the timestamp in the
[InfluxDB line protocol](/influxdb/v1.8/concepts/glossary/#influxdb-line-protocol)
falls outside the valid time range for InfluxDB.

The minimum valid timestamp is `-9223372036854775806` or `1677-09-21T00:12:43.145224194Z`.
The maximum valid timestamp is `9223372036854775806` or `2262-04-11T23:47:16.854775806Z`.

**Resources:**
[InfluxDB line protocol tutorial](/influxdb/v1.8/write_protocols/line_protocol_tutorial/#data-types),
[InfluxDB line protocol reference](/influxdb/v1.8/write_protocols/line_protocol_reference/#data-types)

## write failed for shard < >: engine: cache maximum memory size exceeded

The `cache maximum memory size exceeded` error occurs when the cached
memory size increases beyond the
[`cache-max-memory-size` setting](/influxdb/v1.8/administration/config/#cache-max-memory-size-1g)
in the configuration file.

By default, `cache-max-memory-size` is set to 512mb.
This value is fine for most workloads, but is too small for larger write volumes
or for datasets with higher [series cardinality](/influxdb/v1.8/concepts/glossary/#series-cardinality).
If you have lots of RAM you could set it to `0` to disable the cached memory
limit and never get this error.
You can also examine the `memBytes` field in the`cache` measurement in the
[`_internal` database](/influxdb/v1.8/administration/server_monitoring/#internal-monitoring)
to get a sense of how big the caches are in memory.

**Resources:**
[Database Configuration](/influxdb/v1.8/administration/config/)

## `already killed`

The `already killed` error occurs when a query has already been killed, but
there are subsequent kill attempts before the query has exited.
When a query is killed, it may not exit immediately.
It will be in the `killed` state, which means the signal has been sent, but the
query itself has not hit an interrupt point.

**Resources:**
[Query management](/influxdb/v1.0/troubleshooting/query_management/)

## Common `-import` errors

Find common errors that occur when importing data in the command line interface (CLI).

1. (Optional) Customize how to view `-import` errors and output by running any of the following commands:

  - Send errors and output to a new file: `influx -import -path={import-file}.gz -compressed {new-file} 2>&1`
  - Send errors and output to separate files: `influx -import -path={import-file}.gz -compressed > {output-file} 2> {error-file}`
  - Send errors to a new file: `influx -import -path={import-file}.gz -compressed 2> {new-file}`
  - Send output to a new file: `influx -import -path={import-file}.gz -compressed {new-file}`

2. Review import errors for possible causes to resolve:

  - [Inconsistent data types](#inconsistent-data-types)
  - [Data points older than retention policy](#data-points-older-than-retention-policy)
  - [Unnamed import file](#unnamed-import-file)
  - [Docker container cannot read host files](#docker-container-cannot-read-host-files)

  >**Note:** To learn how to use the `-import` command, see [Import data from a file with `-import`](/influxdb/v1.8/tools/shell/#import-data-from-a-file-with-import).

### Inconsistent data types

**Error:** `partial write: field type conflict:`

This error occurs when fields in an imported measurement have inconsistent data types. Make sure all fields in a measurement have the same data type, such as float64, int64, and so on.

### Data points older than retention policy

**Error:** `partial write: points beyond retention policy dropped={number-of-points-dropped}`

This error occurs when an imported data point is older than the specified retention policy and dropped. Verify the correct retention policy is specified in the import file.

### Unnamed import file

**Error:** `reading standard input: /path/to/directory: is a directory`

  This error occurs when the `-import` command doesn't include the name of an import file. Specify the file to import, for example: `$ influx -import -path={filename}.txt -precision=s`

### Docker container cannot read host files

**Error:** `open /path/to/file: no such file or directory`

This error occurs when the Docker container cannot read files on the host machine. To make host machine files readable, complete the following procedure.

#### Make host machine files readable to Docker

  1. Create a directory, and then copy files to import into InfluxDB to this directory.
  2. When you launch the Docker container, mount the new directory on the InfluxDB container by running the following command:

        docker run -v /dir/path/on/host:/dir/path/in/container

  3. Verify the Docker container can read host machine files by running the following command:

        influx -import -path=/path/in/container
