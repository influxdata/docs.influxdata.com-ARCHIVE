---
title: v1.measurements() function
description: The v1.measurements() function returns a list of measurements in a specific bucket.
menu:
  flux_0_24:
    name: v1.measurements
    parent: InfluxDB v1
weight: 1
---

The `v1.measurements()` function returns a list of measurements in a specific bucket.
The return value is always a single table with a single column, `_value`.

```js
import "influxdata/influxdb/v1"

v1.measurements(bucket: "example-bucket")
```

## Parameters

### bucket
The bucket from which to list measurements.

_**Data type:** String_

## Function definition
```js
measurements = (bucket) =>
  tagValues(bucket: bucket, tag: "_measurement")
```

_**Used functions:**
[tagValues()](/flux/v0.24/functions/influxdb-v1/tagvalues)_
