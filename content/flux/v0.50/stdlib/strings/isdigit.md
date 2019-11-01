---
title: strings.isDigit() function
description: The strings.isDigit() function tests if a single character string is
  a digit (0-9).
menu:
  flux_0_50:
    name: strings.isDigit
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.50/functions/strings/isdigit/
---

The `strings.isDigit()` function tests if a single-character string is a digit (0-9).

_**Output data type:** Boolean_

```js
import "strings"

strings.isDigit(v: "A")

// returns false
```

## Parameters

### v
The single-character string to test.

_**Data type:** String_

## Examples

###### Filter by columns with digits as values
```js
import "strings"

data
  |> filter(fn: (r) => strings.isDigit(v: r.serverRef))
```
