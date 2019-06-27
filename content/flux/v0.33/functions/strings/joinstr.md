---
title: strings.joinStr() function
description: >
  The strings.joinStr() function concatenates the elements of a string array into
  a single string using a specified separator.
menu:
  flux_0_33:
    name: strings.joinStr
    parent: Strings
    weight: 1
---

The `strings.joinStr()` function concatenates elements of a string array into
a single string using a specified separator.

_**Output data type:** String_

```js
import "strings"

strings.joinStr(arr: ["a", "b", "c"], v: ",")

// returns "a,b,c"
```

## Parameters

### arr
The array of strings to concatenate.

_**Data type:** Array of strings_

### v
The separator to use in the concatenated value.

_**Data type:** String_

## Examples

###### Join a list of strings into a single string
```js
import "strings"

searchTags = ["tag1", "tag2", "tag3"]

strings.joinStr(arr: searchTags, v: ","))
```
