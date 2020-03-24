---
title: truncateTimeColumn() function
description: >
  The `truncateTimeColumn()` function truncates all input table `_time`
  values to a specified unit.
menu:
  flux_0_64:
    name: truncateTimeColumn
    parent: Transformations
    weight: 1
aliases:
  - /flux/v0.64/functions/built-in/transformations/truncatetimecolumn/
---

The `truncateTimeColumn()` function truncates all input table `_time` values to a specified unit.

_**Function type:** Transformation_

```js
truncateTimeColumn(unit: 1s)
```

## Parameters

### unit
The unit of time to truncate to.

_**Data type:** Duration_

{{% note %}}
Only use `1` and the unit of time to specify the `unit`.
For example: `1s`, `1m`, `1h`.
{{% /note %}}

## Examples

##### Truncate all time values to seconds
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> truncateTimeColumn(unit: 1s)
```

## Function definition
```js
import "date"

truncateTimeColumn = (unit, tables=<-) =>
  tables
    |> map(fn: (r) => ({
        r with _time: date.truncate(t: r._time, unit:unit)
      })
    )
```
