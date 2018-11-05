---
title: Duplicate
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Duplicate
    weight:
---

Duplicate will duplicate a specified column in a table

Duplicate has the following properties:

* `column` string
* The column to duplicate
* `as` string
	* The name that should be assigned to the duplicate column

**Example**

Duplicate column `server` under the name `host`:

```
from(bucket: "telegraf/autogen")
	|> range(start:-5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> duplicate(column: "host", as: "server")
```
