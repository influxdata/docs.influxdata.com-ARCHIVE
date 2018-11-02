---
title: median() function
description: placeholder
menu:
  flux_0_7:
    name: median
    parent: Functions
    weight: 1
---

The `median()` function returns the median `_value` of an input table.

_**Function type:** Aggregate_  
_**Output data type:** Object_

```js
median()
```

> The `median()` function can only be used with float value types.
> It is a special application of the [`percentile()` function](../percentile) which uses an approximation implementation that requires floats.
> You can convert your value column to a float column using the [`toFloat()` function](../tofloat).


## Examples
```js
from(bucket: "telegraf/autogen")
  |> filter(fn: (r) => r._measurement == "mem" AND r._field == "used_percent")
  |> range(start:-12h)
  |> window(every:10m)
  |> median()
```

## Function definition
```js
median = (method="estimate_tdigest", compression=0.0, table=<-) =>
  percentile(table:table, percentile:0.5, method:method, compression:compression)
```
