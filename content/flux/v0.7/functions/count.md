---
title: count() function
description: The count() function outputs the number of non-null records in each aggregated column.
menu:
  flux_0_7:
    name: count
    parent: Functions
    weight: 1
---

The `count()` function outputs the number of non-null records in each aggregated column.


_**Output data type:** Integer_  
_**Function type:** Aggregate_

```js
count(columns: ["_value"])
```

## Parameters

### columns
A list of columns on which to operate
Defaults to `["_value"]`.

_**Data type: Array of strings**_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> count()
```

```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> count(["_value"])
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[COUNT()](/influxdb/latest/query_language/functions/#count)
