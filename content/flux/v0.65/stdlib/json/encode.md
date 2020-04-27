---
title: json.encode() function
description: The json.encode() function converts a value into JSON bytes.
menu:
  flux_0_65:
    name: json.encode
    parent: JSON
    weight: 1
aliases:
  - /flux/v0.65/functions/json/encode/
draft: true
---

The `json.encode()` function converts a value into JSON bytes.

_**Function type:** Type conversion_

```js
import "json"

json.encode(v: "some value")
```

This function encodes [Flux types](/flux/v0.65/language/types/) as follows:

- `time` values in [RFC3339](https://tools.ietf.org/html/rfc3339) format
- `duration` values in number of milliseconds since the epoch
- `regexp` values as their string representation
- `bytes` values as base64-encoded strings
- `function` values are not encoded and produce an error

## Parameters

### v
The value to convert.

_**Data type:** Object | Array | Boolean | Duration | Float | Integer | String | Time | UInteger_

## Examples

### Encode all values in a column in JSON bytes
```js
import "json"

from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> map(fn: (r) => ({
      r with _value: json.encode(v: r._value)
  }))
```
