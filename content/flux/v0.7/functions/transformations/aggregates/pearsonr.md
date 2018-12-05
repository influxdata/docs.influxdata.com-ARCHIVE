---
title: pearsonr() function
description: The pearsonr() function computes the Pearson R correlation coefficient between two streams by first joining the streams, then performing the covariance operation normalized to compute R.
menu:
  flux_0_7:
    name: pearsonr
    parent: Aggregates
    weight: 1
---

The `pearsonr()` function computes the Pearson R correlation coefficient between two streams
by first joining the streams, then performing the covariance operation normalized to compute R.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
pearsonr(x: stream1, y: stream2, on: ["_time", "_field"])
```

## Parameters

### x
First input stream used in the operation.

_**Data type:** Object_

### y
Second input stream used in the operation.

_**Data type:** Object_

### on
The list of columns on which to join.

_**Data type:** Array of strings_

## Examples
```js
stream1 = from(bucket:"telegraf/autogen")
  |> range(start:-15m)
  |> filter(fn: (r) =>
    r._measurement == "mem" AND
    r._field == "used"
  )

stream2 = from(bucket:"telegraf/autogen")
  |> range(start:-15m)
  |> filter(fn: (r) => r
    ._measurement == "mem" AND
    r._field == "available"
  )

pearsonr(x: stream1, y: stream2, on: ["_time", "_field"])
```

## Function definition
```js
pearsonr = (x,y,on) =>
  cov(x:x, y:y, on:on, pearsonr:true)
```
