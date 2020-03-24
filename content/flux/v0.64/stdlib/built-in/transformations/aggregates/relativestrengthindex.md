---
title: relativeStrengthIndex() function
description: >
  The `relativeStrengthIndex()` function measures the relative speed and
  change of values in an input table.
menu:
  flux_0_64:
    name: relativeStrengthIndex
    parent: Aggregates
weight: 1
aliases:
  - /flux/v0.64/functions/built-in/transformations/aggregates/relativestrengthindex/
---

The `relativeStrengthIndex()` function measures the relative speed and change of
values in an input table.

_**Function type:** Aggregate_  

```js
relativeStrengthIndex(
  n: 5,
  columns: ["_value"]
)
```

##### Relative strength index rules:
- The general equation for calculating a relative strength index (RSI) is
  `RSI = 100 - (100 / (1 + (AVG GAIN / AVG LOSS)))`.
- For the first value of the RSI, `AVG GAIN` and `AVG LOSS` are averages of the `n` period.
- For subsequent calculations:
  - `AVG GAIN` = `((PREVIOUS AVG GAIN) * (n - 1)) / n`
  - `AVG LOSS` = `((PREVIOUS AVG LOSS) * (n - 1)) / n`
- `relativeStrengthIndex()` ignores `null` values.

## Parameters

### n
The number of values to use to calculate the RSI.

_**Data type:** Integer_

### columns
Columns to operate on. _Defaults to `["_value"]`_.

_**Data type:** Array of Strings_

## Examples

#### Calculate a five point relative strength index
```js
from(bucket: "telegraf/autogen"):
  |> range(start: -12h)
  |> relativeStrengthIndex(n: 5)
```

#### Table transformation with a ten point RSI

###### Input table:
| _time | A    | B    | tag |
|:-----:|:----:|:----:|:---:|
| 0001  | 1    | 1    | tv  |
| 0002  | 2    | 2    | tv  |
| 0003  | 3    | 3    | tv  |
| 0004  | 4    | 4    | tv  |
| 0005  | 5    | 5    | tv  |
| 0006  | 6    | 6    | tv  |
| 0007  | 7    | 7    | tv  |
| 0008  | 8    | 8    | tv  |
| 0009  | 9    | 9    | tv  |
| 0010  | 10   | 10   | tv  |
| 0011  | 11   | 11   | tv  |
| 0012  | 12   | 12   | tv  |
| 0013  | 13   | 13   | tv  |
| 0014  | 14   | 14   | tv  |
| 0015  | 15   | 15   | tv  |
| 0016  | 16   | 16   | tv  |
| 0017  | 17   | null | tv  |
| 0018  | 18   | 17   | tv  |

###### Query:
```js
// ...
  |> relativeStrengthIndex(
    n: 10,
    columns: ["A", "B"]
  )
```

###### Output table:
| _time |   A  |   B  | tag |
|:-----:|:----:|:----:|:---:|
|  0011 | 100  | 100  |  tv |
|  0012 | 100  | 100  |  tv |
|  0013 | 100  | 100  |  tv |
|  0014 | 100  | 100  |  tv |
|  0015 | 100  | 100  |  tv |
|  0016 |  90  |  90  |  tv |
|  0017 |  81  |  90  |  tv |
|  0018 | 72.9 |  81  |  tv |

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[RELATIVE_STRENGTH_INDEX](/influxdb/latest/query_language/functions/#relative-strength-index)
