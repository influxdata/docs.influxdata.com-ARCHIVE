---
title: Database management
aliases:
  - /docs/v0.9/query_language/database_administration.html
  - /docs/v0.9/query_language/database_management.html
---

InfluxQL offers a full suite of administrative commands.

* [Data management](../query_language/database_management.html#data-management)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Create a database with `CREATE DATABASE`](../query_language/database_management.html#create-a-database-with-create-database)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Delete a database with `DROP DATABASE`](../query_language/database_management.html#delete-a-database-with-drop-database)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Delete series with `DROP SERIES`](../query_language/database_management.html#delete-series-with-drop-series)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Delete measurements with `DROP MEASUREMENT`](../query_language/database_management.html#delete-measurements-with-drop-measurement)  

* [Retention policy management](../query_language/database_management.html#retention-policy-management)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Create retention policies with `CREATE RETENTION POLICY`](../query_language/database_management.html#create-retention-policies-with-create-retention-policy)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Modify retention policies with `ALTER RETENTION POLICY`](../query_language/database_management.html#modify-retention-policies-with-alter-retention-policy)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Delete retention policies with `DROP RETENTION POLICY`](../query_language/database_management.html#delete-retention-policies-with-drop-retention-policy)  

The examples in the sections below use InfluxDB's [Command Line Interface (CLI)](../introduction/getting_started.html). You can also execute the commands using the HTTP API; simply  send a `GET` request to the `/query` endpoint and include the command in the URL parameter `q`. See the [Querying Data](../guides/querying_data.html) guide for more on using the HTTP API.

> **Note:** When authentication is enabled, only admin users can execute most of the commands listed on this page. See the documentation on [authentication and authorization](../administration/authentication_and_authorization.html) for more information.

## Data management

### Create a database with CREATE DATABASE
---
The `CREATE DATABASE` query takes the following form, where `IF NOT EXISTS` is optional:
```sql
CREATE DATABASE [IF NOT EXISTS] <database_name>
```

Create the database ` NOAA_water_database`:
```sh
> CREATE DATABASE NOAA_water_database
>
```

Create the database `NOAA_water_database` only if it doesn't exist:
```sh
> CREATE DATABASE IF NOT EXISTS NOAA_water_database
>
```

A successful `CREATE DATABASE` query returns an empty result.

### Delete a database with DROP DATABASE
---
The `DROP DATABASE` query deletes all of the data, measurements, series, continuous queries, and retention policies from the specified database. The query takes the following form:
```sql
DROP DATABASE <database_name>
```

CLI example:
```sh
> DROP DATABASE NOAA_water_database
>
```

A successful `DROP DATABASE` query returns an empty result.

### Delete series with DROP SERIES
---
The `DROP SERIES` query deletes all points from [series](../concepts/glossary.html#series) in a database. The query takes the following form, where you must specify either the `FROM` clause or the `WHERE` clause:
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

<dt> `DROP SERIES` does not support time intervals in the `WHERE` clause. See GitHub Issue [#1647](https://github.com/influxdb/influxdb/issues/1647) for more information).  </dt>

<dt>Currently, InfluxDB does not support regular expressions with `DROP SERIES`. See GitHub Issue [#4276](https://github.com/influxdb/influxdb/issues/4276) for more information. </dt>

### Delete measurements with DROP MEASUREMENT
---
The `DROP MEASUREMENT` query deletes all data and series from the specified [measurement](../concepts/glossary.html#measurement) and, unlike `DROP SERIES`, it also deletes the measurement from the index. The query takes the following form:
```sql
DROP MEASUREMENT <measurement_name>
```

Delete the measurement `h2o_feet`:
```sql
> DROP MEASUREMENT h2o_feet
```

> **Note:** `DROP MEASUREMENT` drops all data and series in the measurement. It does not drop the associated continuous queries.

A successful `DROP MEASUREMENT` query returns an empty result.

<dt> Currently, InfluxDB does not support regular expressions with `DROP MEASUREMENTS`. See GitHub Issue [#4275](https://github.com/influxdb/influxdb/issues/4275) for more information. </dt>

## Retention Policy Management
The following sections cover how to create, alter, and delete retention policies. Note that when you create a database, InfluxDB automatically creates a retention policy named `default` which has infinite retention. You may disable that auto-creation in the configuration file.

### Create retention policies with CREATE RETENTION POLICY
---
The `CREATE RETENTION POLICY` query takes the following form, where `DEFAULT` is optional:
```sql
CREATE RETENTION POLICY <retention_policy_name> ON <database_name> DURATION <duration> REPLICATION <n> [DEFAULT]
```

* `DURATION` determines how long InfluxDB keeps the data - the options for specifying the duration of the retention policy are listed below. Note that the minimum retention period is one hour.  
`m` minutes  
`h` hours  
`d` days  
`w` weeks  
`INF` infinite

    <dt> Currently, the `DURATION` attribute supports only single units. For example, you cannot express the duration `7230m` as `120h 30m`. See GitHub Issue [#3634](https://github.com/influxdb/influxdb/issues/3634) for more information. </dt>

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
```sh
> DROP RETENTION POLICY what_is_time ON NOAA_water_database
>
```

A successful `DROP RETENTION POLICY` query returns an empty result.

>**Note:** If you attempt `DROP` a retention policy that is the default retention policy for the database InfluxDB does not delete the policy and returns the error: `ERR: retention policy is default`. `CREATE` a new default policy or `ALTER` an already existing policy to be the default before deleting the retention policy.


