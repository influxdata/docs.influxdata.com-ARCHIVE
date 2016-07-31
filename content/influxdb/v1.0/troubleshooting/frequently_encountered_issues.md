---
title: Frequently Encountered Issues

menu:
  influxdb_1_0:
    weight: 0
    parent: troubleshooting
---

This page addresses frequent sources of confusion and places where InfluxDB behaves in an unexpected way relative to other database systems.
Where applicable, it links to outstanding issues on GitHub.

**Querying data**  

* [Understanding the time intervals returned from `GROUP BY time()` queries](#understanding-the-time-intervals-returned-from-group-by-time-queries)    
* [Querying after `now()`](#querying-after-now)  
* [Querying a time range that spans epoch 0](#querying-a-time-range-that-spans-epoch-0)  
* [Querying with booleans](#querying-with-booleans)  
* [Querying `SELECT *` with field type discrepancies](#querying-select-with-field-type-discrepancies)
* [Working with really big or really small integers](#working-with-really-big-or-really-small-integers)
* [Doing math on timestamps](#doing-math-on-timestamps)  
* [Getting an unexpected epoch 0 timestamp in query returns](#getting-an-unexpected-epoch-0-timestamp-in-query-returns)  
* [Getting large query returns in batches when using the HTTP API](#getting-large-query-returns-in-batches-when-using-the-http-api)  
* [Getting the `expected identifier` error, unexpectedly](#getting-the-expected-identifier-error-unexpectedly)
* [Identifying write precision from returned timestamps](#identifying-write-precision-from-returned-timestamps)  
* [Single quoting and double quoting in queries](#single-quoting-and-double-quoting-in-queries)  
* [Missing data after creating a new `DEFAULT` retention policy](#missing-data-after-creating-a-new-default-retention-policy)
* [Querying for series cardinality](#querying-for-series-cardinality)

**Writing data**  

* [Writing integers](/influxdb/v1.0/troubleshooting/frequently_encountered_issues/#writing-integers)   
* [Writing duplicate points](/influxdb/v1.0/troubleshooting/frequently_encountered_issues/#writing-duplicate-points)  
* [Getting an unexpected error when sending data over the HTTP API](/influxdb/v1.0/troubleshooting/frequently_encountered_issues/#getting-an-unexpected-error-when-sending-data-over-the-http-api)
* [Words and characters to avoid](/influxdb/v1.0/troubleshooting/frequently_encountered_issues/#words-and-characters-to-avoid)  
* [Single quoting and double quoting when writing data](/influxdb/v1.0/troubleshooting/frequently_encountered_issues/#single-quoting-and-double-quoting-when-writing-data)  

**Administration**  

* [Single quoting the password string](/influxdb/v1.0/troubleshooting/frequently_encountered_issues/#single-quoting-the-password-string)
* [Escaping the single quote in a password](/influxdb/v1.0/troubleshooting/frequently_encountered_issues/#escaping-the-single-quote-in-a-password)  
* [Identifying your version of InfluxDB](/influxdb/v1.0/troubleshooting/frequently_encountered_issues/#identifying-your-version-of-influxdb)  
* [Data aren't dropped after altering a retention policy](/influxdb/v1.0/troubleshooting/frequently_encountered_issues/#data-aren-t-dropped-after-altering-a-retention-policy)

# Querying data

## Understanding the time intervals returned from `GROUP BY time()` queries
With some `GROUP BY time()` queries, the returned time intervals may not reflect the time range specified in the `WHERE` clause.
In the example below the first [timestamp](/influxdb/v1.0/concepts/glossary/#timestamp) in the results occurs before the lower bound of the query:

Query with a two day `GROUP BY time()` interval:
<pre><code class="language-sh">
> SELECT count("water_level") FROM "h2o_feet" WHERE time >= <u><b>'2015-08-20T00:00:00Z'</b></u> AND time <= '2015-08-24T00:00:00Z' AND "location" = 'santa_monica' GROUP BY time(2d)
</code></pre>

Results:

<pre><code class="language-sh">name: h2o_feet
--------------
time			         count
<u><b>2015-08-19T00:00:00Z</b></u>	   240
2015-08-21T00:00:00Z	 480
2015-08-23T00:00:00Z	 241
</code></pre>

InfluxDB queries the `GROUP BY time()` intervals that fall within the `WHERE time` clause.
Default `GROUP BY time()` intervals fall on rounded calendar time boundaries.
Because they're rounded time boundaries, the start and end timestamps may appear to include more data than those covered by the query's `WHERE time` clause.

For the example above, InfluxDB works with two day intervals based on round number calendar days.
The rounded two day buckets in August are as follows (explanation continues below):

```
August 1st-2nd
August 3rd-4th
[...]
August 19th-20th
August 21st-22nd
August 23rd-24th
[...]
```

Because InfluxDB groups together August 19th and August 20th by default, August 19th is the first timestamp to appear in the results despite not being within the query's time range.
The number in the `count` column, however, only includes data that occur on or after August 20th as that is the time range specified by the query's `WHERE` clause.

Users may offset the default rounded calendar time boundaries by including an
[offset interval](/influxdb/v1.0/query_language/data_exploration/#configured-group-by-time-boundaries)
in their query.

## Querying after `now()`
By default, InfluxDB uses `now()` (the current nanosecond timestamp of the node that is processing the query) as the upper bound in queries.
You must provide explicit directions in the `WHERE` clause to query points that occur after `now()`.

The first query below asks InfluxDB to return everything from `hillvalley` that occurs between epoch 0 (`1970-01-01T00:00:00Z`) and `now()`.
The second query asks InfluxDB to return everything from `hillvalley` that occurs between epoch 0 and 1,000 days from `now()`.

`SELECT * FROM "hillvalley"`  
`SELECT * FROM "hillvalley" WHERE time < now() + 1000d`

## Querying a time range that spans epoch 0
Currently, InfluxDB can return results for queries that cover either the time range before epoch 0 or the time range after epoch 0, not both.
A query with a time range that spans epoch 0 returns partial results.

<dt> [GitHub Issue #2703](https://github.com/influxdb/influxdb/issues/2703)  </dt>

## Querying with booleans
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

## Querying SELECT * with field type discrepancies

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

## Working with really big or really small integers
InfluxDB stores all integers as signed int64 data types.
The minimum and maximum valid values for int64 are `-9023372036854775808` and `9023372036854775807`.
See [Go builtins](http://golang.org/pkg/builtin/#int64) for more information.

Values close to but within those limits may lead to unexpected results; some functions and operators convert the int64 data type to float64 during calculation which can cause overflow issues.

## Doing math on timestamps
Currently, it is not possible to execute mathematical operators or functions against timestamp values in InfluxDB.
All time calculations must be carried out by the client receiving the query results.

## Getting an unexpected epoch 0 timestamp in query returns
In InfluxDB, epoch 0  (`1970-01-01T00:00:00Z`)  is often used as a null timestamp equivalent.
If you request a query that has no timestamp to return, such as an aggregation function with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.

## Getting large query returns in batches when using the HTTP API
InfluxDB returns large query results in batches of 10,000 points unless you use the query string parameter `chunk_size` to explicitly set the batch size.
For example, get results in batches of 20,000 points with:

```
curl -G 'http://localhost:8086/query?db=deluge' --data-urlencode "chunk_size=20000" --data-urlencode 'q=SELECT * FROM "liters"'
```

<dt> See [GitHub Issue #3242](https://github.com/influxdb/influxdb/issues/3242) for more information on the challenges that this can cause, especially with Grafana visualization.
</dt>

## Getting the `expected identifier` error, unexpectedly
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

## Identifying write precision from returned timestamps
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

## Single quoting and double quoting in queries
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

## Missing data after creating a new `DEFAULT` retention policy
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

## Querying for series cardinality

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

# Writing data
## Writing integers
Add a trailing `i` to the end of the field value when writing an integer.
If you do not provide the `i`, InfluxDB will treat the field value as a float.

Writes an integer: `value=100i`  
Writes a float: `value=100`

## Writing duplicate points
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
time			                  az	      hostname	 val_1	 val_2
1970-01-15T06:56:07.89Z	 us_west	 server02	 5.24	  7
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
  time			            az	     hostname	uniq	val_1	val_2
  1970-01-15T06:56:07.89Z	us_west	 server02	1	    24.5	7
  1970-01-15T06:56:07.89Z	us_west	 server02	2	    5.24
    ```
* Increment the timestamp by a nanosecond.

    Old point: `cpu_load,hostname=server02,az=us_west val_1=24.5,val_2=7 1234567890000000`

    New point: `cpu_load,hostname=server02,az=us_west val_1=5.24 1234567890000001`

    After writing the new point to InfluxDB:
    ```
    > SELECT * FROM "cpu_load" WHERE time >= 1234567890000000 and time <= 1234567890000001
    name: cpu_load
    --------------
    time				             az	      hostname	 val_1	val_2
    1970-01-15T06:56:07.89Z		     us_west  server02	 24.5	 7
    1970-01-15T06:56:07.890000001Z	 us_west  server02	 5.24
    ```

## Getting an unexpected error when sending data over the HTTP API
First, double check your [line protocol](/influxdb/v1.0/write_protocols/line/) syntax.
Second, if you continue to receive errors along the lines of `bad timestamp` or `unable to parse`, verify that your newline character is line feed (`\n`, which is ASCII `0x0A`).
InfluxDB's line protocol relies on `\n` to indicate the end of a line and the beginning of a new line; files or data that use a newline character other than `\n` will encounter parsing issues.
Convert the newline character and try sending the data again.

> **Note:** If you generated your data file on a Windows machine, Windows uses carriage return and line feed (`\r\n`) as the newline character.

## Words and characters to avoid
If you use any of the [InfluxQL keywords](https://github.com/influxdb/influxdb/blob/master/influxql/README.md#keywords) as an identifier you will need to double quote that identifier in every query.
This can lead to [non-intuitive errors](/influxdb/v1.0/troubleshooting/frequently_encountered_issues/#getting-the-expected-identifier-error-unexpectedly).
Identifiers are database names, retention policy names, user names, measurement names, tag keys, and field keys.

To keep regular expressions and quoting simple, avoid using the following characters in identifiers:  

`\` backslash   
 `^` circumflex accent  
 `$` dollar sign  
 `'` single quotation mark  
 `"` double quotation mark  
 `,` comma

## Single quoting and double quoting when writing data
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

See the [Line Protocol Syntax](/influxdb/v1.0/write_protocols/write_syntax/) page for more information.

# Administration
## Single quoting the password string
The `CREATE USER <user> WITH PASSWORD '<password>'` query requires single quotation marks around the password string.
Do not include the single quotes when authenticating requests.

## Escaping the single quote in a password
For passwords that include a single quote, escape the single quote with a backslash both when creating the password and when authenticating requests.

## Identifying your version of InfluxDB
There a number of ways to identify the version of InfluxDB that you're using:

* Check the return when you `curl` the `/ping` endpoint.
For example, if you're using 1.0.0 `curl -i 'http://localhost:8086/ping'` returns:  

`HTTP/1.1 204 No Content`  
`Request-Id: 874101f6-e23e-11e5-8097-000000000000`  
✨`X-Influxdb-Version: 1.0.0`✨  
`Date: Fri, 04 Mar 2016 19:23:08 GMT`

* Check the text that appears when you [launch](/influxdb/v1.0/tools/shell/) the CLI:

`Connected to http://localhost:8086`✨`version 1.0.0`✨  
`InfluxDB shell 1.0.0`

* Check the HTTP response in your logs:  

`[http] 2016/03/04 11:25:13 ::1 - - [04/Mar/2016:11:25:13 -0800] GET /query?db=&epoch=ns&q=show+databases HTTP/1.1 200 98 -`     ✨`InfluxDBShell/1.0.0`✨`d16e7a83-e23e-11e5-80a7-000000000000 529.543µs`

## Data aren't dropped after altering a retention policy
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
