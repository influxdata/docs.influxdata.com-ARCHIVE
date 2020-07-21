---
title: sql.to() function
description: The `sql.to()` function writes data to a SQL database.
menu:
  flux_0_50:
    name: sql.to
    parent: SQL
    weight: 1
aliases:
  - /flux/v0.50/functions/sql/to/
---

The `sql.to()` function writes data to a SQL database.

_**Function type:** Output_

```js
import "sql"

sql.to(
  driverName: "mysql",
  dataSourceName: "username:password@tcp(localhost:3306)/dbname?param=value",
  table: "example_table"
)
```

## Parameters

### driverName
The driver used to connect to the SQL database.

_**Data type:** String_

The following drivers are available:

- mysql
- postgres

### dataSourceName
The connection string used to connect to the SQL database.
The string's form and structure depend on the [driver](#drivername) used.

_**Data type:** String_

##### Driver dataSourceName examples
```sh
# Postgres Driver
postgres://pqgotest:password@localhost/pqgotest?sslmode=verify-full

# MySQL Driver
username:password@tcp(localhost:3306)/dbname?param=value
```

### table
The destination table.

_**Data type:** String_

## Examples

### Write data to a MySQL database
```js
import "sql"

sql.to(
  driverName: "mysql",
  dataSourceName: "user:password@tcp(localhost:3306)/db",
  table: "example_table"
)
```

### Write data to a Postgres database
```js
import "sql"

sql.to(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  table: "example_table"
)
```
