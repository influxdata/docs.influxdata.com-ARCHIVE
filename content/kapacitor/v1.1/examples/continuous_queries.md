---
title: Kapacitor as a Continous Query engine

menu:
  kapacitor_1_1:
    name: Kapacitor as a Continuous Query engine
    identifier: continuous_queries
    weight: 30
    parent: examples
---

Kapacitor can be used to do the same work as Continuous Queries in InfluxDB.
Today we are going to explore reasons to use one over the other and the basics of using Kapacitor for CQ type workloads.

## An Example

First, lets take a simple CQ and rewrite it as a Kapacitor TICKscript.

Here is a CQ that computes the mean of the `cpu.usage_idle` every 5 minutes and stores it in the new measurement `mean_cpu_idle`.

```
CREATE CONTINUOUS QUERY cpu_idle_mean ON telegraf BEGIN SELECT mean("usage_idle") as usage_idle INTO mean_cpu_idle FROM cpu GROUP BY time(5m),* END
```

To do the same with Kapacitor here is a streaming TICKscript.

```javascript
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

```javascript
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

Create a continuous query to down sample across retention policies.

```
CREATE CONTINUOUS QUERY cpu_idle_median ON telegraf BEGIN SELECT median("usage_idle") as usage_idle INTO "telegraf"."sampled_5m"."median_cpu_idle" FROM "telegraf"."autogen"."cpu" GROUP BY time(5m),* END
```

The stream TICKscript:

```javascript
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

```javascript
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
