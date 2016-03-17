---
title: Data Exploration

menu:
  influxdb_010:
    weight: 0
    parent: query_language
---

InfluxQL is an SQL-like query language for interacting with data in InfluxDB.
The following sections cover useful query syntax for exploring your data.

The basics:

* [The `SELECT` statement and the `WHERE` clause](/influxdb/v0.11/query_language/data_exploration/#the-select-statement-and-the-where-clause)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[The basic `SELECT` statement](/influxdb/v0.11/query_language/data_exploration/#the-basic-select-statement)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[The `SELECT` statement and arithmetic](/influxdb/v0.11/query_language/data_exploration/#the-select-statement-and-arithmetic)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[The `WHERE` clause](/influxdb/v0.11/query_language/data_exploration/#the-where-clause)
* [The `GROUP BY` clause](/influxdb/v0.11/query_language/data_exploration/#the-group-by-clause)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[The basic `GROUP BY` clause](/influxdb/v0.11/query_language/data_exploration/#the-basic-group-by-clause)   
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[The `GROUP BY` clause and `fill()`](/influxdb/v0.11/query_language/data_exploration/#the-group-by-clause-and-fill)  
* [The `INTO` clause](/influxdb/v0.11/query_language/data_exploration/#the-into-clause)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Relocate data](/influxdb/v0.11/query_language/data_exploration/#relocate-data)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Downsample data](/influxdb/v0.11/query_language/data_exploration/#downsample-data)    

Limit and sort your results:

* [Limit query returns with `LIMIT` and `SLIMIT`](/influxdb/v0.11/query_language/data_exploration/#limit-query-returns-with-limit-and-slimit)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Limit results per series with `LIMIT`](/influxdb/v0.11/query_language/data_exploration/#limit-the-number-of-results-returned-per-series-with-limit)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Limit the number of series returned with `SLIMIT`](/influxdb/v0.11/query_language/data_exploration/#limit-the-number-of-series-returned-with-slimit)  
* [Sort query returns with `ORDER BY time DESC`](/influxdb/v0.11/query_language/data_exploration/#sort-query-returns-with-order-by-time-desc)
* [Paginate query returns with `OFFSET`](/influxdb/v0.11/query_language/data_exploration/#paginate-query-returns-with-offset)

General tips on query syntax:

* [Multiple statements in queries](/influxdb/v0.11/query_language/data_exploration/#multiple-statements-in-queries)
* [Merge series in queries](/influxdb/v0.11/query_language/data_exploration/#merge-series-in-queries)
* [Time syntax in queries](/influxdb/v0.11/query_language/data_exploration/#time-syntax-in-queries)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Relative time](/influxdb/v0.11/query_language/data_exploration/#relative-time)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Absolute time](/influxdb/v0.11/query_language/data_exploration/#absolute-time)
* [Regular expressions in queries](/influxdb/v0.11/query_language/data_exploration/#regular-expressions-in-queries)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Regular expressions and selecting measurements](/influxdb/v0.11/query_language/data_exploration/#regular-expressions-and-selecting-measurements)  
&nbsp;&nbsp;&nbsp;◦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Regular expressions and specifying tags](/influxdb/v0.11/query_language/data_exploration/#regular-expressions-and-specifying-tags)

The examples below query data using [InfluxDB's Command Line Interface (CLI)](/influxdb/v0.11/tools/shell/).
See the [Querying Data](/influxdb/v0.11/guides/querying_data/) guide for how to query data directly using the HTTP API.

#### Sample data
<br>
If you'd like to follow along with the queries in this document, see [Sample Data](/influxdb/v0.11/sample_data/data_download/) for how to download and write the data to InfluxDB.

This document uses publicly available data from the [National Oceanic and Atmospheric Administration's (NOAA) Center for Operational Oceanographic Products and Services](http://tidesandcurrents.noaa.gov/stations.html?type=Water+Levels).
The data include water levels (ft) collected every six seconds at two stations (Santa Monica, CA (ID 9410840) and Coyote Creek, CA (ID 9414575)) over the period from August 18, 2015 through September 18, 2015.

A subsample of the data in the measurement `h2o_feet`:
```
name: h2o_feet
--------------
time			                 level description	      location	       water_level
2015-08-18T00:00:00Z	   below 3 feet		          santa_monica	   2.064
2015-08-18T00:00:00Z	   between 6 and 9 feet	   coyote_creek	   8.12
2015-08-18T00:06:00Z	   between 6 and 9 feet	   coyote_creek	   8.005
2015-08-18T00:06:00Z	   below 3 feet		          santa_monica	   2.116
2015-08-18T00:12:00Z	   between 6 and 9 feet	   coyote_creek	   7.887
2015-08-18T00:12:00Z	   below 3 feet		          santa_monica	   2.028
2015-08-18T00:18:00Z	   between 6 and 9 feet	   coyote_creek	   7.762
2015-08-18T00:18:00Z	   below 3 feet		          santa_monica	   2.126
2015-08-18T00:24:00Z	   between 6 and 9 feet	   coyote_creek	   7.635
2015-08-18T00:24:00Z	   below 3 feet		          santa_monica	   2.041
```

The [series](/influxdb/v0.11/concepts/glossary/#series) are made up of the [measurement](/influxdb/v0.11/concepts/glossary/#measurement) `h2o_feet` and the [tag key](/influxdb/v0.11/concepts/glossary/#tag-key) `location` with the [tag values](/influxdb/v0.11/concepts/glossary/#tag-value) `santa_monica` and `coyote_creek`.
There are two [fields](/influxdb/v0.11/concepts/glossary/#field): `water_level` which stores floats and `level description` which stores strings.
All of the data are in the `NOAA_water_database` database.

> **Disclaimer:** The `level description` field isn't part of the original NOAA data - we snuck it in there for the sake of having a field key with a special character and string [field values](/influxdb/v0.11/concepts/glossary/#field-value).

## The SELECT statement and the `WHERE` clause
InfluxQL's `SELECT` statement follows the form of an SQL `SELECT` statement where the `WHERE` clause is optional:
```sql
SELECT <stuff> FROM <measurement_name> WHERE <some_conditions>
```  

### The basic `SELECT` statement
---
The following three examples return everything from the measurement `h2o_feet` (see the CLI response at the end of this section).
While they all return the same result, they get to that result in slightly different ways and serve to introduce some of the specifics of the `SELECT` syntax:

 Select everything from `h2o_feet` with `*`:
 ```sql
 > SELECT * FROM h2o_feet
 ```  
 Select everything from `h2o_feet` by specifying each tag key and field key:
 ```sql
 > SELECT "level description",location,water_level FROM h2o_feet
 ```  

* Separate multiple fields and tags of interest with a comma.
Note that you must specify at least one field in the `SELECT` statement.

* Leave identifiers unquoted unless they start with a digit, contain characters other than `[A-z,0-9,_]`, or if they are an [InfluxQL keyword](https://github.com/influxdb/influxdb/blob/master/influxql/README.md#keywords) - then you need to double quote them.
Identifiers are database names, retention policy names, user names, measurement names, tag keys, and field keys.

 Select everything from `h2o_feet` by fully qualifying the measurement:
 ```sql
 > SELECT * FROM NOAA_water_database."default".h2o_feet
 ```
* Fully qualify a measurement if you wish to query data from a different database or from a retention policy other than the default [retention policy](/influxdb/v0.11/concepts/glossary/#retention-policy).
A fully qualified measurement takes the following form:  
```
"<database>"."<retention policy>"."<measurement>"
 ```

The CLI response for all three queries:
 ```
name: h2o_feet
--------------
time			                 level description	      location	       water_level
2015-08-18T00:00:00Z	   below 3 feet		          santa_monica	   2.064
2015-08-18T00:00:00Z	   between 6 and 9 feet	   coyote_creek	   8.12
2015-08-18T00:06:00Z	   between 6 and 9 feet	   coyote_creek	   8.005
2015-08-18T00:06:00Z	   below 3 feet		          santa_monica	   2.116
[...]
2015-09-18T21:24:00Z	   between 3 and 6 feet	   santa_monica	   5.013
2015-09-18T21:30:00Z	   between 3 and 6 feet	   santa_monica	   5.01
2015-09-18T21:36:00Z	   between 3 and 6 feet	   santa_monica	   5.066
2015-09-18T21:42:00Z	   between 3 and 6 feet	   santa_monica	   4.938
```

### The `SELECT` statement and arithmetic
---
Perform basic arithmetic operations on fields that store floats and integers.

Add two to the field `water_level`:
```sql
> SELECT water_level + 2 FROM h2o_feet
```
CLI response:
```bash
name: h2o_feet
--------------
time
2015-08-18T00:00:00Z	4.064
2015-08-18T00:00:00Z	10.12
[...]
2015-09-18T21:36:00Z	7.066
2015-09-18T21:42:00Z	6.938
```

Another example that works:
```sql
> SELECT (water_level * 2) + 4 from h2o_feet
```
CLI response:
```bash
name: h2o_feet
--------------
time
2015-08-18T00:00:00Z	8.128
2015-08-18T00:00:00Z	20.24
[...]
2015-09-18T21:36:00Z	14.132
2015-09-18T21:42:00Z	13.876
```

> **Note:** When performing arithmetic on fields that store integers be aware that InfluxDB casts those integers to floats for all mathematical operations.
This can lead to [overflow issues](/influxdb/v0.11/troubleshooting/frequently_encountered_issues/#working-with-really-big-or-really-small-integers) for some numbers.

### The `WHERE` clause
---
Use a `WHERE` clause to filter your data based on tags, time ranges, and/or field values.

**Tags**  
Return data where the tag key `location` has the tag value `santa_monica`:  
```sql
> SELECT water_level FROM h2o_feet WHERE location = 'santa_monica'
```
* Always single quote tag values in queries - they are strings.
Note that double quotes do not work when specifying tag values and can cause queries to silently fail.


> **Note:** Tags are indexed so queries on tag keys or tag values are more performant than queries on fields.

Return data where the tag key `location` has no tag value (more on regular expressions [later](/influxdb/v0.11/query_language/data_exploration/#regular-expressions-in-queries)):
```sql
> SELECT * FROM h2o_feet WHERE location !~ /.*/
```

Return data where the tag key `location` has a value:
```sql
> SELECT * FROM h2o_feet WHERE location =~ /.*/
```
**Time ranges**  
Return data from the past seven days:
```sql
> SELECT * FROM h2o_feet WHERE time > now() - 7d
```
* `now()` is the Unix time of the server at the time the query is executed on that server.
For more on `now()` and other ways to specify time in queries, see [time syntax in queries](/influxdb/v0.11/query_language/data_exploration/#time-syntax-in-queries).

**Field values**  
Return data where the tag key `location` has the tag value `coyote_creek` and the field `water_level` is greater than 8 feet:
```sql
> SELECT * FROM h2o_feet WHERE location = 'coyote_creek' AND  water_level > 8
```
Return data where the tag key `location` has the tag value `santa_monica` and the field `level description` equals `'below 3 feet'`:
```sql
> SELECT * FROM h2o_feet WHERE location = 'santa_monica' AND "level description" = 'below 3 feet'
```
* Always single quote field values that are strings.
Note that double quotes do not work when specifying string field values and can cause queries to silently fail.

> **Note:** Fields are not indexed; queries on fields are not as performant as those on tags.

More on the `WHERE` clause in InfluxQL:

* The `WHERE` clause supports comparisons against strings, booleans, floats, integers, and against the `time` of the timestamp.
It supports using regular expressions to match tags, but not to match fields.
* Chain logic together using `AND`  and `OR`, and separate using `(` and `)`.
* Acceptable comparators include:  
`=` equal to  
`<>` not equal to  
`!=` not equal to  
`>` greater than  
`<` less than  
`=~` matches against  
`!~` doesn't match against  

## The GROUP BY clause

Use the `GROUP BY` clause to group data by tags and/or time intervals.
To successfully implement `GROUP BY`,  append the`GROUP BY` clause to a `SELECT` statement and pair the `SELECT` statement with one of InfluxQL's [functions](/influxdb/v0.11/query_language/functions/).

> **Note:** If your query includes both a `WHERE` clause and a `GROUP BY` clause, the `GROUP BY` clause must come after the `WHERE` clause.

### The basic `GROUP BY` clause
---
**GROUP BY tag values**  
Calculate the [`MEAN()`](../query_language/functions.html#mean) `water_level` for the different tag values of `location`:
```sql
> SELECT MEAN(water_level) FROM h2o_feet GROUP BY location
```
CLI response:
```bash
name: h2o_feet
tags: location=coyote_creek
time			mean
----			----
1970-01-01T00:00:00Z	5.359342451341403

name: h2o_feet
tags: location=santa_monica
time			mean
----			----
1970-01-01T00:00:00Z	3.5308634700810053
```
>**Note:** In InfluxDB, [epoch 0](https://en.wikipedia.org/wiki/Unix_time) (`1970-01-01T00:00:00Z`) is often used as a null timestamp equivalent.
If you request a query that has no timestamp to return, such as an aggregation function with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.

Calculate the [`MEAN()`](../query_language/functions.html#mean) `index` for every tag set in `h2o_quality`:
```sql
> SELECT MEAN(index) FROM h2o_quality GROUP BY *
```
CLI response:
```bash
name: h2o_quality
tags: location = coyote_creek, randtag = 1
time			               mean
----			               ----
1970-01-01T00:00:00Z	 50.69033760186263

name: h2o_quality
tags: location = coyote_creek, randtag = 2
time			               mean
----			               ----
1970-01-01T00:00:00Z	 49.661867544220485

name: h2o_quality
tags: location = coyote_creek, randtag = 3
time			               mean
----			               ----
1970-01-01T00:00:00Z	 49.360939907550076

name: h2o_quality
tags: location = santa_monica, randtag = 1
time			               mean
----			               ----
1970-01-01T00:00:00Z	 49.132712456344585

name: h2o_quality
tags: location = santa_monica, randtag = 2
time			               mean
----			               ----
1970-01-01T00:00:00Z	 50.2937984496124

name: h2o_quality
tags: location = santa_monica, randtag = 3
time			               mean
----			               ----
1970-01-01T00:00:00Z	 49.99919903884662
```

**GROUP BY time intervals**  
[`COUNT()`](../query_language/functions.html#count) the number of `water_level` points between August 18, 2015 at midnight and September 18 at 5:00pm at two day intervals:
```sql
> SELECT COUNT(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-09-18T17:00:00Z' AND location='coyote_creek' GROUP BY time(2d)
```

CLI response:
```bash
name: h2o_feet
----------
time			               count
2015-08-17T00:00:00Z	 240
2015-08-19T00:00:00Z	 480
2015-08-21T00:00:00Z	 480
2015-08-23T00:00:00Z	 480
2015-08-25T00:00:00Z	 480
2015-08-27T00:00:00Z	 480
2015-08-29T00:00:00Z	 480
2015-08-31T00:00:00Z	 480
2015-09-02T00:00:00Z	 480
2015-09-04T00:00:00Z	 479
2015-09-06T00:00:00Z	 480
2015-09-08T00:00:00Z	 480
2015-09-10T00:00:00Z	 480
2015-09-12T00:00:00Z	 480
2015-09-14T00:00:00Z	 480
2015-09-16T00:00:00Z	 480
2015-09-18T00:00:00Z	 165
```

Notice that each timestamp represents a two day interval and that the value in the `count` field is the number of `water_level` points that occurred in that two day interval.
You could get the same results by querying the data 17 times - that is, one `COUNT()` query for every two days between August 18, 2015 at midnight and September 18 at 5:00pm - but that could take a while.

> **Note:** The first timestamp in the CLI response (`2015-08-17T00:00:00Z`) occurs before the lower bound of the query's time range (`2015-08-18T00:00:00Z`).
See [Frequently Encountered Issues](/influxdb/v0.11/troubleshooting/frequently_encountered_issues/#understanding-the-time-intervals-returned-from-group-by-time-queries) for an explanation of the time intervals returned from `GROUP BY time()` queries.

Other things to note about `GROUP BY time()`:

* InfluxQL requires a `WHERE` clause if you're using `GROUP BY` with `time()`.
Note that unless you specify a different upper and lower bound for the time range, `GROUP BY` uses `epoch 0` as the lower bound and `now()` as the upper bound for the query - this can lead to [unexpected results](/influxdb/v0.11/troubleshooting/frequently_encountered_issues/#getting-unexpected-results-with-group-by-time).
* Valid units for `time()` are:  
<br>
    `u` microseconds  
    `s` seconds  
    `m` minutes  
    `h` hours  
    `d` days  
    `w` weeks   

**GROUP BY tag values AND a time interval**  
Calculate the average `water_level` for the different tag values of `location` in the last two weeks at 6 hour intervals:
```sql
> SELECT MEAN(water_level) FROM h2o_feet WHERE time > now() - 2w GROUP BY location,time(6h)
```
* Separate multiple `GROUP BY` arguments with a comma.

### The `GROUP BY` clause and `fill()`
---
By default, a `GROUP BY` interval with no data has `null` as its value in the output column.
Use `fill()` to change the value reported for intervals that have no data.
`fill()` options include:

* Any numerical value
* `null` - sets `null` as the value for intervals with no data
* `previous` - copies the value from the previous interval for intervals with no data
* `none` - skips intervals with no data to report

Follow the ✨ in the examples below to see what `fill()` can do.

**GROUP BY without fill()**
```sql
> SELECT MEAN(water_level) FROM h2o_feet WHERE time >= '2015-08-18' AND time < '2015-09-24' GROUP BY time(10d)
```
CLI response:
```bash
name: h2o_feet
----------
time			mean
2015-08-13T00:00:00Z	4.306212083333333
2015-08-23T00:00:00Z	4.328549999999998
2015-09-02T00:00:00Z	4.44695286757038
2015-09-12T00:00:00Z	4.701986209010117
✨2015-09-22T00:00:00Z
```
**GROUP BY with fill()**  
Use `fill()` with `-100`:  
```sql
> SELECT MEAN(water_level) FROM h2o_feet WHERE time >= '2015-08-18' AND time < '2015-09-24' GROUP BY time(10d) fill(-100)
```
CLI response:  
```bash
name: h2o_feet
----------
time			mean
2015-08-13T00:00:00Z	4.306212083333323
2015-08-23T00:00:00Z	4.328549999999999
2015-09-02T00:00:00Z	4.4469528675703796
2015-09-12T00:00:00Z	4.701986209010117
✨2015-09-22T00:00:00Z	-100
```
Use `fill()` with `none`:
```sql
> SELECT MEAN(water_level) FROM h2o_feet WHERE time >= '2015-08-18' AND time < '2015-09-24' GROUP BY time(10d) fill(none)
```
CLI response:  
```
name: h2o_feet
----------
time			mean
2015-08-13T00:00:00Z	4.306212083333333
2015-08-23T00:00:00Z	4.32855
2015-09-02T00:00:00Z	4.4469528675703796
2015-09-12T00:00:00Z	4.701986209010117
✨
```

> **Note:** If you're `GROUP(ing) BY` several things (for example, both tags and a time interval) `fill()` must go at the end of the `GROUP BY` clause.

## The INTO clause
### Relocate data
Copy data to another database, retention policy, and measurement with the `INTO` clause:
```sql
SELECT <field_key> INTO <different_measurement> FROM <current_measurement> [WHERE <stuff>] [GROUP BY <stuff>]
```

Write the field `water_level` in `h2o_feet` to a new measurement (`h2o_feet_copy`) in the same database:
```sql
> SELECT water_level INTO h2o_feet_copy FROM h2o_feet WHERE location = 'coyote_creek'
```

The CLI response shows the number of points that InfluxDB wrote to `h2o_feet_copy`:
```
name: result
------------
time			               written
1970-01-01T00:00:00Z	 7604
```

Write the field `water_level` in `h2o_feet` to a new measurement (`h2o_feet_copy`) and to the retention policy `default` in the database `where_else`:
```sql
> SELECT water_level INTO where_else."default".h2o_feet_copy FROM h2o_feet WHERE location = 'coyote_creek'
```

CLI response:
```bash
name: result
------------
time			               written
1970-01-01T00:00:00Z	 7604
```

> **Note**: If you use `SELECT *` with `INTO`, the query converts tags in the current measurement to fields in the new measurement.
This can cause InfluxDB to overwrite points that were previously differentiated by a tag value.
Use `GROUP BY <tag_key>` to preserve tags as tags.

### Downsample data
Combine the `INTO` clause with an InfluxQL [function](/influxdb/v0.11/query_language/functions/) and a `GROUP BY` clause to write the lower precision query results to a different measurement:
```sql
SELECT <function>(<field_key>) INTO <different_measurement> FROM <current_measurement> WHERE <stuff> GROUP BY <stuff>
```

> **Note:** The `INTO` queries in this section downsample old data, that is, data that have already been written to InfluxDB.
If you want InfluxDB to automatically query and downsample all future data see [Continuous Queries](/influxdb/v0.11/query_language/continuous_queries/).

Calculate the average `water_level` in `santa_monica`, and write the results to a new measurement (`average`) in the same database:
```sql
> SELECT mean(water_level) INTO average FROM h2o_feet WHERE location = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)
```

The CLI response shows the number of points that InfluxDB wrote to the new measurement:
```bash
name: result
------------
time			               written
1970-01-01T00:00:00Z	 3
```

To see the query results, select everything from the new measurement `average` in `NOAA_water_database`:
```bash
> SELECT * FROM average
name: average
-------------
time			               mean
2015-08-18T00:00:00Z	 2.09
2015-08-18T00:12:00Z	 2.077
2015-08-18T00:24:00Z	 2.0460000000000003
```

Calculate the average `water_level` and the max `water_level` in `santa_monica`, and write the results to a new measurement (`aggregates`) in a different database (`where_else`):
```sql
> SELECT mean(water_level), max(water_level) INTO where_else."default".aggregates FROM h2o_feet WHERE location = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)
```

CLI response:
```bash
name: result
------------
time			               written
1970-01-01T00:00:00Z	 3
```

Select everything from the new measurement `aggregates` in the database `where_else`:
```bash
> SELECT * FROM where_else."default".aggregates
name: aggregates
----------------
time			               max	   mean
2015-08-18T00:00:00Z	 2.116	 2.09
2015-08-18T00:12:00Z	 2.126	 2.077
2015-08-18T00:24:00Z	 2.051	 2.0460000000000003
```

Calculate the average `degrees` for all temperature measurements (`h2o_temperature` and `average_temperature`) in the `NOAA_water_database` and write the results to new measurements with the same names in a different database (`where_else`).
`:MEASUREMENT` tells InfluxDB to write the query results to measurements with the same names as those targeted by the query:
```sql
> SELECT mean(degrees) INTO where_else."default".:MEASUREMENT FROM /temperature/ WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' GROUP BY time(12m)
```

CLI response:
```bash
name: result
------------
time			               written
1970-01-01T00:00:00Z	 6
```

Select the `mean` field from all new temperature measurements in the database `where_else`.
```bash
> SELECT mean FROM where_else."default"./temperature/
name: average_temperature
-------------------------
time			               mean
2015-08-18T00:00:00Z	 78.5
2015-08-18T00:12:00Z	 84
2015-08-18T00:24:00Z	 74.75

name: h2o_temperature
---------------------
time			                mean
2015-08-18T00:00:00Z	  63.75
2015-08-18T00:12:00Z	  63.5
2015-08-18T00:24:00Z	  63.5
```

More on downsampling with `INTO`:

* InfluxDB does not store null values.
Depending on the frequency of your data, the query results may be missing time intervals.
Use [fill()](/influxdb/v0.11/query_language/data_exploration/#the-group-by-clause-and-fill) to ensure that every time interval appears in the results.
* The number of writes in the CLI response includes one write for every time interval in the query's time range even if there is no data for some of the time intervals.

## Limit query returns with LIMIT and SLIMIT
InfluxQL supports two different clauses to limit your query results.
Currently, they are mutually exclusive so you may use one or the other, but not both in the same query.

<dt> Please note that using `LIMIT` and `SLIMIT` **without** a `GROUP BY *` clause can cause unexpected results.
See [GitHub Issue #4232](https://github.com/influxdb/influxdb/issues/4232) for more information.
</dt>

### Limit the number of results returned per series with `LIMIT`
---
Use `LIMIT <N>` with `SELECT` and `GROUP BY *` to return the first N points from each series.

Return the three oldest points from each series associated with the measurement `h2o_feet`:
```sql
> SELECT water_level FROM h2o_feet GROUP BY * LIMIT 3
```

CLI response:
```bash
name: h2o_feet
tags: location=coyote_creek
time			              water_level
----			              -----------
2015-08-18T00:00:00Z	8.12
2015-08-18T00:06:00Z	8.005
2015-08-18T00:12:00Z	7.887

name: h2o_feet
tags: location=santa_monica
time			              water_level
----			              -----------
2015-08-18T00:00:00Z	2.064
2015-08-18T00:06:00Z	2.116
2015-08-18T00:12:00Z	2.028
```

> **Note:** If N is greater than the number of points in the series, InfluxDB returns all points in the series.

### Limit the number of series returned with `SLIMIT`
---
Use `SLIMIT <N>` with `SELECT` and `GROUP BY *` to return every point from N [series](/influxdb/v0.11/concepts/glossary/#series).

Return everything from one of the series associated with the measurement `h2o_feet`:
```sql
> SELECT water_level FROM h2o_feet GROUP BY * SLIMIT 1
```

CLI response:
```bash
name: h2o_feet
tags: location=coyote_creek
time			              water_level
----			              -----
2015-08-18T00:00:00Z	8.12
2015-08-18T00:06:00Z	8.005
2015-08-18T00:12:00Z	7.887
[...]
2015-09-18T16:12:00Z	3.402
2015-09-18T16:18:00Z	3.314
2015-09-18T16:24:00Z	3.235
```

> **Note:** If N is greater than the number of series associated with the specified measurement, InfluxDB returns all points from every series.

## Sort query returns with ORDER BY time DESC
By default, InfluxDB returns results in ascending time order - so the first points that are returned are the oldest points by timestamp.
Use `ORDER BY time DESC` to see the newest points by timestamp.

Return the oldest five points from one series **without** `ORDER BY time DESC`:  
```sql
> SELECT water_level FROM h2o_feet WHERE location = 'santa_monica' LIMIT 5
```

CLI response:  
```bash
name: h2o_feet
----------
time			water_level
2015-08-18T00:00:00Z	2.064
2015-08-18T00:06:00Z	2.116
2015-08-18T00:12:00Z	2.028
2015-08-18T00:18:00Z	2.126
2015-08-18T00:24:00Z	2.041
```

Now include  `ORDER BY time DESC` to get the newest five points from the same series:  
```sql
> SELECT water_level FROM h2o_feet WHERE location = 'santa_monica' ORDER BY time DESC LIMIT 5
```

CLI response:  
```bash
name: h2o_feet
----------
time			water_level
2015-09-18T21:42:00Z	4.938
2015-09-18T21:36:00Z	5.066
2015-09-18T21:30:00Z	5.01
2015-09-18T21:24:00Z	5.013
2015-09-18T21:18:00Z	5.072
```

Finally, use `GROUP BY` with `ORDER BY time DESC` to return the last five points from each series:  
```sql
> SELECT water_level FROM h2o_feet GROUP BY location ORDER BY time DESC LIMIT 5
```

CLI response:
```bash
name: h2o_feet
tags: location=coyote_creek
time			water_level
----			-----------
2015-09-18T16:24:00Z	3.235
2015-09-18T16:18:00Z	3.314
2015-09-18T16:12:00Z	3.402
2015-09-18T16:06:00Z	3.497
2015-09-18T16:00:00Z	3.599

name: h2o_feet
tags: location=santa_monica
time			water_level
----			-----------
2015-09-18T21:42:00Z	4.938
2015-09-18T21:36:00Z	5.066
2015-09-18T21:30:00Z	5.01
2015-09-18T21:24:00Z	5.013
2015-09-18T21:18:00Z	5.072
```

## Paginate query returns with OFFSET
Use `OFFSET` to paginate the results returned.
For example, get the first three points written to a series:

```sql
> SELECT water_level FROM h2o_feet WHERE location = 'coyote_creek' LIMIT 3
```

CLI response:  
```bash
name: h2o_feet
----------
time			water_level
2015-08-18T00:00:00Z	8.12
2015-08-18T00:06:00Z	8.005
2015-08-18T00:12:00Z	7.887
```

Then get the second three points from that same series:

```sql
> SELECT water_level FROM h2o_feet WHERE location = 'coyote_creek' LIMIT 3 OFFSET 3
```

CLI response:
```bash
name: h2o_feet
----------
time			water_level
2015-08-18T00:18:00Z	7.762
2015-08-18T00:24:00Z	7.635
2015-08-18T00:30:00Z	7.5
```

## Multiple statements in queries

Separate multiple statements in a query with a semicolon.
For example:
<br>
<br>
```sql
> SELECT mean(water_level) FROM h2o_feet WHERE time > now() - 2w GROUP BY location,time(24h) fill(none); SELECT count(water_level) FROM h2o_feet WHERE time > now() - 2w GROUP BY location,time(24h) fill(80)
```

## Merge series in queries

In InfluxDB, queries merge series automatically.

The `NOAA_water_database` database has two [series](/influxdb/v0.11/concepts/glossary/#series).
The first series is made up of the measurement `h2o_feet` and the tag key `location` with the tag value `coyote_creek`.
The second series is made of up the measurement `h2o_feet` and the tag key `location` with the tag value `santa_monica`.

The following query automatically merges those two series when it calculates the [`MEAN()`](../query_language/functions.html#mean) `water_level`:

```sql
> SELECT MEAN(water_level) FROM h2o_feet
```

CLI response:
```bash
name: h2o_feet
--------------
time			              mean
1970-01-01T00:00:00Z	4.442107025822523
```

If you only want the `MEAN()` `water_level` for the first series, specify the tag set in the `WHERE` clause:
```sql
> SELECT MEAN(water_level) FROM h2o_feet WHERE location = 'coyote_creek'
```

CLI response:
```bash
name: h2o_feet
--------------
time			              mean
1970-01-01T00:00:00Z	5.359342451341402
```

> **NOTE:** In InfluxDB, [epoch 0](https://en.wikipedia.org/wiki/Unix_time) (`1970-01-01T00:00:00Z`) is often used as a null timestamp equivalent.
If you request a query that has no timestamp to return, such as an aggregation function with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.

## Time syntax in queries  
InfluxDB is a time series database so, unsurprisingly, InfluxQL has a lot to do with specifying time ranges.
If you do not specify start and end times in your query, they default to epoch 0 (`1970-01-01T00:00:00Z`) and `now()`.
The following sections detail how to specify different start and end times in queries.

### Relative time
---
`now()` is the Unix time of the server at the time the query is executed on that server.
Use `now()` to calculate a timestamp relative to the server's
current timestamp.

Query data starting an hour ago and ending `now()`:
```sql
> SELECT water_level FROM h2o_feet WHERE time > now() - 1h
```

Query data that occur between epoch 0 and 1,000 days from `now()`:  
```sql
> SELECT "level description" FROM h2o_feet WHERE time < now() + 1000d
```

* Note the whitespace between the operator and the time duration.
Leaving that whitespace out can cause InfluxDB to return no results or an `error parsing query` error .

The other options for specifying time durations with `now()` are listed below.
`u` microseconds  
`s` seconds  
`m` minutes  
`h` hours  
`d` days  
`w` weeks   

### Absolute time
---
**Date time strings**  
Specify time with date time strings.
Date time strings can take two formats: `YYYY-MM-DD HH:MM:SS.nnnnnnnnn` and  `YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`, where the second specification is [RFC3339](https://www.ietf.org/rfc/rfc3339.txt).
Nanoseconds (`nnnnnnnnn`) are optional in both formats.

The following two queries query data between August 18, 2015 23:00:01.232000000 and September 19, 2015 00:00:00.


```sql
> SELECT water_level FROM h2o_feet WHERE time > '2015-08-18 23:00:01.232000000' AND time < '2015-09-19'
```
```sql
> SELECT water_level FROM h2o_feet WHERE time > '2015-08-18T23:00:01.232000000Z' AND time < '2015-09-19'
```

* Single quote the date time string.
InfluxDB fails to restrict data by date time strings that are double quoted.
* If you only specify the date, InfluxDB sets the time to `00:00:00`.

**Epoch time**  
Specify time with timestamps in epoch time.
Epoch time is the number of nanoseconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC), Thursday, 1 January 1970.
Indicate the units of the timestamp at the end of the timestamp (see the section above for a list of acceptable time units).

Return all points that occur after  `2014-01-01 00:00:00`:  
```sql
> SELECT * FROM h2o_feet WHERE time > 1388534400s
```

## Regular expressions in queries

Regular expressions are surrounded by `/` characters and use [Golang's regular expression syntax](http://golang.org/pkg/regexp/syntax/).
Use regular expressions when selecting measurements and tags.

>**Note:** You cannot use regular expressions to match databases, retention policies, or fields.
You can only use regular expressions to match measurements and tags.

The [sample data](/influxdb/v0.11/query_language/data_exploration/#sample-data) need to be more intricate for the following sections.
Assume that the database `NOAA_water_database` now holds several measurements: `h2o_feet`, `h2o_quality`, `h2o_pH`, `average_temperature`, and `h2o_temperature`.
Please note that every measurement besides `h2o_feet` is fictional and contains fictional data.

### Regular expressions and selecting measurements
---
Select the oldest point from every measurement in the `NOAA_water_database` database:
```sql
> SELECT * FROM /.*/ LIMIT 1
```

CLI response:
```bash
name: average_temperature
-------------------------
time			              degrees	index	level description	location	    pH	randtag	water_level
2015-08-18T00:00:00Z	85					                         santa_monica

name: h2o_feet
--------------
time			              degrees	index	level description	location	    pH	randtag	water_level
2015-08-18T00:00:00Z			            below 3 feet		    santa_monica			         2.064

name: h2o_pH
------------
time			              degrees	index	level description	location	    pH	randtag	water_level
2015-08-18T00:00:00Z						                           santa_monica	6

name: h2o_quality
-----------------
time			              degrees	index	level description	location	    pH	randtag	water_level
2015-08-18T00:00:00Z		       41				                  coyote_creek		  1

name: h2o_temperature
---------------------
time			              degrees	index	level description	location	    pH	randtag	water_level
2015-08-18T00:00:00Z	70					                         santa_monica
```

* Alternatively, `SELECT` all of the measurements in `NOAA_water_database` by typing them out and separating each name with a comma (see below), but that could get tedious:
```sql
> SELECT * FROM average_temperature,h2o_feet,h2o_pH,h2o_quality,h2o_temperature LIMIT 1
```

Select the first three points from every measurement whose name starts with `h2o`:  
```sql
> SELECT * FROM /^h2o/ LIMIT 3
```
CLI response:  
```bash
name: h2o_feet
--------------
time			              degrees	index	level description	   location	    pH	randtag	water_level
2015-08-18T00:00:00Z			            below 3 feet		       santa_monica	         		2.064
2015-08-18T00:00:00Z			            between 6 and 9 feet	coyote_creek         			8.12
2015-08-18T00:06:00Z			            between 6 and 9 feet	coyote_creek	         		8.005

name: h2o_pH
------------
time			              degrees	index	level description	   location	    pH	randtag	water_level
2015-08-18T00:00:00Z						                              santa_monica	6
2015-08-18T00:00:00Z						                              coyote_creek	7
2015-08-18T00:06:00Z						                              coyote_creek	8

name: h2o_quality
-----------------
time			              degrees	index	level description	   location	    pH	randtag	water_level
2015-08-18T00:00:00Z		       99	                        santa_monica		  2
2015-08-18T00:00:00Z		       41	                        coyote_creek		  1
2015-08-18T00:06:00Z		       11	                        coyote_creek		  3

name: h2o_temperature
---------------------
time			              degrees	index	level description	   location	    pH	randtag	water_level
2015-08-18T00:00:00Z	70						                           santa_monica
2015-08-18T00:00:00Z	60						                           coyote_creek
2015-08-18T00:06:00Z	65						                           coyote_creek
```

Select the last 5 points from every measurement whose name contains `temperature`:

```sql
> SELECT * FROM /.*temperature.*/ LIMIT 5
```

CLI response:
```bash
name: average_temperature
-------------------------
time			              degrees	location
2015-08-18T00:00:00Z	85	     santa_monica
2015-08-18T00:00:00Z	82	     coyote_creek
2015-08-18T00:06:00Z	73	     coyote_creek
2015-08-18T00:06:00Z	74	     santa_monica
2015-08-18T00:12:00Z	86	     coyote_creek

name: h2o_temperature
---------------------
time			              degrees	location
2015-08-18T00:00:00Z	70	     santa_monica
2015-08-18T00:00:00Z	60	     coyote_creek
2015-08-18T00:06:00Z	65	     coyote_creek
2015-08-18T00:06:00Z	60	     santa_monica
2015-08-18T00:12:00Z	68	     coyote_creek
```

### Regular expressions and specifying tags
---
Use regular expressions to specify tags in the `WHERE` clause.
The relevant comparators include:  
`=~` matches against  
`!~` doesn't match against

Select the oldest four points from the measurement `h2o_feet` where the value of the tag `location` does not include an `a`:
```sql
> SELECT * FROM h2o_feet WHERE location !~ /.*a.*/ LIMIT 4
```

CLI response:
```bash
name: h2o_feet
--------------
time			               level description	    location	     water_level
2015-08-18T00:00:00Z	 between 6 and 9 feet 	coyote_creek	 8.12
2015-08-18T00:06:00Z	 between 6 and 9 feet	 coyote_creek	 8.005
2015-08-18T00:12:00Z	 between 6 and 9 feet	 coyote_creek	 7.887
2015-08-18T00:18:00Z	 between 6 and 9 feet	 coyote_creek	 7.762
```

Select the oldest four points from the measurement `h2o_feet` where the value of the tag `location` includes a `y` or an `m` and `water_level` is greater than zero:
```sql
> SELECT * FROM h2o_feet WHERE (location =~ /.*y.*/ OR location =~ /.*m.*/) AND water_level > 0 LIMIT 4
```
or
<br>
<br>
```sql
> SELECT * FROM h2o_feet WHERE location =~ /[ym]/ AND water_level > 0 LIMIT 4
```

CLI response:
```
name: h2o_feet
--------------
time			               level description	    location	     water_level
2015-08-18T00:00:00Z	 below 3 feet		        santa_monica	 2.064
2015-08-18T00:00:00Z	 between 6 and 9 feet 	coyote_creek	 8.12
2015-08-18T00:06:00Z	 between 6 and 9 feet 	coyote_creek	 8.005
2015-08-18T00:06:00Z	 below 3 feet		        santa_monica	 2.116
```

See [the WHERE clause](/influxdb/v0.11/query_language/data_exploration/#the-where-clause) section for an example of how to return data where a tag key has a value and an example of how to return data where a tag key has no value using regular expressions.
