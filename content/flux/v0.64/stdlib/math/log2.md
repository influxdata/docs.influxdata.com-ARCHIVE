---
title: math.log2() function
description: The math.log2() function returns the binary logarithm of `x`.
menu:
  flux_0_64:
    name: math.log2
    parent: Math
weight: 1
aliases:
  - /flux/v0.64/functions/math/log2/
---

The `math.log2()` function returns the binary logarithm of `x`.

_**Output data type:** Float_

```js
import "math"

math.log2(x: 3.14)

// Returns 1.6507645591169022
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.log2(x: +Inf) // Returns +Inf
math.log2(x: 0)    // Returns -Inf
math.log2(x: <0)   // Returns NaN
math.log2(x: NaN)  // Returns NaN
```
