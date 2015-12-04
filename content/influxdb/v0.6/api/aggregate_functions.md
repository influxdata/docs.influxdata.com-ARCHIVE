---
title: Aggregate Functions
---

InfluxDB contains a number of functions that you can use for computing aggregates, rollups, or doing downsampling on the fly. These are always used in conjunction with a `group by time(...)` clause. If no group by clause is given, then a default will be applied from the start of the series to `now()`.

## Count

COUNT() takes a single column name, and counts the number of points
that contains a non NULL value for the given column name in the group by interval.

```sql
SELECT COUNT(column_name) FROM series_name group by time(10m) ...
```

## Min

MIN() returns the lowest value from the specified column over a given interval. The column must contain int64 or float64 values.

```sql
SELECT MIN(column_name) FROM series_name group by time(10m) ...
```

## Max

MAX() returns the highest value from the specified column over a given interval. The column must be of type int64 or float64.

```sql
SELECT MAX(column_name) FROM series_name group by time(10m) ...
```

## Mean

MEAN() returns the arithmetic mean (average) of the specified column over a given interval. The column must be of type int64 or float64.

```sql
SELECT MEAN(column_name) FROM series_name group by time(10m) ...
```

## Mode

MODE() returns the most frequent value(s) of the specified column over a given interval. The column must be of type int64 or float64. Since a timeseries can be multimodal (contain multiple values that occur
the same number of times), this can potentially return multiple rows.

```sql
SELECT MODE(column_name) FROM series_name group by time(10m) ...
```

## Median

MEDIAN() returns the middle value from a sorted set of values for the specified column over a given interval. This is nearly equivalent to PERCENTILE(column_name, 50), except that in the event a dataset contains an even number of points, the median will be the average of the two middle values.

```sql
SELECT MEDIAN(column_name) FROM series_name group by time(10m) ...
```

## Distinct

DISTINCT() returns unique values for the given column.

```sql
SELECT DISTINCT(column_name) FROM series_name group by time(10m) ...
```

You can nest distinct in count to get the counts of unique values over windows of time:

```sql
SELECT COUNT(DISTINCT(column_name)) from series_name
group by time(10m) ...
```

## Percentile

PERCENTILE() returns the Nth percentile of a sorted set of values for the specified column over a given interval. PERCENTILE() requires two values, the second of which can be either an integer or floating point number between 0 and 100.

```sql
SELECT PERCENTILE(column_name, N) FROM series_name group by time(10m) ...
```

## Histogram

HISTOGRAM() requires at least one argument and at most two arguments. The first argument is the column name and the second
argument is the bucket size. Bucket size defaults to `1.0` if it wasn't specified. HISTOGRAM() outputs two columns `bucket_start` and `count`. `bucket_start` is the smallest value in the bucket. `bucket_start` along with the bucket size defines the current bucket. `count` is the number of points that falls in this bucket.

```sql
SELECT HISTOGRAM(column_name) FROM series_name ...

SELECT HISTOGRAM(column_name, 10.0) FROM series_name ...
```

## Derivative

DERIVATIVE() requires exactly one argument, which is a column name. The out is a column containing the value of `(v_last -
v_first) / (t_last - t_first)` where `v_last` is the last value of the given column and `t_last` is the corresponding timestamp (and similarly for `v_first` and `t_first`). In other words, DERIVATIVE() calculates the **rate of change** of the given column.

```sql
SELECT DERIVATIVE(column_name) FROM series_name ...
```

## Sum

SUM() requires exactly one argument, which is a column name. It outputs the sum of the all values for the given column.

```sql
SELECT SUM(column_name) FROM series_name ...
```

## Stddev

STDDEV() requires exactly one argument, which is a column name. It outputs the standard deviation of the given column.

```sql
SELECT STDDEV(column_name) FROM series_name ...
```

## First/Last

FIRST() and LAST() require exactly one argument, which is a column name. It will output the first or last point for each group by interval.

```sql
SELECT FIRST(column_name) FROM series_name ...

SELECT LAST(column_name) FROM series_name ...
```

## Difference

DIFFERENCE() requires one argument, which is a column name. It will output the difference in the first and last value for each group by interval.

```sql
SELECT DIFFERENCE(column_name) FROM series_name ...
```

## Top / Bottom

TOP() and BOTTOM require two arguments, the column name and the number of top results to return. It will output the top or bottom values for each group by interval.

```sql
SELECT TOP(column_name, N) FROM series_name ...

SELECT BOTTOM(column_name, N) FROM series_name ...
```
