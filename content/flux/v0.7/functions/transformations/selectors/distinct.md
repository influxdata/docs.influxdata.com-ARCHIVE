---
title: distinct() function
description: The distinct() function returns the unique values for a given column.
menu:
  flux_0_7:
    name: distinct
    parent: Selectors
    weight: 1
---

The `distinct()` function returns the unique values for a given column.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
distinct(column: "host")
```

## Parameters

### column
Column on which to track unique values.

_**Data type:** string_

## Examples
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> distinct(column: "host")
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[DISTINCT()](/influxdb/latest/query_language/functions/#distinct)
