---
title: contains() function
description: The contains() function tests whether a value is a member of a set.
menu:
  flux_0_24:
    name: contains
    parent: Tests
weight: 1
---

The `contains()` function tests whether a value is a member of a set.
If the value is a member of the set, the function returns `true`.
If the value is not a member of the set, the functions returns `false`.

```js
contains(
  value: 1,
  set: [1,2,3]
)
```

## Parameters

### value
The value for which to search.

_**Data type:** Boolean | Integer | UInteger | Float | String | Time_

### set
The set of values in which to search.

_**Data type:** Array of Booleans | Integers | UIntegers | Floats | Strings | Times_

## Examples

###### Filter on a set of specific fields
```js
fields = ["load1", "load5", "load15"]

from(bucket: "telegraf/autogen")
  |> range(start:start, stop: stop)
  |> filter(fn: (r) =>
      r._measurement == "system" and
      contains(value: r._field, set: fields)
  )
```
