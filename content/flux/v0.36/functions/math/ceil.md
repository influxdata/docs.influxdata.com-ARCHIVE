---
title: math.ceil() function
description: The math.ceil() function returns the least integer value greater than or equal to `x`.
menu:
  flux_0_36:
    name: math.ceil
    parent: Math
weight: 1
---

The `math.ceil()` function returns the least integer value greater than or equal to `x`.

_**Output data type:** Float_

```js
import "math"

math.ceil(x: 3.14)

// Returns 4.0
```

## Parameters

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.ceil(±0)   // Returns ±0
math.ceil(±Inf) // Returns ±Inf
math.ceil(NaN)  // Returns NaN
```
