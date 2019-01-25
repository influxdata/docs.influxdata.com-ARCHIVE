---
title: drop() function
description: The drop() function removes specified columns from a table.
menu:
  flux_0_x:
    name: drop
    parent: Transformations
    weight: 1
---

The `drop()` function removes specified columns from a table.
Columns are specified either through a list or a predicate function.
When a dropped column is part of the group key, it will be removed from the key.
If a specified column is not present in a table, it will return an error.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
drop(columns: ["col1", "col2"])

// OR

drop(fn: (column) => column =~ /usage*/)
```

## Parameters

### columns
Columns to be removed from the table.
Cannot be used with `fn`.

_**Data type:** Array of strings_

### fn
A predicate function which takes a column name as a parameter (`column`) and returns
a boolean indicating whether or not the column should be removed from the table.
Cannot be used with `columns`.

_**Data type:** Function_

## Examples

##### Drop a list of columns
```js
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> drop(columns: ["host", "_measurement"])
```

##### Drop columns matching a predicate
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> drop(fn: (column) => column =~ /usage*/)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[DROP MEASUREMENT](/influxdb/latest/query_language/database_management/#delete-measurements-with-drop-measurement)
