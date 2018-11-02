---
title: pearsonr() function
description: placeholder
menu:
  flux_0_7:
    name: pearsonr
    parent: Functions
    weight: 1
---

The `pearsonr()` function computes the Pearson R correlation coefficient between two streams
by first joining the streams, then performing the covariance operation normalized to compute R.

_**Function type:** aggregate_  
_**Output data type:** float_

```js
pearsonr(x: stream1, y: stream2, on: ["_time", "_field"])
```

## Parameters

### x
One input stream used to be used in the operation.

_**Data type:** table_

### y
The other input stream used to be used in the operation.

_**Data type:** table_

### on
The list of columns on which to join.

_**Data type:** array of strings_

## Examples
```js
stream1 = from(bucket:"telegraf/autogen")
  |> range(start:-15m)
  |> filter(fn: (r) => r._measurement == "mem" AND r._field == "used")

stream2 = from(bucket:"telegraf/autogen")
  |> range(start:-15m)
  |> filter(fn: (r) => r._measurement == "mem" AND r._field == "available")

pearsonr(x: stream1, y: stream2, on: ["_time", "_field"])
```

## Function definition
```js
pearsonr = (x,y,on) => cov(x:x, y:y, on:on, pearsonr:true)
```
