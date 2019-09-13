---
title: fill() function
description: The fill() function filters data based on conditions defined in a predicate
  function (fn).
aliases:
  - /flux/v0.x/functions/transformations/fill
  - /flux/v0.x/functions/built-in/transformations/fill/
menu:
  flux_0_x:
    name: fill
    parent: Transformations
    weight: 1
---


The `fill()` function replaces all null values in an input stream with a non-null value.

_**Function type:** Transformation_  

```js
fill(column: "_value", value: 0.0)

// OR

fill(column: "_value", usePrevious: true)
```

## Parameters

### column
The column in which to replace null values. Defaults to `"_value"`.

_**Data type:** String_

### value
The constant value to use in place of nulls.
The value type must match the value type of the `column`.

_**Data type:** Boolean | Integer | UInteger | Float | String | Time | Duration_

### usePrevious
When `true`, assigns the value set in the previous non-null row.

> Cannot be used with `value`.

_**Data type:** Boolean | Integer | UInteger | Float | String | Time | Duration_


## Examples

##### Fill null values with a specified non-null value
```js
from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> fill(value: 0.0)
```

##### Fill null values with the previous non-null value
```js
from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r.cpu == "cpu-total"
  )
  |> fill(usePrevious: true)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[FILL](/influxdb/latest/query_language/data_exploration/#group-by-time-intervals-and-fill)
