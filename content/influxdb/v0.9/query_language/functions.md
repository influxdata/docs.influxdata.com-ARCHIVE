---
title: Functions
aliases:
  - /docs/v0.9/query_language/aggregate_functions.html
---

InfluxDB contains a number of functions that you can use for computing aggregates, rollups, or doing downsampling on the fly. These are usually used in conjunction with a `GROUP BY time(...)` clause. Note that the use of a `GROUP BY` clause necessitates a `WHERE time` clause with an explicit lower bound for the time range. 

When performing an aggregation without a `GROUP BY` clause, the timestamp returned with the aggregated value(s) will be epoch 0 (1970-01-01T00:00:00Z).

# Aggregations

Aggregation functions return an aggregated value calculated from the points, rather than returning a set of points or a single point.

## Count

COUNT() takes a single field key as the only argument. It returns the number of points that contain a non-NULL value for that field. If a GROUP BY is supplied, COUNT() will return the number of points per GROUP BY interval that have a non-NULL value for the given field.

```sql
SELECT COUNT(field_key) FROM measurement

SELECT COUNT(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)

SELECT COUNT(field_key) FROM measurement WHERE time > 1434059627s GROUP BY tag_key
```

## Distinct

DISTINCT() returns an array of unique values for the given field.

```sql
SELECT DISTINCT(field_key) FROM measurement 

SELECT DISTINCT(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)

SELECT DISTINCT(field_key) FROM measurement WHERE time > 1434059627s GROUP BY tag_key
```

You can nest DISTINCT() in COUNT() to get the counts of unique values over windows of time:

```sql
SELECT COUNT(DISTINCT(field_key)) from measurement

SELECT COUNT(DISTINCT(field_key)) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)

SELECT COUNT(DISTINCT(field_key)) FROM measurement WHERE time > 1434059627s GROUP BY tag_key
```

## Integral

INTEGRAL() is not yet functional in InfluxDB 0.9. See GitHub Issue [#1400](https://github.com/influxdb/influxdb/issues/1400) for more information.

## Mean

MEAN() returns the arithmetic mean (average) of the specified field over a given interval. The field must be of type int64 or float64.

```sql
SELECT MEAN(field_key) FROM measurement

SELECT MEAN(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)

SELECT MEAN(field_key) FROM measurement WHERE time > 1434059627s GROUP BY tag_key
```

## Median

MEDIAN() returns the middle value from a sorted set of values for the specified field over a given interval. The field must be of type int64 or float64. This is nearly equivalent to PERCENTILE(field_key, 50), except that in the event a dataset contains an even number of points, the median will be the average of the two middle values.

```sql
SELECT MEDIAN(field_key) FROM measurement

SELECT MEDIAN(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)

SELECT MEDIAN(field_key) FROM measurement WHERE time > 1434059627s GROUP BY tag_key
```

## Sum

SUM() requires exactly one argument, which is a field name. It outputs the sum of the all values for the given field. The field must be of type int64 or float64.

```sql
SELECT SUM(field_key) FROM measurement ...
```

# Selectors

Selector functions return a single point from the range of points selected. Some selectors return all data for the point including timestamp. Some simply return the field value(s).

## Bottom

BOTTOM() is not yet functional in InfluxDB 0.9. See GitHub Issue [#1820](https://github.com/influxdb/influxdb/issues/1820) for more information.

## First

FIRST() requires exactly one argument, which is a field name. It will output the first (oldest) point for each group by interval, sorted by time.

```sql
SELECT FIRST(field_key) FROM measurement ...
```

## Last

LAST() requires exactly one argument, which is a field name. It will output the last (newest) point for each group by interval, sorted by time.

```sql
SELECT LAST(field_key) FROM measurement ...
```

## Max

MAX() returns the highest value from the specified field over a given interval. The field must be of type int64 or float64.

```sql
SELECT MAX(field_key) FROM measurement 

SELECT MAX(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)

SELECT MAX(field_key) FROM measurement WHERE time > 1434059627s GROUP BY tag_key
```

## Min

MIN() returns the lowest value from the specified field over a given interval. The field must contain int64 or float64 values.

```sql
SELECT MIN(field_key) FROM measurement

SELECT MIN(field_key) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)

SELECT MIN(field_key) FROM measurement WHERE time > 1434059627s GROUP BY tag_key
```

## Percentile

PERCENTILE() returns the Nth percentile value of a sorted set of values for the specified field. The values are sorted in ascending order with the lowest value at 0% and the highest value at 100%. The Nth percentile value is thus the one that is larger than N% of the values in the interval. PERCENTILE() requires two arguments, the first being the field and the second being the desired percentile, which must be an integer or floating point number between 0 and 100, inclusive. The field must be of type int64 or float64. PERCENTILE(value, 0) is equivalent to MIN(value), and PERCENTILE(value, 100) is equivalent to MAX(value)

```sql
SELECT PERCENTILE(field_key, N) FROM measurement

SELECT PERCENTILE(field_key, N) FROM measurement WHERE time > now() - 1d GROUP BY time(10m)

SELECT PERCENTILE(field_key, N) FROM measurement WHERE time > 1434059627s GROUP BY tag_key
```

## Top

TOP() will be available as of InfluxDB 0.9.4. See GitHub Issue [#1821](https://github.com/influxdb/influxdb/issues/1821) for more information on how TOP() is implemented.

# Transformations

Transformation functions return a value or set of values calculated from the points, but are not aggregations of those actual values.

## Ceiling

CEILING() is not yet functional in InfluxDB 0.9. See GitHub Issue [#3691](https://github.com/influxdb/influxdb/issues/3691) for more information.

## Derivative

DERIVATIVE() returns the rate of change for a field value at each point in the series.

DERIVATIVE() can have two arguments. The first is required and is a field name. The second is optional and is a rate normalization parameter. If the second parameter is not provided defaults to 1s.

The optional second argument determines the time `units` of the output. For example `DERIVATIVE(field_key, 1s)` returns a rate per second while `DERIVATIVE(field_key, 1h)` returns a rate per hour. See issue [2699](https://github.com/influxdb/influxdb/issues/2699) for a more in depth explanation.

```sql
SELECT DERIVATIVE(field_key) FROM measurement
```

The above example outputs the rate of change per **second** of `field_key`.

```sql
SELECT DERIVATIVE(field_key, 1h) FROM measurement
```

This example outputs the rate of change per **hour** of `field_key`.

```sql
SELECT DERIVATIVE(field_key) FROM measurement ... GROUP BY time(1m)
```

This example with a `GROUP BY` statement outputs the rate of change per **minute** of `field_key`.


Finally it is possible to take the `DERIVATIVE` of another aggregate function. For example:

```sql
SELECT DERIVATIVE(MEAN(field_key), 1s) FROM measurement ...
```

## Difference

DIFFERENCE() is not yet functional in InfluxDB 0.9. See GitHub Issue [#1825](https://github.com/influxdb/influxdb/issues/1825) for more information.

## Floor

FLOOR() is not yet functional in InfluxDB 0.9. See GitHub Issue [#3691](https://github.com/influxdb/influxdb/issues/3691) for more information.

## Histogram

HISTOGRAM() is not yet functional in InfluxDB 0.9. See GitHub Issue [#3674](https://github.com/influxdb/influxdb/issues/3674) for more information.

## Stddev

STDDEV() requires exactly one argument, which is a field name. It outputs the standard deviation of the given field. The field must be of type int64 or float64.

```sql
SELECT STDDEV(field_key) FROM measurement ...
```

