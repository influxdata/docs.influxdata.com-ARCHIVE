---
title: regexp.getString() function
description: The `regexp.getString()` function returns the source string used to compile
  a regular expression.
menu:
  flux_0_64:
    name: regexp.getString
    parent: regexp-package
    weight: 1
aliases:
  - /flux/v0.64/functions/regexp/getstring/
---

The `regexp.getString()` function returns the source string used to compile a regular expression.

_**Output data type:** String_

```js
import "regexp"

regexp.getString(r: /[a-zA-Z]/)

// Returns "[a-zA-Z]"
```

## Parameters

### r
The regular expression object to convert to a string.

_**Data type:** Regexp_

## Examples

###### Convert regular expressions into strings in each row
```js
import "regexp"

data
  |> map(fn: (r) => ({
      r with
      regex: r.regex,
      regexStr: regexp.getString(r: r.regex)
    })
  )
```
