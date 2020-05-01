---
title: Calculate the rate of change
seotitle: Calculate the rate of change in Flux
list_title: Rate
description: >
  Use the [`derivative()` function](/flux/v0.65/stdlib/built-in/transformations/aggregates/derivative/)
  to calculate the rate of change between subsequent values or the
  [`aggregate.rate()` function](/flux/v0.65/stdlib/experimental/aggregate/rate/)
  to calculate the average rate of change per window of time.
  If time between points varies, these functions normalize points to a common time interval
  making values easily comparable.
weight: 10
menu:
  flux_0_65:
    parent: Query with Flux
    name: Rate
list_query_example: rate_of_change
---


Use the [`derivative()` function](/flux/v0.65/stdlib/built-in/transformations/aggregates/derivative/)
to calculate the rate of change between subsequent values or the
[`aggregate.rate()` function](/flux/v0.65/stdlib/experimental/aggregate/rate/)
to calculate the average rate of change per window of time.
If time between points varies, these functions normalize points to a common time interval
making values easily comparable.

- [Rate of change between subsequent values](#rate-of-change-between-subsequent-values)
- [Average rate of change per window of time](#average-rate-of-change-per-window-of-time)

## Rate of change between subsequent values
Use the [`derivative()` function](/flux/v0.65/stdlib/built-in/transformations/aggregates/derivative/)
to calculate the rate of change per unit of time between subsequent _non-null_ values.

```js
data
  |> derivative(unit: 1s)
```

By default, `derivative()` returns only positive derivative values and replaces negative values with _null_.
Cacluated values are returned as [floats](/flux/v0.65/language/types/#numeric-types).


{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 250    |
| 2020-01-01T00:04:00Z | 160    |
| 2020-01-01T00:12:00Z | 150    |
| 2020-01-01T00:19:00Z | 220    |
| 2020-01-01T00:32:00Z | 200    |
| 2020-01-01T00:51:00Z | 290    |
| 2020-01-01T01:00:00Z | 340    |
{{% /flex-content %}}
{{% flex-content %}}
**`derivative(unit: 1m)` returns:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:04:00Z |        |
| 2020-01-01T00:12:00Z |        |
| 2020-01-01T00:19:00Z | 10.0   |
| 2020-01-01T00:32:00Z |        |
| 2020-01-01T00:51:00Z | 4.74   |
| 2020-01-01T01:00:00Z | 5.56   |
{{% /flex-content %}}
{{< /flex >}}

Results represent the rate of change **per minute** between subsequent values with
negative values set to _null_.

### Return negative derivative values
To return negative derivative values, set the `nonNegative` parameter to `false`,

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 250    |
| 2020-01-01T00:04:00Z | 160    |
| 2020-01-01T00:12:00Z | 150    |
| 2020-01-01T00:19:00Z | 220    |
| 2020-01-01T00:32:00Z | 200    |
| 2020-01-01T00:51:00Z | 290    |
| 2020-01-01T01:00:00Z | 340    |
{{% /flex-content %}}
{{% flex-content %}}
**The following returns:**

```js
|> derivative(
  unit: 1m,
  nonNegative: false
)
```

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:04:00Z | -22.5  |
| 2020-01-01T00:12:00Z | -1.25  |
| 2020-01-01T00:19:00Z | 10.0   |
| 2020-01-01T00:32:00Z | -1.54  |
| 2020-01-01T00:51:00Z | 4.74   |
| 2020-01-01T01:00:00Z | 5.56   |
{{% /flex-content %}}
{{< /flex >}}

Results represent the rate of change **per minute** between subsequent values and
include negative values.

## Average rate of change per window of time

Use the [`aggregate.rate()` function](/flux/v0.65/stdlib/experimental/aggregate/rate/)
to calculate the average rate of change per window of time.

```js
import "experimental/aggregate"

data
  |> aggregate.rate(
    every: 1m,
    unit: 1s,
    groupColumns: ["tag1", "tag2"]
  )
```

`aggregate.rate()` returns the average rate of change (as a [float](/flux/v0.65/language/types/#numeric-types))
per `unit` for time intervals defined by `every`.
Negative values are replaced with _null_.

{{% note %}}
`aggregate.rate()` does not support `nonNegative: false`.
{{% /note %}}

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 250    |
| 2020-01-01T00:04:00Z | 160    |
| 2020-01-01T00:12:00Z | 150    |
| 2020-01-01T00:19:00Z | 220    |
| 2020-01-01T00:32:00Z | 200    |
| 2020-01-01T00:51:00Z | 290    |
| 2020-01-01T01:00:00Z | 340    |
{{% /flex-content %}}
{{% flex-content %}}
**The following returns:**

```js
|> aggregate.rate(
  every: 20m,
  unit: 1m
)
```

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:20:00Z |        |
| 2020-01-01T00:40:00Z | 10.0   |
| 2020-01-01T01:00:00Z | 4.74   |
| 2020-01-01T01:20:00Z | 5.56   |
{{% /flex-content %}}
{{< /flex >}}

Results represent the **average change rate per minute** of every **20 minute interval**
with negative values set to _null_.
Timestamps represent the right bound of the time window used to average values.
