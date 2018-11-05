---
title: How to join data with Flux
description: This guide walks through joining data with Flux and outlines how it shapes your data in the process.
menu:
  flux_0_7:
    name: Join data
    parent: Guides
    weight: 2
---

The [`join()` function](/flux/v.07/functions/transformations/join) merges two or more input streams whose values are equal on
a set of common columns into a single output stream. This function allows you to do math across measurements.

In the following example, we're comparing joining the `httpd` and `write` tables in order to compare `_time`, `_stop`, `_start`, and `_host`. The results are grouped by cluster ID so you can make comparisons across clusters.


```js
batchSize = (cluster_id, start=-1m, interval=10s) => {
    httpd = from(bucket:"telegraf")
        |> range(start:start)
        |> filter(fn:(r) => r._measurement == "influxdb_httpd" and r._field == "writeReq" and r.cluster_id == cluster_id)
        |> window(every:interval)
        |> mean()
        |> window(every:inf)
        |> derivative(nonNegative:true,unit:60s)

    write = from(bucket:"telegraf")
        |> range(start:start)
        |> filter(fn:(r) => r._measurement == "influxdb_write" and r._field == "pointReq" and r.cluster_id == cluster_id)
        |> window(every:interval)
        |> max()
        |> window(every:inf)
        |> derivative(nonNegative:true,unit:60s)

    return join(tables:{httpd:httpd, write:write}, on:["_time","_stop","_start","host"])
        |> map(fn:(r) => ({
            _time: r._time,
            _value: r._value_httpd / r._value_write,
        }))
        |> group(by: "cluster_id")
}

batchSize(cluster_id: "enter cluster id here")
```
