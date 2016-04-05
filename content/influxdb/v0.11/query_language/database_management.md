---
title: Database Management

menu:
  influxdb_011:
    weight: 20
    parent: query_language
---

InfluxQL offers a full suite of administrative commands.

* [Data management](/influxdb/v0.11/query_language/database_management/#data-management)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Create a database with `CREATE DATABASE`](/influxdb/v0.11/query_language/database_management/#create-a-database-with-create-database)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Delete a database with `DROP DATABASE`](/influxdb/v0.11/query_language/database_management/#delete-a-database-with-drop-database)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Delete series with `DROP SERIES`](/influxdb/v0.11/query_language/database_management/#delete-series-with-drop-series)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Delete measurements with `DROP MEASUREMENT`](/influxdb/v0.11/query_language/database_management/#delete-measurements-with-drop-measurement)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Delete a shard with `DROP SHARD`](/influxdb/v0.11/query_language/database_management/#delete-a-shard-with-drop-shard)

* [Retention policy management](/influxdb/v0.11/query_language/database_management/#retention-policy-management)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Create retention policies with `CREATE RETENTION POLICY`](/influxdb/v0.11/query_language/database_management/#create-retention-policies-with-create-retention-policy)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Modify retention policies with `ALTER RETENTION POLICY`](/influxdb/v0.11/query_language/database_management/#modify-retention-policies-with-alter-retention-policy)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Delete retention policies with `DROP RETENTION POLICY`](/influxdb/v0.11/query_language/database_management/#delete-retention-policies-with-drop-retention-policy)  

If you're looking for `SHOW` queries (for example, `SHOW DATABASES` or `SHOW RETENTION POLICIES`), see [Schema Exploration](/influxdb/v0.11/query_language/schema_exploration).

The examples in the sections below use InfluxDB's [Command Line Interface (CLI)](/influxdb/v0.11/introduction/getting_started/).
You can also execute the commands using the HTTP API; simply  send a `GET` request to the `/query` endpoint and include the command in the URL parameter `q`.
See the [Querying Data](/influxdb/v0.11/guides/querying_data/) guide for more on using the HTTP API.

> **Note:** When authentication is enabled, only admin users can execute most of the commands listed on this page.
See the documentation on [authentication and authorization](/influxdb/v0.11/administration/authentication_and_authorization/) for more information.

## Data Management

### Create a database with CREATE DATABASE
---
The `CREATE DATABASE` query takes the following form:
```sql
CREATE DATABASE [IF NOT EXISTS] <database_name> [WITH [DURATION <duration>] [REPLICATION <n>] [NAME <retention-policy-name>]]
```

> **Note:** The `IF NOT EXISTS` clause does nothing, is deprecated, and will be removed in InfluxDB version 0.12.
The `CREATE DATABASE` query will return successfully with no error when a new database is created or if the database already exists.

Create the database ` NOAA_water_database`:
```bash
> CREATE DATABASE NOAA_water_database
>
```

Create the database `NOAA_water_database` only if it doesn't exist:
```bash
> CREATE DATABASE IF NOT EXISTS NOAA_water_database
>
```

Create the database `NOAA_water_database` with a new retention policy called `liquid`:
```bash
> CREATE DATABASE NOAA_water_database WITH DURATION 3d REPLICATION 3 NAME liquid
>
```
When specifying a retention policy you can include one or more of the attributes `DURATION`, `REPLICATION`, and `NAME`.
For more on retention policies, see [Retention Policy Management](/influxdb/v0.11/query_language/database_management/#retention-policy-management)

A successful `CREATE DATABASE` query returns an empty result.

### Delete a database with DROP DATABASE
---
The `DROP DATABASE` query deletes all of the data, measurements, series, continuous queries, and retention policies from the specified database.
The query takes the following form:
```sql
DROP DATABASE [IF EXISTS] <database_name>
```

> **Note:** The `IF EXISTS` clause does nothing, is deprecated, and will be removed in InfluxDB version 0.12. The `DROP DATABASE` query will return successfully with no error when a new database is created or if the database already exists.

Drop the database NOAA_water_database:
```bash
> DROP DATABASE NOAA_water_database
>
```

A successful `DROP DATABASE` query returns an empty result.

### Delete series with DROP SERIES
---
The `DROP SERIES` query deletes all points from [series](/influxdb/v0.11/concepts/glossary/#series) in a database.
The query takes the following form, where you must specify either the `FROM` clause or the `WHERE` clause:
```sql
DROP SERIES FROM <measurement_name[,measurement_name]> WHERE <tag_key>='<tag_value>'
```

Delete all series from a single measurement:
```sql
> DROP SERIES FROM h2o_feet
```

Delete series that have a specific tag set from a single measurement:
```sql
> DROP SERIES FROM h2o_feet WHERE location = 'santa_monica'
```

Delete all points in the series that have a specific tag set from all measurements in the database:
```sql
> DROP SERIES WHERE location = 'santa_monica'
```

A successful `DROP SERIES` query returns an empty result.

<dt> `DROP SERIES` does not support time intervals in the `WHERE` clause.
See GitHub Issue [#1647](https://github.com/influxdb/influxdb/issues/1647) for more information).
</dt>

### Delete measurements with DROP MEASUREMENT
---
The `DROP MEASUREMENT` query deletes all data and series from the specified [measurement](/influxdb/v0.11/concepts/glossary/#measurement) and, unlike `DROP SERIES`, it also deletes the measurement from the index.
The query takes the following form:
```sql
DROP MEASUREMENT <measurement_name>
```

Delete the measurement `h2o_feet`:
```sql
> DROP MEASUREMENT h2o_feet
```

> **Note:** `DROP MEASUREMENT` drops all data and series in the measurement.
It does not drop the associated continuous queries.

A successful `DROP MEASUREMENT` query returns an empty result.

<dt> Currently, InfluxDB does not support regular expressions with `DROP MEASUREMENTS`.
See GitHub Issue [#4275](https://github.com/influxdb/influxdb/issues/4275) for more information.
</dt>

### Delete a shard with DROP SHARD
---
The `DROP SHARD` query deletes a shard. It also drops the shard from the
[metastore](/influxdb/v0.11/concepts/glossary/#metastore).
The query takes the following form:
```sql
DROP SHARD <shard_id_number>
```

Delete the shard with the id `1`:
```
> DROP SHARD 1
>
```

A successful `DROP SHARD` query returns an empty result.
InfluxDB does not return an error if you attempt to drop a shard that does not
exist.

## Retention Policy Management
The following sections cover how to create, alter, and delete retention policies.
Note that when you create a database, InfluxDB automatically creates a retention policy named `default` which has infinite retention.
You may disable that auto-creation in the configuration file.

### Create retention policies with CREATE RETENTION POLICY
---
The `CREATE RETENTION POLICY` query takes the following form, where `DEFAULT` is optional:
```sql
CREATE RETENTION POLICY <retention_policy_name> ON <database_name> DURATION <duration> REPLICATION <n> [DEFAULT]
```

* `DURATION` determines how long InfluxDB keeps the data - the options for specifying the duration of the retention policy are listed below.
Note that the minimum retention period is one hour.
`m` minutes  
`h` hours  
`d` days  
`w` weeks  
`INF` infinite

    <dt> Currently, the `DURATION` attribute supports only single units.
For example, you cannot express the duration `7230m` as `120h 30m`.
See GitHub Issue [#3634](https://github.com/influxdb/influxdb/issues/3634) for more information.
</dt>

* `REPLICATION` determines how many independent copies of each point are stored in the cluster, where `n` is the number of data nodes.

* `DEFAULT` sets the new retention policy as the default retention policy for the database.

Create a retention policy called `one_day_only` for the database `NOAA_water_database` with a one day duration and a replication factor of one:
```sql
> CREATE RETENTION POLICY one_day_only ON NOAA_water_database DURATION 1d REPLICATION 1
>
```

Create the same retention policy as the one in the example above, but set it as the default retention policy for the database.
```sql
> CREATE RETENTION POLICY one_day_only ON NOAA_water_database DURATION 1d REPLICATION 1 DEFAULT
>
```

A successful `CREATE RETENTION POLICY` query returns an empty response.

> **Note:** You can also specify a new retention policy in the `CREATE DATABASE` query.
See [Create a database with CREATE DATABASE](/influxdb/v0.11/query_language/database_management/#create-a-database-with-create-database).

### Modify retention policies with ALTER RETENTION POLICY
---
The `ALTER RETENTION POLICY` query takes the following form, where you must declare at least one of the retention policy attributes `DURATION`, `REPLICATION`, or `DEFAULT`:
```sql
ALTER RETENTION POLICY <retention_policy_name> ON <database_name> DURATION <duration> REPLICATION <n> [DEFAULT]
```

First, create the retention policy `what_is_time` with a `DURATION` of two days:
```sql
> CREATE RETENTION POLICY what_is_time ON NOAA_water_database DURATION 2d REPLICATION 1
>
```

Modify `what_is_time` to have a three week `DURATION` and make it the `DEFAULT` retention policy for `NOAA_water_database`.
```sql
> ALTER RETENTION POLICY what_is_time ON NOAA_water_database DURATION 3w DEFAULT
>
```
In the last example, `what_is_time` retains its original replication factor of 1.

A successful `ALTER RETENTION POLICY` query returns an empty result.

### Delete retention policies with DROP RETENTION POLICY
Delete all measurements and data in a specific retention policy with:
```sql
DROP RETENTION POLICY <retention_policy_name> ON <database_name>
```

Delete the retention policy `what_is_time` in the `NOAA_water_database` database:  
```bash
> DROP RETENTION POLICY what_is_time ON NOAA_water_database
>
```

A successful `DROP RETENTION POLICY` query returns an empty result.
