---
title: regexp.findString() function
description: The `regexp.findString()` function returns the left-most regular expression
  match in a string.
menu:
  flux_0_x:
    name: regexp.findString
    parent: regexp-package
    weight: 1
aliases:
  - /flux/v0.x/functions/regexp/findstring/
---

The `regexp.findString()` function returns the left-most regular expression match in a string.

_**Output data type:** String_

```js
import "regexp"

findString(r: /foo.?/, v: "seafood fool")

// Returns "food"
```

## Parameters

### r
The regular expression used to search `v`.

_**Data type:** Regexp_

### v
The string value to search.

_**Data type:** String_

## Examples

###### Find the first regular expression match in each row
```js
import "regexp"

data
  |> map(fn: (r) => ({
      r with
      message: r.message,
      regexp: r.regexp,
      match: regexp.findString(r: r.regexp, v: r.message)
    })
  )
```
