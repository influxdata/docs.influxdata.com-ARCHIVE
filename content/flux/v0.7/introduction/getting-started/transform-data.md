---
title: Transform data with Flux
description: Learn the basics of using Flux to transform data queried from InfluxDB.
menu:
  flux_0_7:
    name: Transform your data
    parent: get-started
    weight: 2
---

When [querying data from InfluxDB](/flux/v0.7/introduction/getting-started/query-influxdb),
you often need to transform that data in some way.
Common examples are aggregating data into averages, downsampling data, etc.

This guide demonstrates using [Flux functions](#) to transform your data.
It walks through creating a Flux script that partitions data into windows of time,
averages the `_value`s in each window, and outputs the averages as a new table.

## Query data
Use the query built in the previous [Query data from InfluxDB](/platform/introduction/getting-started/query-influxdb)
guide, but update the range to pull data from the last hour:

```js
from(bucket:"telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" AND
    r._field == "usage_system" AND
    r.cpu == "cpu-total")
```

## Flux functions
Flux provides a number of functions that perform a specific operations, transformations, and tasks.
You can also [create custom functions](#) in your Flux queries.
_Functions are covered in detail in the [Flux functions](#) documentation._

A common type of function used when transforming data queried from InfluxDB is an aggregate function.
Aggregate functions take a set of `_value`s within a given time window, aggregate them, and transform
them into a new value.

This example uses the `mean()` function to average values within time windows.

## Window your data
Flux's [`window()` function](#) partitions records based on a time value.
Use the `every` parameter to define a duration of time between windows.

For this example, window data in five minute intervals (`5m`).

```js
from(bucket:"telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" AND
    r._field == "usage_system" AND
    r.cpu == "cpu-total")
  |> window(every: 5m)
```

As data is gathered into windows of time, each window is output as its own table.
When visualized, each table is assigned a unique color.

![Windowed data tables](/img/flux/flux-windowed-data.png)

## Aggregate windowed data
Flux aggregate functions take the `_values` in each window table and aggregate them in some way.
Use the [`mean()` function](#) to average the `_values` of each table.

```js
from(bucket:"telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" AND
    r._field == "usage_system" AND
    r.cpu == "cpu-total")
  |> window(every: 5m)
  |> mean()
```

As rows in each window are aggregated, their output table contains only a single row with the aggregate value.
Windowed tables are all still separate and, when visualized, will appear as single, unconnected points.

![](/img/flux/flux-windowed-aggregates.png)

## Ungroup aggregate tables

Use the `group()` function with the `none:true` parameter to remove the window partitions
and combine the aggregate rows into a single table.

```js
from(bucket:"telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" AND
    r._field == "usage_system" AND
    r.cpu == "cpu-total")
  |> window(every: 5m)
  |> mean()
  |> group(none:true)
```

Once ungrouped and combined into a single table, the aggregate data points will appear connected in your visualization.

![](/img/flux/flux-windowed-aggregates-ungrouped.png)


## Congratulations!
You have now constructed a Flux query that uses Flux functions to transform your data.
There are many more ways to manipulate your data using both Flux's primitive functions
and your own custom functions, but this is a good introduction into the basic syntax and query structure.

<div class="page-nav-btns">
  <a class="btn prev" href="/flux/v0.7/introduction/getting-started/query-influxdb/">Query InfluxDB</a>
  <a class="btn next" href="#">Placeholder</a>
</div>
