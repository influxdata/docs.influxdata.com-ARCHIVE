---
title: sql.from() function
description: The `sql.from()` function retrieves data from a SQL data source.
menu:
  flux_0_x:
    name: sql.from
    parent: SQL
weight: 202
aliases:
  - /flux/v0.x/functions/sql/from/
---

The `sql.from()` function retrieves data from a SQL data source.

_**Function type:** Input_

```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  query:"SELECT * FROM TestTable"
)
```

## Parameters

### driverName
The driver used to connect to the SQL database.

_**Data type:** String_

The following drivers are available:

- mysql
- postgres
- sqlite3 – _Does not work with InfluxDB OSS, InfluxDB Enterprise, or InfluxDB Cloud.
  More information [below](#query-an-sqlite-database)._

### dataSourceName
The data source name (DSN) or connection string used to connect to the SQL database.
The string's form and structure depend on the [driver](#drivername) used.

_**Data type:** String_

##### Driver dataSourceName examples
```sh
# Postgres Driver DSN:
postgres://pqgotest:password@localhost/pqgotest?sslmode=verify-full

# MySQL Driver DSN:
username:password@tcp(localhost:3306)/dbname?param=value

# SQLite Driver DSN
file:/path/to/test.db?cache=shared&mode=ro
```

### query
The query to run against the SQL database.

_**Data type:** String_

## Examples

### Query a MySQL database
```js
import "sql"

sql.from(
 driverName: "mysql",
 dataSourceName: "user:password@tcp(localhost:3306)/db",
 query:"SELECT * FROM ExampleTable"
)
```

### Query a Postgres database
```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  query:"SELECT * FROM ExampleTable"
)
```

### Query an SQLite database

{{% warn %}}
**InfluxDB OSS** and **InfluxDB Cloud** do not have direct access to the local filesystem
and cannot query SQLite data sources.
Use the [Flux REPL](/flux/v0.x/guides/executing-queries#influx-cli-in-flux-mode) to query a SQLite data source
on your local filesystem.
{{% /warn %}}

```js
import "sql"
sql.from(
  driverName: "sqlite3",
  dataSourceName: "file:/path/to/test.db?cache=shared&mode=ro",
  query:"SELECT * FROM ExampleTable"
)
```
