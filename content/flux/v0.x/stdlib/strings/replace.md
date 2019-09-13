---
title: strings.replace() function
description: >
  The strings.replace() function replaces the first `i` non-overlapping
  instances of a substring with a specified replacement.
menu:
  flux_0_x:
    name: strings.replace
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.x/functions/strings/replace/
---

The `strings.replace()` function replaces the first `i` non-overlapping instances
of a substring with a specified replacement.

_**Output data type:** String_

```js
import "strings"

strings.replace(v: "oink oink oink", t: "oink", u: "moo", i: 2)

// returns "moo moo oink"
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### t
The substring value to replace.

_**Data type:** String_

### u
The replacement for `i` instances of `t`.

_**Data type:** String_

### i
The number of non-overlapping `t` matches to replace.

_**Data type:** Integer_

## Examples

###### Replace a specific number of string matches
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      content: strings.replace(v: r.content, t: "he", u: "her", i: 3)
    })
  )
```
