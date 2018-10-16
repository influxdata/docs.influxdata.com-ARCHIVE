---
title: Get started with Flux
description: placeholder
menu:
  flux_0_7:
    name: Get started with Flux
    parent: Introduction
    weight: 2
---

- intro

- Use the Flux builder in Chronograf v1.7.

## Important things to know going in

### Introducing buckets
- Flux is designed around querying data in InfluxDB v2.0 which will change the
  data structure by introducing "buckets".
- A bucket is a combination of a v1.x database and retention policy.
- When using Flux to query data from InfluxDB v1.x, your source must come in the form of a bucket.
  The current technical preview of Flux will know where to access data in InfluxDB as long as you use the following pattern:

```js
// Pattern
from(bucket:"<database>/<retention-policy>")

// Example
from(bucket:"telegraf/autogen")
```

> If no retention policy is included in the bucket name, Flux will query the default RP.

### The pipe-forward operator
- Flux uses this extensively
- Explain what it does

## Define your data source
- Use the `from()` function.
- Flux supports multiple data sources, but this documentation is primarily focused
  on using Flux to query InfluxDB data.

```js
from(bucket:"telegraf/autogen")
```

## Define a time range
```js
from(bucket:"telegraf/autogen")
  |> range(start: -5m)
```

- Relative time ranges using negative durations
- Absolute time ranges using timestamps

## Filter your data
- Filter using anonymous functions

```js
from(bucket:"telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement "cpu")
```

- Using the `AND` operator to chain filters

- In InfluxDB, measurements and everything else is considered a "tag."
- Reserved names namespaced with `_`:
  - `_measurement`
  - `_field`
  - `_value`
  - `_start`
  - `_stop`
  - `_time`

## Transform your data
- Introduction to functions (provided and user-defined)
- Introduction to `window()` for aggregates


## Defining variables
```js
data = from(bucket:"telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "cpu" AND r.cpu == "cpu-total")

data
  |> window(every: 5m)
  |> mean()
  |> yeild(name: "Average CPU Total")
```
