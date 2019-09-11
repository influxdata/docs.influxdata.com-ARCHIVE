---
title: sleep() function
description: The `sleep()` function delays execution by a specified duration.
menu:
  flux_0_x:
    name: sleep
    parent: Miscellaneous
weight: 401
---

The `sleep()` function delays execution by a specified duration.

_**Function type:** Miscellaneous_

```js
sleep(
  v: x,
  duration: 10s
)
```

## Parameters

### v
Defines input tables.
`sleep()` accepts piped-forward data and passes it on unmodified after the
specified [duration](#duration).
If data is not piped-forward into `sleep()`, set `v` to specify a stream object.
The examples [below](#examples) illustrate how.

_**Data type:** Object_

### duration
The length of time to delay execution.

_**Data type:** Duration_

## Examples

### Delay execution in a chained query
```js
from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> sleep(duration: 10s)
```

### Delay execution using a stream variable
```js
x = from(bucket: "telegraf/autogen")
    |> range(start: -1h)

sleep(v: x, duration: 10s)
```
