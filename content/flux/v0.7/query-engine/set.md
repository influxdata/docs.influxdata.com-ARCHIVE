---
title: Set
description:
menu:
  flux_0_7:
    parent: Query engine
    name: Set
    weight:
---

Set assigns a static value to each record.
The key may modify and existing column or it may add a new column to the tables.
If the column that is modified is part of the group key, then the output tables will be regroup as needed.


Set has the following properties:

* `key` string
  * key is the label for the column to set
* `value` string
  * value is the string value to set

**Example**

```
from(bucket: "telegraf/autogen") |> set(key: "mykey", value: "myvalue")
```
