---
title: How to sort and limit data with Flux
description: This guide walks through sorting and limiting data with Flux and outlines how it shapes your data in the process.
menu:
  flux_0_12:
    name: Sort and limit data
    parent: Guides
    weight: 6
---

The [`sort()`function](/flux/v0.12/functions/transformations/sort) orders the records within each table. The following example orders system uptime first by region, then host, then value.

```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" AND
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
```

The [`limit()` function](/flux/v0.12/functions/transformations/limit) limit the number of records in output tables to a fixed number (n). The following example shows up to 10 records from the past hour.

```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> limit(n:10)
```

You can use `sort()` and `limit()` together to show the top N records. The example below returns the 10 top system uptime values sorted first by region, then host, then value.

```js
from(bucket:"telegraf/autogen")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" AND
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
  |> limit(n:10)
```

You now have created a Flux query that sorts and limits data. Flux also provides the [`top()](/flux/v0.12/functions/transformations/selectors/top) and [`bottom()`](/flux/v0.12/functions/transformations/selectors/bottom) function to perform both of these functions at the same time.
