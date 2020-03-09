---
title: count() function
description: The count() function outputs the number of non-null records in each aggregated
  column.
aliases:
  - /flux/v0.x/functions/transformations/aggregates/count
  - /flux/v0.x/functions/built-in/transformations/aggregates/count/
menu:
  flux_0_x:
    name: count
    parent: Aggregates
    weight: 1
---

The `count()` function outputs the number of records in each aggregated column.
It counts both null and non-null records.

_**Function type:** Aggregate_  
_**Output data type:** Integer_

```js
count(column: "_value")
```

{{% note %}}
#### Count empty tables
`count()` returns `0` for empty tables.
To keep empty tables in your data, set the following parameters for the following functions:

| Function                                                                                    | Parameter           |
|:--------                                                                                    |:---------           |
| [filter()](/flux/v0.x/stdlib/built-in/transformations/filter/)                              | `onEmpty: "keep"`   |
| [window()](/flux/v0.x/stdlib/built-in/transformations/window/)                              | `createEmpty: true` |
| [aggregateWindow()](/flux/v0.x/stdlib/built-in/transformations/aggregates/aggregatewindow/) | `createEmpty: true` |
{{% /note %}}

## Parameters

### column
Column on which to operate.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> count()
```

```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> count(column: "_value")
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[COUNT()](/influxdb/latest/query_language/functions/#count)
