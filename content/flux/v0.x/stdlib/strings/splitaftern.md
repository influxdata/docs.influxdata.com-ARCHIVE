---
title: strings.splitAfterN() function
description: >
  The strings.splitAfterN() function splits a string after a specified
  separator and returns an array of `i` substrings.
menu:
  flux_0_x:
    name: strings.splitAfterN
    parent: Strings
    weight: 1
aliases:
  - /flux/v0.x/functions/strings/splitaftern/
---

The `strings.splitAfterN()` function splits a string after a specified separator and returns
an array of `i` substrings.
Split substrings include the separator, `t`.

_**Output data type:** Array of strings_

```js
import "strings"

strings.splitAfterN(v: "a flux of foxes", t: " ", i: 3)

// returns ["a ", "flux ", "of foxes"]
```

## Parameters

### v
The string value to split.

_**Data type:** String_

### t
The string value that acts as the separator.

_**Data type:** String_

### i
The maximum number of split substrings to return.
`-1` returns all matching substrings.
The last substring is the unsplit remainder.

_**Data type:** Integer_

## Examples

###### Split a string into an array of substrings
```js
import "strings"

data
  |> map (fn:(r) => strings.splitAfterN(v: r.searchTags, t: ","))
```
