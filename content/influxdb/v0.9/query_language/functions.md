---
title: Functions
aliases:
  - /docs/v0.9/query_language/aggregate_functions.html
---

Use InfluxQL functions to aggregate, select, and transform data.

| Aggregations  | Selectors | Transformations  
|---|---|---|
| [COUNT()](../query_language/functions.html#count)  | [BOTTOM()](../query_language/functions.html#bottom)  | [CEILING()](../query_language/functions.html#ceiling)   
| [DISTINCT()](../query_language/functions.html#distinct)  | [FIRST()](../query_language/functions.html#first)  | [DERIVATIVE()](../query_language/functions.html#derivative)  
| [INTEGRAL()](../query_language/functions.html#integral)  | [LAST()](../query_language/functions.html#last)  | [DIFFERENCE()](../query_language/functions.html#difference)  
| [MEAN()](../query_language/functions.html#mean) | [MAX()](../query_language/functions.html#max)  | [FLOOR()](../query_language/functions.html#floor) 
| [MEDIAN()](../query_language/functions.html#median)  | [MIN()](../query_language/functions.html#min)  | [HISTOGRAM()](../query_language/functions.html#histogram)  
| [SUM()](../query_language/functions.html#sum) | [PERCENTILE()](../query_language/functions.html#percentile)  | [NON_NEGATIVE_DERIVATIVE()](../query_language/functions.html#non-negative-derivative)
|   | [TOP()](../query_language/functions.html#top) | [STDDEV()](../query_language/functions.html#stddev) 

Tip: [Rename the output column's title with `AS`](../query_language/functions.html#rename-the-output-column-s-title-with-as)

The examples below query data using [InfluxDB's Command Line Interface (CLI)](../tools/shell.html). See the [Querying Data](../guides/querying_data.html) guide for how to query data directly using the HTTP API.

**Sample data**

The examples in this document use the same sample data as the [Data Exploration](../query_language/data_exploration.html) page. The data are described and are available for download on the [Sample Data](../sample_data/data_download.html) page.

# Aggregations

## COUNT()
Returns the number of non-null values in a single [field](https://influxdb.com/docs/v0.9/concepts/glossary.html#field). 
```sql
SELECT COUNT(<field_key>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

Examples:

* Count the number of non-null field values in the `water_level` field:
```sql
> SELECT COUNT(water_level) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               count
1970-01-01T00:00:00Z	 15258
``` 

> **Note:** InfluxDB often uses [epoch 0](https://en.wikipedia.org/wiki/Unix_time) (`1970-01-01T00:00:00Z`) as a null timestamp equivalent. If you request a query that has no timestamp to return, such as an aggregation function with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.

* Count the number of non-null field values in the `water_level` field at four-day intervals:
```sql
> SELECT COUNT(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-09-18T17:00:00Z' GROUP BY time(4d)
```

CLI response:
```sh
name: h2o_feet
--------------
time			               count
2015-08-17T00:00:00Z	 1440
2015-08-21T00:00:00Z	 1920
2015-08-25T00:00:00Z	 1920
2015-08-29T00:00:00Z	 1920
2015-09-02T00:00:00Z	 1915
2015-09-06T00:00:00Z	 1920
2015-09-10T00:00:00Z	 1920
2015-09-14T00:00:00Z	 1920
2015-09-18T00:00:00Z	 335
```

## DISTINCT()
Returns an array of the unique values in a single [field](../concepts/glossary.html#field).
```sql
SELECT DISTINCT(<field_key>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

Examples:

* Select the unique field values in the `level description` field:
```sql
> SELECT DISTINCT("level description") FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			                distinct
1970-01-01T00:00:00Z   [at or greater than 9 feet below 3 feet between 3 and 6 feet between 6 and 9 feet]
```

The response shows that `level description` has four distinct field values:  `at or greater than 9 feet`, `below 3 feet`, `between 3 and 6 feet`, and `between 6 and 9 feet`.

* Select the unique field values in the `level description` field grouped by the `location` tag:
```sql
> SELECT DISTINCT("level description") FROM h2o_feet GROUP BY location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			                distinct
----			                --------
1970-01-01T00:00:00Z	  [at or greater than 9 feet below 3 feet between 3 and 6 feet between 6 and 9 feet]


name: h2o_feet
tags: location = santa_monica
time			                distinct
----			                --------
1970-01-01T00:00:00Z	  [below 3 feet between 3 and 6 feet between 6 and 9 feet]
```

<dt> The returned timestamps mark the start of the relevant time interval for the query. See GitHub Issue [#4680](https://github.com/influxdb/influxdb/issues/4680) for more information. </dt>

* Nest `DISTINCT()` in [`COUNT()`](../query_language/functions.html#count) to get the number of unique field values in `level description` grouped by the `location` tag:

```sql
> SELECT COUNT(DISTINCT("level description")) FROM h2o_feet GROUP BY location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			               count
----			               -----
1970-01-01T00:00:00Z	 4

name: h2o_feet
tags: location = santa_monica
time			               count
----			               -----
1970-01-01T00:00:00Z	 3
```

## INTEGRAL()
`INTEGRAL()` is not yet functional. 

<dt> See GitHub Issue [#1400](https://github.com/influxdb/influxdb/issues/1400) for more information. </dt>

## MEAN()
Returns the arithmetic mean (average) for the values in a single [field](../concepts/glossary.html#field). The field type must be int64 or float64.
```sql
SELECT MEAN(<field_key>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

Examples:

* Calculate the average value of the `water_level` field:
```sql
> SELECT MEAN(water_level) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               mean
1970-01-01T00:00:00Z	 4.442107025822521
```

> **Note:** InfluxDB often uses [epoch 0](https://en.wikipedia.org/wiki/Unix_time) (`1970-01-01T00:00:00Z`) as a null timestamp equivalent. If you request a query that has no timestamp to return, such as an aggregation function with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.

* Calculate the average value in the field `water_level` at four-day intervals:
```sql
> SELECT MEAN(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-09-18T17:00:00Z' GROUP BY time(4d)
```

CLI response:
```sh
name: h2o_feet
--------------
time			               mean
2015-08-17T00:00:00Z	 4.322029861111109
2015-08-21T00:00:00Z	 4.227080729166667
2015-08-25T00:00:00Z	 4.2850364583333285
2015-08-29T00:00:00Z	 4.450500520833331
2015-09-02T00:00:00Z	 4.382785378590078
2015-09-06T00:00:00Z	 4.43194583333333
2015-09-10T00:00:00Z	 4.658127604166671
2015-09-14T00:00:00Z	 4.7635046875
2015-09-18T00:00:00Z	 4.232829850746268
```

## MEDIAN()
Returns the middle value from the sorted values in a single [field](../concepts/glossary.html#field). The field values must be of type int64 or float64. 

```sql
SELECT MEDIAN(<field_key>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

> **Note:** `MEDIAN()` is nearly equivalent to [`PERCENTILE(field_key, 50)`](../query_language/functions.html#percentile), except `MEDIAN()` returns the average of the two middle values if the field contains an even number of points.

Examples:

* Select the median value in the field `water_level`:
```sql
> SELECT MEDIAN(water_level) from h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               median
1970-01-01T00:00:00Z	 4.124
```

> **Note:** InfluxDB often uses [epoch 0](https://en.wikipedia.org/wiki/Unix_time) (`1970-01-01T00:00:00Z`) as a null timestamp equivalent. If you request a query that has no timestamp to return, such as an aggregation function with an unbounded time range, InfluxDB returns epoch 0 as the timestamp.

* Select the median value of `water_level` between August 18, 2015 at 00:00:00 and August 18, 2015 at 00:30:00 grouped by the `location` tag:
```sql
> SELECT MEDIAN(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-08-18T00:36:00Z' GROUP BY location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			               median
----			               ------
2015-08-18T00:00:00Z	 7.8245

name: h2o_feet
tags: location = santa_monica
time			               median
----			               ------
2015-08-18T00:00:00Z	 2.0575
```

<dt> The returned timestamps mark the start of the relevant time interval for the query. See GitHub Issue [#4680](https://github.com/influxdb/influxdb/issues/4680) for more information. </dt>

## SUM()
Returns the sum of the all values in a single [field](../concepts/glossary.html#field). The field must be of type int64 or float64.
```sql
SELECT SUM(<field_key>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

Examples:

* Calculate the sum of the values in the `water level` field:
```sql
> SELECT SUM(water_level) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               sum
1970-01-01T00:00:00Z	 67777.66900000001
```

* Calculate the sum of the `water level` field grouped by five-day intervals:
```sql
> SELECT SUM(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-09-18T17:00:00Z' GROUP BY time(5d)
```

CLI response:
```sh
name: h2o_feet
--------------
time			               sum
2015-08-18T00:00:00Z	 10334.908999999989
2015-08-23T00:00:00Z	 10113.357000000004
2015-08-28T00:00:00Z	 10663.682999999997
2015-09-02T00:00:00Z	 10451.321000000013
2015-09-07T00:00:00Z	 10871.817999999988
2015-09-12T00:00:00Z	 11459.001000000007
2015-09-17T00:00:00Z	 3627.7619999999997
```

# Selectors

## BOTTOM()
Returns the smallest `N` values in a single [field](../concepts/glossary.html#field). The field type must be int64 or float64.
```sql
SELECT BOTTOM(<field_key>[,<tag_keys>],<N>)[,<tag_keys>] FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

> **Note:** `BOTTOM()` is available in InfluxDB versions 0.9.5+.

Examples:

* Select the smallest three values of `water_level`:
```sql
> SELECT BOTTOM(water_level,3) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               bottom
2015-08-29T14:30:00Z	 -0.61
2015-08-29T14:36:00Z	 -0.591
2015-08-30T15:18:00Z	 -0.594
```

* Select the smallest three values of `water_level` and include the relevant `location` tag in the output:
```sql
> SELECT BOTTOM(water_level,3),location FROM h2o_feet
```

```sh
name: h2o_feet
--------------
time			               bottom	 location
2015-08-29T14:30:00Z	 -0.61	  coyote_creek
2015-08-29T14:36:00Z	 -0.591	 coyote_creek
2015-08-30T15:18:00Z	 -0.594	 coyote_creek
```

* Select the smallest value of `water_level` within each tag value of `location`: 
```sql
> SELECT BOTTOM(water_level,location,2) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               bottom	 location
2015-08-29T10:36:00Z	 -0.243	 santa_monica
2015-08-29T14:30:00Z	 -0.61	  coyote_creek
```

The output shows the bottom values of `water_level` for each tag value of `location` (`santa_monica` and `coyote_creek`).

> **Note:** Queries with the syntax `SELECT BOTTOM(<field_key>,<tag_key>,<N>)`, where the tag has `X` distinct values, return `N` or `X` field values, whichever is smaller, and each returned point has a unique tag value. To demonstrate this behavior, see the results of the above example query where `N` equals `3` and `N` equals `1`.

> * `N` = `3`

> ```sql
> > SELECT BOTTOM(water_level,location,3) FROM h2o_feet
> ```

> CLI response:

> ```sh
name: h2o_feet
--------------
time			         bottom	 location
2015-08-29T10:36:00Z	 -0.243	 santa_monica
2015-08-29T14:30:00Z	 -0.61	 coyote_creek
> ```

> InfluxDB returns two values instead of three because the `location` tag has only two values (`santa_monica` and `coyote_creek`).

> * `N` = `1`

> ```sql
> > SELECT BOTTOM(water_level,location,1) FROM h2o_feet
> ```

> CLI response:

> ```sh
name: h2o_feet
--------------
time			         bottom	 location
2015-08-29T14:30:00Z	 -0.61	 coyote_creek
> ```

> InfluxDB compares the bottom values of `water_level` within each tag value of `location` and returns the smaller value of `water_level`.

* Select the smallest two values of `water_level` between August 18, 2015 at 4:00:00 and August 18, 2015 at 4:18:00 for every tag value of `location`:

```sql
> SELECT BOTTOM(water_level,2) FROM h2o_feet WHERE time >= '2015-08-18T04:00:00Z' AND time < '2015-08-18T04:24:00Z' GROUP BY location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			               bottom
----			               ------
2015-08-18T04:00:00Z	 2.625
2015-08-18T04:00:00Z	 2.717

name: h2o_feet
tags: location = santa_monica
time			               bottom
----			               ------
2015-08-18T04:00:00Z	 3.911
2015-08-18T04:00:00Z	 4.055
```

<dt> The returned timestamps mark the start of the relevant time interval for the query. See GitHub Issue [#4680](https://github.com/influxdb/influxdb/issues/4680) for more information. </dt>

* Select the smallest two values of `water_level` between August 18, 2015 at 4:00:00 and August 18, 2015 at 4:18:00 in `santa_monica`:
```sql
> SELECT BOTTOM(water_level,2) FROM h2o_feet WHERE time >= '2015-08-18T04:00:00Z' AND time < '2015-08-18T04:24:00Z' AND location = 'santa_monica'
```

CLI response:
```sh
name: h2o_feet
--------------
time			               bottom
2015-08-18T04:00:00Z	 3.911
2015-08-18T04:06:00Z	 4.055
```

Note that in the raw data, `water_level` equals `4.055` at `2015-08-18T04:06:00Z` and at `2015-08-18T04:12:00Z`. In the case of a tie, InfluxDB returns the value with the earlier timestamp.

## FIRST()
Returns the oldest value (determined by the timestamp) of a single [field](../concepts/glossary.html#field). 
```sql
SELECT FIRST(<field_key>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

Examples:

* Select the oldest value of the field `water_level` where the `location` is `santa_monica`:
```sql
> SELECT FIRST(water_level) FROM h2o_feet WHERE location = 'santa_monica'
```

CLI response:
```sh
name: h2o_feet
--------------
time			               first
2015-08-18T00:00:00Z	 2.064
```

> **Note:** In versions prior to 0.9.5, InfluxDB returns epoch 0 (`1970-01-01T00:00:00Z`) as the timestamp.

* Select the oldest values of the field `water_level` grouped by the `location` tag:
```sql
> SELECT FIRST(water_level) FROM h2o_feet GROUP BY location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			               first
----			               -----
1970-01-01T00:00:00Z	 8.12

name: h2o_feet
tags: location = santa_monica
time			               first
----			               -----
1970-01-01T00:00:00Z	 2.064
```

<dt> The returned timestamps mark the start of the relevant time interval for the query. See GitHub Issue [#4680](https://github.com/influxdb/influxdb/issues/4680) for more information. </dt>

## LAST()
Returns the newest value (determined by the timestamp) of a single [field](../concepts/glossary.html#field).
```sql
SELECT LAST(<field_key>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

Examples:

* Select the newest value of the field `water_level` where the `location` is `santa_monica`:
```sql
> SELECT LAST(water_level) FROM h2o_feet WHERE location = 'santa_monica'
```

CLI response:
```sh
name: h2o_feet
--------------
time			               last
2015-09-18T21:42:00Z	 4.938
```

> **Note:** In versions prior to 0.9.5, InfluxDB returns epoch 0 (`1970-01-01T00:00:00Z`) as the timestamp.

* Select the newest values of the field `water_level` grouped by the `location` tag:
```sql
> SELECT LAST(water_level) FROM h2o_feet GROUP BY location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			               last
----			               ----
1970-01-01T00:00:00Z	 3.235

name: h2o_feet
tags: location = santa_monica
time			               last
----			               ----
1970-01-01T00:00:00Z	 4.938
```

<dt> The returned timestamps mark the start of the relevant time interval for the query. See GitHub Issue [#4680](https://github.com/influxdb/influxdb/issues/4680) for more information. </dt>

> **Note:** `LAST()` does not return points that occur after `now()` unless the `WHERE` clause specifies that time range. See [Frequently Encountered Issues](../troubleshooting/frequently_encountered_issues.html#querying-after-now) for how to query after `now()`.

## MAX()
Returns the highest value in a single [field](../concepts/glossary.html#field). The field must be of type int64 or float64.
```sql
SELECT MAX(<field_key>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

Examples:

* Select the maximum `water_level` in the measurement `h2o_feet`:
```sql
> SELECT MAX(water_level) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               max
2015-08-29T07:24:00Z	 9.964
```

> **Note:** In versions prior to 0.9.5, InfluxDB returns epoch 0 (`1970-01-01T00:00:00Z`) as the timestamp.

* Select the maximum `water_level` in the measurement `h2o_feet` between August 18, 2015 at midnight and August 18, 2015 at 00:48 grouped at 12 minute intervals and by the `location` tag:
```sql
> SELECT MAX(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-08-18T00:54:00Z' GROUP BY time(12m), location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			              max
----		  	            ---
2015-08-18T00:00:00Z	8.12
2015-08-18T00:12:00Z	7.887
2015-08-18T00:24:00Z	7.635
2015-08-18T00:36:00Z	7.372
2015-08-18T00:48:00Z	7.11

name: h2o_feet
tags: location = santa_monica
time			              max
----		  	            ---
2015-08-18T00:00:00Z	2.116
2015-08-18T00:12:00Z	2.126
2015-08-18T00:24:00Z	2.051
2015-08-18T00:36:00Z	2.067
2015-08-18T00:48:00Z	1.991
```

## MIN()
Returns the lowest value in a single [field](../concepts/glossary.html#field). The field must be of type int64 or float64.
```sql
SELECT MIN(<field_key>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

Examples:

* Select the minimum `water_level` in the measurement `h2o_feet`:
```sql
> SELECT MIN(water_level) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               min
2015-08-29T14:30:00Z	 -0.61
```

> **Note:** In versions prior to 0.9.5, InfluxDB returns epoch 0 (`1970-01-01T00:00:00Z`) as the timestamp.

* Select the minimum `water_level` in the measurement `h2o_feet` between August 18, 2015 at midnight and August 18, at 00:48 grouped at 12 minute intervals and by the `location` tag:
```sql
> SELECT MIN(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-08-18T00:54:00Z' GROUP BY time(12m), location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			               min
----			               ---
2015-08-18T00:00:00Z	 8.005
2015-08-18T00:12:00Z	 7.762
2015-08-18T00:24:00Z	 7.5
2015-08-18T00:36:00Z	 7.234
2015-08-18T00:48:00Z	 7.11


name: h2o_feet
tags: location = santa_monica
time			               min
----			               ---
2015-08-18T00:00:00Z	 2.064
2015-08-18T00:12:00Z	 2.028
2015-08-18T00:24:00Z	 2.041
2015-08-18T00:36:00Z	 2.057
2015-08-18T00:48:00Z	 1.991
```

## PERCENTILE()
Returns the `N`th percentile value for the sorted values of a single [field](../concepts/glossary.html#field). The field must be of type int64 or float64. The percentile `N` must be an integer or floating point number between 0 and 100, inclusive.
```sql
SELECT PERCENTILE(<field_key>, <N>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

Examples:

* Calculate the fifth percentile of the field `water_level` where the tag `location` equals `coyote_creek`:
```sql
> SELECT PERCENTILE(water_level,5) FROM h2o_feet WHERE location = 'coyote_creek'
```

CLI response:
```sh
name: h2o_feet
--------------
time			               percentile
1970-01-01T00:00:00Z	 1.148
```

 The value `1.148` is larger than 5% of the values in `water_level` where `location` equals `coyote_creek`. 

* Calculate the 100th percentile of the field `water_level` grouped by the `location` tag:
```sql
> SELECT PERCENTILE(water_level, 100) FROM h2o_feet GROUP BY location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			               percentile
----			               ----------
1970-01-01T00:00:00Z	 9.964

name: h2o_feet
tags: location = santa_monica
time			               percentile
----			               ----------
1970-01-01T00:00:00Z	 7.205
```

Notice that `PERCENTILE(<field_key>,100)` is equivalent to `MAX(<field_key>)`.

<dt> Currently, `PERCENTILE(<field_key>,0)` is not equivalent to `MIN(<field_key>)`. See GitHub Issue [#4724](https://github.com/influxdb/influxdb/issues/4724) for more information. </dt>

> **Note**: `PERCENTILE(<field_key>, 50)` is nearly equivalent to `MEDIAN()`, except `MEDIAN()` returns the average of the two middle values if the field contains an even number of points.

## TOP()
Returns the largest `N` values in a single [field](../concepts/glossary.html#field). The field type must be int64 or float64.
```sql
SELECT TOP(<field_key>[,<tag_keys>],<N>)[,<tag_keys>] FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

> **Note:** `TOP()` is available in InfluxDB versions 0.9.5+.

Examples:

* Select the largest three values of `water_level`:
```sql
> SELECT TOP(water_level,3) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               top
2015-08-29T07:18:00Z	 9.957
2015-08-29T07:24:00Z	 9.964
2015-08-29T07:30:00Z	 9.954
```

* Select the largest three values of `water_level` and include the relevant `location` tag in the output:
```sql
> SELECT TOP(water_level,3),location FROM h2o_feet
```

```sh
name: h2o_feet
--------------
time			               top	   location
2015-08-29T07:18:00Z	 9.957	 coyote_creek
2015-08-29T07:24:00Z	 9.964	 coyote_creek
2015-08-29T07:30:00Z	 9.954	 coyote_creek
```

* Select the largest value of `water_level` within each tag value of `location`: 
```sql
> SELECT TOP(water_level,location,2) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               top	   location
2015-08-29T03:54:00Z	 7.205	 santa_monica
2015-08-29T07:24:00Z	 9.964	 coyote_creek
```

The output shows the top values of `water_level` for each tag value of `location` (`santa_monica` and `coyote_creek`).

> **Note:** Queries with the syntax `SELECT TOP(<field_key>,<tag_key>,<N>)`, where the tag has `X` distinct values, return `N` or `X` field values, whichever is smaller, and each returned point has a unique tag value. To demonstrate this behavior, see the results of the above example query where `N` equals `3` and `N` equals `1`.

> * `N` = `3`

> ```sql
> > SELECT TOP(water_level,location,3) FROM h2o_feet
> ```

> CLI response:

> ```sh
name: h2o_feet
--------------
time			         top	 location
2015-08-29T03:54:00Z	 7.205	 santa_monica
2015-08-29T07:24:00Z	 9.964	 coyote_creek
> ```

> InfluxDB returns two values instead of three because the `location` tag has only two values (`santa_monica` and `coyote_creek`).

> * `N` = `1`

> ```sql
> > SELECT TOP(water_level,location,1) FROM h2o_feet
> ```

> CLI response:

> ```sh
name: h2o_feet
--------------
time			         top	 location
2015-08-29T07:24:00Z	 9.964	 coyote_creek
> ```

> InfluxDB compares the top values of `water_level` within each tag value of `location` and returns the larger value of `water_level`.

* Select the largest two values of `water_level` between August 18, 2015 at 4:00:00 and August 18, 2015 at 4:18:00 for every tag value of `location`:
```sql
> SELECT TOP(water_level,2) FROM h2o_feet WHERE time >= '2015-08-18T04:00:00Z' AND time < '2015-08-18T04:24:00Z' GROUP BY location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			               top
----			               ---
2015-08-18T04:00:00Z	 2.943
2015-08-18T04:00:00Z	 2.831

name: h2o_feet
tags: location = santa_monica
time			               top
----			               ---
2015-08-18T04:00:00Z	 4.124
2015-08-18T04:00:00Z	 4.055
```

<dt> The returned timestamps mark the start of the relevant time interval for the query. See GitHub Issue [#4680](https://github.com/influxdb/influxdb/issues/4680) for more information. </dt>

* Select the largest two values of `water_level` between August 18, 2015 at 4:00:00 and August 18, 2015 at 4:18:00 in `santa_monica`:
```sql
> SELECT TOP(water_level,2) FROM h2o_feet WHERE time >= '2015-08-18T04:00:00Z' AND time < '2015-08-18T04:24:00Z' AND location = 'santa_monica'
```

CLI response:
```sh
name: h2o_feet
--------------
time			               top
2015-08-18T04:06:00Z	 4.055
2015-08-18T04:18:00Z	 4.124
```

Note that in the raw data, `water_level` equals `4.055` at `2015-08-18T04:06:00Z` and at `2015-08-18T04:12:00Z`. In the case of a tie, InfluxDB returns the value with the earlier timestamp.

# Transformations

## CEILING()
`CEILING()` is not yet functional. 

<dt> See GitHub Issue [#3691](https://github.com/influxdb/influxdb/issues/3691) for more information. </dt>

## DERIVATIVE()
Returns the rate of change for the values in a single [field](../concepts/glossary.html#field) in a [series](../concepts/glossary.html#series). InfluxDB calculates the difference between chronological field values and converts those results into the rate of change per `unit`. The `unit` argument is optional and, if not specified, defaults to one second (`1s`).

The basic `DERIVATIVE()` query:
```sql
SELECT DERIVATIVE(<field_key>, [<unit>]) FROM <measurement_name> [WHERE <stuff>]
```

Valid time specifications for `unit` are:  
`u` microseconds  
`s` seconds  
`m` minutes  
`h` hours  
`d` days  
`w` weeks  

`DERIVATIVE()` also works with a nested function coupled with a `GROUP BY time()` clause. For queries that include those options, InfluxDB first performs the aggregation, selection, or transformation across the time interval specified in the `GROUP BY time()` clause and then carries out the same procedure outlined above.

The `DERIVATIVE()` query with an aggregation function and `GROUP BY time()` clause:
```sql
SELECT DERIVATIVE(AGGREGATION_FUNCTION(<field_key>),[<unit>]) FROM <measurement_name> WHERE <stuff> GROUP BY time(<aggregation_interval>)
```

Examples:

The following examples work with the first six observations of the `water_level` field in the measurement `h2o_feet` with the tag set `location = santa_monica`:
```sh
name: h2o_feet
--------------
time			               water_level
2015-08-18T00:00:00Z	 2.064
2015-08-18T00:06:00Z	 2.116
2015-08-18T00:12:00Z	 2.028
2015-08-18T00:18:00Z	 2.126
2015-08-18T00:24:00Z	 2.041
2015-08-18T00:30:00Z	 2.051
```

* `DERIVATIVE()` with a single argument:  
Calculate the rate of change per one second

```sql
> SELECT DERIVATIVE(water_level) FROM h2o_feet WHERE location = 'santa_monica' LIMIT 6
```

CLI response:
```sh
name: h2o_feet
--------------
time			               derivative
2015-08-18T00:06:00Z	 0.00014444444444444457
2015-08-18T00:12:00Z	 -0.00024444444444444465
2015-08-18T00:18:00Z	 0.0002722222222222218
2015-08-18T00:24:00Z	 -0.000236111111111111
2015-08-18T00:30:00Z	 2.777777777777842e-05
```

Notice that the first field value (`0.00014`) in the `derivative` column is **not** `0.052` (the difference between the first two field values in the raw data: `2.116` - `2.604` = `0.052`). Because the query does not specify the `unit` option, InfluxDB automatically calculates the rate of change per one second, not the rate of change per six minutes. The calculation of the first value in the `derivative` column looks like this:
<br>
<br>
```
(2.116 - 2.064) / (360s / 1s)
```

The numerator is the difference between chronological field values. The denominator is the difference between the relevant timestamps in seconds (`2015-08-18T00:06:00Z` - `2015-08-18T00:00:00Z` = `360s`) divided by `unit` (`1s`). This returns the rate of change per second from `2015-08-18T00:00:00Z` to `2015-08-18T00:06:00Z`.

* `DERIVATIVE()` with two arguments:  
Calculate the rate of change per six minutes

```sql
> SELECT DERIVATIVE(water_level,6m) FROM h2o_feet WHERE location = 'santa_monica' LIMIT 6
```

CLI response:
```sh
name: h2o_feet
--------------
time			               derivative
2015-08-18T00:06:00Z	 0.052000000000000046
2015-08-18T00:12:00Z	 -0.08800000000000008
2015-08-18T00:18:00Z	 0.09799999999999986
2015-08-18T00:24:00Z	 -0.08499999999999996
2015-08-18T00:30:00Z	 0.010000000000000231
```

The calculation of the first value in the `derivative` column looks like this:
<br>
<br>
```
(2.116 - 2.064) / (6m / 6m)
```

The numerator is the difference between chronological field values. The denominator is the difference between the relevant timestamps in minutes (`2015-08-18T00:06:00Z` - `2015-08-18T00:00:00Z` = `6m`) divided by `unit` (`6m`). This returns the rate of change per six minutes from `2015-08-18T00:00:00Z` to `2015-08-18T00:06:00Z`.

* `DERIVATIVE()` with two arguments:  
Calculate the rate of change per 12 minutes

```sql
> SELECT DERIVATIVE(water_level,12m) FROM h2o_feet WHERE location = 'santa_monica' LIMIT 6
```

CLI response:
```sh
name: h2o_feet
--------------
time			               derivative
2015-08-18T00:06:00Z	 0.10400000000000009
2015-08-18T00:12:00Z	 -0.17600000000000016
2015-08-18T00:18:00Z	 0.19599999999999973
2015-08-18T00:24:00Z	 -0.16999999999999993
2015-08-18T00:30:00Z	 0.020000000000000462
```

The calculation of the first value in the `derivative` column looks like this:
<br>
<br>
```
(2.116 - 2.064 / (6m / 12m)
```

The numerator is the difference between chronological field values. The denominator is the difference between the relevant timestamps in minutes (`2015-08-18T00:06:00Z` - `2015-08-18T00:00:00Z` = `6m`) divided by `unit` (`12m`). This returns the rate of change per 12 minutes from `2015-08-18T00:00:00Z` to `2015-08-18T00:06:00Z`.

> **Note:** Specifying `12m` as the `unit` **does not** mean that InfluxDB calculates the rate of change for every 12 minute interval of data. Instead, InfluxDB calculates the rate of change per 12 minutes for each interval of valid data.

* `DERIVATIVE()` with two arguments, a function, and a `GROUP BY time()` clause:  
Select the `MAX()` value at 12 minute intervals and calculate the rate of change per 12 minutes

```sql
> SELECT DERIVATIVE(MAX(water_level),12m) FROM h2o_feet WHERE location = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time < '2015-08-18T00:36:00Z' GROUP BY time(12m)
```

CLI response:
```sh
name: h2o_feet
--------------
time			               derivative
2015-08-18T00:12:00Z	 0.009999999999999787
2015-08-18T00:24:00Z	 -0.07499999999999973
```

To get those results, InfluxDB first aggregates the data by calculating the `MAX()` `water_level` at the time interval specified in the `GROUP BY time()` clause (`12m`). Those results look like this:
```sh
name: h2o_feet
--------------
time			               max
2015-08-18T00:00:00Z	 2.116
2015-08-18T00:12:00Z	 2.126
2015-08-18T00:24:00Z	 2.051
```

Second, InfluxDB calculates the rate of change per `unit` (`12m`) to get the results in the `derivative` column above. The calculation of the first value in the `derivative` column looks like this:
<br>
<br>
```
(2.126 - 2.116) / (12m / 12m)
```

The numerator is the difference between chronological field values. The denominator is the difference between the relevant timestamps in minutes (`2015-08-18T00:12:00Z` - `2015-08-18T00:00:00Z` = `12m`) divided by `unit` (`12m`). This returns rate of change per 12 minutes for the aggregated data from `2015-08-18T00:00:00Z` to `2015-08-18T00:12:00Z`.

* `DERIVATIVE()` with two arguments, a function, and a `GROUP BY time()` clause:  
Aggregate the data to 18 minute intervals and calculate the rate of change per six minutes

```sql
> SELECT DERIVATIVE(SUM(water_level),6m) FROM h2o_feet WHERE location = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time < '2015-08-18T00:36:00Z' GROUP BY time(18m)
```

CLI response:
```sh
name: h2o_feet
--------------
time			               derivative
2015-08-18T00:18:00Z	 0.0033333333333332624
```

To get those results, InfluxDB first aggregates the data by calculating the `SUM()` of `water_level` at the time interval specified in the `GROUP BY time()` clause (`18m`). The aggregated results look like this:
```sh
name: h2o_feet
--------------
time			               sum
2015-08-18T00:00:00Z	 6.208
2015-08-18T00:18:00Z	 6.218
```

Second, InfluxDB calculates the rate of change per `unit` (`6m`) to get the results in the `derivative` column above. The calculation of the first value in the `derivative` column looks like this:
<br>
<br>
```
(6.218 - 6.208) / (18m / 6m)
```

The numerator is the difference between chronological field values. The denominator is the difference between the relevant timestamps in minutes (`2015-08-18T00:18:00Z` - `2015-08-18T00:00:00Z` = `18m`) divided by `unit` (`6m`). This returns the rate of change per six minutes for the aggregated data from `2015-08-18T00:00:00Z` to `2015-08-18T00:18:00Z`.

## DIFFERENCE()
`DIFFERENCE()` is not yet functional. 

<dt> See GitHub Issue [#1825](https://github.com/influxdb/influxdb/issues/1825) for more information. </dt>

## FLOOR()
`FLOOR()` is not yet functional. 

<dt> See GitHub Issue [#3691](https://github.com/influxdb/influxdb/issues/3691) for more information. </dt>

## HISTOGRAM()
`HISTOGRAM()` is not yet functional. 

<dt> See GitHub Issue [#3674](https://github.com/influxdb/influxdb/issues/3674) for more information. </dt>

## NON_NEGATIVE_DERIVATIVE()
Returns the non-negative rate of change for the values in a single [field](../concepts/glossary.html#field) in a [series](../concepts/glossary.html#series). InfluxDB calculates the difference between chronological field values and converts those results into the rate of change per `unit`. The `unit` argument is optional and, if not specified, defaults to one second (`1s`).

The basic `NON_NEGATIVE_DERIVATIVE()` query:
```sql
SELECT NON_NEGATIVE_DERIVATIVE(<field_key>, [<unit>]) FROM <measurement_name> [WHERE <stuff>]
```

Valid time specifications for `unit` are:  
`u` microseconds  
`s` seconds  
`m` minutes  
`h` hours  
`d` days  
`w` weeks  

`NON_NEGATIVE_DERIVATIVE()` also works with a nested function coupled with a `GROUP BY time()` clause. For queries that include those options, InfluxDB first performs the aggregation, selection, or transformation across the time interval specified in the `GROUP BY time()` clause and then carries out the same procedure outlined above.

The `NON_NEGATIVE_DERIVATIVE()` query with an aggregation function and `GROUP BY time()` clause:
```sql
SELECT NON_NEGATIVE_DERIVATIVE(AGGREGATION_FUNCTION(<field_key>),[<unit>]) FROM <measurement_name> WHERE <stuff> GROUP BY time(<aggregation_interval>)
```

See [`DERIVATIVE()`](../query_language/functions.html#derivative) for example queries. All query results are the same for `DERIVATIVE()` and `NON_NEGATIVE_DERIVATIVE` except that `NON_NEGATIVE_DERIVATIVE()` returns only the positive values.

## STDDEV()
Returns the standard deviation of the values in a single [field](../concepts/glossary.html#field). The field must be of type int64 or float64.
```sql
SELECT STDDEV(<field_key>) FROM <measurement_name> [WHERE <stuff>] [GROUP BY <stuff>]
```

Examples:

* Calculate the standard deviation for the `water_level` field in the measurement `h2o_feet`:
```sql
> SELECT STDDEV(water_level) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               stddev
1970-01-01T00:00:00Z	 2.279144584196145
```

* Calculate the standard deviation for the `water_level` field between August 18, 2015 at midnight and September 18, 2015 at noon grouped at one week intervals and by the `location` tag:
```sql
> SELECT STDDEV(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' and time < '2015-09-18T12:06:00Z' GROUP BY time(1w), location
```

CLI response:
```sh
name: h2o_feet
tags: location = coyote_creek
time			               stddev
----			               ------
2015-08-13T00:00:00Z	 2.2437263080193985
2015-08-20T00:00:00Z	 2.121276150144719
2015-08-27T00:00:00Z	 3.0416122170786215
2015-09-03T00:00:00Z	 2.5348065025435207
2015-09-10T00:00:00Z	 2.584003954882673
2015-09-17T00:00:00Z	 2.2587514836274414

name: h2o_feet
tags: location = santa_monica
time			               stddev
----			               ------
2015-08-13T00:00:00Z	 1.11156344587553
2015-08-20T00:00:00Z	 1.0909849279082366
2015-08-27T00:00:00Z	 1.9870116180096962
2015-09-03T00:00:00Z	 1.3516778450902067
2015-09-10T00:00:00Z	 1.4960573811500588
2015-09-17T00:00:00Z	 1.075701669442093
```

## Rename the output column's title with `AS`

By default, queries that include a function output a column that has the same name as that function. If you'd like a different column name change it with an `AS` clause.

Before:
```sql
> SELECT MEAN(water_level) FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               mean
1970-01-01T00:00:00Z	 4.442107025822522
```

After:
```sql
> SELECT MEAN(water_level) AS dream_name FROM h2o_feet
```

CLI response:
```sh
name: h2o_feet
--------------
time			               dream_name
1970-01-01T00:00:00Z	 4.442107025822522
```
