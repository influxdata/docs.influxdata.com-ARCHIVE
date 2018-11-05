---
title: Drop
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Drop
    weight:
---


Drop will exclude specified columns from a table. Columns to exclude can be specified either through a
list, or a predicate function.
When a dropped column is part of the group key it will also be dropped from the key.

Drop has the following properties:
* `columns` array of strings
* An array of columns which should be excluded from the resulting table. Cannot be used with `fn`.
* `fn` function
  * A function which takes a column name as a parameter and returns a boolean. indicating whether or not the column should be excluded from the resulting table.
  - Cannot be used with `columns`.  

**Examples:**

**Drop a list of columns**

```
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> drop(columns: ["host", "_measurement"])
```

**Drop columns matching a predicate**

```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> drop(fn: (col) => col =~ /usage*/)
```
