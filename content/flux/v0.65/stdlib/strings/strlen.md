---
title: strings.strlen() function
description: >
  The strings.strlen() function returns the length of a string. String
  length is determined by the number of UTF code points a string contains.
menu:
  flux_0_65:
    name: strings.strlen
    parent: Strings
weight: 301
aliases:
  - /flux/v0.65/functions/strings/strlen/
---

The `strings.strlen()` function returns the length of a string.
String length is determined by the number of UTF code points a string contains.

_**Output data type:** Integer_

```js
import "strings"

strings.strlen(v: "apple")

// returns 5
```

## Parameters

### v
The string value to measure.

_**Data type:** String_

## Examples

###### Filter based on string value length
```js
import "strings"

data
  |> filter(fn: (r) => strings.strlen(v: r._measurement) <= 4)
```

###### Store the length of string values
```js
import "strings"

data
  |> map(fn: (r) => ({
      r with
      length: strings.strlen(v: r._value)
    })
  )
```
