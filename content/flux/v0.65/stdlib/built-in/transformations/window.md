---
title: window() function
description: The window() function groups records based on a time value.
aliases:
  - /flux/v0.65/functions/transformations/window
  - /flux/v0.65/functions/built-in/transformations/window/
menu:
  flux_0_65:
    name: window
    parent: Transformations
    weight: 1
---

The `window()` function groups records based on a time value.
New columns are added to uniquely identify each window.
Those columns are added to the group key of the output tables.

A single input record will be placed into zero or more output tables, depending on the specific windowing function.

By default the start boundary of a window will align with the Unix epoch (zero time)
modified by the offset of the `location` option.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
window(
  every: 5m,
  period: 5m,
  offset: 12h,
  timeColumn: "_time",
  startColumn: "_start",
  stopColumn: "_stop",
  createEmpty: false
)
```

## Parameters

{{% note %}}
#### Calendar months and years
`every`, `period`, and `offset` support all [valid duration units](/flux/v0.65/language/types/#duration-types),
including **calendar months (`1mo`)** and **years (`1y`)**.
{{% /note %}}

### every
Duration of time between windows.
Defaults to `period` value.

_**Data type:** Duration_

### period
Duration of the window.
Period is the length of each interval.
It can be negative, indicating the start and stop boundaries are reversed.
Defaults to `every` value.

_**Data type:** Duration_

### offset
Offset is the duration by which to shift the window boundaries.
It can be negative, indicating that the offset goes backwards in time.
Defaults to 0, which will align window end boundaries with the `every` duration.

_**Data type:** Duration_

### timeColumn
The column containing time.
Defaults to `"_time"`.

_**Data type:** String_

### startColumn
The column containing the window start time.
Defaults to `"_start"`.

_**Data type:** String_

### stopColumn
The column containing the window stop time.
Defaults to `"_stop"`.

_**Data type:** String_

### createEmpty
Specifies whether empty tables should be created.
Defaults to `false`.

_**Data type:** Boolean_

## Examples

#### Window data into 10 minute intervals
```js
from(bucket:"telegraf/autogen")
  |> range(start: -12h)
  |> window(every: 10m)
  // ...
```

#### Window data using intervals function
The following windows data into 8 hour intervals starting at 9AM every day.
```js
from(bucket:"telegraf/autogen")
  |> range(start: -12h)
  |> window(intervals: intervals(every: 1d, period: 8h, offset: 9h))
```

#### Window by calendar month
```js
from(bucket:"example-bucket")
  |> range(start: -1y)
  |> window(every: 1mo)
  // ...
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[GROUP BY time()](/influxdb/latest/query_language/explore-data/#the-group-by-clause)
