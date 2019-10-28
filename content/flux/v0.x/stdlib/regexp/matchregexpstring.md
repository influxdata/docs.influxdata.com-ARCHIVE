---
title: regexp.matchRegexpString() function
description: >
  The `regexp.matchRegexpString()` function tests if a string contains
  any match to a regular expression.
menu:
  flux_0_x:
    name: regexp.matchRegexpString
    parent: regexp-package
    weight: 1
aliases:
  - /flux/v0.x/functions/regexp/matchregexpstring/
---

The `regexp.matchRegexpString()` function tests if a string contains any match
to a regular expression.

_**Output data type:** Boolean_

```js
import "regexp"

regexp.matchRegexpString(r: /(gopher){2}/, v: "gophergophergopher")

// Returns true
```

## Parameters

### r
The regular expression used to search `v`.

_**Data type:** Regexp_

### v
The string value to search.

_**Data type:** String_

## Examples

###### Filter by columns that contain matches to a regular expression
```js
import "regexp"

data
  |> filter(fn: (r) =>
    regexp.matchRegexpString(
      r: /Alert\:/,
      v: r.message
    )
  )
```
