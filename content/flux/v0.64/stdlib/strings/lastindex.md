---
title: strings.lastIndex() function
description: >
  The strings.lastIndex() function returns the index of the last instance
  of a substring in a string or `-1` if substring is not present.
menu:
  flux_0_64:
    name: strings.lastIndex
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.64/functions/strings/lastindex/
---

The `strings.lastIndex()` function returns the index of the last instance of a substring
in a string. If the substring is not present, the function returns `-1`.

_**Output data type:** Integer_

```js
import "strings"

strings.lastIndex(v: "go gopher", t: "go")

// returns 3
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### substr
The substring to search for.

_**Data type:** String_

## Examples

###### Find the last occurrence of a substring
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      the_index: strings.lastIndex(v: r.pageTitle, substr: "the")
    })
  )
```
