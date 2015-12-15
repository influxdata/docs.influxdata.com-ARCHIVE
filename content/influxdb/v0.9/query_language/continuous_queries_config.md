---
title: Configuring continuous queries
---

## What is a continuous query?
A continuous query (CQ) is an InfluxQL query that the system periodically executes in batches. 

Each batch contains one or more queries where each query covers a single `GROUP BY time()` interval. InfluxDB always generates a query for the current `GROUP BY time()` interval (determined by `now()`) and it generates zero or more queries for recent `GROUP BY time()` intervals.

The time ranges of the generated queries have round-number boundaries. For example, if the CQ's `GROUP BY time()` interval is 30 minutes long, the queries' start and end times (in `MM:SS`) are always `00:00` or `30:00`.

## The CQ schedule
The rate at which InfluxDB generates batches of queries and the number of queries generated per batch depend on the CQ's `GROUP BY time()` interval and on the following configuration options (shown with their default settings):

* `compute-runs-per-interval = 10`
* `compute-no-more-than = "2m0s"`
* `recompute-previous-n =  2`
* `recompute-no-older-than = "10m0s"`

### Frequency of batch creation

InfluxDB compares `compute-runs-per-interval` and `compute-no-more-than` to determine the rate at which it generates batches for a CQ. `compute-runs-per-interval` is the upper bound of the number of incremental queries generated per `GROUP BY time()` interval. `compute-no-more-than` is the maximum frequency at which InfluxDB generates batches. `compute-no-more-than` takes precedence over `compute-runs-per-interval`.

In the default settings, InfluxDB generates batches for a CQ as often as  `10` times per the `GROUP BY time()` interval. However, it will not generate batches more often than every two minutes, regardless of the value of `GROUP BY  time()` divided by 10.

For example, if the CQ has a `30m` `GROUP BY time()` interval, then `compute-runs-per-interval` sets a maximum batch frequency of `3m`, since `30m` / 10 = `3m`. This is less frequent than the maximum frequency of `2m`, as set by `compute-no-more-than`, so the system generates a batch of that CQ every `3m`.

If the CQ has a `30s` `GROUP BY time()` interval, then `compute-runs-per-interval` sets a maximum batch frequency of `3s`, since `30s` / 10 = `3s`. However, `compute-no-more-than` takes precedence and thus the system generates batches every `2m`.

### Number of queries per batch
InfluxDB uses `recompute-previous-n` and `recompute-no-older-than` to determine the number queries generated per batch for a CQ. All batches include at least one generated query with the time range that spans `now()`. The maximum number of additional queries with time ranges that span intervals prior to `now()` is determined by `recompute-previous-n`. Therefore `recompute-previous-n` + 1 is the maximum number of queries per batch. `recompute-no-older-than` puts a limit on the age of the previous query interval, such that the upper boundary  of each generated query must be greater than `now()` - `recompute-no-older-than`. `recompute-no-older-than` takes precedence over `recompute-previous-n`.

In the default settings, InfluxDB generates at most three queries per batch: one spanning `now()` and up to two queries spanning older time intervals, as set by `recompute-previous-n`. In addition, the upper boundary of the query time range for each generated query must be less than `10m` in the past.

For example, if the CQ has a `30s` `GROUP BY time()` interval, then InfluxDB generates three queries for each batch. However, if the CQ has a `30m` `GROUP BY time` interval, then InfluxDB generates only one or two queries for a given batch, since the third query would have an upper boundary at least `30m` in the past, which exceeds the `recompute-no-older-than` setting.

Depending on your CQ's `GROUP BY time()` interval you may want to make changes to the default configuration settings. The next sections present example CQs and discuss how they work with the configuration options:

* [CQ 1](../query_language/continuous_queries_config.html#cq-1-4-minute-group-by-time-interval) is an introductory example CQ that shows how the default configuration settings work with a CQ's `GROUP BY time()` interval. 
* [CQ 2](../query_language/continuous_queries_config.html#cq-2-30-second-group-by-time-interval) is an example of a CQ with a shorter term `GROUP BY time()` interval that doesn't work well with the default configuration settings. This section also covers how to alter the configuration settings to fix the issue.
* [CQ 3](../query_language/continuous_queries_config.html#cq-3-1-hour-group-by-time-interval) is an example of a CQ with a longer term `GROUP BY time()` interval. This section shows how to alter the configuration settings to take into account lagged data.

## CQ 1: 4 minute `GROUP BY time()` interval
### Create CQ 1
```sql
CREATE CONTINUOUS QUERY cq1 ON telegraf BEGIN SELECT MEAN(value) INTO cq_4m FROM cpu_usage_idle WHERE cpu='cpu-total' GROUP BY time(4m) END
```

For our purposes the only important part of that statement is the `4m` `GROUP BY time()` interval. For more on the syntax for creating CQs, see [Continuous Queries](../query_language/continuous_queries.html).

### The default CQ schedule
Default configuration settings:  
`compute-runs-per-interval = 10`  
`compute-no-more-than = "2m0s"`  
`recompute-previous-n = 2`  
`recompute-no-older-than = "10m0s"`  

*InfluxDB generates batches of CQ 1 every 2 minutes.*

`compute-runs-per-interval` sets a maximum batch frequency of `0.4m`, since `4m` /  `10` = `0.4m`. This is more frequent than the maximum frequency of `2m`, as set by `compute-no-more-than`, so the system generates a batch of CQ 1 every `2m`.

*InfluxDB generates 3 queries per batch of CQ 1.*

InfluxDB generates one query that spans `now()` and two additional queries that span older time intervals because `recompute-no-older-than` (`10m`) always falls within the time range covered by `recompute-previous-n` (`2` intervals * `4m` = `8m`).

### CQ 1 in practice
A sample of CQ 1's frequency of batch creation and the number of queries per batch on 2015/11/24 starting at 18:19:45 (UTC):

InfluxDB generates three queries at 18:19:45:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_4m FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T18:16:00Z' AND time < '2015-11-24T18:20:00Z' GROUP BY time(4m)

SELECT MEAN(value) INTO "telegraf"."default".cq_4m FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T18:12:00Z' AND time < '2015-11-24T18:16:00Z' GROUP BY time(4m)

SELECT MEAN(value) INTO "telegraf"."default".cq_4m FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T18:08:00Z' AND time < '2015-11-24T18:12:00Z' GROUP BY time(4m)
```
InfluxDB generates another three queries two minutes later at 18:21:45:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_4m FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T18:20:00Z' AND time < '2015-11-24T18:24:00Z' GROUP BY time(4m)

SELECT MEAN(value) INTO "telegraf"."default".cq_4m FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T18:16:00Z' AND time < '2015-11-24T18:20:00Z' GROUP BY time(4m)

SELECT MEAN(value) INTO "telegraf"."default".cq_4m FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T18:12:00Z' AND time < '2015-11-24T18:16:00Z' GROUP BY time(4m)
```

In both cases, the first query has the relevant time range that spans `now()`: 18:19:45 falls within the four minute interval between 18:16:00 and 18:20:00, and 18:21:45 falls within the four minute interval between 18:20:00 and 18:24:00. The second two queries span older four minute time intervals. Notice that the queries that cover the time ranges 18:16:00 through 18:20:00 and 18:12:00 through 18:16:00 appear in both the first batch of generated queries and in the second batch of generated queries.  

## CQ 2: 30 second `GROUP BY time()` interval
### Create CQ 2
```sql
CREATE CONTINUOUS QUERY cq2 ON telegraf BEGIN SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' GROUP BY time(30s) END
```
For our purposes the only important part of that statement is the `30s` `GROUP BY time()` interval. For more on the syntax for creating CQs, see [Continuous Queries](../query_language/continuous_queries.html).

### The default CQ schedule
Default configuration settings:  
`compute-runs-per-interval = 10`  
`compute-no-more-than = "2m0s"`  
`recompute-previous-n = 2`  
`recompute-no-older-than = "10m0s"`  

*InfluxDB generates batches of CQ 2 every 2 minutes.*

`compute-runs-per-interval` sets a maximum batch frequency of `3s`, since `30s` /  `10` = `3s`. This is more frequent than the maximum frequency of `2m`, as set by `compute-no-more-than`, so the system generates a batch of CQ 2 every `2m`.

*InfluxDB generates 3 queries per batch of CQ 2.*

InfluxDB generates one query that spans `now()` and two additional queries that span older time intervals because `recompute-no-older-than` (`10m`) always falls within the time range covered by `recompute-previous-n` (`2` intervals * `30s` = `1m`).

### CQ 2 in practice
A sample of CQ 2’s frequency of batch creation and the number of queries per batch on 2015/11/24 starting at 19:41:17 (UTC):

InfluxDB generates three queries at 19:41:17:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:41:00Z' AND time < '2015-11-24T19:41:30Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:40:30Z' AND time < '2015-11-24T19:41:00Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:40:00Z' AND time < '2015-11-24T19:40:30Z' GROUP BY time(30s)
```
InfluxDB generates another three queries two minutes later at 19:43:17:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:43:00Z' AND time < '2015-11-24T19:43:30Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:42:30Z' AND time < '2015-11-24T19:43:00Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:42:00Z' AND time < '2015-11-24T19:42:30Z' GROUP BY time(30s)
```

In both cases, the first query has the revelant time range that spans `now()`: 19:41:17 falls within the 30 second interval between 19:41:00 and 19:41:30, and 19:43:17 falls within the 30 second interval between 19:43:00 and 19:43:30. The second two queries span older 30 second time intervals. 

Because of CQ 2's small `GROUP BY time()` interval, leaving the default configuration settings as is causes InfluxDB to skip a 30 second interval. In the example above, the system never queries the time range between 19:41:30 and 19:42:00. The next two sections offer different ways to solve the missing interval problem.

### Change the frequency of batch creation
New configuration settings:  
`compute-runs-per-interval = 10`  
`compute-no-more-than = "1m30s"`  

*InfluxDB now generates batches of CQ 2 every 1.5 minutes.*

`compute-runs-per-interval` sets a maximum batch frequency of `3s`, since `30s` /  `10` = `3s`. This is more frequent than the maximum frequency of `1.5m`, as set by `compute-no-more-than`, so the system generates a batch of CQ 2 every `1.5m`.

Now a sample of CQ 2’s frequency of batch creation and the number of queries per batch on 2015/11/24 starting at 19:41:17 (UTC) looks like this:

InfluxDB generates three queries at 19:41:17:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:41:00Z' AND time < '2015-11-24T19:41:30Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:40:30Z' AND time < '2015-11-24T19:41:00Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:40:00Z' AND time < '2015-11-24T19:40:30Z' GROUP BY time(30s)
```
InfluxDB generates another three queries 1.5 minutes later at 19:42:47:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:42:30Z' AND time < '2015-11-24T19:43:00Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:42:00Z' AND time < '2015-11-24T19:42:30Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:41:30Z' AND time < '2015-11-24T19:42:00Z' GROUP BY time(30s)
```

Notice that because of the new frequency of batch creation, InfluxDB no longer misses the query that covers the time range from 19:41:30 through 19:42:00.

### Change the number of queries per batch
New configuration settings:    
`recompute-previous-n = 3`  
`recompute-no-older-than = "10m0s"`  

*InfluxDB generates 4 queries per batch of CQ 2.*

InfluxDB generates one query that spans `now()` and three additional queries that span older time intervals because `recompute-no-older-than` (`10m`) always falls within the time range covered by `recompute-previous-n` (`3` intervals * `30s` = `1.5m`).

Now a sample of CQ 2’s frequency of batch creation and the number of queries per batch on 2015/11/24 starting at 19:41:17 (UTC) looks like this:

InfluxDB generates four queries at 19:41:17:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:41:00Z' AND time < '2015-11-24T19:41:30Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:40:30Z' AND time < '2015-11-24T19:41:00Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:40:00Z' AND time < '2015-11-24T19:40:30Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:39:30Z' AND time < '2015-11-24T19:40:00Z' GROUP BY time(30s)
```
InfluxDB generates another four queries two minutes later at 19:43:17:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:43:00Z' AND time < '2015-11-24T19:43:30Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:42:30Z' AND time < '2015-11-24T19:43:00Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:42:00Z' AND time < '2015-11-24T19:42:30Z' GROUP BY time(30s)

SELECT MEAN(value) INTO "telegraf"."default".cq_30s FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T19:41:30Z' AND time < '2015-11-24T19:42:00Z' GROUP BY time(30s)
```

Notice that because of the new number of queries per batch, InfluxDB no longer misses the query that covers the time range from 19:41:30 through 19:42:00.

## CQ 3: 1 hour `GROUP BY time()` interval
### Create CQ 3
```sql
CREATE CONTINUOUS QUERY cq3 ON telegraf BEGIN SELECT MEAN(value) INTO cq_1h FROM cpu_usage_idle WHERE cpu='cpu-total' GROUP BY time(1h) END
```
For our purposes the only important part of that statement is the `1h` `GROUP BY time()` interval. For more on the syntax for creating CQs, see [Continuous Queries](../query_language/continuous_queries.html).

### The default CQ schedule
Default configuration settings:   
`compute-runs-per-interval = 10`  
`compute-no-more-than = "2m0s"`  
`recompute-previous-n = 2`  
`recompute-no-older-than = "10m0s"`  

*InfluxDB generates batches of CQ 3 every 6 minutes.*

`compute-runs-per-interval` sets a maximum batch frequency of `6m`, since `60m` /  `10` = `6m`. This is less frequent than the maximum frequency of `2m`, as set by `compute-no-more-than`, so the system generates a batch of CQ 3 every `6m`.

*InfluxDB generates at most 2 queries per batch of CQ 3.*

InfluxDB generates one query that spans `now()` and at most 1 additional query that spans an older time interval because the third query would have an upper boundary at least `1h` in the past, which exceeds the `recompute-no-older-than` (`10m`) setting.

### CQ 3 in practice
A sample of CQ 3’s frequency of batch creation and the number of queries per batch on 2015/11/24 starting at 22:09:55 (UTC):

InfluxDB generates two queries at 22:09:55:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_1h FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T22:00:00Z' AND time < '2015-11-24T23:00:00Z' GROUP BY time(1h)

SELECT MEAN(value) INTO "telegraf"."default".cq_1h FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T21:00:00Z' AND time < '2015-11-24T22:00:00Z' GROUP BY time(1h)
```
InfluxDB generates one query six minutes later at 22:15:55:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_1h FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T22:00:00Z' AND time < '2015-11-24T23:00:00Z' GROUP BY time(1h)
```

At 22:09:55, InfluxDB generates two queries; one query covers the time range that spans `now()` and one query covers the previous `GROUP BY time()` interval. InfluxDB generates the second query because  `now()` - `10m` falls in the previous `GROUP BY time()` interval (22:09:55 -  `10m` = 21:59:55). 

At 22:15:55, InfluxDB generates only one query. That query covers the time range that spans `now()`. InfluxDB doesn't generate a second query because `now()` - `10m` falls in the interval that spans `now()` (22:15:55 - `10m` = 22:05:55).

If you have lagged data, generating, at most, one query for a previous interval may not take into account all of your data. The next section offers one way to adjust the configuration settings so that a query batch always includes a query for one previous time interval.

### Change the number of previous intervals queried
New configuration settings:  
`recompute-previous-n = 1`  
`recompute-no-older-than = 120m0s`  

*InfluxDB generates 2 queries per batch of CQ 3.*

InfluxDB generates one query that spans `now()` and one additional query that spans an older time interval because `recompute-no-older-than` (`120m`) always falls within the time range covered by `recompute-previous-n` (`1` intervals * `1h` = `60m`).

Now, a sample of CQ 3’s frequency of batch creation and the number of queries per batch on 2015/11/24 starting at 22:09:55 (UTC) looks like this:

InfluxDB generates two queries at 22:09:55:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_1h FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T22:00:00Z' AND time < '2015-11-24T23:00:00Z' GROUP BY time(1h)

SELECT MEAN(value) INTO "telegraf"."default".cq_1h FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T21:00:00Z' AND time < '2015-11-24T22:00:00Z' GROUP BY time(1h)
```
InfluxDB generates two queries six minutes later at 22:15:55:
```sql
SELECT MEAN(value) INTO "telegraf"."default".cq_1h FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T22:00:00Z' AND time < '2015-11-24T23:00:00Z' GROUP BY time(1h)

SELECT MEAN(value) INTO "telegraf"."default".cq_1h FROM "telegraf"."default".cpu_usage_idle WHERE cpu = 'cpu-total' AND time >= '2015-11-24T21:00:00Z' AND time < '2015-11-24T22:00:00Z' GROUP BY time(1h)
```

Because of the new settings, InfluxDB always includes in a batch one query that spans an older time interval in addition to the query that spans `now()`.

