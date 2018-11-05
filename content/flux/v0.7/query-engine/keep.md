---
title: Keep
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Keep
    weight:
---

Keep is the inverse of drop. It will return a table containing only columns that are specified,
ignoring all others.
Only columns in the group key that are also specified in `keep` will be kept in the resulting group key.

Keep has the following properties:
* `columns` array of strings
  * An array of columns that should be included in the resulting table. Cannot be used with `fn`.
* `fn` function
  * A function which takes a column name as a parameter and returns a boolean indicating whether or not the column should be included in the resulting table.
  * Cannot be used with `columns`.

**Examples**

Keep a list of columns:

`keep(columns: ["_time", "_value"])`

Keep all columns matching a predicate:

`keep(fn: (col) => col =~ /inodes*/)`

Keep a list of columns:

```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> keep(columns: ["_time", "_value"])
```
Keep all columns matching a predicate:

```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> keep(fn: (col) => col =~ /inodes*/)
```
