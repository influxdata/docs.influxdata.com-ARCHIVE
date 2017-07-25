---
title: Differences Between InfluxDB 1.3 and 1.2
aliases:
    - influxdb/v1.3/concepts/013_vs_1/
    - influxdb/v1.3/concepts/012_vs_013/
    - influxdb/v1.3/concepts/011_vs_012/
    - influxdb/v1.3/concepts/010_vs_011/
    - influxdb/v1.3/concepts/09_vs_010/
    - influxdb/v1.3/concepts/08_vs_09/
menu:
  influxdb_1_3:
    weight: 40
    parent: administration
---

This page aims to ease the transition from InfluxDB 1.2 to InfluxDB 1.3.
For a comprehensive list of the differences between the versions
see [InfluxDB's Changelog](/influxdb/v1.3/about_the_project/releasenotes-changelog/).

### Content
* [TSI Release](#tsi-release)
* [Web Admin UI Removal](#web-admin-ui-removal)
* [Duration Unit Updates](#duration-unit-updates)
* [InfluxQL Updates](#influxql-updates)
  * [Operators](#operators)
  * [Functions](#functions)
  * [Other](#other)

## TSI Release
Version 1.3.0 marked the first official release of InfluxDB's new time series index (TSI) engine.

The TSI engine is a significant technical advancement in InfluxDB.
It offers a solution to the [time-structured merge tree](https://docs.influxdata.com/influxdb/v1.2/concepts/storage_engine/) engine's [high series cardinality issue](https://docs.influxdata.com/influxdb/v1.3/troubleshooting/frequently-asked-questions/#why-does-series-cardinality-matter).
With TSI, the number of series should be unbounded by the memory on the server hardware and the number of existing series will have a negligible impact on database startup time.
See Paul Dix's blogpost [Path to 1 Billion Time Series: InfluxDB High Cardinality Indexing Ready for Testing](https://www.influxdata.com/path-1-billion-time-series-influxdb-high-cardinality-indexing-ready-testing/) for additional information.

TSI is disabled by default in version 1.3.
To enable TSI, uncomment the [`index-version` setting](/influxdb/v1.3/administration/config/#index-version-inmem) and set it to `tsi1`.
The `index-version` setting is in the `[data]` section of the configuration file.
Next, restart your InfluxDB instance.

```
[data]
  dir = "/var/lib/influxdb/data"
  index-version = "tsi1"
```

## Web Admin UI Removal

In version 1.3, the web admin interface is no longer available in InfluxDB.
The interface does not run on port `8083` and InfluxDB ignores the `[admin]` section in the configuration file if that section is present.
[Chronograf](/chronograf/v1.3/) replaces the web admin interface with improved tooling for querying data, writing data, and database management.
See [Chronograf's transition guide](/chronograf/v1.3/guides/transition-web-admin-interface/) for more information.

## Duration Unit Updates

Duration units specify the time precision in InfluxQL queries and when writing data to InfluxDB.
Version 1.3 introduces two updates to duration units.

InfluxDB now supports the nanosecond (`ns`) duration literal.
The query below uses a [`GROUP BY time()` clause](/influxdb/v1.3/query_language/data_exploration/#group-by-time-intervals) to group [averages](/influxdb/v1.3/query_language/functions/#mean) into `1000000000` nanosecond buckets:
```
> SELECT MEAN("value") FROM "gopher" WHERE time >= 1497481480598711679 AND time <= 1497481484005926368 GROUP BY time(1000000000ns)
```

Version 1.3 also changes the way InfluxDB handles queries with an invalid duration unit.
In versions prior to 1.3, the system ignored invalid duration units and did not return an error.
In version 1.3, the system returns an error if the query includes an invalid duration unit.
The following query erroneously specifies oranges as a duration unit:

```
> SELECT MEAN("value") FROM "gopher" WHERE time >= 1497481480598711679 AND time <= 1497481484005926368 GROUP BY time(2oranges)
ERR: error parsing query: invalid duration
```

## InfluxQL Updates

### Operators

Version 1.3 introduces several new mathematical operators.
Follow the links below to learn more:

* [Modulo (`%`)](/influxdb/v1.3/query_language/math_operators/#modulo)
* [Bitwise AND (`&`)](/influxdb/v1.3/query_language/math_operators/#bitwise-and)
* [Bitwise OR (`|`)](/influxdb/v1.3/query_language/math_operators/#bitwise-or)
* [Bitwise Exclusive-OR (`^`)](/influxdb/v1.3/query_language/math_operators/#bitwise-exclusive-or)

### Functions

InfluxDB version 1.3 introduces two new functions and updates the behavior for the existing `TOP()` and `BOTTOM()` functions.

#### New function: `INTEGRAL()`

The `INTEGRAL()` function returns the area under the curve for subsequent [field values](/influxdb/v1.3/concepts/glossary/#field-value).
The query below returns the area under the curve (in seconds) for the field values associated with the `water_level` field key and in the `h2o_feet` measurement:

```
> SELECT INTEGRAL("water_level") FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z'

name: h2o_feet
time                  integral
----                  --------
1970-01-01T00:00:00Z  3732.66
```

See the [functions page](/influxdb/v1.3/query_language/functions/#integral) for detailed documentation.

#### New function: `NON_NEGATIVE_DIFFERENCE()`

The `NON_NEGATIVE_DIFFERENCE()` function returns the non-negative result of subtraction between subsequent [field values](/influxdb/v1.3/concepts/glossary/#field-value).
Non-negative results of subtraction include positive differences and differences that equal zero.
The query below returns the non-negative difference between subsequent field values in the `water_level` field key and in the `h2o_feet` measurement:

```
> SELECT NON_NEGATIVE_DIFFERENCE("water_level") FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND "location" = 'santa_monica'

name: h2o_feet
time                  non_negative_difference
----                  -----------------------
2015-08-18T00:06:00Z  0.052000000000000046
2015-08-18T00:18:00Z  0.09799999999999986
2015-08-18T00:30:00Z  0.010000000000000231
```

See the [functions page](/influxdb/v1.3/query_language/functions/#non-negative-difference) for detailed documentation.

#### Updated functions: `TOP()` and `BOTTOM()`

Version 1.3 introduces three major changes to the `TOP()` and `BOTTOM()` functions:

- `TOP()` and `BOTTOM()` no longer support other functions in 
the `SELECT` [clause](/influxdb/v1.3/query_language/data_exploration/#description-of-syntax). 
The following query returns an error:

    ```
    > SELECT TOP(value,1),MEAN(value) FROM "gopher"
    ERR: error parsing query: selector function top() cannot be combined with other functions
    ```
    
- `TOP()` and `BOTTOM()` now maintain tags as tags if the query includes a
[tag key](/influxdb/v1.3/concepts/glossary/#tag-key) as an argument. 
The [query below](/influxdb/v1.3/query_language/functions/#issue-3-bottom-tags-and-the-into-clause) 
preserves `location` as a tag in the newly-written data:

    ```
    > SELECT BOTTOM("water_level","location",2) INTO "bottom_water_levels" FROM "h2o_feet"
    name: result
    time                 written
    ----                 -------
    1970-01-01T00:00:00Z 2

    > SHOW TAG KEYS FROM "bottom_water_levels"
    name: bottom_water_levels
    tagKey
    ------
    location
    ```

- `TOP()` and `BOTTOM()` now preserve the timestamps in the original data when they're 
used with the [`GROUP BY time()` clause](/influxdb/v1.3/query_language/data_exploration/#group-by-time-intervals).
The [following query](/influxdb/v1.3/query_language/functions/#issue-1-top-with-a-group-by-time-clause) returns 
the points' original timestamps; the timestamps are not forced to match the start of the `GROUP BY time()` intervals:

    ```
    > SELECT TOP("water_level",2) FROM "h2o_feet" WHERE time >= '2015-08-18T00:00:00Z' AND time <= '2015-08-18T00:30:00Z' AND     "location" = 'santa_monica' GROUP BY time(18m)

    name: h2o_feet
    time                   top
    ----                   ------
                                 __
    2015-08-18T00:00:00Z  2.064 |
    2015-08-18T00:06:00Z  2.116 | <------- Greatest points for the first time interval
                                 __
                                 __
    2015-08-18T00:18:00Z  2.126 |
    2015-08-18T00:30:00Z  2.051 | <------- Greatest points for the second time interval
                                 __
    ```                             
                                

Review the functions page for a complete discussion of the [`TOP()` function](/influxdb/v1.3/query_language/functions/#top) and the [`BOTTOM()` function](/influxdb/v1.3/query_language/functions/#bottom).

### Other

#### Time zone clause
InfluxQL's new time zone clause returns the UTC offset for the specified timezone.
The query below returns the UTC offset for Chicago’s time zone:
```
    > SELECT "water_level" FROM "h2o_feet" WHERE "location" = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time <=      '2015-08-18T00:18:00Z' tz('America/Chicago')

    name: h2o_feet
    time                       water_level
    ----                       -----------
    2015-08-17T19:00:00-05:00  2.064
    2015-08-17T19:06:00-05:00  2.116
    2015-08-17T19:12:00-05:00  2.028
    2015-08-17T19:18:00-05:00  2.126
```
See the [data exploration page](/influxdb/v1.3/query_language/data_exploration/#the-time-zone-clause) for more information.

#### Continuous Queries

A defect was identified in the way that continuous queries were previously handling time ranges.  The result of that 
defect is that for certain time scales larger than 1d, the continuous queries had their time ranges miscalculated and 
were run at the incorrect time.

This has been addressed -- but this change may impact existing continuous queries which process data in time 
ranges larger than 1d.
Additional details [can be found here].(https://github.com/influxdata/influxdb/issues/8569)


#### CLI non-admin user updates
In versions prior to v1.3, [non-admin users](/influxdb/v1.3/query_language/authentication_and_authorization/#user-types-and-privileges) could not execute a `USE <database_name>` query in the [CLI](/influxdb/v1.3/tools/shell/) even if they had `READ` and/or `WRITE` permissions on that database.
Starting with version 1.3, non-admin users can execute the `USE <database_name>` query for databases on which they have `READ` and/or `WRITE` permissions.
See the [FAQ page](/influxdb/v1.3/troubleshooting/frequently-asked-questions/#how-can-a-non-admin-user-use-a-database-in-influxdb-s-cli) for more information.
