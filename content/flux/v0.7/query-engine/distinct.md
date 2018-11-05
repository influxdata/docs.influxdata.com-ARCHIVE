---
title: Distinct
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Distinct
    weight:
---

Distinct produces the unique values for a given column.

Distinct has the following properties:

* `column` string
* `column` the column on which to track unique values.

**Example:**

```
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> distinct(column: "host")
```
