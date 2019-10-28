---
title: experimental.addDuration() function
description: >
  The `experimental.addDuration()` function adds a duration to a time value and
  returns the resulting time.
menu:
  flux_0_x:
    name: experimental.addDuration
    parent: Experimental
weight: 1
---

The `experimental.addDuration()` function adds a duration to a time value and
returns the resulting time value.

_**Function type:** Transformation_

{{% warn %}}
The `experimental.addDuration()` function is subject to change at any time.
By using this function, you accept the [risks of experimental functions](/flux/v0.x/stdlib/experimental/#use-experimental-functions-at-your-own-risk).

This specific function will be removed once duration vectors are implemented.
See [influxdata/flux#413](https://github.com/influxdata/flux/issues/413).
{{% /warn %}}

```js
import "experimental"

experimental.addDuration(
  d: 12h,
  to: now(),
)
```

## Parameters

### d
The duration to add.

_**Data type:** Duration_

### to
The time to add the [duration](#d) to.

_**Data type:** Time_

## Examples

### Add six hours to a timestamp
```js
import "experimental"

experimental.addDuration(
  d: 6h,
  to: 2019-09-16T12:00:00Z,
)

// Returns 2019-09-16T18:00:00.000000000Z
```

---

### Related functions
- [experimental.subDuration()](/flux/v0.x/stdlib/experimental/subduration/)
