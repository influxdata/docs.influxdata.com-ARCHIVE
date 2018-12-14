---
title: systemTime() function
description: The systemTime() function returns the current system time.
menu:
  flux_0_x:
    name: systemTime
    parent: Miscellaneous
    weight: 1
---

The `systemTime()` function returns the current system time.

_**Function type:** Date/Time_  
_**Output data type:** Timestamp_

```js
systemTime()
```

## Examples
```js
offsetTime = (offset) => systemTime() |> shift(shift: offset)
```
