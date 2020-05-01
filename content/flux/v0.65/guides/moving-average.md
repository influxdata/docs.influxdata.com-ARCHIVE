---
title: Calculate the moving average
seotitle: Calculate the moving average in Flux
list_title: Moving Average
description: >
  Use the [`movingAverage()`](/flux/v0.65/stdlib/built-in/transformations/aggregates/movingaverage/)
  or [`timedMovingAverage()`](/flux/v0.65/stdlib/built-in/transformations/aggregates/timedmovingaverage/)
  functions to return the moving average of data.
weight: 10
menu:
  flux_0_65:
    parent: Query with Flux
    name: Moving Average
list_query_example: moving_average
---

Use the [`movingAverage()`](/flux/v0.65/stdlib/built-in/transformations/aggregates/movingaverage/)
or [`timedMovingAverage()`](/flux/v0.65/stdlib/built-in/transformations/aggregates/timedmovingaverage/)
functions to return the moving average of data.

```js
data
  |> movingAverage(n: 5)

// OR

data
  |> timedMovingAverage(every: 5m, period: 10m)
```

### movingAverage()
For each row in a table, `movingAverage()` returns the average of the current value and
**previous** values where `n` is the total number of values used to calculate the average.

If `n = 3`:

| Row # | Calculation                   |
|:-----:|:-----------                   |
| 1     | _Insufficient number of rows_ |
| 2     | _Insufficient number of rows_ |
| 3     | (Row1 + Row2 + Row3) / 3      |
| 4     | (Row2 + Row3 + Row4) / 3      |
| 5     | (Row3 + Row4 + Row5) / 3      |

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.2    |
| 2020-01-01T00:03:00Z | 1.8    |
| 2020-01-01T00:04:00Z | 0.9    |
| 2020-01-01T00:05:00Z | 1.4    |
| 2020-01-01T00:06:00Z | 2.0    |
{{% /flex-content %}}
{{% flex-content %}}
**The following would return:**

```js
|> movingAverage(n: 3)
```  

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:03:00Z | 1.33   |
| 2020-01-01T00:04:00Z | 1.30   |
| 2020-01-01T00:05:00Z | 1.36   |
| 2020-01-01T00:06:00Z | 1.43   |
{{% /flex-content %}}
{{< /flex >}}

### timedMovingAverage()
For each row in a table, `timedMovingAverage()` returns the average of the
current value and all row values in the **previous** `period` (duration).
It returns moving averages at a frequency defined by the `every` parameter.

Each color in the diagram below represents a period of time used to calculate an
average and the time a point representing the average is returned.
If `every = 30m` and `period = 1h`:

{{< svg "/static/img/svgs/timed-moving-avg.svg" >}}

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.2    |
| 2020-01-01T00:03:00Z | 1.8    |
| 2020-01-01T00:04:00Z | 0.9    |
| 2020-01-01T00:05:00Z | 1.4    |
| 2020-01-01T00:06:00Z | 2.0    |  
{{% /flex-content %}}
{{% flex-content %}}
**The following would return:**

```js
|> timedMovingAverage(
  every: 2m,
  period: 4m
)
```  

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:02:00Z | 1.000  |
| 2020-01-01T00:04:00Z | 1.333  |
| 2020-01-01T00:06:00Z | 1.325  |
| 2020-01-01T00:06:00Z | 1.150  |
{{% /flex-content %}}
{{< /flex >}}
