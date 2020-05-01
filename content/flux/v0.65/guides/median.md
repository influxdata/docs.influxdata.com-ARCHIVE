---
title: Find median values
seotitle: Find median values in Flux
list_title: Median
description: >
  Use the [`median()` function](/flux/v0.65/stdlib/built-in/transformations/aggregates/median/)
  to return a value representing the `0.5` quantile (50th percentile) or median of input data.
weight: 10
menu:
  flux_0_65:
    parent: Query with Flux
    name: Median
list_query_example: median
---

Use the [`median()` function](/flux/v0.65/stdlib/built-in/transformations/aggregates/median/)
to return a value representing the `0.5` quantile (50th percentile) or median of input data.

## Select a method for calculating the median
Select one of the following methods to calculate the median:

- [estimate_tdigest](#estimate-tdigest)
- [exact_mean](#exact-mean)
- [exact_selector](#exact-selector)

### estimate_tdigest
**(Default)** An aggregate method that uses a [t-digest data structure](https://github.com/tdunning/t-digest)
to compute an accurate `0.5` quantile estimate on large data sources.
Output tables consist of a single row containing the calculated median.

{{< flex >}}
{{% flex-content %}}
**Given the following input table:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.0    |
| 2020-01-01T00:03:00Z | 2.0    |
| 2020-01-01T00:04:00Z | 3.0    |
{{% /flex-content %}}
{{% flex-content %}}
**`estimate_tdigest` returns:**

| _value |
|:------:|
| 1.5    |
{{% /flex-content %}}
{{< /flex >}}

### exact_mean
An aggregate method that takes the average of the two points closest to the `0.5` quantile value.
Output tables consist of a single row containing the calculated median.

{{< flex >}}
{{% flex-content %}}
**Given the following input table:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.0    |
| 2020-01-01T00:03:00Z | 2.0    |
| 2020-01-01T00:04:00Z | 3.0    |
{{% /flex-content %}}
{{% flex-content %}}
**`exact_mean` returns:**

| _value |
|:------:|
| 1.5    |
{{% /flex-content %}}
{{< /flex >}}

### exact_selector
A selector method that returns the data point for which at least 50% of points are less than.
Output tables consist of a single row containing the calculated median.

{{< flex >}}
{{% flex-content %}}
**Given the following input table:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:01:00Z | 1.0    |
| 2020-01-01T00:02:00Z | 1.0    |
| 2020-01-01T00:03:00Z | 2.0    |
| 2020-01-01T00:04:00Z | 3.0    |
{{% /flex-content %}}
{{% flex-content %}}
**`exact_selector` returns:**

| _time                | _value |
|:-----                | ------:|
| 2020-01-01T00:02:00Z | 1.0    |
{{% /flex-content %}}
{{< /flex >}}

{{% note %}}
The examples below use the [example data variable](/flux/v0.65/guides/#example-data-variable).
{{% /note %}}

## Find the value that represents the median
Use the default method, `"estimate_tdigest"`, to return all rows in a table that
contain values in the 50th percentile of data in the table.

```js
data
  |> median()
```

## Find the average of values closest to the median
Use the `exact_mean` method to return a single row per input table containing the
average of the two values closest to the mathematical median of data in the table.

```js
data
  |> median(method: "exact_mean")
```

## Find the point with the median value
Use the `exact_selector` method to return a single row per input table containing the
value that 50% of values in the table are less than.

```js
data
  |> median(method: "exact_selector")
```

## Use median() with aggregateWindow()
[`aggregateWindow()`](/flux/v0.65/stdlib/built-in/transformations/aggregates/aggregatewindow/)
segments data into windows of time, aggregates data in each window into a single
point, and then removes the time-based segmentation.
It is primarily used to downsample data.

To specify the [median calculation method](#select-a-method-for-calculating-the-median) in `aggregateWindow()`, use the
[full function syntax](/flux/v0.65/stdlib/built-in/transformations/aggregates/aggregatewindow/#specify-parameters-of-the-aggregate-function):

```js
data
  |> aggregateWindow(
    every: 5m,
    fn: (tables=<-, column) => tables |> median(method: "exact_selector")
  )
```
