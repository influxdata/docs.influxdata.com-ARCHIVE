---
title: Query Syntax
---

The InfluxDB Query Language (InfluxQL) syntax is a SQL-like query language tailored for querying ranges of time. This page explains the InfluxQL syntax. See the [specification](/docs/v0.9/query_language/spec.html) for a formal explanation of InfluxQL.

## Identifiers (Double-quoted)

Identifiers are user defined references to objects in the database. They are distinct from string literals, which are single quoted values. In InfluxQL, all of the following are all references with identifiers:

- usernames
- database names
- retention policy names
- measurement names
- tag keys
- field keys
- continuous queries

### Identifier Quoting Requirements

Identifiers can be either bare (no quotes) or wrapped in double-quotes. Bare (unquoted) identifiers are allowed for convenience and must meet all of the following rules,

- contain only `A-Z`, `a-z`, `0-9`, or `_`
- begin with `A-Z`, `a-z`, or `_`
- not match a [keyword](/docs/v0.9/query_language/spec.html#keywords).

All other identifiers must be wrapped in double-quotes (`"`). Double-quoted identifers may contain any unicode characters except for double quotes, new lines and backslashes, which must be backslash (`\`) escaped.

> **Tip:** Using double quoted identifiers is almost always recommended.

#### Bare Identifier Examples

```sql
SELECT * FROM first_measurement
SELECT * FROM FirstMeasurement
SELECT * FROM _1st_MEASUREMENT
```

#### Double-quoted Identifier Examples

```sql
SELECT * FROM "first measurement"
SELECT * FROM "1st_measurement"
SELECT * FROM "first.measurement"
SELECT * FROM "first-measurement"
SELECT * FROM "α-measurement"
```

## String Literals (Single-quoted)

String literals are values (like integers or booleans). In InfluxQL, all tag values are string literals, and any field values that are not integers, floats, or booleans are also strings. String literals are also used when checking equality with identifiers.

### String Literal Quoting Requirements

String literals must always be single-quoted (`'`). String literals may contain any unicode characters except for single quotes, new lines and backslashes, which must be backslash (`\`) escaped.

#### String Literal Examples

```sql
SELECT * FROM mydb WHERE tag_key='a string value'
SELECT * FROM mydb WHERE tag_key='a string\' value'
SHOW TAG KEYS WHERE tag_key = 'string value'
```

## Time Ranges

When querying you often want to limit the set of returned points to a particular time range. This is done with the `now()` function in conjunction with the set of possible time range descriptors.

### `now()` is Local 

`now()` is the Unix time of the server at the time the query is executed on that server. In a cluster, `now()` will come from the node that receives and processes the query, regardless of where the queried data resides. 

### Implicit Time Range Boundaries

If you do not supply a lower bound for the time range, InfluxDB will use epoch `0`, "1970-01-01T00:00:00Z", as the lower bound.

If you do not supply an upper bound for the time range, InfluxDB will use `now()` as the upper bound.

## Whitespace requirements

When using time ranges, you must put a space between any arithmetic operators and the time range parameters. You must not include any whitespace between the time range parameter and the unit supplied.

```sql
SELECT * FROM mydb WHERE time > now() - 1d
SELECT * FROM mydb WHERE time> now() - 1d
SELECT * FROM mydb WHERE time >now() - 1d
SELECT * FROM mydb WHERE time > now()- 1d
``` 
are all valid, but  

```sql
SELECT * FROM mydb WHERE time > now() -1d
SELECT * FROM mydb WHERE time > now() - 1 d
``` 
are not.

## CLI

Querying with the CLI requires nothing other than selecting a database and then typing in the direct query.

### Select Target Database

You should first set a target database for all queries. This will be passed along with each subsequent query until a new selection is made. The CLI command is `USE` and the syntax is `USE <database>`.

```sh
> use mydb
Using database mydb
```

All subsequent queries will run against the `mydb` database.

You do not need to select a target database. You may choose to explicitly name the database in each query:

```sh
> select * from mydb.myrp.mymeasurement
```

### Output Formats

The CLI can return the results in three formats, column, JSON, and CSV. The default is column. You can change the output settings with `format`. Run `help` from within the CLI for more information.

### Non-interactive Mode

The CLI can run queries in non-interactive mode and the output can be redirected as desired. Run `influx -help` from the command line for more information.

## HTTP

To query the database using HTTP, submit a GET request to the `/query` endpoint at port `8086`. Specify the desired query to run using the query string parameter `q=<query>`.

Successful queries will return a `204` HTTP Status Code. Queries will return a `400` for invalid syntax.

### Query String Parameters for Reads

- `q=<query>`
- `db=<database>`
- `u=<username>`, `p=<password>`
- `precision=[n,u,ms,s,m,h]`

### Database

If required, specify the desired target database in the query string using `db=<target_database>`. 

### Authentication

Use the `u=<user>` and `p=<password>` to pass the authentication details, if required. 

#### Query to Show All Databases

```sh
curl -G 'http://localhost:8086/query' --data-urlencode 'q=SHOW DATABASES'
```

#### Query to Show All Measurements

This query is against a particular database, so we must supply the `db=` parameter in the query string.

```sh
curl -G 'http://localhost:8086/query?db=mydb' --data-urlencode 'q=SHOW MEASUREMENTS'
```

```sh
curl -G 'http://localhost:8086/query' --data-urlencode 'db=mydb&q=SHOW MEASUREMENTS'
```

#### Query Against Non-defaults with Authentication 

```sh
curl -G 'http://localhost:8086/query' --data-urlencode 'db=mydb&rp=six_months' --data-urlencode 'u=root&p=123456' --data-urlencode 'q=select * from disk_free where time > now() - 2w group by time(2h)'
```

#### Declare Database and Retention Policy in InfluxQL

Rather than using the GET query string parameters you can specify the target database and/or retention policy directly in the InfluxQL query.

```sh
curl -G 'http://localhost:8086/query' --data-urlencode 'q=select * from mydb.myrp.disk_free'
```

If you want to specify the database but are using the default retention policy for that database, you can leave the retention policy undeclared:

```sh
curl -G 'http://localhost:8086/query' --data-urlencode 'q=select * from mydb..disk_free'
```

### Caveats

Use `--data-urlencode` for all parameters passed to `curl` when hitting the `/query` endpoint.

Some queries require a target database. You may specify that in the URL query string or directly in the InfluxQL query, or both. The InfluxQL query takes precedence over the GET query string parameter. 

Querying measurements or tags that contain double-quotes `"` can be difficult, since double-quotes are also the syntax for an identifier. It's possible to work around the limitations with regular expressions but it's not easy.

Avoid using Keywords as identifiers (database names, retention policy names, measurement names, tag keys, or field keys) whenever possible. Keywords in InfluxDB are referenced on the [InfluxQL Syntax](../query_language/spec.html) page. There is no need to quote or escape keywords in the write syntax. 

All values in InfluxDB are case-sensitive: `MyDB` != `mydb` != `MYDB`. The exception is Keywords, which are case-insensitive.
