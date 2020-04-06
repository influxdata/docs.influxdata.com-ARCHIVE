---
title: Query cumulative sum
description: >
  Use the `cumulativeSum()` function to calculate a running total of values.
weight: 10
menu:
  flux_0_65:
    parent: Guides
    name: Query the cumulative sum
---

Use the [`cumulativeSum()` function](/flux/v0.65/stdlib/built-in/transformations/cumulativesum/)
to calculate a running total of values.
`cumulativeSum` sums the values of subsequent records and returns each row updated with the summed total.

{{< flex >}}
{{% flex-content "half" %}}
**Given the following input table:**

| _time | _value |
| ----- |:------:|
| 0001  | 1      |
| 0002  | 2      |
| 0003  | 1      |
| 0004  | 3      |
{{% /flex-content %}}
{{% flex-content "half" %}}
**`cumulativeSum()` returns:**

| _time | _value |
| ----- |:------:|
| 0001  | 1      |
| 0002  | 3      |
| 0003  | 4      |
| 0004  | 7      |
{{% /flex-content %}}
{{< /flex >}}

{{% note %}}
The examples below use the [example data variable](/flux/v0.65/guides/#example-data-variable).
{{% /note %}}

##### Calculate the running total of values
```js
data
  |> cumulativeSum()
```

### Use cumulativeSum() with aggregateWindow()
[`aggregateWindow()`](/flux/v0.65/stdlib/built-in/transformations/aggregates/aggregatewindow/)
segments data into windows of time, aggregates data in each window into a single
point, then removes the time-based segmentation.
It is primarily used to downsample data.

`aggregateWindow()` expects an aggregate function that returns a single row for each time window.
To use `cumulativeSum()` with `aggregateWindow`, use `sum` in `aggregateWindow()`,
then calculate the running total of the aggregate values with `cumulativeSum()`.

<!-- -->
```js
data
  |> aggregateWindow(every: 5m, fn: sum)
  |> cumulativeSum()
```
