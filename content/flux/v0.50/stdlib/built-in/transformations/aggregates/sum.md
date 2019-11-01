---
title: sum() function
description: The sum() function computes the sum of non-null records in a specified
  column.
aliases:
  - /flux/v0.50/functions/transformations/aggregates/sum
  - /flux/v0.50/functions/built-in/transformations/aggregates/sum/
menu:
  flux_0_50:
    name: sum
    parent: Aggregates
    weight: 1
---

The `sum()` function computes the sum of non-null records in a specified column.

_**Function type:** Aggregate_  
_**Output data type:** Integer, UInteger, or Float (inherited from column type)_

```js
sum(column: "_value")
```

## Parameters

### column
The column on which to operate.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> sum()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SUM()](/influxdb/latest/query_language/functions/#sum)  
