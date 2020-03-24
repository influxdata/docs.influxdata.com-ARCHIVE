---
title: strings.trimSpace() function
description: The strings.trimSpace() function removes leading and trailing spaces
  from a string.
menu:
  flux_0_64:
    name: strings.trimSpace
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.64/functions/strings/trimspace/
---

The `strings.trimSpace()` function removes leading and trailing spaces from a string.

_**Output data type:** String_

```js
import "strings"

strings.trimSpace(v: "  abc  ")

// returns "abc"
```

## Parameters

### v
String to remove spaces from.

_**Data type:** String_

## Examples

###### Trim leading and trailing spaces from all values in a column
```js
import "strings"

data
  |> map(fn: (r) => ({ r with userInput: strings.trimSpace(v: r.userInput) }))
```
