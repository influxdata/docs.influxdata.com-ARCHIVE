---
title: math.hypot() function
description: >
  The math.hypot() function returns the square root of `p*p + q*q`, taking
  care to avoid unnecessary overflow and underflow.
menu:
  flux_0_50:
    name: math.hypot
    parent: Math
weight: 1
aliases:
  - /flux/v0.50/functions/math/hypot/
---

The `math.hypot()` function returns the square root  of `p*p + q*q`,
taking care to avoid overflow and underflow.

_**Output data type:** Float_

```js
import "math"

math.hypot(p: 2.0, q: 5.0)

// Returns 5.385164807134505
```

## Parameters

### p
The p value used in the operation.

_**Data type:** Float_

### q
The q value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.hypot(p: ±Inf, q:q) // Returns +Inf
math.hypot(p:p, q: ±Inf) // Returns +Inf
math.hypot(p: NaN, q:q)  // Returns NaN
math.hypot(p:p, q: NaN)  // Returns NaN
```
