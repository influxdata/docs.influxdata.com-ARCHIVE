---
title: Cumulative sum
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Cumulative sum
    weight:
---










Cumulative sum computes a running sum for non null records in the table.
The output table schema will be the same as the input table.

Cumulative sum has the following properties:

* `columns` list string
    columns is a list of columns on which to operate.

Example:
```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "disk" and r._field == "used_percent")
    |> cumulativeSum(columns: ["_value"])
```
