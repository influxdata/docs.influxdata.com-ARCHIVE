---
title: keys() function
description: The keys() function returns a table with the input table's group key columns, plus a _value column containing the names of the input table's columns.
menu:
  flux_0_7:
    name: keys
    parent: Functions
    weight: 1
---

The `keys()` function returns a table with the input table's group key columns,
plus a `_value` column containing the names of the input table's columns.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
keys(except: ["_time", "_value"])
```

## Parameters

### except
Exclude the specified column names in the output.
Defaults to `["_time", "_value"]`.

_**Data type:** Array of strings_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -30m)
  |> keys(except: ["_time", "_start", "_stop", "_field", "_measurement", "_value"])
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SHOW MEASUREMENTS](/influxdb/latest/query_language/schema_exploration/#show-measurements)  
[SHOW FIELD KEYS](/influxdb/latest/query_language/schema_exploration/#show-field-keys)  
[SHOW TAG KEYS](/influxdb/latest/query_language/schema_exploration/#show-tag-keys)  
[SHOW SERIES](/influxdb/latest/query_language/schema_exploration/#show-tag-keys)
