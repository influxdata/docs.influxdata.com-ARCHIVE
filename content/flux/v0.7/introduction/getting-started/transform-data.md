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
you often need to transform that data in some way such as aggregating data into averages,
downsampling data, etc.

This guide demonstrates using [Flux functions](#) to transform your data by walking through
a Flux script that aggregates data into windows of time, averages the `_value`s in each window,
and outputs the newly transformed data.

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
Flux includes a number of primitive functions that perform a specific operations, transformations, or tasks.
You can also create [user-defined functions (UDFs)](#) to use in your Flux queries.
Functions are covered in detail in the [Flux functions](#) documentation.

A common type of function used when transforming data queried from InfluxDB is an aggregate function.
Aggregate functions take a set of `_value`s within a given time window, aggregate them, and transform
them into a new value.

This example uses the `mean()` function to average values within a given time window.

## Window your data
Flux's [`window()` function](#) groups records based on a time value.
Use the `every` property to define a duration of time between windows.

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

As data is gathered into windows of time, each window is its own table.
In the data visualization, each table is assigned a unique color.

![Windowed data tables](/img/flux/flux-windowed-data.png)

## Aggregate windowed data
Flux aggregate functions take the `_values` in each window table and aggregates them in some way.
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

## Ungroup aggregate tables
Aggregate functions aggregate rows in the separate window tables into a single row for each table.
However the window tables are all still separate and, when visualized, will appear as single, unconnected points.

![](/img/flux/flux-windowed-aggregates.png)

Use the `group()` function with the `none:true` property to combine the window aggregates into a single table.

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
There are many more possible ways to manipulated your data using both Flux's primitive functions
and your own custom UDFs, but this is a good introduction into the basic syntax and query structure.

<div class="page-nav-btns">
  <a class="btn prev" href="/flux/v0.7/introduction/getting-started/query-influxdb/">Transform your data</a>
  <a class="btn next" href="#">Placeholder</a>
</div>
