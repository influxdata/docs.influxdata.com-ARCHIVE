---
title: Calculate the increase
seotitle: Calculate the increase in Flux
list_title: Increase
description: >
  Use the [`increase()` function](/flux/v0.65/stdlib/built-in/transformations/aggregates/increase/)
  to track increases across multiple columns in a table.
  This function is especially useful when tracking changes in counter values that
  wrap over time or periodically reset.
weight: 10
menu:
  flux_0_65:
    parent: Query with Flux
    name: Increase
list_query_example: increase
---

Use the [`increase()` function](/flux/v0.65/stdlib/built-in/transformations/aggregates/increase/)
to track increases across multiple columns in a table.
This function is especially useful when tracking changes in counter values that
wrap over time or periodically reset.

```js
data
  |> increase()
```

`increase()` returns a cumulative sum of **non-negative** differences between rows in a table.
For example:

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1      |
| 2020-01-01T00:02:00Z | 2      |
| 2020-01-01T00:03:00Z | 8      |
| 2020-01-01T00:04:00Z | 10     |
| 2020-01-01T00:05:00Z | 0      |
| 2020-01-01T00:06:00Z | 4      |
{{% /flex-content %}}
{{% flex-content %}}
**`increase()` returns:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:02:00Z | 1      |
| 2020-01-01T00:03:00Z | 7      |
| 2020-01-01T00:04:00Z | 9      |
| 2020-01-01T00:05:00Z | 9      |
| 2020-01-01T00:06:00Z | 13     |
{{% /flex-content %}}
{{< /flex >}}
