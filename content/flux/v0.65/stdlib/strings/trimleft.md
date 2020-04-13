---
title: strings.trimLeft() function
description: >
  The strings.trimLeft() function removes specified leading characters
  from a string.
menu:
  flux_0_65:
    name: strings.trimLeft
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.65/functions/strings/trimleft/
---

The `strings.trimLeft()` function removes specified leading characters from a string.

_**Output data type:** String_

```js
import "strings"

strings.trimLeft(v: ".abc.", cutset: ".")

// returns "abc."
```

## Parameters

### v
String to remove characters from.

_**Data type:** String_

### cutset
The leading characters to remove from the string.
Only characters that match the `cutset` string exactly are removed.

_**Data type:** String_

## Examples

###### Trim leading periods from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      variables: strings.trimLeft(v: r.variables, cutset: ".")
    })
  )
```
