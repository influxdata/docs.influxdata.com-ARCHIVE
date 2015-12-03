---
title: Continuous Queries
aliases:
  - /docs/v0.9/concepts/continuous_queries.html
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
