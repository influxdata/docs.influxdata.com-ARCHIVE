---
title: from() function
description: The from() function retrieves data from an InfluxDB data source.
aliases:
  - /flux/v0.50/functions/inputs/from
  - /flux/v0.50/functions/built-in/inputs/from/
menu:
  flux_0_50:
    name: from
    parent: Inputs
    weight: 1
---

The `from()` function retrieves data from an InfluxDB data source.
It returns a stream of tables from the specified [bucket](#parameters).
Each unique series is contained within its own table.
Each record in the table represents a single point in the series.

_**Function type:** Input_  
_**Output data type:** Object_

```js
from(bucket: "telegraf/autogen")

// OR

from(bucketID: "0261d8287f4d6000")
```

## Parameters

### bucket
The name of the bucket to query.

_**Data type:** String_

### bucketID
The string-encoded ID of the bucket to query.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen")
```
```js
from(bucketID: "0261d8287f4d6000")
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[FROM](/influxdb/latest/query_language/data_exploration/#from-clause)
