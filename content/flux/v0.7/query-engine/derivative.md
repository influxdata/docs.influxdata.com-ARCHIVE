---
title: Derivative
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Derivative
    weight:
---

Derivative computes the time based difference between subsequent non null records.

Derivative has the following properties:

* `unit` duration
  * unit is the time duration to use for the result
* `nonNegative` bool
  * nonNegative indicates if the derivative is allowed to be negative.
  * If a value is encountered which is less than the previous value then it is assumed the previous value should have been a zero.
* `columns` list strings
  * `columns` is a list of columns on which to compute the derivative
* `timeSrc` string
  * `timeSrc` is the source column for the time values.
    Defaults to `_time`.

**Example:**
```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "disk" and r._field == "used_percent")
    |> derivative(nonNegative: true, columns: ["used_percent"])
```
