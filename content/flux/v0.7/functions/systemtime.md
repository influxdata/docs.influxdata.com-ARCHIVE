---
title: systemTime() function
description: placeholder
menu:
  flux_0_7:
    name: systemTime
    parent: Functions
    weight: 1
---

The `systemTime()` function returns the current system time.

_**Function type:** date/time_  
_**Output data type:** timestamp_

```js
systemTime()
```

## Examples
```js
offsetTime = (offset) => systemTime() |> shift(shift: offset)
```
