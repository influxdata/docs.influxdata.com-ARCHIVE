---
title: strings.equalFold() function
description: >
  The strings.equalFold() function reports whether two UTF-8 strings are equal
  under Unicode case-folding.
menu:
  flux_0_x:
    name: strings.equalFold
    parent: Strings
    weight: 1
---

The `strings.equalFold()` function reports whether two UTF-8 strings are equal
under Unicode case-folding.

_**Output data type:** Boolean_

```js
import "strings"

strings.equalFold(v: "Go", t: "go")

// returns true
```

## Parameters

### v
The string value to compare.

_**Data type:** String_

### t
The string value to compare against.

_**Data type:** String_

## Examples

###### Ignore case when testing if two strings are the same
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      string1: r.string1,
      string2: r.string2,
      same: strings.equalFold(v: r.string1, t: r.string2)
    })
  )
```
