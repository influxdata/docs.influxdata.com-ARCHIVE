---
title: systemTime() function
description: The systemTime() function returns the current system time.
aliases:
  - /flux/v0.24/functions/misc/systemtime
menu:
  flux_0_24:
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
