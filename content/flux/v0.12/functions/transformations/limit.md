---
title: limit() function
description: The limit() function limits the number of records in output tables to a fixed number (n).
menu:
  flux_0_12:
    name: limit
    parent: Transformations
    weight: 1
---

The `limit()` function limits the number of records in output tables to a fixed number ([`n`](#n)).
One output table is produced for each input table.
The output table contains the first `n` records from the input table.
If the input table has less than `n` records, all records are be output.

_**Function type:** Filter_  
_**Output data type:** Object_

```js
limit(n:10)
```

## Parameters

### n
The maximum number of records to output.

_**Data type:** Integer_

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> limit(n:10)
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[LIMIT](/influxdb/latest/query_language/data_exploration/#the-limit-and-slimit-clauses)  
