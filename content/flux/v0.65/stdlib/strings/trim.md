---
title: strings.trim() function
description: >
  The strings.trim() function removes leading and trailing characters
  specified in the cutset from a string.
menu:
  flux_0_65:
    name: strings.trim
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.65/functions/strings/trim/
---

The `strings.trim()` function removes leading and trailing characters specified
in the [`cutset`](#cutset) from a string.

_**Output data type:** String_

```js
import "strings"

strings.trim(v: ".abc.", cutset: ".")

// returns "abc"
```

## Parameters

### v
String to remove characters from.

_**Data type:** String_

### cutset
The leading and trailing characters to remove from the string.
Only characters that match the `cutset` string exactly are trimmed.

_**Data type:** String_

## Examples

###### Trim leading and trailing periods from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      variables: strings.trim(v: r.variables, cutset: ".")
    })
  )
```
