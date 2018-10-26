---
title: range() function
description: placeholder
menu:
  flux_0_7:
    name: range
    parent: Functions
    weight: 1
---

The `range()` function filters records based on time bounds.
Each input table's records are filtered to contain only records that exist within the time bounds.
Each input table's group key value is modified to fit within the time bounds.
Tables where all records exists outside the time bounds are filtered entirely.

_**Function type:** filter_  
_**Output data type:* table(s)_

```js
range(start: -15m, stop: now)
```

## Parameters

### start
Specifies the oldest time to be included in the results.

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using timestamps.

_**Data type:** duration or timestamp_

### stop
Specifies the exclusive newest time to be included in the results. Defaults to `now`.

Relative stop times are defined using negative durations.
Negative durations are relative to now.
Absolute stop times are defined using timestamps.

_**Data type:** duration or timestamp_

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
