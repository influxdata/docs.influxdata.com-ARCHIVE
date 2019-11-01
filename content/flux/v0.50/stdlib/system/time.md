---
title: system.time() function
description: The `system.time()` function returns the current system time.
aliases:
  - /flux/v0.50/functions/misc/systemtime
  - /flux/v0.50/functions/built-in/misc/systemtime/
  - /flux/v0.50/stdlib/built-in/misc/systemtime/
menu:
  flux_0_50:
    name: system.time
    parent: System
weight: 1
---

The `system.time()` function returns the current system time.

_**Function type:** Date/Time_  
_**Output data type:** Timestamp_

```js
import "system"

system.time()
```

## Examples
```js
import "system"

data
  |> set(key: "processed_at", value: string(v: system.time() ))
```

{{% note %}}
#### system.time() vs now()
`system.time()` returns the current system time of the host machine, which
typically accounts for the local time zone.
This time represents the time at which `system.time()` it is executed, so each
instance of `system.time()` in a Flux script returns a unique value.

[`now()`](/flux/0.x/stdlib/built-in/misc/now/) returns the current UTC time.
`now()` is cached at runtime, so all instances of `now()` in a Flux script
return the same value.
{{% /note %}}

---

### Related functions
- [now()](/flux/v0.50/stdlib/built-in/misc/now/)
