---
title: InfluxQL Continuous Queries

menu:
  influxdb_1_6:
    name: Continuous Queries
    weight: 50
    parent: InfluxQL
---


## Introduction

Continuous Queries (CQ) are InfluxQL queries that run automatically and
periodically on realtime data and store query results in a
specified measurement.

<table style="width:100%">
  <tr>
    <td><a href="#basic-syntax">Basic Syntax</a></td>
    <td><a href="#advanced-syntax">Advanced Syntax</a></td>
    <td><a href="#continuous-query-management">CQ Management</a></td>
  </tr>
  <tr>
    <td><a href="#examples-of-basic-syntax">Examples of Basic Syntax</a></td>
    <td><a href="#examples-of-advanced-syntax">Examples of Advanced Syntax</a></td>
    <td><a href="#continuous-query-use-cases">CQ Use Cases</a></td>
  </tr>
  <tr>
    <td><a href="#common-issues-with-basic-syntax">Common Issues with Basic Syntax</a></td>
    <td><a href="#common-issues-with-advanced-syntax">Common Issues with Advanced Syntax</a></td>
    <td><a href="#further-information">Further information</a></td>
  </tr>
</table>

## Syntax

### Basic syntax

```
CREATE CONTINUOUS QUERY <cq_name> ON <database_name>
BEGIN
  <cq_query>
END
```

#### Description of basic syntax

##### The cq_query
<br>
The `cq_query` requires a
[function](/influxdb/v1.6/concepts/glossary/#function),
an [`INTO` clause](/influxdb/v1.6/query_language/spec/#clauses),
and a [`GROUP BY time()` clause](/influxdb/v1.6/query_language/spec/#clauses):

```
SELECT <function[s]> INTO <destination_measurement> FROM <measurement> [WHERE <stuff>] GROUP BY time(<interval>)[,<tag_key[s]>]
```

>**Note:** Notice that the `cq_query` does not require a time range in a `WHERE` clause.
InfluxDB automatically generates a time range for the `cq_query` when it executes the CQ.
Any user-specified time ranges in the `cq_query`'s `WHERE` clause will be ignored
by the system.

##### Schedule and Coverage
<br>
CQs operate on realtime data.
They use the local server’s timestamp, the `GROUP BY time()` interval, and
InfluxDB's preset time boundaries to determine when to execute and what time
range to cover in the query.

CQs execute at the same interval as the `cq_query`'s `GROUP BY time()` interval,
and they run at the start of InfluxDB's preset time boundaries.
If the `GROUP BY time()` interval is one hour, the CQ executes at the start of
every hour.

When the CQ executes, it runs a single query for the time range between
[`now()`](/influxdb/v1.6/concepts/glossary/#now) and `now()` minus the
`GROUP BY time()` interval.
If the `GROUP BY time()` interval is one hour and the current time is 17:00,
the query's time range is between 16:00 and 16:59.999999999.

#### Examples of basic syntax

The examples below use the following sample data in the `transportation`
database.
The measurement `bus_data` stores 15-minute resolution data on the number of bus
`passengers` and `complaints`:

```
name: bus_data
--------------
time                   passengers   complaints
2016-08-28T07:00:00Z   5            9
2016-08-28T07:15:00Z   8            9
2016-08-28T07:30:00Z   8            9
2016-08-28T07:45:00Z   7            9
2016-08-28T08:00:00Z   8            9
2016-08-28T08:15:00Z   15           7
2016-08-28T08:30:00Z   15           7
2016-08-28T08:45:00Z   17           7
2016-08-28T09:00:00Z   20           7
```

##### Example 1: Automatically downsampling data
<br>
Use a simple CQ to automatically downsample data from a single field
and write the results to another measurement in the same database.

```
CREATE CONTINUOUS QUERY "cq_basic" ON "transportation"
BEGIN
  SELECT mean("passengers") INTO "average_passengers" FROM "bus_data" GROUP BY time(1h)
END
```

`cq_basic` calculates the average hourly number of passengers from the
`bus_data` measurement and stores the results in the `average_passengers`
measurement in the `transportation` database.

`cq_basic` executes at one-hour intervals, the same interval as the
`GROUP BY time()` interval.
Every hour, `cq_basic` runs a single query that covers the time range between
`now()` and `now()` minus the `GROUP BY time()` interval, that is, the time
range between `now()` and one hour prior to `now()`.

Annotated log output on the morning of August 28, 2016:

>
At **8:00** `cq_basic` executes a query with the time range `time >= '7:00' AND time < '08:00'`.
`cq_basic` writes one point to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T07:00:00Z   7
>
At **9:00** `cq_basic` executes a query with the time range `time >= '8:00' AND time < '9:00'`.
`cq_basic` writes one point to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T08:00:00Z   13.75

Results:
```
> SELECT * FROM "average_passengers"
name: average_passengers
------------------------
time                   mean
2016-08-28T07:00:00Z   7
2016-08-28T08:00:00Z   13.75
```

##### Example 2: Automatically downsampling data into another retention policy
<br>
[Fully qualify](/influxdb/v1.6/query_language/data_exploration/#the-basic-select-statement)
the destination measurement to store the downsampled data in a non-`DEFAULT`
[retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) (RP).

```
CREATE CONTINUOUS QUERY "cq_basic_rp" ON "transportation"
BEGIN
  SELECT mean("passengers") INTO "transportation"."three_weeks"."average_passengers" FROM "bus_data" GROUP BY time(1h)
END
```

`cq_basic_rp` calculates the average hourly number of passengers from the
`bus_data` measurement and stores the results in the `transportation` database,
the `three_weeks` RP, and the `average_passengers` measurement.

`cq_basic_rp` executes at one-hour intervals, the same interval as the
`GROUP BY time()` interval.
Every hour, `cq_basic_rp` runs a single query that covers the time range between
`now()` and `now()` minus the `GROUP BY time()` interval, that is, the time
range between `now()` and one hour prior to `now()`.

Annotated log output on the morning of August 28, 2016:

>
At **8:00** `cq_basic_rp` executes a query with the time range `time >= '7:00' AND time < '8:00'`.
`cq_basic_rp` writes one point to the `three_weeks` RP and the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T07:00:00Z   7
>
At **9:00** `cq_basic_rp` executes a query with the time range
`time >= '8:00' AND time < '9:00'`.
`cq_basic_rp` writes one point to the `three_weeks` RP and the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T08:00:00Z   13.75

Results:
```
> SELECT * FROM "transportation"."three_weeks"."average_passengers"
name: average_passengers
------------------------
time                   mean
2016-08-28T07:00:00Z   7
2016-08-28T08:00:00Z   13.75
```

`cq_basic_rp` uses CQs and retention policies to automatically downsample data
and keep those downsampled data for an alternative length of time.
See the [Downsampling and Data Retention](/influxdb/v1.6/guides/downsampling_and_retention/)
guide for an in-depth discussion about this CQ use case.

##### Example 3: Automatically downsampling a database with backreferencing
<br>
Use a function with a wildcard (`*`) and `INTO` query's
[backreferencing syntax](/influxdb/v1.6/query_language/data_exploration/#the-into-clause)
to automatically downsample data from all measurements and numerical fields in
a database.

```
CREATE CONTINUOUS QUERY "cq_basic_br" ON "transportation"
BEGIN
  SELECT mean(*) INTO "downsampled_transportation"."autogen".:MEASUREMENT FROM /.*/ GROUP BY time(30m),*
END
```

`cq_basic_br` calculates the 30-minute average of `passengers` and `complaints`
from every measurement in the `transportation` database (in this case, there's only the
`bus_data` measurement).
It stores the results in the `downsampled_transportation` database.

`cq_basic_br` executes at 30 minutes intervals, the same interval as the
`GROUP BY time()` interval.
Every 30 minutes, `cq_basic_br` runs a single query that covers the time range
between `now()` and `now()` minus the `GROUP BY time()` interval, that is,
the time range between `now()` and 30 minutes prior to `now()`.


Annotated log output on the morning of August 28, 2016:

>
At **7:30**, `cq_basic_br` executes a query with the time range `time >= '7:00' AND time < '7:30'`.
`cq_basic_br` writes two points to the `bus_data` measurement in the `downsampled_transportation` database:
>
    name: bus_data
    --------------
    time                   mean_complaints   mean_passengers
    2016-08-28T07:00:00Z   9                 6.5
>
At **8:00**, `cq_basic_br` executes a query with the time range `time >= '7:30' AND time < '8:00'`.
`cq_basic_br` writes two points to the `bus_data` measurement in the `downsampled_transportation` database:
>
    name: bus_data
    --------------
    time                   mean_complaints   mean_passengers
    2016-08-28T07:30:00Z   9                 7.5
>
[...]
>
At **9:00**, `cq_basic_br` executes a query with the time range `time >= '8:30' AND time < '9:00'`.
`cq_basic_br` writes two points to the `bus_data` measurement in the `downsampled_transportation` database:
>
    name: bus_data
    --------------
    time                   mean_complaints   mean_passengers
    2016-08-28T08:30:00Z   7                 16


Results:

```
> SELECT * FROM "downsampled_transportation."autogen"."bus_data"
name: bus_data
--------------
time                   mean_complaints   mean_passengers
2016-08-28T07:00:00Z   9                 6.5
2016-08-28T07:30:00Z   9                 7.5
2016-08-28T08:00:00Z   8                 11.5
2016-08-28T08:30:00Z   7                 16
```

##### Example 4: Automatically downsampling data and configuring CQ time boundaries
<br>
Use an
[offset interval](/influxdb/v1.6/query_language/data_exploration/#advanced-group-by-time-syntax)
in the `GROUP BY time()` clause to alter both the CQ's default execution time and
preset time boundaries.

```
CREATE CONTINUOUS QUERY "cq_basic_offset" ON "transportation"
BEGIN
  SELECT mean("passengers") INTO "average_passengers" FROM "bus_data" GROUP BY time(1h,15m)
END
```

`cq_basic_offset`calculates the average hourly number of passengers from the
`bus_data` measurement and stores the results in the `average_passengers`
measurement.

`cq_basic_offset` executes at one-hour intervals, the same interval as the
`GROUP BY time()` interval.
The 15 minute offset interval forces the CQ to execute 15 minutes after the
default execution time; `cq_basic_offset` executes at 8:15 instead of 8:00.

Every hour, `cq_basic_offset` runs a single query that covers the time range
between `now()` and `now()` minus the `GROUP BY time()` interval, that is, the
time range between `now()` and one hour prior to `now()`.
The 15 minute offset interval shifts forward the generated preset time boundaries in the
CQ's `WHERE` clause; `cq_basic_offset` queries between 7:15 and 8:14.999999999 instead of 7:00 and 7:59.999999999.

Annotated log output on the morning of August 28, 2016:

>
At **8:15** `cq_basic_offset` executes a query with the time range `time >= '7:15' AND time < '8:15'`.
`cq_basic_offset` writes one point to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T07:15:00Z   7.75
>
At **9:15** `cq_basic_offset` executes a query with the time range `time >= '8:15' AND time < '9:15'`.
`cq_basic_offset` writes one point to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T08:15:00Z   16.75

Results:
```
> SELECT * FROM "average_passengers"
name: average_passengers
------------------------
time                   mean
2016-08-28T07:15:00Z   7.75
2016-08-28T08:15:00Z   16.75
```
Notice that the timestamps are for 7:15 and 8:15 instead of 7:00 and 8:00.

#### Common issues with basic syntax

##### Issue 1: Handling time intervals with no data
<br>
CQs do not write any results for a time interval if no data fall within that
time range.

Note that the basic syntax does not support using
[`fill()`](/influxdb/v1.6/query_language/data_exploration/#group-by-time-intervals-and-fill)
to change the value reported for intervals with no data.
Basic syntax CQs ignore `fill()` if it's included in the CQ query.
A possible workaround is to use the
[advanced CQ syntax](#example-4-configuring-cq-time-ranges-and-filling-empty-results).

##### Issue 2: Resampling previous time intervals
<br>
The basic CQ runs a single query that covers the time range between `now()`
and `now()` minus the `GROUP BY time()` interval.
See the [advanced syntax](#advanced-syntax) for how to configure the query's
time range.

##### Issue 3: Backfilling results for older data
<br>
CQs operate on realtime data, that is, data with timestamps that occur
relative to [`now()`](/influxdb/v1.6/concepts/glossary/#now).
Use a basic
[`INTO` query](/influxdb/v1.6/query_language/data_exploration/#the-into-clause)
to backfill results for data with older timestamps.

##### Issue 4: Missing tags in the CQ results
<br>
By default, all
[`INTO` queries](/influxdb/v1.6/query_language/data_exploration/#the-into-clause)
convert any tags in the source measurement to fields in the destination
measurement.

Include `GROUP BY *` in the CQ to preserve tags in the destination measurement.

### Advanced syntax

```
CREATE CONTINUOUS QUERY <cq_name> ON <database_name>
RESAMPLE EVERY <interval> FOR <interval>
BEGIN
  <cq_query>
END
```

#### Description of advanced syntax

##### The cq_query
<br>
See [ Description of Basic Syntax](/influxdb/v1.6/query_language/continuous_queries/#description-of-basic-syntax).

##### Scheduling and coverage
<br>
CQs operate on realtime data. With the advanced syntax, CQs use the local
server’s timestamp, the information in the `RESAMPLE` clause, and InfluxDB's
preset time boundaries to determine when to execute and what time range to
cover in the query.

CQs execute at the same interval as the `EVERY` interval in the `RESAMPLE`
clause, and they run at the start of InfluxDB’s preset time boundaries.
If the `EVERY` interval is two hours, InfluxDB executes the CQ at the top of
every other hour.

When the CQ executes, it runs a single query for the time range between
[`now()`](/influxdb/v1.6/concepts/glossary/#now) and `now()` minus the `FOR` interval in the `RESAMPLE` clause.
If the `FOR` interval is two hours and the current time is 17:00, the query's
time range is between 15:00 and 16:59.999999999.

Both the `EVERY` interval and the `FOR` interval accept
[duration literals](/influxdb/v1.6/query_language/spec/#durations).
The `RESAMPLE` clause works with either or both of the `EVERY` and `FOR` intervals
configured.
CQs default to the relevant
[basic syntax behavior](/influxdb/v1.6/query_language/continuous_queries/#description-of-basic-syntax)
if the `EVERY` interval or `FOR` interval is not provided (see the first issue in
[Common Issues with Advanced Syntax](/influxdb/v1.6/query_language/continuous_queries/#common-issues-with-advanced-syntax)
for an anomalistic case).

#### Examples of advanced syntax

The examples below use the following sample data in the `transportation` database.
The measurement `bus_data` stores 15-minute resolution data on the number of bus
`passengers`:
```
name: bus_data
--------------
time                   passengers
2016-08-28T06:30:00Z   2
2016-08-28T06:45:00Z   4
2016-08-28T07:00:00Z   5
2016-08-28T07:15:00Z   8
2016-08-28T07:30:00Z   8
2016-08-28T07:45:00Z   7
2016-08-28T08:00:00Z   8
2016-08-28T08:15:00Z   15
2016-08-28T08:30:00Z   15
2016-08-28T08:45:00Z   17
2016-08-28T09:00:00Z   20
```

##### Example 1: Configuring execution intervals
<br>
Use an `EVERY` interval in the `RESAMPLE` clause to specify the CQ's execution
interval.

```
CREATE CONTINUOUS QUERY "cq_advanced_every" ON "transportation"
RESAMPLE EVERY 30m
BEGIN
  SELECT mean("passengers") INTO "average_passengers" FROM "bus_data" GROUP BY time(1h)
END
```

`cq_advanced_every` calculates the one-hour average of `passengers`
from the `bus_data` measurement and stores the results in the
`average_passengers` measurement in the `transportation` database.

`cq_advanced_every` executes at 30-minute intervals, the same interval as the
`EVERY` interval.
Every 30 minutes, `cq_advanced_every` runs a single query that covers the time
range for the current time bucket, that is, the one-hour time bucket that
intersects with `now()`.

Annotated log output on the morning of August 28, 2016:

>
At **8:00**, `cq_advanced_every` executes a query with the time range `WHERE time >= '7:00' AND time < '8:00'`.
`cq_advanced_every` writes one point to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T07:00:00Z   7
>
At **8:30**, `cq_advanced_every` executes a query with the time range `WHERE time >= '8:00' AND time < '9:00'`.
`cq_advanced_every` writes one point to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T08:00:00Z   12.6667
>
At **9:00**, `cq_advanced_every` executes a query with the time range `WHERE time >= '8:00' AND time < '9:00'`.
`cq_advanced_every` writes one point to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T08:00:00Z   13.75


Results:
```
> SELECT * FROM "average_passengers"
name: average_passengers
------------------------
time                   mean
2016-08-28T07:00:00Z   7
2016-08-28T08:00:00Z   13.75
```

Notice that `cq_advanced_every` calculates the result for the 8:00 time interval
twice.
First, it runs at 8:30 and calculates the average for every available data point
between 8:00 and 9:00 (`8`,`15`, and `15`).
Second, it runs at 9:00 and calculates the average for every available data
point between 8:00 and 9:00 (`8`, `15`, `15`, and `17`).
Because of the way InfluxDB
[handles duplicate points](/influxdb/v1.6/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-duplicate-points)
, the second result simply overwrites the first result.

##### Example 2: Configuring time ranges for resampling
<br>
Use a `FOR` interval in the `RESAMPLE` clause to specify the length of the CQ's
time range.

```
CREATE CONTINUOUS QUERY "cq_advanced_for" ON "transportation"
RESAMPLE FOR 1h
BEGIN
  SELECT mean("passengers") INTO "average_passengers" FROM "bus_data" GROUP BY time(30m)
END
```

`cq_advanced_for` calculates the 30-minute average of `passengers`
from the `bus_data` measurement and stores the results in the `average_passengers`
measurement in the `transportation` database.

`cq_advanced_for` executes at 30-minute intervals, the same interval as the
`GROUP BY time()` interval.
Every 30 minutes, `cq_advanced_for` runs a single query that covers the time
range between `now()` and `now()` minus the `FOR` interval, that is, the time
range between `now()` and one hour prior to `now()`.

Annotated log output on the morning of August 28, 2016:

>
At **8:00** `cq_advanced_for` executes a query with the time range `WHERE time >= '7:00' AND time < '8:00'`.
`cq_advanced_for` writes two points to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T07:00:00Z   6.5
    2016-08-28T07:30:00Z   7.5
>
At **8:30** `cq_advanced_for` executes a query with the time range  `WHERE time >= '7:30' AND time < '8:30'`.
`cq_advanced_for` writes two points to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T07:30:00Z   7.5
    2016-08-28T08:00:00Z   11.5
>
At **9:00** `cq_advanced_for` executes a query with the time range `WHERE time >= '8:00' AND time < '9:00'`.
`cq_advanced_for` writes two points to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T08:00:00Z   11.5
    2016-08-28T08:30:00Z   16


Notice that `cq_advanced_for` will calculate the result for every time interval
twice.
The CQ calculates the average for the 7:30 time interval at 8:00 and at 8:30,
and it calculates the average for the 8:00 time interval at 8:30 and 9:00.

Results:
```
> SELECT * FROM "average_passengers"
name: average_passengers
------------------------
time                   mean
2016-08-28T07:00:00Z   6.5
2016-08-28T07:30:00Z   7.5
2016-08-28T08:00:00Z   11.5
2016-08-28T08:30:00Z   16
```

##### Example 3: Configuring execution intervals and CQ time ranges
<br>
Use an `EVERY` interval and `FOR` interval in the `RESAMPLE` clause to specify
the CQ's execution interval and the length of the CQ's time range.

```
CREATE CONTINUOUS QUERY "cq_advanced_every_for" ON "transportation"
RESAMPLE EVERY 1h FOR 90m
BEGIN
  SELECT mean("passengers") INTO "average_passengers" FROM "bus_data" GROUP BY time(30m)
END
```

`cq_advanced_every_for` calculates the 30-minute average of
`passengers` from the `bus_data` measurement and stores the results in the
`average_passengers` measurement in the `transportation` database.

`cq_advanced_every_for` executes at one-hour intervals, the same interval as the
`EVERY` interval.
Every hour, `cq_advanced_every_for` runs a single query that covers the time
range between `now()` and `now()` minus the `FOR` interval, that is, the time
range between `now()` and 90 minutes prior to `now()`.

Annotated log output on the morning of August 28, 2016:

>
At **8:00** `cq_advanced_every_for` executes a query with the time range `WHERE time >= '6:30' AND time < '8:00'`.
`cq_advanced_every_for` writes three points to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T06:30:00Z   3
    2016-08-28T07:00:00Z   6.5
    2016-08-28T07:30:00Z   7.5
>
At **9:00** `cq_advanced_every_for` executes a query with the time range `WHERE time >= '7:30' AND time < '9:00'`.
`cq_advanced_every_for` writes three points to the `average_passengers` measurement:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T07:30:00Z   7.5
    2016-08-28T08:00:00Z   11.5
    2016-08-28T08:30:00Z   16

Notice that `cq_advanced_every_for` will calculate the result for every time
interval twice.
The CQ calculates the average for the 7:30 interval at 8:00 and 9:00.

Results:
```
> SELECT * FROM "average_passengers"
name: average_passengers
------------------------
time                   mean
2016-08-28T06:30:00Z   3
2016-08-28T07:00:00Z   6.5
2016-08-28T07:30:00Z   7.5
2016-08-28T08:00:00Z   11.5
2016-08-28T08:30:00Z   16
```

##### Example 4: Configuring CQ time ranges and filling empty results
<br>
Use a `FOR` interval and `fill()` to change the value reported for time
intervals with no data.
Note that at least one data point must fall within the `FOR` interval for `fill()`
to operate.
If no data fall within the `FOR` interval the CQ writes no points to the
destination measurement.

```
CREATE CONTINUOUS QUERY "cq_advanced_for_fill" ON "transportation"
RESAMPLE FOR 2h
BEGIN
  SELECT mean("passengers") INTO "average_passengers" FROM "bus_data" GROUP BY time(1h) fill(1000)
END
```

`cq_advanced_for_fill` calculates the one-hour average of `passengers` from the
`bus_data` measurement and stores the results in the `average_passengers`
measurement in the `transportation` database.
Where possible, it writes the value `1000` for time intervals with no results.

`cq_advanced_for_fill` executes at one-hour intervals, the same interval as the
`GROUP BY time()` interval.
Every hour, `cq_advanced_for_fill` runs a single query that covers the time
range between `now()` and `now()` minus the `FOR` interval, that is, the time
range between `now()` and two hours prior to `now()`.

Annotated log output on the morning of August 28, 2016:

>
At **6:00**, `cq_advanced_for_fill` executes a query with the time range `WHERE time >= '4:00' AND time < '6:00'`.
`cq_advanced_for_fill` writes nothing to `average_passengers`; `bus_data` has no data
that fall within that time range.
>
At **7:00**, `cq_advanced_for_fill` executes a query with the time range `WHERE time >= '5:00' AND time < '7:00'`.
`cq_advanced_for_fill` writes two points to `average_passengers`:
>
    name: average_passengers
    ------------------------
    time                   mean
    2016-08-28T05:00:00Z   1000          <------ fill(1000)
    2016-08-28T06:00:00Z   3             <------ average of 2 and 4
>
[...]
>
At **11:00**, `cq_advanced_for_fill` executes a query with the time range `WHERE time >= '9:00' AND time < '11:00'`.
`cq_advanced_for_fill` writes two points to `average_passengers`:
>
    name: average_passengers
    ------------------------
    2016-08-28T09:00:00Z   20            <------ average of 20
    2016-08-28T10:00:00Z   1000          <------ fill(1000)
>
At **12:00**, `cq_advanced_for_fill` executes a query with the time range `WHERE time >= '10:00' AND time < '12:00'`.
`cq_advanced_for_fill` writes nothing to `average_passengers`; `bus_data` has no data
that fall within that time range.

Results:
```
> SELECT * FROM "average_passengers"
name: average_passengers
------------------------
time                   mean
2016-08-28T05:00:00Z   1000
2016-08-28T06:00:00Z   3
2016-08-28T07:00:00Z   7
2016-08-28T08:00:00Z   13.75
2016-08-28T09:00:00Z   20
2016-08-28T10:00:00Z   1000
```

> **Note:** `fill(previous)` doesn’t fill the result for a time interval if the
previous value is outside the query’s time range.
See [Frequently Asked Questions](/influxdb/v1.6/troubleshooting/frequently-asked-questions/#why-does-fill-previous-return-empty-results)
for more information.

#### Common issues with advanced syntax

##### Issue 1: If the `EVERY` interval is greater than the `GROUP BY time()` interval
<br>
If the `EVERY` interval is greater than the `GROUP BY time()` interval, the CQ
executes at the same interval as the `EVERY` interval and runs a single query
that covers the time range between `now()` and `now()` minus the `EVERY`
interval (not between `now()` and `now()` minus the `GROUP BY time()` interval).

For example, if the `GROUP BY time()` interval is `5m` and the `EVERY` interval
is `10m`, the CQ executes every ten minutes.
Every ten minutes, the CQ runs a single query that covers the time range
between `now()` and `now()` minus the `EVERY` interval, that is, the time
range between `now()` and ten minutes prior to `now()`.

This behavior is intentional and prevents the CQ from missing data between
execution times.

##### Issue 2: If the `FOR` interval is less than the execution interval
<br>
If the `FOR` interval is less than the `GROUP BY time()` interval or, if
specified, the `EVERY` interval, InfluxDB returns the following error:

```
error parsing query: FOR duration must be >= GROUP BY time duration: must be a minimum of <minimum-allowable-interval> got <user-specified-interval>
```

To avoid missing data between execution times, the `FOR` interval must be equal
to or greater than the `GROUP BY time()` interval or, if specified, the `EVERY`
interval.

Currently, this is the intended behavior.
GitHub Issue [#6963](https://github.com/influxdata/influxdb/issues/6963)
outlines a feature request for CQs to support gaps in data coverage.

## Continuous query management

Only admin users are allowed to work with CQs. For more on user privileges, see [Authentication and Authorization](/influxdb/v1.6/administration/authentication_and_authorization/#user-types-and-privileges).

### Listing Continuous Queries

List every CQ on an InfluxDB instance with:
```
SHOW CONTINUOUS QUERIES
```
`SHOW CONTINUOUS QUERIES` groups results by database.
##### Example
<br>
The output shows that the `telegraf` and `mydb` databases have CQs:
```
> SHOW CONTINUOUS QUERIES
name: _internal
---------------
name   query


name: telegraf
--------------
name           query
idle_hands     CREATE CONTINUOUS QUERY idle_hands ON telegraf BEGIN SELECT min(usage_idle) INTO telegraf.autogen.min_hourly_cpu FROM telegraf.autogen.cpu GROUP BY time(1h) END
feeling_used   CREATE CONTINUOUS QUERY feeling_used ON telegraf BEGIN SELECT mean(used) INTO downsampled_telegraf.autogen.:MEASUREMENT FROM telegraf.autogen./.*/ GROUP BY time(1h) END


name: downsampled_telegraf
--------------------------
name   query


name: mydb
----------
name      query
vampire   CREATE CONTINUOUS QUERY vampire ON mydb BEGIN SELECT count(dracula) INTO mydb.autogen.all_of_them FROM mydb.autogen.one GROUP BY time(5m) END
```

### Deleting Continuous Queries

Delete a CQ from a specific database with:
```
DROP CONTINUOUS QUERY <cq_name> ON <database_name>
```
`DROP CONTINUOUS QUERY` returns an empty result.
##### Example
<br>
Drop the `idle_hands` CQ from the `telegraf` database:
```
> DROP CONTINUOUS QUERY "idle_hands" ON "telegraf"`
>
```

### Altering Continuous Queries

CQs cannot be altered once they're created.
To change a CQ, you must `DROP` and re`CREATE` it with the updated settings.

### Continuous Query Statistics

If `query-stats-enabled` is set to `true` in your `influxdb.conf` or using the `INFLUXDB_CONTINUOUS_QUERIES_QUERY_STATS_ENABLED` environment variable, data will be written to `_internal` with information about when continuous queries ran and their duration.
Information about CQ configuration settings is available in the [Configuration](/influxdb/v1.6/administration/config/#continuous-queries-settings-continuous-queries) documentation.

> **Note:** `_internal` houses internal system data and is meant for internal use.
The structure of and data stored in `_internal` can change at any time.
Use of this data falls outside the scope of official InfluxData support.

## Continuous Query Use Cases

### Downsampling and Data Retention

Use CQs with InfluxDB's
[retention policies](/influxdb/v1.6/concepts/glossary/#retention-policy-rp)
(RPs) to mitigate storage concerns.
Combine CQs and RPs to automatically downsample high precision data to a lower
precision and remove the dispensable, high precision data from the database.

See the
[Downsampling and Data Retention](/influxdb/v1.6/guides/downsampling_and_retention/)
guide for a detailed walkthrough of this common use case.

### Precalculating expensive queries

Shorten query runtimes by pre-calculating expensive queries with CQs.
Use a CQ to automatically downsample commonly-queried, high precision data to a
lower precision.
Queries on lower precision data require fewer resources and return faster.

**Tip:** Pre-calculate queries for your preferred graphing tool to accelerate
the population of graphs and dashboards.

### Substituting for a `HAVING` Clause

InfluxQL does not support [`HAVING` clauses](https://en.wikipedia.org/wiki/Having_%28SQL%29).
Get the same functionality by creating a CQ to aggregate the data and querying
the CQ results to apply the `HAVING` clause.

> **Note:** InfluxQL supports [subqueries](/influxdb/v1.6/query_language/data_exploration/#subqueries) which also offer similar functionality to `HAVING` clauses.
See [Data Exploration](/influxdb/v1.6/query_language/data_exploration/#subqueries) for more information.

##### Example
<br>
InfluxDB does not accept the following query with a `HAVING` clause.
The query calculates the average number of `bees` at `30` minute intervals and
requests averages that are greater than `20`.
```
SELECT mean("bees") FROM "farm" GROUP BY time(30m) HAVING mean("bees") > 20
```

To get the same results:

**1. Create a CQ**
<br>
This step performs the `mean("bees")` part of the query above.
Because this step creates CQ you only need to execute it once.

The following CQ automatically calculates the average number of `bees` at
`30` minutes intervals and writes those averages to the `mean_bees` field in the
`aggregate_bees` measurement.

```
CREATE CONTINUOUS QUERY "bee_cq" ON "mydb" BEGIN SELECT mean("bees") AS "mean_bees" INTO "aggregate_bees" FROM "farm" GROUP BY time(30m) END
```

**2. Query the CQ results**
<br>
This step performs the `HAVING mean("bees") > 20` part of the query above.

Query the data in the measurement `aggregate_bees` and request values of the `mean_bees` field that are greater than `20` in the `WHERE` clause:

```
SELECT "mean_bees" FROM "aggregate_bees" WHERE "mean_bees" > 20
```

### Substituting for nested functions

Some InfluxQL functions
[support nesting](/influxdb/v1.6/troubleshooting/frequently-asked-questions/#which-influxql-functions-support-nesting)
of other functions.
Most do not.
If your function does not support nesting, you can get the same functionality using a CQ to calculate
the inner-most function.
Then simply query the CQ results to calculate the outer-most function.

> **Note:** InfluxQL supports [subqueries](/influxdb/v1.6/query_language/data_exploration/#subqueries) which also offer the same functionality as nested functions.
See [Data Exploration](/influxdb/v1.6/query_language/data_exploration/#subqueries) for more information.

##### Example
<br>
InfluxDB does not accept the following query with a nested function.
The query calculates the number of non-null values
of `bees` at `30` minute intervals and the average of those counts:
```
SELECT mean(count("bees")) FROM "farm" GROUP BY time(30m)
```

To get the same results:

**1. Create a CQ**
<br>
This step performs the `count("bees")` part of the nested function above.
Because this step creates a CQ you only need to execute it once.

The following CQ automatically calculates the number of non-null values of `bees` at `30` minute intervals
and writes those counts to the `count_bees` field in the `aggregate_bees` measurement.
```
CREATE CONTINUOUS QUERY "bee_cq" ON "mydb" BEGIN SELECT count("bees") AS "count_bees" INTO "aggregate_bees" FROM "farm" GROUP BY time(30m) END
```

**2. Query the CQ results**
<br>
This step performs the `mean([...])` part of the nested function above.

Query the data in the measurement `aggregate_bees` to calculate the average of the
`count_bees` field:
```
SELECT mean("count_bees") FROM "aggregate_bees" WHERE time >= <start_time> AND time <= <end_time>
```

## Further information

See the
[Downsampling and data retention](/influxdb/v1.6/guides/downsampling_and_retention/)
guide to see how to combine two InfluxDB features, CQs, and retention policies,
to periodically downsample data and automatically expire the dispensable high
precision data.

Kapacitor, InfluxData's data processing engine, can do the same work as
InfluxDB's CQs.
Check out [examples of continuous queries in Kapacitor](/kapacitor/latest/examples/continuous_queries/) to learn when
to use Kapacitor instead of InfluxDB and how to perform the same CQ
functionality with a TICKscript.
