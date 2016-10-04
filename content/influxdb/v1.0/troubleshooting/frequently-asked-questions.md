---
title: Frequently Asked Questions
aliases:
  - /influxdb/v1.0/troubleshooting/frequently_encountered_issues/

menu:
  influxdb_1_0:
    weight: 0
    parent: troubleshooting
---

This page addresses frequent sources of confusion and places where InfluxDB behaves in an unexpected way relative to other database systems.
Where applicable, it links to outstanding issues on GitHub.

**Administration**  

* [Why is `CREATE USER` returning `error parsing query`?](#why-is-create-user-returning-error-parsing-query)
* [How do I include a single quote in a password?](#how-do-i-include-a-single-quote-in-a-password)  
* [How can I identify my version of InfluxDB?](#how-can-i-identify-my-version-of-influxdb)  
* [Why aren't data dropped after I've altered a retention policy?](#why-aren-t-data-dropped-after-i-ve-altered-a-retention-policy)

**Command Line Interface (CLI)**

* [How do I make InfluxDB’s CLI return human readable timestamps?](#how-do-i-make-influxdb-s-cli-return-human-readable-timestamps)  
* [How can a non-admin user `USE` a database in InfluxDB's CLI?](#how-can-a-non-admin-user-use-a-database-in-influxdb-s-cli)  
* [How do I write to a non-`DEFAULT` retention policy with InfluxDB's CLI?](#how-do-i-write-to-a-non-default-retention-policy-with-influxdb-s-cli)

**Data Types**

* [Why can't I query boolean field values?](#why-can-t-i-query-boolean-field-values)  
* [How does InfluxDB handle field type discrepancies across shards?](#how-does-influxdb-handle-field-type-discrepancies-across-shards)  
* [What are the minimum and maximum integers that InfluxDB can store?](#what-are-the-minimum-and-maximum-integers-that-influxdb-can-store)  
* [How can I tell what type of data are stored in a field?](#how-can-i-tell-what-type-of-data-are-stored-in-a-field)

**InfluxQL Functions**

* [How do I perform mathematical operations within a function?](#how-do-i-perform-mathematical-operations-within-a-function)  
* [Why does my query return epoch 0 as the timestamp?](#why-does-my-query-return-epoch-0-as-the-timestamp)   
* [Which InfluxQL functions support nesting?](#which-influxql-functions-support-nesting)

**Querying data**  

* [What determines the time intervals returned by `GROUP BY time()` queries?](#what-determines-the-time-intervals-returned-by-group-by-time-queries)  
* [Why don't my queries return timestamps that occur after `now()`?](#why-don-t-my-queries-return-timestamps-that-occur-after-now)  
* [Can I perform mathematical operations against timestamps?](#can-i-perform-mathematical-operations-against-timestamps)  
* [Why am I getting an `expected identifier error`?](#why-am-i-getting-an-expected-identifier-error)
* [Can I identify write precision from returned timestamps?](#can-i-identify-write-precision-from-returned-timestamps)  
* [When should I single quote and when should I double quote in queries?](#when-should-i-single-quote-and-when-should-i-double-quote-in-queries)  
* [Why am I missing data after creating a new `DEFAULT` retention policy?](#why-am-i-missing-data-after-creating-a-new-default-retention-policy)
* [Why is my query with a `WHERE OR` time clause returning empty results?](#why-is-my-query-with-a-where-or-time-clause-returning-empty-results)
* [Why does `fill(previous)` return empty results?](#why-does-fill-previous-return-empty-results)
* [Why are my `INTO` queries missing data?](#why-are-my-into-queries-missing-data)
* [How do I query data with an identical tag key and field key?](#how-do-i-query-data-with-an-identical-tag-key-and-field-key)
* [How do I query data across measurements?](#how-do-i-query-data-across-measurements)
* [Does the order of the timestamps matter?](#does-the-order-of-the-timestamps-matter)
* [How do I `SELECT` data with a tag that has no value?](#how-do-i-select-data-with-a-tag-that-has-no-value)

**Series and series cardinality**

* [How can I query for series cardinality?](#how-can-i-query-for-series-cardinality)  
* [Why does series cardinality matter?](#why-does-series-cardinality-matter)  
* [How can I remove series from the index?](#how-can-i-remove-series-from-the-index)

**Writing data**  

* [How do I write integer field values?](#how-do-i-write-integer-field-values)   
* [How does InfluxDB handle duplicate points?](#how-does-influxdb-handle-duplicate-points)  
* [What newline character does the HTTP API require?](#what-newline-character-does-the-http-api-require)
* [What words and characters should I avoid when writing data to InfluxDB?](#what-words-and-characters-should-i-avoid-when-writing-data-to-influxdb)  
* [When should I single quote and when should I double quote when writing data?](#when-should-i-single-quote-and-when-should-i-double-quote-when-writing-data)  
* [Does the precision of the timestamp matter?](#does-the-precision-of-the-timestamp-matter)


## Why is CREATE USER returning error parsing query?
In most cases, the query is missing single quotes around the password string.
The `CREATE USER <user> WITH PASSWORD '<password>'` query requires single quotation marks around the password string.
Note that you should not include the single quotes when authenticating requests.

## How do I include a single quote in a password?
Escape the single quote with a backslash (`\`) both when creating the password
and when authentication requests.

## How can I identify my version of InfluxDB?
There a number of ways to identify the version of InfluxDB that you're using:

* Check the return when you `curl` the `/ping` endpoint.
For example, if you're using 1.0.0 `curl -i 'http://localhost:8086/ping'` returns:  

`HTTP/1.1 204 No Content`  
`Request-Id: 874101f6-e23e-11e5-8097-000000000000`  
✨`X-Influxdb-Version: 1.0.0`✨  
`Date: Fri, 04 Mar 2016 19:23:08 GMT`

If authentication is enabled you will need to use `https` in the URL.

* Check the text that appears when you [launch](/influxdb/v1.0/tools/shell/) the CLI:

`Connected to http://localhost:8086`✨`version 1.0.0`✨  
`InfluxDB shell 1.0.0`

* Check the HTTP response in your logs:  

`[http] 2016/03/04 11:25:13 ::1 - - [04/Mar/2016:11:25:13 -0800] GET /query?db=&epoch=ns&q=show+databases HTTP/1.1 200 98 -`     ✨`InfluxDBShell/1.0.0`✨`d16e7a83-e23e-11e5-80a7-000000000000 529.543µs`

## Why aren't data dropped after I've altered a retention policy?
After [shortening](/influxdb/v1.0/query_language/database_management/#modify-retention-policies-with-alter-retention-policy) the `DURATION` of a [retention policy](/influxdb/v1.0/concepts/glossary/#retention-policy-rp) (RP), you may notice that InfluxDB keeps some data that are older than the `DURATION` of the modified RP.
This behavior is a result of the relationship between the time interval covered by a shard group and the `DURATION` of a retention policy.

InfluxDB stores data in shard groups.
A single shard group covers a specific time interval; InfluxDB determines that time interval by looking at the `DURATION` of the relevant RP.
The table below outlines the relationship between the `DURATION` of an RP and the time interval of a shard group:

| RP duration  | Shard group interval  |
|---|---|
| < 2 days  | 1 hour  |
| >= 2 days and <= 6 months  | 1 day  |
| > 6 months  | 7 days  |

If you shorten the `DURATION` of an RP and the shard group interval also shrinks, InfluxDB may be forced to keep data that are older than the new `DURATION`.
This happens because InfluxDB cannot divide the old, longer shard group into new, shorter shard groups; it must keep all of the data in the longer shard group even if only a small part of those data overlaps with the new `DURATION`.

*Example: Moving from an infinite RP to a three day RP*

Figure 1 shows the shard groups for our example database (`example_db`) after 11 days.
The database uses the automatically generated `autogen` retention policy with an infinite (`INF`) `DURATION` so each shard group interval is seven days.
On day 11, InfluxDB is no longer writing to `Shard Group 1` and `Shard Group 2` has four days worth of data:

> **Figure 1**
![Retention policy duration infinite](/img/influxdb/fei/alter-rp-inf.png)

On day 11, we notice that `example_db` is accruing data too fast; we want to delete, and keep deleting, all data older than three days.
We do this by [altering](/influxdb/v1.0/query_language/database_management/#modify-retention-policies-with-alter-retention-policy) the retention policy:
<br>
<br>
```
> ALTER RETENTION POLICY autogen ON example_db DURATION 3d
```

At the next [retention policy enforcement check](/influxdb/v1.0/administration/config/#retention), InfluxDB immediately drops `Shard Group 1` because all of its data are older than 3 days.
InfluxDB does not drop `Shard Group 2`.
This is because InfluxDB cannot divide existing shard groups and some data in `Shard Group 2` still fall within the new three day retention policy.

Figure 2 shows the shard groups for `example_db` five days after the retention policy change.
Notice that the new shard groups span one day intervals.
All of the data in `Shard Group 2` remain in the database because the shard group still has data within the retention policy's three day `DURATION`:

> **Figure 2**
![Retention policy duration three days](/img/influxdb/fei/alter-rp-3d.png)

After day 17, all data within the past 3 days will be in one day shard groups.
InfluxDB will then be able to drop `Shard Group 2` and `example_db` will have only 3 days worth of data.

> **Note:** The time it takes for InfluxDB to adjust to the new retention policy may be longer depending on your shard precreation configuration setting.
See [Database Configuration](/influxdb/v1.0/administration/config/#shard-precreation) for more on that setting.
See [Database Management](/influxdb/v1.0/query_language/database_management/#delete-a-shard-with-drop-shard) for how to delete a shard.

## How do I make InfluxDB’s CLI return human readable timestamps?

When you first connect to the CLI, specify the [rfc3339](https://www.ietf.org/rfc/rfc3339.txt) precision:

```
$ influx -precision rfc3339
```

Alternatively, specify the precision once you’ve already connected to the CLI:

```
$ influx
Connected to http://localhost:8086 version 0.xx.x
InfluxDB shell 0.xx.x
> precision rfc3339
>
```

Check out [CLI/Shell](/influxdb/v1.0/tools/shell/) for more useful CLI options.

## How can a non-admin user `USE` a database in InfluxDB's CLI?

Currently, non-admin users cannot execute a `USE <database>` query within the
CLI even if they have read and write permissions on that database:

```
> USE special_db
ERR: error authorizing query: <username> not authorized to execute statement 'SHOW DATABASES', requires admin privilege
```

The workaround is for the user to explicitly connect to the relevant database when launching the CLI:

```
> influx -username 'username' -password 'password' -database 'special_db'
```

All operations for the duration of that CLI session will go against the `special_db` database.

## How do I write to a non-DEFAULT retention policy with InfluxDB's CLI?

Use the syntax `INSERT INTO <retention_policy> <line_protocol>` to write data to a non-`DEFAULT` retention policy using the CLI.

For example:

```
> INSERT INTO one_day mortality bool=true
Using retention policy one_day
> SELECT * FROM "mydb"."one_day"."mortality"
name: mortality
---------------
time                             bool
2016-09-13T22:29:43.229530864Z   true
```

Note that you will need to fully qualify the measurement to query data in the non-`DEFAULT` retention policy. Fully qualify the measurement with the syntax:

```
"<database>"."<retention_policy>"."<measurement>"
```

## Why can't I query boolean field values?
Acceptable boolean syntax differs for data writes and data queries.

| Boolean syntax |  Writes | Queries  |
-----------------------|-----------|--------------|
|  `t`,`f` |	👍 | ❌ |
|  `T`,`F` |  👍 |  ❌ |
|  `true`,`false` | 👍  | 👍  |
|  `True`,`False` |  👍 |  👍 |
|  `TRUE`,`FALSE` |  👍 |  👍 |

For example, `SELECT * FROM "hamlet" WHERE "bool"=True` returns all points with `bool` set to `TRUE`, but `SELECT * FROM "hamlet" WHERE "bool"=T` returns nothing.

<dt> [GitHub Issue #3939](https://github.com/influxdb/influxdb/issues/3939) </dt>

## How does InfluxDB handle field type discrepancies across shards?

Field values can be floats, integers, strings, or booleans.
Field value types cannot differ within a
[shard](/influxdb/v1.0/concepts/glossary/#shard), but they can differ across
shards.

A `SELECT * FROM <measurement_name>` query returns all field values **if** all
values have the same type.
If field value types differ across shards, InfluxDB first performs any
applicable
[cast](/influxdb/v1.0/query_language/data_exploration/#cast-operations)
operations and then returns all values with the type that occurs first in the
following list: float, integer, string, boolean.

If your data have field value type discrepancies, use the syntax
`<field_key>::<type>` to query the different data types.

Example:

The measurement `just_my_type` has a single field called `my_field`.
`my_field` has four field values across four different shards, and each value has
a different data type (float, integer, string, and boolean).

`SELECT *` returns only the float and integer field values.
Note that InfluxDB casts the integer value to a float in the response.
```
SELECT * FROM just_my_type
name: just_my_type
------------------
time		                	my_field
2016-06-03T15:45:00Z	  9.87034
2016-06-03T16:45:00Z	  7
```

`SELECT <field_key>::<type> [...]` returns all value types.
InfluxDB outputs each value type in its own column with incremented column names.
Where possible, InfluxDB casts field values to another type;
it casts the integer `7` to a float in the first column, and it
casts the float `9.879034` to an integer in the second column.
InfluxDB cannot cast floats or integers to strings or booleans.
```
SELECT "my_field"::float,"my_field"::integer,"my_field"::string,"my_field"::boolean FROM just_my_type
name: just_my_type
------------------
time			               my_field	 my_field_1	 my_field_2		 my_field_3
2016-06-03T15:45:00Z	 9.87034	  9
2016-06-03T16:45:00Z	 7	        7
2016-06-03T17:45:00Z			                     a string
2016-06-03T18:45:00Z					                                true
```

## What are the minimum and maximum integers that InfluxDB can store?
InfluxDB stores all integers as signed int64 data types.
The minimum and maximum valid values for int64 are `-9023372036854775808` and `9023372036854775807`.
See [Go builtins](http://golang.org/pkg/builtin/#int64) for more information.

Values close to but within those limits may lead to unexpected results; some functions and operators convert the int64 data type to float64 during calculation which can cause overflow issues.


## How can I tell what type of data are stored in a field?

The [`SHOW FIELD KEYS`](/influxdb/v1.0/query_language/schema_exploration/#explore-field-keys-with-show-field-keys) query also returns the field's type.

#### Example

```
> SHOW FIELD KEYS FROM all_the_types
name: all_the_types
-------------------
fieldKey  fieldType
blue      string
green     boolean
orange    integer
yellow    float
```

## How do I perform mathematical operations within a function?

Currently, InfluxDB does not support mathematical operations within functions.
We recommend using InfluxQL's [`INTO` queries](/influxdb/v1.0/query_language/data_exploration/#the-into-clause)
as a workaround.

#### Example

Split the following invalid query into two steps:
```
SELECT mean("dogs" - "cats") from "pet_daycare"
```

First, calculate the difference between `dogs` and `cats` and write the results to the same measurement using an `INTO` query:
```
SELECT "dogs" - "cats" AS "diff" INTO "pet_daycare" FROM "pet_daycare"
```

Second, calculate the average of the new field (`diff`):
```
SELECT mean("diff") FROM "pet_daycare"
```

## Why does my query return epoch 0 as the timestamp?
In InfluxDB, epoch 0  (`1970-01-01T00:00:00Z`)  is often used as a null timestamp equivalent.
If you request a query that has no timestamp to return, such as an aggregation function with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.

## Which InfluxQL functions support nesting?

The following InfluxQL functions support nesting:

* [`count()` with `distinct()`](/influxdb/v1.0/query_language/functions/#distinct)
* [`derivative()`](/influxdb/v1.0/query_language/functions/#derivative)
* [`difference()`](/influxdb/v1.0/query_language/functions/#difference)
* [`moving_average()`](/influxdb/v1.0/query_language/functions/#moving-average)
* [`non_negative_derivative()`](/influxdb/v1.0/query_language/functions/#non-negative-derivative)
* [`holt_winters()`](/influxdb/v1.0/query_language/functions/#holt-winters)

See
[Continuous Queries](/influxdb/v1.0/query_language/continuous_queries/#continuous-query-use-cases)
for how to use InfluxDB's CQs as a substitute for nested functions.

## What determines the time intervals returned by `GROUP BY time()` queries?

The time intervals returned by `GROUP BY time()` queries conform to InfluxDB's preset time
buckets or to the user-specified [offset interval](/influxdb/v1.0/query_language/data_exploration/#configured-group-by-time-boundaries).

#### Example

##### Preset time buckets:
<br>
The following query calculates the average value of `sunflowers` between
6:15pm and 7:45pm and groups those averages into one hour intervals:
```
SELECT mean("sunflowers")
FROM "flower_orders"
WHERE time >= '2016-08-29T18:15:00Z' AND time <= '2016-08-29T19:45:00Z' GROUP BY time(1h)
```
The results below show how InfluxDB maintains its preset time buckets.

In this example, the 6pm hour is a preset bucket and the 7pm hour is a preset bucket.
The average for the 6pm time bucket does not include data prior to 6:15pm because of the `WHERE` time clause,
but any data included in the average for the 6pm time bucket must occur in the 6pm hour.
The same goes for the 7pm time bucket; any data included in the average for the 7pm
time bucket must occur in the 7pm hour.
The dotted lines show the points that make up each average.

Note that while the first timestamp in the results is `2016-08-29T18:00:00Z`,
that time bucket does **not** include data with timestamps that occur before the start of the
`WHERE` time clause (`2016-08-29T18:15:00Z`).

Raw data:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Results:                
```
name: flower_orders                                name: flower_orders
—————————                                          -------------------
time                    sunflowers                 time                  mean
2016-08-29T18:00:00Z    34                         2016-08-29T18:00:00Z  22.332
                       |--|                        2016-08-29T19:00:00Z  62.75
2016-08-29T18:15:00Z   |28|
2016-08-29T18:30:00Z   |19|                    
2016-08-29T18:45:00Z   |20|
                       |--|
                       |--|
2016-08-29T19:00:00Z   |56|
2016-08-29T19:15:00Z   |76|
2016-08-29T19:30:00Z   |29|
2016-08-29T19:45:00Z   |90|
                       |--|
2016-08-29T20:00:00Z    70

```

##### Offset interval
<br>
The following query calculates the average value of `sunflowers` between
6:15pm and 7:45pm and groups those averages into one hour intervals.
It also offsets InfluxDB's preset time buckets by `15` minutes.
```
SELECT mean("sunflowers")
FROM "flower_orders"
WHERE time >= '2016-08-29T18:15:00Z' AND time <= '2016-08-29T19:45:00Z' GROUP BY time(1h,15m)
                                                                                         ---
                                                                                          |
                                                                                   offset interval
```

In this example, the user-specified
[offset interval](/influxdb/v1.0/query_language/data_exploration/#configured-group-by-time-boundaries)
shifts InfluxDB's preset time buckets forward by `15` minutes.
The average for the 6pm time bucket now includes data between 6:15pm and 7pm, and
the average for the 7pm time bucket includes data between 7:15pm and 8pm.
The dotted lines show the points that make up each average.

Note that the first timestamp in the result is `2016-08-29T18:15:00Z`
instead of `2016-08-29T18:00:00Z`.

Raw data:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Results:  
```
name: flower_orders                                name: flower_orders
—————————                                          -------------------
time                    sunflowers                 time                  mean
2016-08-29T18:00:00Z    34                         2016-08-29T18:15:00Z  30.75
                       |--|                        2016-08-29T19:15:00Z  65
2016-08-29T18:15:00Z   |28|
2016-08-29T18:30:00Z   |19|
2016-08-29T18:45:00Z   |20|
2016-08-29T19:00:00Z   |56|
                       |--|
                       |--|
2016-08-29T19:15:00Z   |76|
2016-08-29T19:30:00Z   |29|
2016-08-29T19:45:00Z   |90|
2016-08-29T20:00:00Z   |70|
                       |--|
```

## Why don't my queries return timestamps that occur after now()?
By default, InfluxDB uses `now()` (the current nanosecond timestamp of the node that is processing the query) as the upper bound in queries.
You must provide explicit directions in the `WHERE` clause to query points that occur after `now()`.

The first query below asks InfluxDB to return everything from `hillvalley` that occurs between epoch 0 (`1970-01-01T00:00:00Z`) and `now()`.
The second query asks InfluxDB to return everything from `hillvalley` that occurs between epoch 0 and 1,000 days from `now()`.

`SELECT * FROM "hillvalley"`  
`SELECT * FROM "hillvalley" WHERE time < now() + 1000d`

It is required that the default upper bound be explicitly replaced.
A query that resets the lower bound without changing the upper bound will not return any points after `now()`.
For example:

`SELECT * FROM "hillvalley" WHERE time > now()`

resets the lower bound of the query from `epoch=0` to `> now()`.
However, the default upper bound for the query is still `now()`.
Internally, the query expands to

`SELECT * FROM "hillvalley" WHERE time > now() AND time < now()`

which cannot match any points.

## Can I perform mathematical operations against timestamps?
Currently, it is not possible to execute mathematical operators against timestamp values in InfluxDB.
Most time calculations must be carried out by the client receiving the query results.

There is limited support for using InfluxQL functions against timestamp values.
The function [ELAPSED()](/influxdb/v1.0/query_language/functions/#elapsed)
returns the difference between subsequent timestamps in a single field.

## Why am I getting an `expected identifier error`?
Receiving the error `ERR: error parsing query: found [WORD], expected identifier[, string, number, bool]` is often a gentle reminder that you forgot to include something in your query, as is the case in the following examples:

* `SELECT FROM "logic" WHERE "rational" = 5` should be `SELECT "something" FROM "logic" WHERE "rational" = 5`  
* `SELECT * FROM WHERE "rational" = 5` should be `SELECT * FROM "logic" WHERE "rational" = 5`

In other cases, your query seems complete but you receive the same error:

* `SELECT field FROM why`  
* `SELECT * FROM why WHERE tag = '1'`  
* `SELECT * FROM grant WHERE why = 9`

In the last three queries, and in most unexpected `expected identifier` errors, at least one of the identifiers in the query is an InfluxQL keyword.
Identifiers are database names, retention policy names, user names, measurement names, tag keys, and field keys.
To successfully query data that use a keyword as an identifier enclose that identifier in double quotes, so the examples above become:

* `SELECT "field" FROM why`  
* `SELECT * FROM why WHERE "tag" = '1'`  
* `SELECT * FROM "grant" WHERE why = 9`

While using double quotes is an acceptable workaround, we recommend that you avoid using InfluxQL keywords as identifiers for simplicity's sake.
The InfluxQL documentation has a comprehensive list of all [InfluxQL keywords](https://github.com/influxdb/influxdb/blob/master/influxql/README.md#keywords).

## Can I identify write precision from returned timestamps?
InfluxDB stores all timestamps as nanosecond values regardless of the write precision supplied.
It is important to note that when returning query results, the database silently drops trailing zeros from timestamps which obscures the initial write precision.

In the example below, the tags `precision_supplied` and `timestamp_supplied` show the time precision and timestamp that the user provided at the write.
Because InfluxDB silently drops trailing zeros on returned timestamps, the write precision is not recognizable in the returned timestamps.
<br>
```bash
name: trails
-------------
time                  value	 precision_supplied  timestamp_supplied
1970-01-01T01:00:00Z  3      n                   3600000000000
1970-01-01T01:00:00Z  5      h                   1
1970-01-01T02:00:00Z  4      n                   7200000000000
1970-01-01T02:00:00Z  6      h                   2
```

<dt> [GitHub Issue #2977](https://github.com/influxdb/influxdb/issues/2977) </dt>

## When should I single quote and when should I double quote in queries?
Single quote string values (for example, tag values) but do not single quote identifiers (database names, retention policy names, user names, measurement names, tag keys, and field keys).

Double quote identifiers if they start with a digit, contain characters other than `[A-z,0-9,_]`, or if they are an [InfluxQL keyword](https://github.com/influxdb/influxdb/blob/master/influxql/README.md#keywords).
Double quotes are not required for identifiers if they don't fall into one of
those categories but we recommend double quoting them anyway.

Examples:

Yes: `SELECT bikes_available FROM bikes WHERE station_id='9'`

Yes: `SELECT "bikes_available" FROM "bikes" WHERE "station_id"='9'`

Yes: `SELECT * from "cr@zy" where "p^e"='2'`

No: `SELECT 'bikes_available' FROM 'bikes' WHERE 'station_id'="9"`

No: `SELECT * from cr@zy where p^e='2'`

Single quote date time strings. InfluxDB returns an error (`ERR: invalid
operation: time and *influxql.VarRef are not compatible`) if you double quote
a date time string.

Examples:

Yes: `SELECT "water_level" FROM "h2o_feet" WHERE time > '2015-08-18T23:00:01.232000000Z' AND time < '2015-09-19'`

No: `SELECT "water_level" FROM "h2o_feet" WHERE time > "2015-08-18T23:00:01.232000000Z" AND time < "2015-09-19"`

See [Data Exploration](/influxdb/v1.0/query_language/data_exploration/#time-syntax-in-queries) for more on time syntax in queries.

## Why am I missing data after creating a new DEFAULT retention policy?
When you create a new `DEFAULT` retention policy (RP) on a database, the data written to the old `DEFAULT` RP remain in the old RP.
Queries that do not specify an RP automatically query the new `DEFAULT` RP so the old data may appear to be missing.
To query the old data you must fully qualify the relevant data in the query.

Example:

All of the data in the measurement `fleeting` fall under the `DEFAULT` RP called `one_hour`:
```bash
> SELECT count(flounders) FROM fleeting
name: fleeting
--------------
time			               count
1970-01-01T00:00:00Z	 8
```
We [create](/influxdb/v1.0/query_language/database_management/#create-retention-policies-with-create-retention-policy) a new `DEFAULT` RP (`two_hour`) and perform the same query:
```bash
> SELECT count(flounders) FROM fleeting
>
```
To query the old data, we must specify the old `DEFAULT` RP by fully qualifying `fleeting`:
```bash
> SELECT count(flounders) FROM fish.one_hour.fleeting
name: fleeting
--------------
time			               count
1970-01-01T00:00:00Z	 8
```

## Why is my query with a `WHERE OR` time clause returning empty results?

Currently, InfluxDB does not support using `OR` with
[absolute time](/influxdb/v1.0/query_language/data_exploration/#absolute-time)
in the `WHERE` clause.
InfluxDB returns an empty response if the query's `WHERE` clause uses `OR`
with absolute time.

Example:
```
> SELECT * FROM "absolutismus" WHERE time = '2016-07-31T20:07:00Z' OR time = '2016-07-31T23:07:17Z'
>
```

<dt> [GitHub Issue #3290](https://github.com/influxdata/influxdb/issues/3290)
</dt>

## Why does `fill(previous)` return empty results?

`fill(previous)` doesn't fill the result for a time bucket if the previous value is outside the query's time range.

In the following example, InfluxDB doesn't fill the `2016-07-12T16:50:20Z`-`2016-07-12T16:50:30Z` time bucket with the results from the `2016-07-12T16:50:00Z`-`2016-07-12T16:50:10Z` time bucket because the query’s time range does not include the earlier time bucket.

Raw data:
```
> SELECT * FROM "cupcakes"
name: cupcakes
--------------
time                   chocolate
2016-07-12T16:50:00Z   3
2016-07-12T16:50:10Z   2
2016-07-12T16:50:40Z   12
2016-07-12T16:50:50Z   11
```

`GROUP BY time()` query:
```
> SELECT max("chocolate") FROM "cupcakes" WHERE time >= '2016-07-12T16:50:20Z' AND time <= '2016-07-12T16:51:10Z' GROUP BY time(20s) fill(previous)
name: cupcakes
--------------
time                   max
2016-07-12T16:50:20Z
2016-07-12T16:50:40Z   12
2016-07-12T16:51:00Z   12
```

While this is the expected behavior of `fill(previous)`, an [open feature request](https://github.com/influxdata/influxdb/issues/6878) on GitHub proposes that `fill(previous)` should fill results even when previous values fall outside the query’s time range.


## Why are my INTO queries missing data?

By default, `INTO` queries convert any tags in the initial data to fields in
the newly written data.
This can cause InfluxDB to overwrite [points](/influxdb/v1.0/concepts/glossary/#point) that were previously differentiated by a tag.
Include `GROUP BY *` in all `INTO` queries to preserve tags in the newly written data.

#### Example

##### Initial data
<br>
The `french_bulldogs` measurement includes the `color` tag and the `name` field.
```
> SELECT * FROM "french_bulldogs"
name: french_bulldogs
---------------------
time                  color  name
2016-05-25T00:05:00Z  peach  nugget
2016-05-25T00:05:00Z  grey   rumple
2016-05-25T00:10:00Z  black  prince
```

##### `INTO` query without `GROUP BY *`
<br>
An `INTO` query without a `GROUP BY *` clause turns the `color` tag into
a field in the newly written data.
In the initial data the `nugget` point and the `rumple` points are differentiated only by the `color` tag.
Once `color` becomes a field, InfluxDB assumes that the `nugget` point and the
`rumple` point are duplicate points and it overwrites the `nugget` point with
the `rumple` point.

```
> SELECT * INTO "all_dogs" FROM "french_bulldogs"
name: result
------------
time                  written
1970-01-01T00:00:00Z  3

> SELECT * FROM "all_dogs"
name: all_dogs
--------------
time                  color  name
2016-05-25T00:05:00Z  grey   rumple                <---- no more nugget 🐶
2016-05-25T00:10:00Z  black  prince
```

##### `INTO` query with `GROUP BY *`
<br>
An `INTO` query with a `GROUP BY *` clause preserves `color` as a tag in the newly written data.
In this case, the `nugget` point and the `rumple` point remain unique points and InfluxDB does not overwrite any data.

```
> SELECT "name" INTO "all_dogs" FROM "french_bulldogs" GROUP BY *
name: result
------------
time                  written
1970-01-01T00:00:00Z  3

> SELECT * FROM "all_dogs"
name: all_dogs
--------------
time                  color  name
2016-05-25T00:05:00Z  peach  nugget
2016-05-25T00:05:00Z  grey   rumple
2016-05-25T00:10:00Z  black  prince
```

## How do I query data with an identical tag key and field key?

Use the `::` syntax to specify if the key is a field key or tag key.

#### Examples

##### Sample data:
<br>
```
> INSERT candied,almonds=true almonds=50,half_almonds=51 1465317610000000000
> INSERT candied,almonds=true almonds=55,half_almonds=56 1465317620000000000

> SELECT * FROM "candied"
name: candied
-------------
time                   almonds  almonds_1  half_almonds
2016-06-07T16:40:10Z   50       true       51
2016-06-07T16:40:20Z   55       true       56
```

##### Specify that the key is a field:
<br>
```
> SELECT * FROM "candied" WHERE "almonds"::field > 51
name: candied
-------------
time                   almonds  almonds_1  half_almonds
2016-06-07T16:40:20Z   55       true       56
```

##### Specify that the key is a tag:
<br>
```
> SELECT * FROM "candied" WHERE "almonds"::tag='true'
name: candied
-------------
time                   almonds  almonds_1  half_almonds
2016-06-07T16:40:10Z   50       true       51
2016-06-07T16:40:20Z   55       true       56
```

## How do I query data across measurements?

Currently, there is no way to perform cross-measurement math or grouping.
All data must be under a single measurement to query it together.  InfluxDB is not a relational database and mapping data across measurements is not a great [schema](/influxdb/v1.0/concepts/glossary/#schema).

## Does the order of the timestamps matter?

No.
Our tests indicate that there is a only a negligible difference between the times
it takes InfluxDB to complete the following queries:

```
SELECT ... FROM ... WHERE time > 'timestamp1' AND time < 'timestamp2'
SELECT ... FROM ... WHERE time < 'timestamp2' AND time > 'timestamp1'
```

## How do I SELECT data with a tag that has no value?

Specify an empty tag value with `''`. For example:

```
> SELECT * FROM "vases" WHERE priceless=''
name: vases
-----------
time                   origin   priceless
2016-07-20T18:42:00Z   8
```

## How can I query for series cardinality?

The following queries return [series cardinality](/influxdb/v1.0/concepts/glossary/#series-cardinality):

#### Series cardinality per database:
```
SELECT numSeries FROM "_internal".."database" GROUP BY "database" ORDER BY desc LIMIT 1
```
#### Series cardinality across all database:
```
SELECT sum(numSeries) AS “total_series" FROM “_internal".."database" WHERE time > now() - 10s
```

> **Note:** Changes to the [`[monitor]`](/influxdb/v1.0/administration/config/#monitor)
section in the configuration file may affect query results.

## Why does series cardinality matter?

InfluxDB maintains an in-memory index of every [series](/influxdb/v1.0/concepts/glossary/#series) in the system. As the number of unique series grows, so does the RAM usage. High [series cardinality](/influxdb/v1.0/concepts/glossary/#series-cardinality) can lead to the operating system killing the InfluxDB process with an out of memory (OOM) exception. See [Querying for series cardinality](#querying-for-series-cardinality) to learn how to query for series cardinality.

## How can I remove series from the index?

To reduce series cardinality, series must be dropped from the index.
[`DROP DATABASE`](/influxdb/v1.0/query_language/database_management/#delete-a-database-with-drop-database),
[`DROP MEASUREMENT`](/influxdb/v1.0/query_language/database_management/#delete-measurements-with-drop-measurement), and
[`DROP SERIES`](/influxdb/v1.0/query_language/database_management/#drop-series-from-the-index-with-drop-series) will all remove series from the index and reduce the overall series cardinality.

> **Note:** `DROP` commands are usually CPU-intensive, as they frequently trigger a TSM compaction. Issuing `DROP` queries at a high frequency may significantly impact write and other query throughput.

## How do I write integer field values?
Add a trailing `i` to the end of the field value when writing an integer.
If you do not provide the `i`, InfluxDB will treat the field value as a float.

Writes an integer: `value=100i`  
Writes a float: `value=100`

## How does InfluxDB handle duplicate points?
A point is uniquely identified by the measurement name, [tag set](/influxdb/v1.0/concepts/glossary/#tag-set), and timestamp.
If you submit a new point with the same measurement, tag set, and timestamp as an existing point, the field set becomes the union of the old field set and the new field set, where any ties go to the new field set.
This is the intended behavior.

For example:

Old point: `cpu_load,hostname=server02,az=us_west val_1=24.5,val_2=7 1234567890000000`

New point: `cpu_load,hostname=server02,az=us_west val_1=5.24 1234567890000000`

After you submit the new point, InfluxDB overwrites `val_1` with the new field value and leaves the field `val_2` alone:
```
> SELECT * FROM "cpu_load" WHERE time = 1234567890000000
name: cpu_load
--------------
time                      az        hostname   val_1   val_2
1970-01-15T06:56:07.89Z   us_west   server02   5.24    7
```

To store both points:

* Introduce an arbitrary new tag to enforce uniqueness.

    Old point: `cpu_load,hostname=server02,az=us_west,uniq=1 val_1=24.5,val_2=7 1234567890000000`

    New point: `cpu_load,hostname=server02,az=us_west,uniq=2 val_1=5.24 1234567890000000`

    After writing the new point to InfluxDB:

```
> SELECT * FROM "cpu_load" WHERE time = 1234567890000000
name: cpu_load
--------------
time                      az        hostname   uniq   val_1   val_2
1970-01-15T06:56:07.89Z   us_west   server02   1      24.5    7
1970-01-15T06:56:07.89Z   us_west   server02   2      5.24
```

* Increment the timestamp by a nanosecond.

    Old point: `cpu_load,hostname=server02,az=us_west val_1=24.5,val_2=7 1234567890000000`

    New point: `cpu_load,hostname=server02,az=us_west val_1=5.24 1234567890000001`

    After writing the new point to InfluxDB:

```
> SELECT * FROM "cpu_load" WHERE time >= 1234567890000000 and time <= 1234567890000001
name: cpu_load
--------------
time                             az        hostname   val_1   val_2
1970-01-15T06:56:07.89Z          us_west   server02   24.5    7
1970-01-15T06:56:07.890000001Z   us_west   server02   5.24
```    

## What newline character does the HTTP API require?
InfluxDB's line protocol relies on line feed (`\n`, which is ASCII `0x0A`) to indicate the end of a line and the beginning of a new line. Files or data that use a newline character other than `\n` will result in the following errors: `bad timestamp`, `unable to parse`.

Note that Windows uses carriage return and line feed (`\r\n`) as the newline character.

## What words and characters should I avoid when writing data to InfluxDB?
If you use any of the [InfluxQL keywords](https://github.com/influxdb/influxdb/blob/master/influxql/README.md#keywords) as an identifier you will need to double quote that identifier in every query.
This can lead to [non-intuitive errors](#why-am-i-getting-an-expected-identifier-error).
Identifiers are database names, retention policy names, user names, measurement names, tag keys, and field keys.

To keep regular expressions and quoting simple, avoid using the following characters in identifiers:  

`\` backslash   
 `^` circumflex accent  
 `$` dollar sign  
 `'` single quotation mark  
 `"` double quotation mark  
 `,` comma

## When should I single quote and when should I double quote when writing data?
* Avoid single quoting and double quoting identifiers when writing data via the line protocol; see the examples below for how writing identifiers with quotes can complicate queries.
Identifiers are database names, retention policy names, user names, measurement names, tag keys, and field keys.
<br>
<br>
	Write with a double-quoted measurement: `INSERT "bikes" bikes_available=3`  
	Applicable query: `SELECT * FROM "\"bikes\""`
<br>
<br>
	Write with a single-quoted measurement: `INSERT 'bikes' bikes_available=3`  
	Applicable query: `SELECT * FROM "\'bikes\'"`
<br>
<br>
	Write with an unquoted measurement: `INSERT bikes bikes_available=3`  
	Applicable query: `SELECT * FROM "bikes"`
<br>
<br>
* Double quote field values that are strings.
<br>
<br>
	Write: `INSERT bikes happiness="level 2"`  
	Applicable query: `SELECT * FROM "bikes" WHERE "happiness"='level 2'`
<br>
<br>
* Special characters should be escaped with a backslash and not placed in quotes.
<br>
<br>
	Write: `INSERT wacky va\"ue=4`  
	Applicable query: `SELECT "va\"ue" FROM "wacky"`

See the [Line Protocol](/influxdb/v1.0/write_protocols/) documentation for more information.


## Does the precision of the timestamp matter?

Yes.
To maximize performance we recommend using the coarsest possible timestamp precision when writing data to InfluxDB.

For example, we recommend using the second of the following two requests:
```
curl -i -XPOST "http://localhost:8086/write?db=weather" --data-binary 'temperature,location=1 value=90 1472666050000000000'

curl -i -XPOST "http://localhost:8086/write?db=weather&precision=s" --data-binary 'temperature,location=1 value=90 1472666050'
```
