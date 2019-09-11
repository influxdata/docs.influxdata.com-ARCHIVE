---
title: movingAverage() function
description: >
  The `movingAverage()` function calculates the mean of values grouped into `n` number of points.
menu:
  flux_0_36:
    name: movingAverage
    parent: Aggregates
weight: 501
---

The `movingAverage()` function calculates the mean of values grouped into `n` number of points.

_**Function type:** Aggregate_  

```js
movingAverage(
  n: 5,
  columns: ["_value"]
)
```

##### Moving average rules:
- The average over a period populated by `n` values is equal to their algebraic mean.
- The average over a period populated by only `null` values is `null`.
- Moving averages skip `null` values.
- If `n` is less than the number of records in a table, `movingAverage` returns
  the average of the available values.

## Parameters

### n
The number of points to average.

_**Data type:** Integer_

### columns
Columns to operate on. _Defaults to `["_value"]`_.

_**Data type:** Array of Strings_

## Examples

#### Calculate a five point moving average
```js
from(bucket: "telegraf/autogen"):
  |> range(start: -12h)
  |> movingAverage(n: 5)
```

#### Calculate a ten point moving average
```js
movingAverage = (every, period, column="_value", tables=<-) =>
  tables
    |> window(every: every, period: period)
    |> mean(column: column)
    |> duplicate(column: "_stop", as: "_time")
    |> window(every: inf)
```

#### Table transformation with a two point moving average

###### Input table:
| _time |   A  |   B  |   C  |   D  | tag |
|:-----:|:----:|:----:|:----:|:----:|:---:|
|  0001 | null |   1  |   2  | null |  tv |
|  0002 |   6  |   2  | null | null |  tv |
|  0003 |   4  | null |   4  |   4  |  tv |

###### Query:
```js
// ...
  |> movingAverage(
    n: 2,
    columns: ["A", "B", "C", "D"]
  )
```

###### Output table:
| _time |   A  |   B  |   C  |   D  | tag |
|:-----:|:----:|:----:|:----:|:----:|:---:|
|  0002 |   6  |  1.5 |   2  | null |  tv |
|  0003 |   5  |   2  |   4  |   4  |  tv |
