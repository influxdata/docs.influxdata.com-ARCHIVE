---
title: Aggregate derivative across series

menu:
  kapacitor_1_1:
    name: Aggregate derivative across series
    identifier: derivative_across_series
    weight: 0
    parent: examples
---

Some components are exposing monotonically increasing series such as a webserver with the raw number of total input metrics.
Using Kapacitor you can trigger events based on the total number of queries per second (or minute, etc.) across a cluster
of such components.

Let's say we have one measurement:

* `total_queries` -- the total number of queries, emit by a single server.

We can achieve our goal thanks to `derivative`, `groupBy` (both as node and property), `truncate` and `sum`.

### Aggregating with stream data

```javascript
var queries_per_second = stream
    |from()
        .measurement('total_queries')
        // group by host, assuming you have a host tag
        .groupBy('cluster_id', 'host')
        // truncate times to 1s intervals so they match up for the derivative and sum operations
        .truncate(1s)
    |derivative('value')
        .unit(1s)
        .nonNegative()
        .as('queries_per_sec')
    // Now only group by cluster_id and sum across all host in a cluster_id
    |groupBy('cluster_id')
    |sum('queries_per_sec')
        .as('queries_per_sec')
    |window()
        .period(5m)
        .every(1m)
        .align()
    // Keeping the integer part should be enough
    |eval(lambda: int("queries_per_sec"))
        .as('queries_per_sec')
```

This will allow you to trigger alerts when overall number of QPS will reach a specified threshold.
You can even plug it to the Kubernetes autoscaler (`k8sAutoscale`, Kapacitor >= v1.1).
