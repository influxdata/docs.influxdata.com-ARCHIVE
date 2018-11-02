---
title: from() function
description: The from() function retrieves data from an InfluxDB data source.
menu:
  flux_0_7:
    name: from
    parent: Functions
    weight: 1
---

The `from()` function retrieves data from an InfluxDB data source.
It returns a stream of tables from the specified [bucket](#parameters).
Each unique series is contained within its own table.
Each record in the table represents a single point in the series.

_**Function type:** Source_  
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
