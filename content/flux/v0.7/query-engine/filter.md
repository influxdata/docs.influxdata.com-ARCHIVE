---
title: Filter
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Filter
    weight:
---

Filter applies a predicate function to each input record, output tables contain only records which matched the predicate.
One output table is produced for each input table.
The output tables will have the same schema as their corresponding input tables.

Filter has the following properties:

* `fn` function(record) bool
  * Predicate function.
  * The function must accept a single record parameter and return a boolean value.
  * Each record will be passed to the function.
  * Records which evaluate to `true` will be included in the output tables.
  * TODO(nathanielc): Do we need a syntax for expressing type signatures?

**Example**

```
from(bucket:"telegraf/autogen")
    |> range(start:-12h)
    |> filter(fn: (r) => r._measurement == "cpu" AND
                r._field == "usage_system" AND
                r.service == "app-server")
```
