---
title: strings.replaceAll() function
description: >
  The strings.replaceAll() function replaces all non-overlapping instances
  of a substring with a specified replacement.
menu:
  flux_0_64:
    name: strings.replaceAll
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.64/functions/strings/replaceall/
---

The `strings.replaceAll()` function replaces all non-overlapping instances of a
substring with a specified replacement.

_**Output data type:** String_

```js
import "strings"

strings.replaceAll(v: "oink oink oink", t: "oink", u: "moo")

// returns "moo moo moo"
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### t
The substring to replace.

_**Data type:** String_

### u
The replacement for all instances of `t`.

_**Data type:** String_

## Examples

###### Replace string matches
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      content: strings.replaceAll(v: r.content, t: "he", u: "her")
    })
  )
```
