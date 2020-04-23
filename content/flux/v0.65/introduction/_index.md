---
title: Introduction to Flux
description: Flux is InfluxData's new functional data scripting language designed for querying, analyzing, and acting on time series data.
menu:
  flux_0_65:
    name: Introduction
    weight: 2
---

Flux is InfluxData's new functional data scripting language designed for querying, analyzing, and acting on time series data.
Its takes the power of [InfluxQL](/influxdb/latest/query_language/spec/) and the functionality of [TICKscript](https://docs.influxdata.com/kapacitor/v1.5/tick/introduction/) and combines them into a single, unified syntax.

> Flux v0.65 is a technical preview included with [InfluxDB v1.7](/influxdb/latest).
> It is still in active development and many functions provided by InfluxQL and TICKscript
> have yet to be implemented.

## Flux design principles
Flux is designed to be usable, readable, flexible, composable, testable, contributable, and shareable.
Its syntax is largely inspired by [2018's most popular scripting language](https://insights.stackoverflow.com/survey/2018#technology),
Javascript, and takes a functional approach to data exploration and processing.

The following example illustrates pulling data from a bucket (similar to an InfluxQL database) for the last five minutes,
filtering that data by the `cpu` measurement and the `cpu=cpu-total` tag, windowing the data in 1 minute intervals,
and calculating the average of each window:

```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn:(r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> aggregateWindow(every: 1m, fn: mean)
```

## [Enable Flux](/flux/v0.65/introduction/installation)
Flux is packaged with InfluxDB v1.7+ and does not require any additional installation,
however it does need to be enabled.

## [Get started with Flux](/flux/v0.65/introduction/getting-started)
The best way to familiarize yourself with Flux is to walk through creating a simple Flux query.
The getting started documentation does just that.
