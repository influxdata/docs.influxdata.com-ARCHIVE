---
title: v1.tagValues() function
description: placeholder
menu:
  flux_0_64:
    name: v1.tagValues
    parent: InfluxDB v1
weight: 1
aliases:
  - /flux/v0.64/functions/influxdb-v1/tagvalues/
---

The `v1.tagValues()` function returns a list unique values for a given tag.
The return value is always a single table with a single column, `_value`.


```js
import "influxdata/influxdb/v1"

v1.tagValues(
  bucket: "telegraf/autogen",
  tag: "host",
  predicate: (r) => true,
  start: -30d
)
```

## Parameters

### bucket
The bucket from which to list tag values.

_**Data type:** String_

### tag
The tag for which to return unique values.

_**Data type:** String_

### predicate
The predicate function that filters tag values.
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

v1.tagKeys(
  bucket: "my-bucket",
  tag: "host",
)
```

## Function definition
```js
tagValues = (bucket, tag, predicate=(r) => true, start=-30d) =>
  from(bucket: bucket)
    |> range(start: start)
    |> filter(fn: predicate)
    |> group(columns: [tag])
    |> distinct(column: tag)
    |> keep(columns: ["_value"])
```

_**Used functions:**
[from](/flux/v0.64/stdlib/built-in/inputs/from/),
[range](/flux/v0.64/stdlib/built-in/transformations/range/),
[filter](/flux/v0.64/stdlib/built-in/transformations/filter/),
[group](/flux/v0.64/stdlib/built-in/transformations/group/),
[distinct](/flux/v0.64/stdlib/built-in/transformations/selectors/distinct/),
[keep](/flux/v0.64/stdlib/built-in/transformations/keep/)_

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SHOW TAG VALUES](/influxdb/latest/query_language/schema_exploration#show-tag-values)
