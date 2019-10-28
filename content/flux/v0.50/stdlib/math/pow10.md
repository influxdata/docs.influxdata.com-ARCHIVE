---
title: math.pow10() function
description: The math.pow10() function returns `10**n`, the base-10 exponential of
  `n`.
menu:
  flux_0_50:
    name: math.pow10
    parent: Math
weight: 1
aliases:
  - /flux/v0.50/functions/math/pow10/
---

The `math.pow10()` function returns `10**n`, the base-10 exponential of `n`.

_**Output data type:** Float_

```js
import "math"

math.pow10(n: 3)

// Returns 1000
```

## Parameters

### n
The value used in the operation.

_**Data type:** Integer_

## Special cases
```js
math.pow10(n: <-323) // Returns 0
math.pow10(n: >308)  // Returns +Inf
```
