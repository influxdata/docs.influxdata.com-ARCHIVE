# What's in a database?

This page gives SQL users an overview of how InfluxDB is like an SQL database and how it's not. It highlights some of the major distinctions between the two and provides a loose crosswalk between the different database terminologies and query languages.

## In general...

InfluxDB is designed to work with time-series data. SQL databases can handle time-series but weren't created strictly for that purpose. In short, InfluxDB is made to store a large volume of time-series data and perform real-time analysis on those data, quickly.

### Timing is everything

In InfluxDB, a timestamp identifies a single point in any given data series. This is like an SQL database table where the primary key is pre-set by the system and is always time.

InfluxDB also recognizes that your schema preferences may change over time. In InfluxDB you don't have to define schemas up front. Data points can have one of the fields on a measurement, all of the fields on a measurement, or any number in-between. You can add new fields to a measurement simply by writing a point for that new field. If you need an explanation of the terms measurements, tags, and fields check out the next section for an SQL database to InfluxDB terminology crosswalk.

## Terminology

The table below is a (very) simple example of a table  called `foodships` in an SQL database with the unindexed column `#_foodships` and the indexed columns `park_id`, `planet`, and `time`.

``` sql
+---------+---------+---------------------+--------------+
| park_id | planet  | time                | #_foodships  |
+---------+---------+---------------------+--------------+
|       1 | Earth   | 1429185600000000000 |            0 |
|       1 | Earth   | 1429185601000000000 |            3 |
|       1 | Earth   | 1429185602000000000 |           15 |
|       1 | Earth   | 1429185603000000000 |           15 |
|       2 | Saturn  | 1429185600000000000 |            5 |
|       2 | Saturn  | 1429185601000000000 |            9 |
|       2 | Saturn  | 1429185602000000000 |           10 |
|       2 | Saturn  | 1429185603000000000 |           14 |
|       3 | Jupiter | 1429185600000000000 |           20 |
|       3 | Jupiter | 1429185601000000000 |           21 |
|       3 | Jupiter | 1429185602000000000 |           21 |
|       3 | Jupiter | 1429185603000000000 |           20 |
|       4 | Saturn  | 1429185600000000000 |            5 |
|       4 | Saturn  | 1429185601000000000 |            5 |
|       4 | Saturn  | 1429185602000000000 |            6 |
|       4 | Saturn  | 1429185603000000000 |            5 |
+---------+---------+---------------------+--------------+
```

Those same data look like this in InfluxDB:

```sql
name: foodships
tags: park_id=1, planet=Earth
time			#_foodships
----			------------
2015-04-16T12:00:00Z	0
2015-04-16T12:00:01Z	3
2015-04-16T12:00:02Z	15
2015-04-16T12:00:03Z	15

name: foodships
tags: park_id=2, planet=Saturn
time			#_foodships
----			------------
2015-04-16T12:00:00Z	5
2015-04-16T12:00:01Z	9
2015-04-16T12:00:02Z	10
2015-04-16T12:00:03Z	14

name: foodships
tags: park_id=3, planet=Jupiter
time			#_foodships
----			------------
2015-04-16T12:00:00Z	20
2015-04-16T12:00:01Z	21
2015-04-16T12:00:02Z	21
2015-04-16T12:00:03Z	20

name: foodships
tags: park_id=4, planet=Saturn
time			#_foodships
----			------------
2015-04-16T12:00:00Z	5
2015-04-16T12:00:01Z	5
2015-04-16T12:00:02Z	6
2015-04-16T12:00:03Z	5
```

Referencing the example above, in general:

* An InfluxDB measurement (`foodships`) is similar to an SQL database table.
* InfluxDB tags ( `park_id` and `planet`) are like indexed columns in an SQL database.
* InfluxDB fields (`#_foodships`) are like unindexed columns in an SQL database.
* InfluxDB points (for example, `2015-04-16T12:00:00Z	5`) are similar to SQL rows.

Building on this comparison of database terminology, InfluxDB's [continuous queries](https://influxdb.com/docs/v0.9/query_language/continuous_queries.html) and [replication policies](https://influxdb.com/docs/v0.9/administration/administration.html) are similar to stored procedures in an SQL database. They're specified once and then performed regularly and automatically.

Of course, there are some major disparities between SQL databases and InfluxDB. SQL `JOIN`s aren't available for InfluxDB measurements; your schema design should reflect that difference. And, as we mentioned above, a measurement is like an SQL table where the primary index is always pre-set to time. InfluxDB timestamps must be in UNIX epoch (GMT) or formatted as a date-time string valid under RFC3339.

For more detailed descriptions of the InfluxDB terms mentioned in this section see our [Glossary of Terms](https://influxdb.com/docs/v0.9/concepts/glossary.html).

## InfluxQL and SQL

InfluxQL is an SQL-like query language for interacting with InfluxDB. It has been lovingly crafted to feel familiar to those coming from other SQL or SQL-like environments while also providing features specific to storing and analyzing time series data.

InfluxQL's `SELECT` statement follows the form of an SQL `SELECT` statement:

```sql
SELECT <stuff> FROM <measurement_name> WHERE <some_conditions>
```
where `WHERE` is optional. To get the InfluxDB output in the section above, you'd enter:

```sql
SELECT * FROM foodships
```

If you only wanted to see data for the planet `Saturn`, you'd enter:

```sql
SELECT * FROM foodships WHERE planet = 'Saturn'
```

If you wanted to see data for the planet `Saturn` after 12:00:01 UTC on April 16, 2015, you'd enter:

```sql
SELECT * FROM foodships WHERE planet = 'Saturn' AND time > '2015-04-16 12:00:01'
```

As shown in the example above, InfluxQL allows you to specify the time range of your query in the `WHERE` clause. You can use date-time strings wrapped in single quotes that have the format `YYYY-MM-DD HH:MM:SS.mmm` ( `mmm` is milliseconds and is optional, and you can also specify microseconds or nanoseconds). You can also use relative time with `now()` which refers to the server's current timestamp:

```sql
SELECT * FROM foodships WHERE time > now() -1h
```

That query outputs the data in the `foodships` measure where the timestamp is newer than the server's current time minus one hour. The options for specifying time durations with `now()` are:

|Letter|Meaning|
|:---:|:---:|
|u|microseconds|
|s | seconds   		|
| m        | minutes   		|
| h        | hours   		|
| d        | days   		|
| w        | weeks   		|

<br/>

InfluxQL also supports regular expressions, arithmetic in expressions, `SHOW` statements, and `GROUP BY` statements. See our [data exploration](https://influxdb.com/docs/v0.9/query_language/data_exploration.html) page for an in-depth discussion of those topics. InfluxQL functions include `COUNT`, `MIN`, `MAX`, `MEDIAN`, `DERIVATIVE` (a function in progress), and more. For a full list check out the [functions](https://influxdb.com/docs/v0.9/query_language/functions.html) page.

Now that you have the general idea, check out our [Getting Started Guide](https://influxdb.com/docs/v0.9/introduction/getting_started.html).

## A note on why InfluxDB isn't CRUD...

InfluxDB is a database that has been optimized for time series data. This data commonly comes from sources like distributed sensor groups, click data from large websites, or lists of financial transactions.

One thing this data has in common is that it is more useful in the aggregate. One reading saying that your computer’s CPU is at 12% utilization at 12:38:35 UTC on a Tuesday is hard to draw conclusions from. It becomes more useful when combined with the rest of the series and visualized. This is where trends over time begin to show, and actionable insight can be drawn from the data. In addition, time series data is generally written once and rarely updated.

The result is that InfluxDB is not a full CRUD database but more like a CR-ud, prioritizing the performance of creating and reading data over update and destroy, and preventing some update and destroy behaviors to make create and read more performant. For more information on why InfluxDB made these architectural decisions [Paul Dix](https://github.com/pauldix) has an excellent [blog post](https://influxdb.com/blog/2015/06/03/InfluxDB_clustering_design.html) with more explanation.
