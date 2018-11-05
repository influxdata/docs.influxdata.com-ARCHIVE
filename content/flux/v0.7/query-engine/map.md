---
title: Map
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Map
    weight:
---


Map applies a function to each record of the input tables.
The modified records are assigned to new tables based on the group key of the input table.
The output tables are the result of applying the map function to each record on the input tables.

When the output record contains a different value for the group key the record is regroup into the appropriate table.
When the output record drops a column that was part of the group key that column is removed from the group key.

Map has the following properties:

* `fn` function
    Function to apply to each record.
    The return value must be an object.
* `mergeKey` bool
    MergeKey indicates if the record returned from fn should be merged with the group key.
    When merging, all columns on the group key will be added to the record giving precedence to any columns already present on the record.
    When not merging, only columns defined on the returned record will be present on the output records.
    Defaults to true.

**Example**

```
from(bucket:"telegraf/autogen")
    |> filter(fn: (r) => r._measurement == "cpu" AND
                r._field == "usage_system" AND
                r.service == "app-server")
    |> range(start:-12h)
    // Square the value
    |> map(fn: (r) => r._value * r._value)
```
**Example: Creating a new table**

```
from(bucket:"telegraf/autogen")
    |> filter(fn: (r) => r._measurement == "cpu" AND
                r._field == "usage_system" AND
                r.service == "app-server")
    |> range(start:-12h)
    // create a new table by copying each row into a new format
    |> map(fn: (r) => ({_time: r._time, app_server: r._service}))
```
