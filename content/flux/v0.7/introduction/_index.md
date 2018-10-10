---
title: Introduction to Flux
description: Flux is InfluxData's new functional data scripting language designed for querying, analyzing, and acting on time series data.
menu:
  flux_0_7:
    name: Introduction
    weight: 2
---

Flux is InfluxData's new functional data scripting language designed for querying, analyzing, and acting on time series data.
Its takes the power of [InfluxQL](/influxdb/latest/query_language/spec/) and the functionality of [TICKscript](https://docs.influxdata.com/kapacitor/v1.5/tick/introduction/) and combines them into a single, unified syntax.

> Flux v0.7 is a technical preview included with [InfluxDB v1.7](/influxdb/v1.7).
> It is still in active development and many functions provided by InfluxQL and TICKscript
> have yet to be implemented. View the [Flux roadmap](#) for information about the progress
> of functions and features.

## Flux design principles
Flux is designed to be usable, readable, flexible, composable, testable, contributable, and shareable.
Its syntax is largely inspired by [2018's most popular scripting language](https://insights.stackoverflow.com/survey/2018#technology),
Javascript, and takes a functional approach to data exploration and processing.

The following example illustrates pulling data from a bucket (similar to an InfluxQL database) for the last five minutes,
filtering that data by the `cpu` measurement and the `cpu=cpu-usage` tag, windowing the data in 1 minute intervals,
and calculating the average of each window:

```js
from(bucket:"telegraf/autogen")
  |> range(start:-5m)
  |> filter(fn:(r) => r._measurement == "cpu" AND r.cpu == "cpu-total")
  |> window(every:1m)
  |> mean()
```

### Pipe-forward operator
Flux uses the pipe-forward operator (`|>`) heavily. After each function or operation,
Flux returns a table of data. The pipe-forward pipes that table into the next
function or operation where it will be further processed or manipulated.

## Get started with Flux
The best way to familiarize yourself with Flux is to walk through creating a simple Flux query.
The getting started documentation does just that.

<span style="font-size:1.25em">
  [Get started with Flux](/flux/v0.7/introduction/getting-started)
</span>
