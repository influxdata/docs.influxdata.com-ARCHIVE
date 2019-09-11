---
title: range() function
description: The range() function filters records based on time bounds.
aliases:
  - /flux/v0.x/functions/transformations/range
menu:
  flux_0_x:
    name: range
    parent: Transformations
    weight: 1
---

The `range()` function filters records based on time bounds.
Each input table's records are filtered to contain only records that exist within the time bounds.
Records with a `null` value for their time are filtered.
Each input table's group key value is modified to fit within the time bounds.
Tables where all records exists outside the time bounds are filtered entirely.

_**Function type:** Transformation_  
_**Output data type:* Object_

```js
range(start: -15m, stop: now)
```

## Parameters

### start
The earliest time to include in results.
Use a relative duration or absolute time.
For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to `now()`.

_**Data type:** Duration | Time_

### stop
The latest time to include in results.
Use a relative duration or absolute time.
For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to `now()`.
Defaults to `now()`.

_**Data type:** Duration | Time_

> Time values in Flux must be in [RFC3339 format](/flux/v0.x/language/types#timestamp-format).

## Examples

###### Time range relative to now
```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  // ...
```

###### Relative time range
```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h, stop: -15m)
  // ...
```

###### Absolute time range
```js
from(bucket:"telegraf/autogen")
  |> range(start:2018-05-22T23:30:00Z, stop: 2018-05-23T00:00:00Z)
  // ...
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[WHERE](/influxdb/latest/query_language/data_exploration/#the-where-clause)  
