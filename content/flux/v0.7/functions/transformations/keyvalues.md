---
title: keyValues() function
description: The keyValues() function returns a table with the input table's group key plus two columns, _key and _value, that correspond to unique column + value pairs from the input table.
menu:
  flux_0_7:
    name: keyValues
    parent: Transformations
    weight: 1
---

The `keyValues()` function returns a table with the input table's group key plus two columns,
`_key` and `_value`, that correspond to unique column + value pairs from the input table.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
keyValues(keyCols: ["usage_idle", "usage_user"])

// OR

keyValues(fn: (schema) => schema.columns |> filter(fn:(v) =>  v.label =~ /usage_.*/))
```

## Parameters

> `keyCols` and `fn` are mutually exclusive. Only one may be used at a time.

### keyCols
A list of columns from which values are extracted.
All columns indicated must be of the same type.

_**Data type:** Array of strings_

### fn
Function used to identify a set of columns.
All columns indicated must be of the same type.

_**Data type:** Function_

## Examples

##### Get key values from explicitly defined columns
```js
from(bucket: "telegraf/autogen")
  |> range(start: -30m)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> keyValues(keyCols: ["usage_idle", "usage_user"])
```

##### Get key values from columns matching a regular expression
```js
from(bucket: "telegraf/autogen")
  |> range(start: -30m)
  |> filter(fn: (r) => r._measurement == "cpu")
  |> keyValues(fn: (schema) => schema.columns |> filter(fn:(v) =>  v.label =~ /usage_.*/))
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SHOW MEASUREMENTS](/influxdb/latest/query_language/schema_exploration/#show-measurements)  
[SHOW FIELD KEYS](/influxdb/latest/query_language/schema_exploration/#show-field-keys)  
[SHOW TAG KEYS](/influxdb/latest/query_language/schema_exploration/#show-tag-keys)  
[SHOW TAG VALUES](/influxdb/latest/query_language/schema_exploration/#show-tag-values)  
[SHOW SERIES](/influxdb/latest/query_language/schema_exploration/#show-series)  
