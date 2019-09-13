---
title: v1.tagKeys() function
description: The v1.tagKeys() function returns a list of tag keys for all series that
  match the predicate.
menu:
  flux_0_x:
    name: v1.tagKeys
    parent: InfluxDB v1
weight: 1
aliases:
  - /flux/v0.x/functions/influxdb-v1/tagkeys/
---

The `v1.tagKeys()` function returns a list of tag keys for all series that match the [`predicate`](#predicate).
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/v1"

v1.tagKeys(
  bucket: "telegraf/autogen",
  predicate: (r) => true,
  start: -30d
)
```

## Parameters

### bucket
The bucket from which to list tag keys.

_**Data type:** String_

### predicate
The predicate function that filters tag keys.
_Defaults to `(r) => true`._

_**Data type:** Function_

### start
Specifies the oldest time to be included in the results.
_Defaults to `-30d`._

Relative start times are defined using negative durations.
Negative durations are relative to now.
Absolute start times are defined using timestamps.

_**Data type:** Duration_

## Examples
```js
import "influxdata/influxdb/v1"

v1.tagKeys(bucket: "my-bucket")
```


## Function definition
```js
tagKeys = (bucket, predicate=(r) => true, start=-30d) =>
  from(bucket: bucket)
    |> range(start: start)
    |> filter(fn: predicate)
    |> keys()
    |> keep(columns: ["_value"])
    |> distinct()
```

_**Used functions:**
[from](/flux/v0.x/stdlib/built-in/inputs/from/),
[range](/flux/v0.x/stdlib/built-in/transformations/range/),
[filter](/flux/v0.x/stdlib/built-in/transformations/filter/),
[keys](/flux/v0.x/stdlib/built-in/transformations/keys/),
[keep](/flux/v0.x/stdlib/built-in/transformations/keep/),
[distinct](/flux/v0.x/stdlib/built-in/transformations/selectors/distcint)_
