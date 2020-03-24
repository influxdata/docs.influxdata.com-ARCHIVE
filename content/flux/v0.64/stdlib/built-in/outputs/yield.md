---
title: yield() function
description: The yield() function indicates the input tables received should be delivered
  as a result of the query.
aliases:
  - /flux/v0.64/functions/outputs/yield
  - /flux/v0.64/functions/built-in/outputs/yield/
menu:
  flux_0_64:
    name: yield
    parent: Outputs
    weight: 1
---

The `yield()` function indicates the input tables received should be delivered as a result of the query.
Yield outputs the input stream unmodified.
A query may have multiple results, each identified by the name provided to the `yield()` function.

_**Function type:** Output_  
_**Output data type:** Object_

```js
yield(name: "custom-name")
```

> `yield()` is implicit for queries that do only one thing and are only needed when using multiple sources in a query.
> With multiple sources, `yield()` is required to specify what is returned, and what name to give it.

## Parameters

### name
A unique name for the yielded results.
Defaults to `"_results"`.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> yield(name: "1")
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SELECT AS](/influxdb/latest/query_language/data_exploration/#the-basic-select-statement)
