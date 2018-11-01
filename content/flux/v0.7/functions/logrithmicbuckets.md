---
title: logrithmicBuckets() function
description: placeholder
menu:
  flux_0_7:
    name: logrithmicBuckets
    parent: Functions
    weight: 1
---

The `logrithmicBuckets()` function generates a list of exponentially separated floats.

_**Function type:** generator_  
_**Output data type:** array of floats_

```js
logrithmicBuckets(start:1.0, factor: 2.0, count: 10, infinity: true)
```

## Parameters

### start
The first value in the returned bucket list.

_**Data type:** float_

### factor
The multiplier applied to each subsequent bucket.

_**Data type:** float_

### count
The number of buckets to create.

_**Data type:** integer_

### infinity
When `true`, adds an additional bucket with a value of positive infinity.
Defaults to `true`.

_**Data type:** boolean_

## Examples
```js
logarithmicBuckets(start: 1.0, factor: 2.0, count: 10, infinty: true)

// Generated list: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, +Inf]
```
