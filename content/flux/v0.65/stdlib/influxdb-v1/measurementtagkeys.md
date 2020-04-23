---
title: v1.measurementTagKeys() function
description: The v1.measurementTagKeys() function returns a list of tag keys for a
  specific measurement.
menu:
  flux_0_65:
    name: v1.measurementTagKeys
    parent: InfluxDB v1
weight: 1
aliases:
  - /flux/v0.65/functions/influxdb-v1/measurementtagkeys/
---

The `v1.measurementTagKeys()` function returns a list of tag keys for a specific measurement.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/v1"

v1.measurementTagKeys(
  bucket: "telegraf/autogen",
  measurement: "cpu"
)
```

## Parameters

### bucket
The bucket from which to return tag keys for a specific measurement.

_**Data type:** String_

### measurement
The measurement from which to return tag keys.

_**Data type:** String_

## Function definition
```js
measurementTagKeys = (bucket, measurement) =>
  tagKeys(
    bucket: bucket,
    predicate: (r) => r._measurement == measurement)
```

_**Used functions:**
[tagKeys()](/flux/v0.65/stdlib/influxdb-v1/tagkeys)_

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SHOW TAG KEYS](/influxdb/latest/query_language/schema_exploration#show-tag-keys)
