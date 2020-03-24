---
title: v1.measurementTagValues() function
description: The v1.measurementTagValues() function returns a list of tag values for
  a specific measurement.
menu:
  flux_0_x:
    name: v1.measurementTagValues
    parent: InfluxDB v1
weight: 1
aliases:
  - /flux/v0.x/functions/influxdb-v1/measurementtagvalues/
---

The `v1.measurementTagValues()` function returns a list of tag values for a specific measurement.
The return value is always a single table with a single column, `_value`.



```js
import "influxdata/influxdb/v1"

v1.measurementTagValues(
  bucket: "telegraf/autogen",
  measurement: "cpu",
  tag: "host"
)
```

## Parameters

### bucket
The bucket from which to return tag values for a specific measurement.

_**Data type:** String_

### measurement
The measurement from which to return tag values.

_**Data type:** String_

### tag
The tag from which to return all unique values.

_**Data type:** String_


## Function definition
```js
measurementTagValues = (bucket, measurement, tag) =>
  tagValues(
    bucket: bucket,
    tag: tag,
    predicate: (r) => r._measurement == measurement
  )
```

_**Used functions:**
[tagValues()](/flux/v0.x/stdlib/influxdb-v1/tagvalues)_

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SHOW TAG VALUES](/influxdb/latest/query_language/schema_exploration#show-tag-values)
