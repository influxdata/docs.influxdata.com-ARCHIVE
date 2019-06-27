---
title: strings.splitAfter() function
description: >
  The strings.splitAfter() function splits a string after a specified separator and returns
  an array of substrings.
menu:
  flux_0_33:
    name: strings.splitAfter
    parent: Strings
    weight: 1
---

The `strings.splitAfter()` function splits a string after a specified separator and returns
an array of substrings.

_**Output data type:** Array of strings_

```js
import "strings"

strings.splitAfter(v: "a flux of foxes", t: " ")

// returns ["a ", "flux ", "of ", "foxes"]
```

## Parameters

### v
The string value to split.

_**Data type:** String_

### t
The string value that acts as the separator.

_**Data type:** String_

## Examples

###### Split a string into an array of substrings
```js
import "strings"

data
  |> map (fn:(r) => strings.splitAfter(v: r.searchTags, t: ","))
```
