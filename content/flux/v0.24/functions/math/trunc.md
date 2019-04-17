---
title: math.trunc() function
description: The math.trunc() function returns the integer value of `x`.
menu:
  flux_0_24:
    name: math.trunc
    parent: Math
weight: 1
---

The `math.trunc()` function returns the integer value of `x`.

_**Output data type:** Float_

```js
import "math"

math.trunc(x: 3.14)

// Returns 3.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.trunc(x: ±0)   // Returns ±0
math.trunc(x: ±Inf) // Returns ±Inf
math.trunc(x: NaN)  // Returns NaN
```
