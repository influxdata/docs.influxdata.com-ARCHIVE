---
title: math.mod() function
description: >
  The math.mod() function returns the floating-point remainder of `x`/`y`.
  The magnitude of the result is less than `y` and its sign agrees with that of `x`.
menu:
  flux_0_x:
    name: math.mod
    parent: Math
weight: 1
aliases:
  - /flux/v0.x/functions/math/mod/
---

The `math.mod()` function returns the floating-point remainder of `x`/`y`.
The magnitude of the result is less than `y` and its sign agrees with that of `x`.

_**Output data type:** Float_

```js
import "math"

math.mod(x: 1.23, y: 4.56)

// Returns 1.23
```

## Parameters

### x
The X value used in the operation.

_**Data type:** Float_

### y
The Y value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.mod(x: ±Inf, y:y)  // Returns NaN
math.mod(x: NaN, y:y)   // Returns NaN
math.mod(x:x, y: 0)     // Returns NaN
math.mod(x:x, y: ±Inf)  // Returns x
math.mod(x:x, y: NaN)   // Returns NaN
```
