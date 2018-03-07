---
title: Database management using InfluxQL

menu:
  influxdb_1_5:
    name: Data management
    weight: 40
    parent: query_language
---

InfluxQL offers a full suite of administrative commands.

<table style="width:100%">
  <tr>
    <td><b>Data Management:</b></td>
    <td><b>Retention Policy Management:</br></td>
  </tr>
  <tr>
    <td><a href="#create-database">CREATE DATABASE</a></td>
    <td><a href="#create-retention-policies-with-create-retention-policy">CREATE RETENTION POLICY</a></td>
  </tr>
  <tr>
    <td><a href="#delete-a-database-with-drop-database">DROP DATABASE</a></td>
    <td><a href="#modify-retention-policies-with-alter-retention-policy">ALTER RETENTION POLICY</a></td>
  </tr>
  <tr>
    <td><a href="#drop-series-from-the-index-with-drop-series">DROP SERIES</a></td>
    <td><a href="#delete-retention-policies-with-drop-retention-policy">DROP RETENTION POLICY</a></td>
  </tr>
  <tr>
    <td><a href="#delete-series-with-delete">DELETE</a></td>
    <td></td>
  </tr>
  <tr>
    <td><a href="#delete-measurements-with-drop-measurement">DROP MEASUREMENT</a></td>
    <td></td>
  </tr>
  <tr>
    <td><a href="#delete-a-shard-with-drop-shard">DROP SHARD</a></td>
    <td></td>
  </tr>
</table>

If you're looking for `SHOW` queries (for example, `SHOW DATABASES` or `SHOW RETENTION POLICIES`), see [Schema Exploration](/influxdb/v1.5/query_language/schema_exploration).

The examples in the sections below use InfluxDB's [Command Line Interface (CLI)](/influxdb/v1.5/introduction/getting_started/).
You can also execute the commands using the HTTP API; simply  send a `GET` request to the `/query` endpoint and include the command in the URL parameter `q`.
See the [Querying Data](/influxdb/v1.5/guides/querying_data/) guide for more on using the HTTP API.

> **Note:** When authentication is enabled, only admin users can execute most of the commands listed on this page.
See the documentation on [authentication and authorization](/influxdb/v1.5/query_language/authentication_and_authorization/) for more information.

## Data Management

### CREATE DATABASE

Creates a new database.

#### Syntax
```sql
CREATE DATABASE <database_name> [WITH [DURATION <duration>] [REPLICATION <n>] [SHARD DURATION <duration>] [NAME <retention-policy-name>]]
```

#### Description of Syntax

`CREATE DATABASE` requires a database [name](/influxdb/v1.5/troubleshooting/frequently-asked-questions/#what-words-and-characters-should-i-avoid-when-writing-data-to-influxdb).

The `WITH`, `DURATION`, `REPLICATION`, `SHARD DURATION`, and `NAME` clauses are optional and create a single [retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy-rp) associated with the created database.
If you do not specify one of the clauses after `WITH`, the relevant behavior defaults to the `autogen` retention policy settings.
The created retention policy automatically serves as the database's default retention policy.
For more information about those clauses, see [Retention Policy Management](/influxdb/v1.5/query_language/database_management/#retention-policy-management).

A successful `CREATE DATABASE` query returns an empty result.
If you attempt to create a database that already exists, InfluxDB does nothing and does not return an error.

#### Examples

##### Example 1: Create a database
<br>
```
> CREATE DATABASE "NOAA_water_database"
>
```

The query creates a database called `NOAA_water_database`.
[By default](/influxdb/v1.5/administration/config/#retention-autocreate-true), InfluxDB also creates the `autogen` retention policy and associates it with the `NOAA_water_database`.

##### Example 2: Create a database with a specific retention policy
<br>
```
> CREATE DATABASE "NOAA_water_database" WITH DURATION 3d REPLICATION 1 SHARD DURATION 1h NAME "liquid"
>
```

The query creates a database called `NOAA_water_database`.
It also creates a default retention policy for `NOAA_water_database` with a `DURATION` of three days, a [replication factor](/influxdb/v1.5/concepts/glossary/#replication-factor) of one, a [shard group](/influxdb/v1.5/concepts/glossary/#shard-group) duration of one hour, and with the name `liquid`.

### Delete a database with DROP DATABASE

The `DROP DATABASE` query deletes all of the data, measurements, series, continuous queries, and retention policies from the specified database.
The query takes the following form:
```sql
DROP DATABASE <database_name>
```

Drop the database NOAA_water_database:
```bash
> DROP DATABASE "NOAA_water_database"
>
```

A successful `DROP DATABASE` query returns an empty result.
If you attempt to drop a database that does not exist, InfluxDB does not return an error.

### Drop series from the index with DROP SERIES

The `DROP SERIES` query deletes all points from a [series](/influxdb/v1.5/concepts/glossary/#series) in a database,
and it drops the series from the index.

> **Note:** `DROP SERIES` does not support time intervals in the `WHERE` clause.
See
[`DELETE`](/influxdb/v1.5/query_language/database_management/#delete-series-with-delete)
for that functionality.

The query takes the following form, where you must specify either the `FROM` clause or the `WHERE` clause:
```sql
DROP SERIES FROM <measurement_name[,measurement_name]> WHERE <tag_key>='<tag_value>'
```

Drop all series from a single measurement:
```sql
> DROP SERIES FROM "h2o_feet"
```

Drop series with a specific tag pair from a single measurement:
```sql
> DROP SERIES FROM "h2o_feet" WHERE "location" = 'santa_monica'
```

Drop all points in the series that have a specific tag pair from all measurements in the database:
```sql
> DROP SERIES WHERE "location" = 'santa_monica'
```

A successful `DROP SERIES` query returns an empty result.

### Delete series with DELETE

The `DELETE` query deletes all points from a
[series](/influxdb/v1.5/concepts/glossary/#series) in a database.
Unlike
[`DROP SERIES`](/influxdb/v1.5/query_language/database_management/#drop-series-from-the-index-with-drop-series), it does not drop the series from the index and it supports time intervals
in the `WHERE` clause.

The query takes the following form where you must include either the `FROM`
clause or the `WHERE` clause, or both:

```
DELETE FROM <measurement_name> WHERE [<tag_key>='<tag_value>'] | [<time interval>]
```

Delete all data associated with the measurement `h2o_feet`:
```
> DELETE FROM "h2o_feet"
```

Delete all data associated with the measurement `h2o_quality` and where the tag `randtag` equals `3`:
```
> DELETE FROM "h2o_quality" WHERE "randtag" = '3'
```

Delete all data in the database that occur before January 01, 2016:
```
> DELETE WHERE time < '2016-01-01'
```

A successful `DELETE` query returns an empty result.

Things to note about `DELETE`:

* `DELETE` supports
[regular expressions](/influxdb/v1.5/query_language/data_exploration/#regular-expressions)
in the `FROM` clause when specifying measurement names and in the `WHERE` clause
when specifying tag values.
* `DELETE` does not support [fields](/influxdb/v1.5/concepts/glossary/#field) in the `WHERE` clause.
* If you need to delete points in the future, you must specify that time period as `DELETE SERIES` runs for `time < now()` by default. [Syntax](https://github.com/influxdata/influxdb/issues/8007)

### Delete measurements with DROP MEASUREMENT

The `DROP MEASUREMENT` query deletes all data and series from the specified [measurement](/influxdb/v1.5/concepts/glossary/#measurement) and deletes the
measurement from the index.

The query takes the following form:
```sql
DROP MEASUREMENT <measurement_name>
```

Delete the measurement `h2o_feet`:
```sql
> DROP MEASUREMENT "h2o_feet"
```

> **Note:** `DROP MEASUREMENT` drops all data and series in the measurement.
It does not drop the associated continuous queries.

A successful `DROP MEASUREMENT` query returns an empty result.

<dt> Currently, InfluxDB does not support regular expressions with `DROP MEASUREMENTS`.
See GitHub Issue [#4275](https://github.com/influxdb/influxdb/issues/4275) for more information.
</dt>

### Delete a shard with DROP SHARD

The `DROP SHARD` query deletes a shard. It also drops the shard from the
[metastore](/influxdb/v1.5/concepts/glossary/#metastore).
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
Note that when you create a database, InfluxDB automatically creates a retention policy named `autogen` which has infinite retention.
You may rename that retention policy or disable its auto-creation in the [configuration file](/influxdb/v1.5/administration/config/#meta).

### Create retention policies with CREATE RETENTION POLICY

#### Syntax
```
CREATE RETENTION POLICY <retention_policy_name> ON <database_name> DURATION <duration> REPLICATION <n> [SHARD DURATION <duration>] [DEFAULT]
```

#### Description of Syntax

##### `DURATION`
<br>
The `DURATION` clause determines how long InfluxDB keeps the data.
The `<duration>` is a [duration literal](/influxdb/v1.5/query_language/spec/#durations)
or `INF` (infinite).
The minimum duration for a retention policy is one hour and the maximum
duration is `INF`.

##### `REPLICATION`
<br>
The `REPLICATION` clause determines how many independent copies of each point
are stored in the [cluster](/influxdb/v1.5/high_availability/clusters/), where `n` is the number of data nodes.

<dt> Replication factors do not serve a purpose with single node instances.
</dt>

##### `SHARD DURATION`
<br>
The `SHARD DURATION` clause determines the time range covered by a [shard group](/influxdb/v1.5/concepts/glossary/#shard-group).
The `<duration>` is a [duration literal](/influxdb/v1.5/query_language/spec/#durations)
and does not support an `INF` (infinite) duration.
This setting is optional.
By default, the shard group duration is determined by the retention policy's
`DURATION`:

| Retention Policy's DURATION  | Shard Group Duration  |
|---|---|
| < 2 days  | 1 hour  |
| >= 2 days and <= 6 months  | 1 day  |
| > 6 months  | 7 days  |

The minimum allowable `SHARD GROUP DURATION` is `1h`.
If the `CREATE RETENTION POLICY` query attempts to set the `SHARD GROUP DURATION` to less than `1h` and greater than `0s`, InfluxDB automatically sets the `SHARD GROUP DURATION` to `1h`.
If the `CREATE RETENTION POLICY` query attempts to set the `SHARD GROUP DURATION` to `0s`, InfluxDB automatically sets the `SHARD GROUP DURATION` according to the default settings listed above.

See
[Shard Group Duration Management](/influxdb/v1.5/concepts/schema_and_data_layout/#shard-group-duration-management)
for recommended configurations.

##### `DEFAULT`
<br>
Sets the new retention policy as the default retention policy for the database.
This setting is optional.

#### Examples

##### Example 1: Create a retention policy
<br>
```
> CREATE RETENTION POLICY "one_day_only" ON "NOAA_water_database" DURATION 1d REPLICATION 1
>
```
The query creates a retention policy called `one_day_only` for the database
`NOAA_water_database` with a one day duration and a replication factor of one.

##### Example 2: Create a DEFAULT retention policy
<br>
```sql
> CREATE RETENTION POLICY "one_day_only" ON "NOAA_water_database" DURATION 23h60m REPLICATION 1 DEFAULT
>
```

The query creates the same retention policy as the one in the example above, but
sets it as the default retention policy for the database.

A successful `CREATE RETENTION POLICY` query returns an empty response.
If you attempt to create a retention policy identical to one that already exists, InfluxDB does not return an error.
If you attempt to create a retention policy with the same name as an existing retention policy but with differing attributes, InfluxDB returns an error.

> **Note:** You can also specify a new retention policy in the `CREATE DATABASE` query.
See [Create a database with CREATE DATABASE](/influxdb/v1.5/query_language/database_management/#create-a-database-with-create-database).

### Modify retention policies with ALTER RETENTION POLICY

The `ALTER RETENTION POLICY` query takes the following form, where you must declare at least one of the retention policy attributes `DURATION`, `REPLICATION`, `SHARD DURATION`, or `DEFAULT`:
```sql
ALTER RETENTION POLICY <retention_policy_name> ON <database_name> DURATION <duration> REPLICATION <n> SHARD DURATION <duration> DEFAULT
```

<dt> Replication factors do not serve a purpose with single node instances.
</dt>

First, create the retention policy `what_is_time` with a `DURATION` of two days:
```sql
> CREATE RETENTION POLICY "what_is_time" ON "NOAA_water_database" DURATION 2d REPLICATION 1
>
```

Modify `what_is_time` to have a three week `DURATION`, a 30 minute shard group duration, and  make it the `DEFAULT` retention policy for `NOAA_water_database`.
```sql
> ALTER RETENTION POLICY "what_is_time" ON "NOAA_water_database" DURATION 3w SHARD DURATION 30m DEFAULT
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
> DROP RETENTION POLICY "what_is_time" ON "NOAA_water_database"
>
```

A successful `DROP RETENTION POLICY` query returns an empty result.
If you attempt to drop a retention policy that does not exist, InfluxDB does not return an error.
