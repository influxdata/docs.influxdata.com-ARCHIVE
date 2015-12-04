---
title: Query Language
---

InfluxDB features a SQL like query language, only used for querying data. The HTTP API has endpoints for writing data and performing other database administration tasks. The only exception to this is [continuous queries](continuous_queries.html), which perpetually write their results into one or more time series.

## Getting a List of Time Series

There are two different methods for returning a list of all time series in a database:

```sql
list series
-- or this
select * from /.*/ limit 1
```

The first query will return all series, while the second will return the most recent point from each series that matches the given regex.

## Select and Time Ranges

By default, InfluxDB returns data in time descending order. The most efficient queries run over only a single column in a given time series.

```sql
select value from response_times;
```

This simple query pulls the values for the `value` column from the `response_times` series.

### How to set query start and end time

If start and end times aren't set they will default to beginning of
time until now, respectively.

The column `time` is built in for every time series in the
database. You specify the start and end times by setting conditions on
the `time` columns in the where clause.

Below are the different formats that can be used to specify start and
end times.

#### Date time strings

Date time strings have the format `YYYY-MM-DD HH:MM:SS.mmm` where
`mmm` are the milliseconds within the second. For example:

```sql
select value from response_times
where time > '2013-08-12 23:32:01.232' and time < '2013-08-13';
```

The time and date should be wrapped in single quotes. If you only
specify the date, the time will be set to `00:00:00`. The `.232` after
the hours, minutes, and seconds is optional and specifies the
milliseconds.

#### Relative time

You can use `now()` to calculate a timestamp relative to the server's
current timestamp. For example:

```sql
select value from response_times where time > now() - 1h limit 1000;
```

will return all points starting an hour ago until now.

Other options for how to specify time durations are `u` for
microseconds, `s` for seconds, `m` for minutes, `h` for hours, `d`
for days and `w` for weeks. If no suffix is given the value is
interpreted as microseconds.

#### Absolute time

You can specify timestamp in epoch time, which is defined as the
number of microseconds that have elapsed since 00:00:00 Coordinated
Universal Time (UTC), Thursday, 1 January 1970. You can use the same
suffixes from the previous section if you don't want to specify
timestamp in microseconds. For example:

```sql
select value from response_times where time > 1388534400s
```

will return all points that were writtern after `2014-01-01 00:00:00`

## Selecting a Specific Point

Points are uniquely identified by the time series they appear in, the time, and the sequence number. Here's a query that returns a specific point.

```sql
select * from events where time = 1400497861762723 and sequence_number = 2321;
```

**Note** that the time is a very large number. That's because it's a microsecond scale epoch. InfluxDB always stores points at this scale, but most libraries will return the time as either a second, or millisecond scale value. If you're selecting a specific point, you'll need to know the exact microsecond scale epoch that point has otherwise you'll get an unexpected empty result.

## Selecting Multiple Series

You can select from multiple series by name or by specifying a regex to match against. Here are a few examples.

```sql
select * from events, errors;
```

Get the last hour of data from the two series `events`, and `errors`. Here's a regex example:

```sql
select * from /^stats\./i where time > now() - 1h;
```

Get the last hour of data from every time series that starts with `stats.` (case insensitive). Another example:

```sql
select * from /.*/ limit 1;
```

Return the last point from every time series in the database.

## Deleting data or dropping series

The delete query looks like the following:

```sql
delete from response_times where time < now() - 1h
```

With no time constraints this query will delete every point in the
time series `response_times`. You must be a cluster or database admin to run delete queries.

You can also delete from any series that matches a regex:

```sql
delete from /^stats.*/ where time < now() - 7d
```

Any conditions in the where clause that don't set the start and/or end
time will be ignored, for example the following query returns an error:

```sql
delete from response_times where user = 'foo'
```

Delete time conditions only support ranges, an equals condition (=) is
currently not supported.

Deleting all data for a series will only remove the points. It will
still remain in the index. If you want to remove all data from a
series and remove it from the list of series in a database use the
`drop` query:

```sql
drop series response_times
```

### Note about Delete Performance

Currently, deletes are not very efficient. If you want to quickly evict old data, the best way to do that is by dropping a shard. For more [information on shards go here](../advanced_topics/sharding_and_storage.html).

## The Where Clause

We've already seen the where clause for selecting time ranges and a specific point. You can also use it to filter based on given values, comparators, or regexes. Here are some examples of different ways to use *where*.

```sql
select * from events where state = 'NY';

select * from log_lines where line =~ /error/i;

select * from events where customer_id = 23 and type = 'click';

select * from response_times where value > 500;

select * from events where email !~ /.*gmail.*/;

select * from nagios_checks where status <> 0;

select * from events where signed_in = false;

select * from events
where (email =~ /.*gmail.*/ or email =~ /.*yahoo.*/) and state = 'ny';
```

The where clause supports comparisons against regexes, strings, booleans, floats, integers, and the times listed before. Comparators include `=` equal to, `>` greater than, `<` less than, `<>` not equal to, `=~` matches against, `!~` doesn't match against. You can chain logic together using `and` and `or` and you can separate using `(` and `)`

## Group By

The group by clause in InfluxDB is used not only for grouping by given values, but also for grouping by given time buckets. You'll always be pairing this up with [a function](aggregate_functions.html) in the `select` clause. Here are a few examples to illustrate how group by works.

```sql
-- count of events in 10 minute intervals
select count(type) from events group by time(10m);

-- count of each unique type of event in 10 minute intervals
select count(type) from events group by time(10m), type;

-- 95th percentile of response times in 30 second intervals
select percentile(value, 95) from response_times group by time(30s);
```

By default functions will output a column that have the same name as the function, e.g. `count` will output a column with the name `count` in order to change the name of the column an `AS` clause is required. Here is an example to illustrate how aliasing work:

```sql
select count(type) as number_of_types group by time(10m);
```

The time function takes the time interval which can be in
microseconds, seconds, minutes, hours, days or weeks. To specify the
units you can use the respective suffix `u`, `s`, `m`, `h`, `d` and `w`.

### Filling intervals with no data

By default, group by intervals that have no data will not have associated datapoints. For instance, say you have the following query:

```sql
select count(type) from events
group by time(1h) where time > now() - 3h
```

If the events series had data for this hour and two hours ago only, you'd only get two points in the result. If you want to ensure that you get back points for intervals that don't have data, you can use the `fill` function like this:

```sql
select count(type) from events
group by time(1h) fill(0) where time > now() - 3h
```

Note that `fill` must go at the end of the group by clause if there are other arguments:

```sql
select count(type) from events
group by time(1h), type fill(0) where time > now() - 3h
```

## Merging Series

You can merge multiple time series into a single stream in the select clause. This is helpful when you want to run a function over one of the columns with an associated group by time clause.

```sql
select count(type) from user_events merge admin_events group by time(10m)
```

You'd get a single time series with the count of events from the two combined in 10 minute intervals.

## Joining Series

Joins will put two or more series together. Since timestamps may not match exactly, InfluxDB will make a best effort to put points together. Joins are used when you want to perform a transformation of one time series against another. Here are a few examples.

```sql
select hosta.value + hostb.value
from cpu_load as hosta
inner join cpu_load as hostb
where hosta.host = 'hosta.influxdb.orb' and hostb.host = 'hostb.influxdb.org';
```

The above query will return a time series of the combined cpu load for hosts a and b. The individual points will be coerced into the closest time frames to match up.

```sql
select errors_per_minute.value / page_views_per_minute.value
from errors_per_minute
inner join page_views_per_minute
```

The above query will return the error rate per minute.
