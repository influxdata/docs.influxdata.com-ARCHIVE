---
title: range() function
description: The range() function filters records based on time bounds.
aliases:
  - /flux/v0.33/functions/transformations/range
menu:
  flux_0_33:
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
Specifies the oldest time to be included in the results.

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using timestamps.

_**Data type:** Duration or Timestamp_

### stop
Specifies the exclusive newest time to be included in the results. Defaults to `now`.

Relative stop times are defined using negative durations.
Negative durations are relative to now.
Absolute stop times are defined using timestamps.

_**Data type:** Duration or Timestamp_

> Flux only honors [RFC3339 timestamps](/flux/v0.33/language/types#timestamp-format)
> and ignores dates and times provided in other formats.

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
