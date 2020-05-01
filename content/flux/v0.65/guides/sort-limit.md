---
title: Sort and limit data with Flux
seotitle: Sort and limit data in InfluxDB with Flux
list_title: Sort and limit
description: >
  Use the [`sort()`function](/flux/v0.65/stdlib/built-in/transformations/sort)
  to order records within each table by specific columns and the
  [`limit()` function](/flux/v0.65/stdlib/built-in/transformations/limit)
  to limit the number of records in output tables to a fixed number, `n`.
menu:
  flux_0_65:
    name: Sort and limit
    parent: Query with Flux
weight: 3
list_query_example: sort_limit
---

Use the [`sort()`function](/flux/v0.65/stdlib/built-in/transformations/sort)
to order records within each table by specific columns and the
[`limit()` function](/flux/v0.65/stdlib/built-in/transformations/limit)
to limit the number of records in output tables to a fixed number, `n`.

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/flux/v0.65/introduction/getting-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/flux/v0.65/guides/execute-queries/) to discover a variety of ways to run your queries.

##### Example sorting system uptime

The following example orders system uptime first by region, then host, then value.

```js
from(bucket:"db/rp")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
```

The [`limit()` function](/flux/v0.65/stdlib/built-in/transformations/limit)
limits the number of records in output tables to a fixed number, `n`.
The following example shows up to 10 records from the past hour.

```js
from(bucket:"db/rp")
  |> range(start:-1h)
  |> limit(n:10)
```

You can use `sort()` and `limit()` together to show the top N records.
The example below returns the 10 top system uptime values sorted first by
region, then host, then value.

```js
from(bucket:"db/rp")
  |> range(start:-12h)
  |> filter(fn: (r) =>
    r._measurement == "system" and
    r._field == "uptime"
  )
  |> sort(columns:["region", "host", "_value"])
  |> limit(n:10)
```

You now have created a Flux query that sorts and limits data.
Flux also provides the [`top()`](/flux/v0.65/stdlib/built-in/transformations/selectors/top)
and [`bottom()`](/flux/v0.65/stdlib/built-in/transformations/selectors/bottom)
functions to perform both of these functions at the same time.
