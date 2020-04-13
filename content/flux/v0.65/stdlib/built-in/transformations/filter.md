---
title: filter() function
description: The filter() function filters data based on conditions defined in a predicate
  function (fn).
aliases:
  - /flux/v0.65/functions/transformations/filter
  - /flux/v0.65/functions/built-in/transformations/filter/
menu:
  flux_0_65:
    name: filter
    parent: Transformations
    weight: 1
---

The `filter()` function filters data based on conditions defined in a predicate function ([`fn`](#fn)).
The output tables have the same schema as the corresponding input tables.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
filter(
  fn: (r) => r._measurement == "cpu",
  onEmpty: "drop"
)
```

## Parameters

### fn
A single argument predicate function that evaluates true or false.
Records are passed to the function.
Those that evaluate to true are included in the output tables.
Records that evaluate to _null_ or false are not included in the output tables.

_**Data type:** Function_

> Objects evaluated in `fn` functions are represented by `r`, short for "record" or "row".

{{% note %}}
Make sure `fn` parameter names match each specified parameter.
To learn why, see [Match parameter names](/flux/v0.65/language/data-model/#match-parameter-names).
{{% /note %}}

### onEmpty
Defines the behavior for empty tables.
Potential values are `keep` and `drop`.
Defaults to `drop`.

{{% warn %}}
Keeping empty tables with your first `filter()` function can have severe performance
costs since it retains empty tables from your entire data set.
For higher performance, use your first `filter()` function to do basic filtering,
then keep empty tables on subsequent `filter()` calls with smaller data sets.
_[See the example below](#keep-empty-tables-when-filtering)._
{{% /warn %}}

_**Data type:** String_

##### drop
Tables left without rows are dropped.

##### keep
Tables left without rows are output to the next transformation.

{{% warn %}}
Keeping empty tables with your first `filter()` function can have severe performance
costs since it retains empty tables from your entire data set.
For higher performance, use your first `filter()` function to do basic filtering,
then keep empty tables on subsequent `filter()` calls with smaller data sets.
_[See the example below](#keep-empty-tables-when-filtering)._
{{% /warn %}}

## Examples

##### Filter based on measurement, field, and tag
```js
from(bucket:"db/rp")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system" and
    r.cpu == "cpu-total"
  )
```

##### Filter out null values
```js
from(bucket:"db/rp")
  |> range(start:-1h)
  |> filter(fn: (r) => exists r._value )
```

##### Filter values based on thresholds
```js
from(bucket:"db/rp")
  |> range(start:-1h)
  |> filter(fn: (r) => r._value > 50.0 and r._value < 65.0 )
```

##### Keep empty tables when filtering
```js
from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "events" and r._field == "open")
  |> filter(fn: (r) => r.doorId =~ /^2.*/, onEmpty: "keep")
```

##### Keep empty tables when filtering
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "events" and r._field == "open")
  |> filter(fn: (r) => r.doorId =~ /^2.*/, onEmpty: "keep")
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SELECT](/influxdb/latest/query_language/data_exploration/#the-basic-select-statement)
