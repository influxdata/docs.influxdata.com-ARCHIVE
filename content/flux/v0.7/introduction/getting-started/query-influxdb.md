---
title: Query data from InfluxDB with Flux
description: placeholder
menu:
  flux_0_7:
    name: Query data from InfluxDB
    parent: get-started
    weight: 1
---

## Open the Data Explorer
- Click on Data Explorer in the left Nav

### Define your data source
- Use the `from()` function.
- Flux supports multiple data sources, but this documentation is primarily focused
  on using Flux to query InfluxDB data.

```js
from(bucket:"telegraf/autogen")
```

### Specify a time range
```js
from(bucket:"telegraf/autogen")
  |> range(start: -5m)
```

- Relative time ranges using negative durations
- Absolute time ranges using timestamps

### Filter your data
- Filter using anonymous functions

```js
from(bucket:"telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) => r._measurement "cpu")
```

- Using the `AND` operator to chain filters

##E Transform your data
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
