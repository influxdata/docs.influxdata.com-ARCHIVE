---
title: Flux stream and table functions
description: >
  Use stream and table functions to extract a table from a stream of tables
  and access its columns and records.
weight: 1
menu:
  flux_0_50:
    name: Stream & table
    parent: Transformations
aliases:
  - /flux/v0.50/functions/built-in/transformations/stream-table/
---

Use stream and table functions to extract a table from a stream of tables and access its
columns and records.

{{< function-list >}}

##### Example stream and table functions
```js
data = from(bucket:"telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn:(r) => r._measurement == "cpu")

// Extract the first available table for which "_field" is equal to "usage_idle"
t = data |> tableFind(fn: (key) => key._field == "usage_idle")

// Extract the "_value" column from the table
values = t |> getColumn(column: "_value")

// Extract the first record from the table
r0 = t |> getRecord(idx: 0)
```
