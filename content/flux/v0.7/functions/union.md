---
title: union() function
description: The union() function concatenates two or more input streams into a single output stream.
menu:
  flux_0_7:
    name: union
    parent: Functions
    weight: 1
---

The `union()` function concatenates two or more input streams into a single output stream.
In tables that have identical schemas and group keys, contents of the tables will be concatenated in the output stream.
The output schemas of the `union()` function is the union of all input schemas.

`union()` does not preserve the sort order of the rows within tables.
A sort operation may be added if a specific sort order is needed.

_**Function type:** Transformation_
_**Output data type:** Object_

```js
union(tables: ["table1", "table2"])
```

## Parameters

### tables
Specifies the streams to union together.
There must be at least two streams.

_**Data type:** Array of strings_

## Examples
```js
left = from(bucket: "test")
  |> range(start: 2018-05-22T19:53:00Z, stop: 2018-05-22T19:53:50Z)
  |> filter(fn: (r) => r._field == "usage_guest" OR r._field == "usage_guest_nice")
  |> drop(columns: ["_start", "_stop"])

right = from(bucket: "test")
  |> range(start: 2018-05-22T19:53:50Z, stop: 2018-05-22T19:54:20Z)
  |> filter(fn: (r) => r._field == "usage_guest" OR r._field == "usage_idle")
  |> drop(columns: ["_start", "_stop"])

union(tables: [left, right])
  |> sort(cols: ["_time"])
```
