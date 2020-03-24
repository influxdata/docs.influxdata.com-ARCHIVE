---
title: union() function
description: The union() function concatenates two or more input streams into a single
  output stream.
aliases:
  - /flux/v0.64/functions/transformations/union
  - /flux/v0.64/functions/built-in/transformations/union/
menu:
  flux_0_64:
    name: union
    parent: Transformations
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

_**Data type:** Array of streams_

## Examples
```js
left = from(bucket: "test")
  |> range(start: 2018-05-22T19:53:00Z, stop: 2018-05-22T19:53:50Z)
  |> filter(fn: (r) =>
    r._field == "usage_guest" or
    r._field == "usage_guest_nice"
  )
  |> drop(columns: ["_start", "_stop"])

right = from(bucket: "test")
  |> range(start: 2018-05-22T19:53:50Z, stop: 2018-05-22T19:54:20Z)
  |> filter(fn: (r) =>
    r._field == "usage_guest" or
    r._field == "usage_idle"
  )
  |> drop(columns: ["_start", "_stop"])

union(tables: [left, right])
```

## union() versus join()
`union()` merges separate streams of tables into a single stream of tables and
groups rows of data based on existing [group keys](/flux/v0.64/introduction/getting-started/#group-keys).
`union()` does not modify individual rows of data.
`join()` creates new rows based on common values in one or more specified columns.
Output rows also contain the differing values from each of the joined streams.
