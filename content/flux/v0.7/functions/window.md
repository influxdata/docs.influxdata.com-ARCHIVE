---
title: window() function
description: placeholder
menu:
  flux_0_7:
    name: window
    parent: Functions
    weight: 1
---

The `window()` function groups records based on a time value.
New columns are added to uniquely identify each window.
Those columns are added to the group key of the output tables.

A single input record will be placed into zero or more output tables, depending on the specific windowing function.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
window(every: 5m, period: 5m, offset: 12h, timeCol: "_time", startCol: "_start", stopCol: "_stop")

// OR

window(intervals: intervals(every: 5m, period: 5m, offset: 12h), timeCol: "_time", startCol: "_start", stopCol: "_stop")
```

## Parameters

> `every`,`period` or `intervals` is required.

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
The offset duration relative to the [`location`](#) offset.
It can be negative, indicating that the offset goes backwards in time.
The default aligns the window boundaries with `now`.

_**Data type:** Duration_

### intervals
A function that returns an interval generator, a set of intervals used as windows.

_**Data type:** Function_

###### Example interval generator function
```js
intervals(every:1d, period:8h, offset:9h)
```

> When `intervals` is used, `every`, `period`, and `offset` cannot be used or need to be set to 0.

### timeCol
The column containing time.
Defaults to `"_time"`.

_**Data type:** String_

### startCol
The column containing the window start time.
Defaults to `"_start"`.

_**Data type:** String_

### stopCol
The column containing the window stop time.
Defaults to `"_stop"`.

_**Data type:** String_

## Examples

#### Window data into 10 minute intervals
```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  |> window(every:10m)
  // ...
```

#### Window data using intervals function
The following windows data into 8 hour intervals starting at 9AM every day.
```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  |> window(intervals: intervals(every:1d, period:8h, offset:9h))
```
