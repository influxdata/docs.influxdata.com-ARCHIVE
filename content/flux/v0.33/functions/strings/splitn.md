---
title: strings.splitN() function
description: >
  The strings.splitN() function splits a string on a specified separator and returns
  an array of `i` substrings.
menu:
  flux_0_33:
    name: strings.splitN
    parent: Strings
    weight: 1
---

The `strings.splitN()` function splits a string on a specified separator and returns
an array of `i` substrings.

_**Output data type:** Array of strings_

```js
import "strings"

strings.splitN(v: "a flux of foxes", t: " ", i: 2)

// returns ["a", "flux", "of foxes"]
```

## Parameters

### v
The string value to split.

_**Data type:** String_

### t
The string value that acts as the separator.

_**Data type:** String_

### i
The number of substrings to return.

_**Data type:** Integer_

## Examples

###### Split a string into an array of substrings
```js
import "strings"

data
  |> map (fn:(r) => strings.splitN(v: r.searchTags, t: ","))
```
