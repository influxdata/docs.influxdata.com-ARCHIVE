---
title: strings.indexAny() function
description: >
  The strings.indexAny() function returns the index of the first instance
  of specified characters in a string.
menu:
  flux_0_50:
    name: strings.indexAny
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.50/functions/strings/indexany/
---

The `strings.indexAny()` function returns the index of the first instance of specified characters in a string.
If none of the specified characters are present, it returns `-1`.

_**Output data type:** Integer_

```js
import "strings"

strings.indexAny(v: "chicken", chars: "aeiouy")

// returns 2
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### chars
Characters to search for.

_**Data type:** String_

## Examples

###### Find the first occurrence of characters from a string
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      charIndex: strings.indexAny(v: r._field, chars: "_-")
    })
  )
```
