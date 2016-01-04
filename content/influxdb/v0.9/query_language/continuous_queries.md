---
title: Continuous Queries
aliases:
  - /docs/v0.9/concepts/continuous_queries.html
menu:
  influxdb_09:
    weight: 40
    parent: query_language
---

When writing in large amounts of raw data, you will often want to query a downsampled variant of the data for viewing or analysis. In some cases, this downsampled data may be needed many times in the future, and repeatedly computing the same rollups is wasteful. Continuous queries let you precompute these expensive queries into another time series in real-time.

## Creating Continuous Queries

Continuous queries are created on a database. Instead of returning the results immediately like a normal query, InfluxDB will instead store this continuous query and run it periodically as data is collected. Only cluster and database admins are allowed to create continuous queries.

Here are a few examples:

```sql
# Create a CQ to sample the 95% value from 5 minute buckets of the response_times measurement
CREATE CONTINUOUS QUERY response_times_percentile ON mydb BEGIN
  SELECT percentile(value, 95) INTO "response_times.percentiles.5m.95" FROM response_times GROUP BY time(5m)
END

# Create a CQ to count the number of points with non-null "type" value per 10 minute bucket, grouping and tagging by "type"
CREATE CONTINUOUS QUERY event_counts_per_10m_by_type ON mydb BEGIN
  SELECT COUNT(type) INTO typeCount_10m_byType FROM events GROUP BY time(10m), type
END
```

To preserve all tags in your downsampled data, add a `, *` clause to the `GROUP BY` clause of the continuous query. For example:

```sql
# Create a CQ to count the number of points with non-null "type" value per 10 minute bucket, grouping by all tags
CREATE CONTINUOUS QUERY event_counts_per_10m_by_type ON mydb BEGIN
  SELECT COUNT(type) INTO typeCount_10m_byType FROM events GROUP BY time(10m), *
END
```

To preserve a subset of tags in your downsampled data, add them individually in the `GROUP BY` clause of the continuous query. For example:

```sql
# Create a CQ to count the number of points with non-null "type" value per 10 minute bucket, preserving just the "type" tag
CREATE CONTINUOUS QUERY event_counts_per_10m_by_type ON mydb BEGIN
  SELECT COUNT(type) INTO typeCount_10m_byType FROM events GROUP BY time(10m), type
END
```

### Downsampling Continuous Queries

This is expected to be the primary use case for continuous queries. When a continuous query is created from a select query that contains a `GROUP BY` time() clause, InfluxDB will write the aggregate into the target time series when each time interval elapses. Continuous queries are not applied to historical data. See GitHub Issue [#211](https://github.com/influxdb/influxdb/issues/211) to follow development of the historical backfill feature for continuous queries.

```sql
CREATE CONTINUOUS QUERY clicks_per_hour ON mydb BEGIN
  SELECT COUNT(name) INTO clicksCount_1h FROM clicks GROUP BY time(1h) 
END
```


## Listing Continuous Queries

To see the continuous queries you have defined, query `SHOW CONTINUOUS QUERIES` and InfluxDB will return the name and query for each continuous query in the database.

## Deleting Continuous Queries

The drop query takes the following form:

```sql
DROP CONTINUOUS QUERY <name> ON <database>
```

## Backfilling

Continuous queries on their own do not backfill data, that is, they do not compute results for data written to the database before the CQ existed. Instead, users can backfill data with the `INTO` clause. Unlike continuous queries, backfill queries require a `WHERE` clause with a `time` restriction.

### Examples

Here is a basic backfill example:
```sql
SELECT min(temp) as min_temp, max(temp) as max_temp INTO "reading.minmax.5m" FROM reading 
WHERE time >= '2015-12-14 00:05:20' AND time < '2015-12-15 00:05:20'
GROUP BY time(5m)
```

Tags (`sensor_id` in the example below) can be used optionally in the same way as in continuous queries:
```sql
SELECT min(temp) as min_temp, max(temp) as max_temp INTO "reading.minmax.5m" FROM reading 
WHERE time >= '2015-12-14 00:05:20' AND time < '2015-12-15 00:05:20'
GROUP BY time(5m), sensor_id
```

To prevent the backfill from creating a huge number of "empty" points containing only `null` values, [fill()](/influxdb/v0.9/query_language/data_exploration/#the-group-by-clause-and-fill) can be used at the end of the query:
```sql
SELECT min(temp) as min_temp, max(temp) as max_temp INTO "reading.minmax.5m" FROM reading 
WHERE time >= '2015-12-14 00:05:20' AND time < '2015-12-15 00:05:20'
GROUP BY time(5m), fill(none)
```

If you would like to further break down the queries and run them with even more control, you can add additional `WHERE` clauses:
```sql
SELECT min(temp) as min_temp, max(temp) as max_temp INTO "reading.minmax.5m" FROM reading 
WHERE sensor_id="EG-21442" AND time >= '2015-12-14 00:05:20' AND time < '2015-12-15 00:05:20'
GROUP BY time(5m)
```

**Note**: In InfluxDB 0.9, a point is uniquely identified by the measurement, full tag set, and timestamp. Re-backfilling or writing another point with the same measurement, tag set, and timestamp will silently overwrite the already existing point, it will not create a duplicate.


