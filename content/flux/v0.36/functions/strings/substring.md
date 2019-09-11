---
title: strings.substring() function
description: >
  The strings.substring() function returns a substring based on `start` and `end` parameters.
  Indices are based on UTF code points.
menu:
  flux_0_36:
    name: strings.substring
    parent: Strings
weight: 301
---

The `strings.substring()` function returns a substring based on `start` and `end` parameters.
These parameters are represent indices of UTF code points in the string.

_**Output data type:** String_

```js
import "strings"

strings.substring(v: "influx", start: 0, end: 3)

// returns "infl"
```

## Parameters

### v
The string value to search.

_**Data type:** String_

### start
The starting index of the substring.

_**Data type:** Integer_

### end
The ending index of the substring.

_**Data type:** Integer_

## Examples

###### Store the first four characters of a string
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      abbr: strings.substring(v: r.name, start: 0, end: 3)
    })
  )
```
