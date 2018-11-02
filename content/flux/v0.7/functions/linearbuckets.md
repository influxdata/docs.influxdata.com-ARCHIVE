---
title: linearBuckets() function
description: placeholder
menu:
  flux_0_7:
    name: linearBuckets
    parent: Functions
    weight: 1
---

The `linearBuckets()` function generates a list of linearly separated floats.

_**Function type:** Generator_  
_**Output data type:** Array of floats_

```js
linearBuckets(start: 0.0, width: 5.0, count: 20, infinity: true)
```

## Parameters

### start
The first value in the returned list.

_**Data type:** Float_

### width
The distance between subsequent bucket values.

_**Data type:** Float_

### count
The number of buckets to create.

_**Data type:** Integer_

### infinity
When `true`, adds an additional bucket with a value of positive infinity.
Defaults to `true`.

_**Data type:** Boolean_

## Examples

```js
linearBuckets(start: 0.0, width: 10.0, count: 10)

// Generated list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, +Inf]
```
