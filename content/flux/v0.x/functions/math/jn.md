---
title: math.jn() function
description: The math.jn() function returns the order-n Bessel function of the first kind.
menu:
  flux_0_x:
    name: math.jn
    parent: Math
weight: 1
---

The `math.jn()` function returns the order-n Bessel function of the first kind.

_**Output data type:** Float_

```js
import "math"

math.jn(n: 2, x: 1.23)

// Returns 0.16636938378681407
```

## Parameters

### n
The order number.

_**Data type:** Integer_

### x
The value used in the operation.

_**Data type:** Float_

## Special cases
```js
math.jn(n:n, x: ±Inf) // Returns 0
math.jn(n:n, x: NaN)  // Returns NaN
```
