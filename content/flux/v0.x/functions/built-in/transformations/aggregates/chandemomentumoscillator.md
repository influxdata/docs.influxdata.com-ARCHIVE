---
title: chandeMomentumOscillator() function
description: >
  The `chandeMomentumOscillator()` function applies the technical momentum indicator
  developed by Tushar Chande.
menu:
  flux_0_x:
    name: chandeMomentumOscillator
    parent: Aggregates
    weight: 1
---

The `chandeMomentumOscillator()` function applies the technical momentum indicator
developed by Tushar Chande.

_**Function type:** Aggregate_

```js
chandeMomentumOscillator(
  n: 10,
  columns: ["_value"]
)
```

The Chande Momentum Oscillator (CMO) indicator calculates the difference between
the sum of all recent data points with values greater than the median value of the data set
and the sum of all recent data points with values lower than the median value of the data set,
then divides the result by the sum of all data movement over a given time period.
It then multiplies the result by 100 and returns a value between -100 and +100.

## Parameters

### n
The period or number of points to use in the calculation.

_**Data type: Integer**_

### columns
The columns to operate on.
Defaults to `["_value"]`.

_**Data type: Array of Strings**_

## Examples

#### Table transformation with a ten point Chande Momentum Oscillator
###### Input table
| _time | _value |
|:-----:|:------:|
| 0001  | 1      |
| 0002  | 2      |
| 0003  | 3      |
| 0004  | 4      |
| 0005  | 5      |
| 0006  | 6      |
| 0007  | 7      |
| 0008  | 8      |
| 0009  | 9      |
| 0010  | 10     |
| 0011  | 11     |
| 0012  | 12     |
| 0013  | 13     |
| 0014  | 14     |
| 0015  | 15     |
| 0016  | 14     |
| 0017  | 13     |
| 0018  | 12     |
| 0019  | 11     |
| 0020  | 10     |
| 0021  | 9      |
| 0022  | 8      |
| 0023  | 7      |
| 0024  | 6      |
| 0025  | 5      |
| 0026  | 4      |
| 0027  | 3      |
| 0028  | 2      |
| 0029  | 1      |

###### Query
```js
// ...
  |> chandeMomentumOscillator(n: 10)
```

###### Output table
| _time | _value |
|:-----:|:------:|
| 0011  | 100    |
| 0012  | 100    |
| 0013  | 100    |
| 0014  | 100    |
| 0015  | 100    |
| 0016  | 80     |
| 0017  | 60     |
| 0018  | 40     |
| 0019  | 20     |
| 0020  | 0      |
| 0021  | -20    |
| 0022  | -40    |
| 0023  | -60    |
| 0024  | -80    |
| 0025  | -100   |
| 0026  | -100   |
| 0027  | -100   |
| 0028  | -100   |
| 0029  | -100   |

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[CHANDE_MOMENTUM_OSCILLATOR](/influxdb/latest/query_language/functions/#chande-momentum-oscillator)
