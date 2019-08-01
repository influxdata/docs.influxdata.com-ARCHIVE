---
title: math.acosh() function
description: The math.acosh() function returns the inverse hyperbolic cosine of `x`.
menu:
  flux_0_36:
    name: math.acosh
    parent: Math
weight: 1
---

The `math.acosh()` function returns the inverse hyperbolic cosine of `x`.

_**Output data type:** Float_

```js
import "math"

math.acosh(x: 1.22)

// Returns 0.6517292837263685
```

## Parameters

### x
`x` should be greater than 1.
If less than 1, the operation will return `NaN`.

_**Data type:** Float_

## Special cases
```js
math.acosh(x: +Inf) // Returns +Inf
math.acosh(x: <1)   // Returns NaN
math.acosh(x: NaN)  // Returns NaN
```
