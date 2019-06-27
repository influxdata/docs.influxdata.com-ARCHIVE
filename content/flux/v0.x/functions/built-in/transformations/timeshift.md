---
title: timeShift() function
description: The timeShift() function adds a fixed duration to time columns.
aliases:
  - /flux/v0.x/functions/transformations/shift
  - /flux/v0.x/functions/built-in/transformations/shift
menu:
  flux_0_x:
    name: shift
    parent: Transformations
    weight: 1
---

The `timeShift()` function adds a fixed duration to time columns.
The output table schema is the same as the input table.
If the time is `null`, the time will continue to be `null`.

_**Function type:** Transformation_

```js
timeShift(duration: 10h, columns: ["_start", "_stop", "_time"])
```

## Parameters

### duration
The amount of time to add to each time value.
May be a negative duration.

_**Data type:** Duration_

### columns
The list of all columns to be shifted.
Defaults to `["_start", "_stop", "_time"]`.

_**Data type:** Array of strings_

## Examples

###### Shift forward in time
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> timeShift(duration: 12h)
```

###### Shift backward in time
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> timeShift(duration: -12h)
```
