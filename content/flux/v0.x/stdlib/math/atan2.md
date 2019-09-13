---
title: math.atan2() function
description: >
  The math.atan2() function returns the arc tangent of `y`/`x`, using
  the signs of the parameters to determine the quadrant of the return value.
menu:
  flux_0_x:
    name: math.atan2
    parent: Math
weight: 1
aliases:
  - /flux/v0.x/functions/math/atan2/
---

The `math.atan2()` function returns the arc tangent of `y`/`x`, using the signs
of the two to determine the quadrant of the return value.

_**Output data type:** Float_

```js
import "math"

math.atan2(y: 1.22, x: 3.14)

// Returns 0.3705838802763881
```

## Parameters

### y
The y coordinate used in the operation.

_**Data type:** Float_

### x
The x coordinate used in the operation.

_**Data type:** Float_

## Special cases
```js
math.atan2(y:y, x:NaN)        // Returns NaN
math.atan2(y: NaN, x:x)       // Returns NaN
math.atan2(y: +0, x: >=0)     // Returns +0
math.atan2(y: -0, x: >=0)     // Returns -0
math.atan2(y: +0, x: <=-0)    // Returns +Pi
math.atan2(y: -0, x: <=-0)    // Returns -Pi
math.atan2(y: >0, x: 0)       // Returns +Pi/2
math.atan2(y: <0, x: 0)       // Returns -Pi/2
math.atan2(y: +Inf, x: +Inf)  // Returns +Pi/4
math.atan2(y: -Inf, x: +Inf)  // Returns -Pi/4
math.atan2(y: +Inf, x: -Inf)  // Returns 3Pi/4
math.atan2(y: -Inf, x: -Inf)  // Returns -3Pi/4
math.atan2(y:y, x: +Inf)      // Returns 0
math.atan2(y: >0, x: -Inf)    // Returns +Pi
math.atan2(y: <0, x: -Inf)    // Returns -Pi
math.atan2(y: +Inf, x:x)      // Returns +Pi/2
math.atan2(y: -Inf, x:x)      // Returns -Pi/2
```
