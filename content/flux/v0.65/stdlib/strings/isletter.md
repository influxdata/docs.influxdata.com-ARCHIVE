---
title: strings.isLetter() function
description: The strings.isLetter() function tests if a single character string is
  a letter (a-z, A-Z).
menu:
  flux_0_65:
    name: strings.isLetter
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.65/functions/strings/isletter/
---

The `strings.isLetter()` function tests if a single character string is a letter (a-z, A-Z).

_**Output data type:** Boolean_

```js
import "strings"

strings.isLetter(v: "A")

// returns true
```

## Parameters

### v
The single character string to test.

_**Data type:** String_

## Examples

###### Filter by columns with single-letter values
```js
import "strings"

data
  |> filter(fn: (r) => strings.isLetter(v: r.serverRef))
```
