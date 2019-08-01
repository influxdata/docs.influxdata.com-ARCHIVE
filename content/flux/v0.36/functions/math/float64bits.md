---
title: math.float64bits() function
description: The math.float64bits() function returns the IEEE 754 binary representation of `f`, with the sign bit of `f` and the result in the same bit position.
menu:
  flux_0_36:
    name: math.float64bits
    parent: Math
weight: 1
---

The `math.float64bits()` function returns the IEEE 754 binary representation of `f`, with the sign bit of `f` and the result in the same bit position.

_**Output data type:** UInteger_

```js
import "math"

math.float64bits(f: 1234.56)

// Returns 4653144467747100426
```

## Parameters

### f
The value used in the operation.

_**Data type:** Float_
