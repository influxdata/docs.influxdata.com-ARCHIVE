---
title: Kapacitor as a Continuous Query engine
aliases:
    - kapacitor/v1.5/examples/continuous_queries/
menu:
  kapacitor_1_5:
    name: Kapacitor as a Continuous Query engine
    identifier: continuous_queries
    weight: 30
    parent: guides
---

Kapacitor can be used to do the same work as Continuous Queries (CQ) in InfluxDB.
Today we are going to explore reasons to use one over the other and the basics of using Kapacitor for CQ-type workloads.

## An Example

First, lets take a simple CQ and rewrite it as a Kapacitor TICKscript.

Here is a CQ that computes the mean of the `cpu.usage_idle` every 5 minutes and stores it in the new measurement `mean_cpu_idle`.

```
CREATE CONTINUOUS QUERY cpu_idle_mean ON telegraf BEGIN SELECT mean("usage_idle") as usage_idle INTO mean_cpu_idle FROM cpu GROUP BY time(5m),* END
```

To do the same with Kapacitor here is a streaming TICKscript.

```js
dbrp "telegraf"."autogen"

stream
    |from()
        .database('telegraf')
        .measurement('cpu')
        .groupBy(*)
    |window()
        .period(5m)
        .every(5m)
        .align()
    |mean('usage_idle')
        .as('usage_idle')
    |influxDBOut()
        .database('telegraf')
        .retentionPolicy('autogen')
        .measurement('mean_cpu_idle')
        .precision('s')
```

The same thing can also be done as a batch task in Kapacitor.

```js
dbrp "telegraf"."autogen"

batch
    |query('SELECT mean(usage_idle) as usage_idle FROM "telegraf"."autogen".cpu')
        .period(5m)
        .every(5m)
        .groupBy(*)
    |influxDBOut()
        .database('telegraf')
        .retentionPolicy('autogen')
        .measurement('mean_cpu_idle')
        .precision('s')
```

All three of these methods will produce the same results.

## Questions

At this point there are a few questions we should answer:

1. When should we use Kapacitor instead of CQs?
2. When should we use stream tasks vs batch tasks in Kapacitor?

### When should we use Kapacitor instead of CQs?

There are a few reasons to use Kapacitor instead of CQs.

* You are performing a significant number of CQs and want to isolate the work load.
    By using Kapacitor to perform the aggregations InfluxDB's performance profile can remain more stable and isolated from Kapacitor's.
* You need to do more than just perform a query, for example maybe you only want to store only outliers from an aggregation instead of all of them.
    Kapacitor can do significantly more with the data than CQs so you have more flexibility in transforming your data.

There are a few use cases where using CQs almost always makes sense.

* Performing downsampling for retention policies.
    This is what CQs are designed for and do well.
    No need to add another moving piece (i.e. Kapacitor) to your infrastructure if you do not need it.
    Keep it simple.
* You only have a handful of CQs, again keep it simple, do not add more moving parts to your setup unless you need it.

### When should we use stream tasks vs batch tasks in Kapacitor?

Basically the answer boils down to two things, the available RAM and time period being used.

A stream task will have to keep all data in RAM for the specified period.
If this period is too long for the available RAM then you will first need to store the data in InfluxDB and then query using a batch task.

A stream task does have one slight advantage in that since its watching the stream of data it understands time by the timestamps on the data.
As such there are no race conditions for whether a given point will make it into a window or not.
If you are using a batch task it is still possible for a point to arrive late and be missed in a window.


## Another Example

Create a continuous query to downsample across retention policies.

```
CREATE CONTINUOUS QUERY cpu_idle_median ON telegraf BEGIN SELECT median("usage_idle") as usage_idle INTO "telegraf"."sampled_5m"."median_cpu_idle" FROM "telegraf"."autogen"."cpu" GROUP BY time(5m),* END
```

The stream TICKscript:

```js
dbrp "telegraf"."autogen"

stream
    |from()
        .database('telegraf')
        .retentionPolicy('autogen')
        .measurement('cpu')
        .groupBy(*)
    |window()
        .period(5m)
        .every(5m)
        .align()
    |median('usage_idle')
        .as('usage_idle')
    |influxDBOut()
        .database('telegraf')
        .retentionPolicy('sampled_5m')
        .measurement('median_cpu_idle')
        .precision('s')
```

And the batch TICKscript:

```js
dbrp "telegraf"."autogen"

batch
    |query('SELECT median(usage_idle) as usage_idle FROM "telegraf"."autogen"."cpu"')
        .period(5m)
        .every(5m)
        .groupBy(*)
    |influxDBOut()
        .database('telegraf')
        .retentionPolicy('sampled_5m')
        .measurement('median_cpu_idle')
        .precision('s')
```


## Summary

Kapacitor is a powerful tool, if you need more power use it.
If not keep using CQs until you do.
For more information and help writing TICKscripts from InfluxQL queries take a looks at these [docs](https://docs.influxdata.com/kapacitor/latest/nodes/influx_q_l_node/) on the InfluxQL node in Kapacitor.
Every function available in the InfluxDB query language is available in Kapacitor, so you can convert any query into a Kapacitor TICKscript.

## Important to Know

### Continuous queries and Kapacitor tasks may produce different results
For some types of queries, CQs (InfluxDB) and TICKscripts (Kapacitor) may return different results due to how each selects time boundaries. Kapacitor chooses the maximum timestamp (tMax) while InfluxDB chooses the minimum timestamp (tMin). The choice between using tMax or tMin is somewhat arbitrary for InfluxDB, however the same cannot be said for Kapacitor.

Kapacitor has the ability to do complex joining operations on overlapping time windows. For example, if you were to join the mean over the last month with the the mean over the last day, you would need their resulting values to occur at the same time, using the most recent time, tMax. However, Kapacitor would use tMin and the resulting values would not occur at the same time. One would be at the beginning of the last month, while the other would be at the beginning of the last day.

Consider the following query run as both an InfluxQL query and as a TICKscript:

#### InfluxQL

```sql
SELECT mean(*) FROM ... time >= '2017-03-13T17:50:00Z' AND time < '2017-03-13T17:51:00Z'
```

#### TICKscript

``` js
batch
  |query('SELECT queryDurationNs FROM "_internal".monitor.queryExecutor')
    .period(1m)
    .every(1m)
    .align()
  |mean('queryDurationNs')
```

#### Query Results
| Query Method     | Time                 | Mean                  |
|:------------     |:----                 |:----                  |
| Continuous Query | 2017-03-13T22:29:00Z | 8.083532716666666e+08 |
| TICKscript       | 2017-03-13T17:51:00Z | 8.083532716666666e+08 |

> Note the difference between the returned timestamps.

This is a known issue discussed in [Issue #1258](https://github.com/influxdata/kapacitor/issues/1258) on Github.
