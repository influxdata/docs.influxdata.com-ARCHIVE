---
title: logarithmicBins() function
description: The logarithmicBins() function generates a list of exponentially separated floats.
aliases:
  - /flux/v0.x/functions/misc/logarithmicbins
menu:
  flux_0_x:
    name: logarithmicBins
    parent: Miscellaneous
    weight: 1
---

The `logarithmicBins()` function generates a list of exponentially separated floats.
It is a helper function meant to generate bin bounds for the
[`histogram()` function](/flux/v0.x/functions/transformations/histogram).

_**Function type:** Miscellaneous_  
_**Output data type:** Array of floats_

```js
logarithmicBins(start:1.0, factor: 2.0, count: 10, infinity: true)
```

## Parameters

### start
The first value in the returned bin list.

_**Data type:** Float_

### factor
The multiplier applied to each subsequent bin.

_**Data type:** Float_

### count
The number of bins to create.

_**Data type:** Integer_

### infinity
When `true`, adds an additional bin with a value of positive infinity.
Defaults to `true`.

_**Data type:** Boolean_

## Examples
```js
logarithmicBins(start: 1.0, factor: 2.0, count: 10, infinty: true)

// Generated list: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, +Inf]
```
