---
title: shift() function
description: placeholder
menu:
  flux_0_7:
    name: shift
    parent: Functions
    weight: 1
---

The `shift()` function adds a fixed duration to time columns.
The output table schema is the same as the input table.

_**Function type:** transformation_  
_**Output data type:** table_

```js
shift(shift: 10h, columns: ["_start", "_stop", "_time"])
```

## Parameters

### shift
The amount of time to add to each time value. The shift may be a negative duration.

_**Data type:** duration_

### columns
The list of all columns to be shifted. Defaults to `["_start", "_stop", "_time"]`.

_**Data type:** array of strings_

## Examples

###### Shift forward in time
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> shift(shift: 12h)
```

###### Shift backward in time
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> shift(shift: -12h)
```
