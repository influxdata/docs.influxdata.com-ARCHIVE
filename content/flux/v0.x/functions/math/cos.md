---
title: math.cos() function
description: The math.cos() function returns the cosine of the radian argument `x`.
menu:
  flux_0_x:
    name: math.cos
    parent: Math
weight: 1
---

The `math.cos()` function returns the cosine of the radian argument `x`.

_**Output data type:** Float_

```js
import "math"

math.cos(x: 3.14)

// Returns -0.9999987317275396
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.cos(±Inf) // Returns NaN
math.cos(NaN)  // Returns NaN
```
