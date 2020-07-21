---
title: Query first and last values
seotitle: Query first and last values in Flux
list_title: First and last
description: >
  Use the [`first()`](/flux/v0.65/stdlib/built-in/transformations/selectors/first/) or
  [`last()`](/flux/v0.65/stdlib/built-in/transformations/selectors/last/) functions
  to return the first or last point in an input table.
weight: 10
menu:
  flux_0_65:
    parent: Query with Flux
    name: First & last
list_query_example: first_last
---

Use the [`first()`](/flux/v0.65/stdlib/built-in/transformations/selectors/first/) or
[`last()`](/flux/v0.65/stdlib/built-in/transformations/selectors/last/) functions
to return the first or last record in an input table.

```js
data
  |> first()

// OR

data
  |> last()
```

{{% note %}}
By default, InfluxDB returns results sorted by time, however you can use the
[`sort()` function](/flux/v0.65/stdlib/built-in/transformations/sort/)
to change how results are sorted.
`first()` and `last()` respect the sort order of input data and return records
based on the order they are received in.
{{% /note %}}

### first
`first()` returns the first non-null record in an input table.

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.0    |
| 2020-01-01T00:03:00Z | 2.0    |
| 2020-01-01T00:04:00Z | 3.0    |
{{% /flex-content %}}
{{% flex-content %}}
**The following function returns:**
```js
|> first()
```

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
{{% /flex-content %}}
{{< /flex >}}

### last
`last()` returns the last non-null record in an input table.

{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.0    |
| 2020-01-01T00:03:00Z | 2.0    |
| 2020-01-01T00:04:00Z | 3.0    |
{{% /flex-content %}}
{{% flex-content %}}
**The following function returns:**

```js
|> last()
```

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:04:00Z | 3.0    |
{{% /flex-content %}}
{{< /flex >}}

## Use first() or last() with aggregateWindow()
Use `first()` and `last()` with [`aggregateWindow()`](/flux/v0.65/stdlib/built-in/transformations/aggregates/aggregatewindow/)
to select the first or last records in time-based groups.
`aggregateWindow()` segments data into windows of time, aggregates data in each window into a single
point using aggregate or selector functions, and then removes the time-based segmentation.


{{< flex >}}
{{% flex-content %}}
**Given the following input:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:00Z | 10     |
| 2020-01-01T00:00:15Z | 12     |
| 2020-01-01T00:00:45Z | 9      |
| 2020-01-01T00:01:05Z | 9      |
| 2020-01-01T00:01:10Z | 15     |
| 2020-01-01T00:02:30Z | 11     |
{{% /flex-content %}}

{{% flex-content %}}
**The following function returns:**
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[first](#)
[last](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
|> aggregateWindow(
  every: 1h,
  fn: first
)
```
| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:59Z | 10     |
| 2020-01-01T00:01:59Z | 9      |
| 2020-01-01T00:02:59Z | 11     |
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
|> aggregateWindow(
  every: 1h,
  fn: last
)
```

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:00:59Z | 9      |
| 2020-01-01T00:01:59Z | 15     |
| 2020-01-01T00:02:59Z | 11     |
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{%/flex-content %}}
{{< /flex >}}
