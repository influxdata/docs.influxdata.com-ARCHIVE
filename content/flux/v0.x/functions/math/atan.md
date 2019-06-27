---
title: math.atan() function
description: The math.atan() function returns the arctangent of `x` in radians.
menu:
  flux_0_x:
    name: math.atan
    parent: Math
weight: 1
---

The `math.atan()` function returns the arctangent of `x` in radians.

_**Output data type:** Float_

```js
import "math"

math.atan(x: 3.14)

// Returns 1.262480664599468
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.atan(x: ±0)    // Returns ±0
math.atan(x: ±Inf)  // Returns ±Pi/2
```
