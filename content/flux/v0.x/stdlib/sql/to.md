---
title: sql.to() function
description: The `sql.to()` function writes data to a SQL database.
menu:
  flux_0_x:
    name: sql.to
    parent: SQL
    weight: 1
aliases:
  - /flux/v0.x/functions/sql/to/
---

The `sql.to()` function writes data to a SQL database.

_**Function type:** Output_

```js
import "sql"

sql.to(
  driverName: "mysql",
  dataSourceName: "username:password@tcp(localhost:3306)/dbname?param=value",
  table: "ExampleTable",
  batchSize: 10000
)
```

## Parameters

### driverName
The driver used to connect to the SQL database.

_**Data type:** String_

The following drivers are available:

- mysql
- postgres
- sqlite3

### dataSourceName
The data source name (DSN) or connection string used to connect to the SQL database.
The string's form and structure depend on the [driver](#drivername) used.

_**Data type:** String_

##### Driver dataSourceName examples
```sh
# Postgres Driver DSN
postgres://pqgotest:password@localhost/pqgotest?sslmode=verify-full

# MySQL Driver DSN
username:password@tcp(localhost:3306)/dbname?param=value

# SQLite Driver DSN
file:test.db?cache=shared&mode=memory
```

### table
The destination table.

_**Data type:** String_

### batchSize
The number of parameters or columns that can be queued within each call to `Exec`.
Defaults to `10000`.

_**Data type:** Integer_

{{% note %}}
If writing to a **SQLite** database, set `batchSize` to `999` or less.
{{% /note %}}

## Examples

### Write data to a MySQL database
```js
import "sql"

sql.to(
  driverName: "mysql",
  dataSourceName: "user:password@tcp(localhost:3306)/db",
  table: "ExampleTable"
)
```

### Write data to a Postgres database
```js
import "sql"

sql.to(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  table: "ExampleTable"
)
```

### Write data to an SQLite database
```js
import "sql"
sql.to(
  driverName: "sqlite3",
  dataSourceName: "file:test.db?cache=shared&mode=memory",
  table: "ExampleTable"
)
```
