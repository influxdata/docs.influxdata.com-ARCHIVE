---
title: strings.repeat() function
description: The strings.repeat() function returns a string consisting of `i` copies
  of a specified string.
menu:
  flux_0_64:
    name: strings.repeat
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.64/functions/strings/repeat/
---

The `strings.repeat()` function returns a string consisting of `i` copies of a specified string.

_**Output data type:** String_

```js
import "strings"

strings.repeat(v: "ha", i: 3)

// returns "hahaha"
```

## Parameters

### v
The string value to repeat.

_**Data type:** String_

### i
The number of times to repeat `v`.

_**Data type:** Integer_

## Examples

###### Repeat a string based on existing columns
```js
import "strings"

data
  |> map(fn: (r) => ({
      laugh: r.laugh
      intensity: r.intensity
      laughter: strings.repeat(v: r.laugh, i: r.intensity)
    })
  )
```
