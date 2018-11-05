---
title: HistogramQuantile
description:
menu:
  flux_0_7:
    parent: Query engine
    name: HistogramQuantile
    weight:
---


HistogramQuantile approximates a quantile given an histogram that approximates the cumulative distribution of the dataset.
Each input table represents a single histogram.
The histogram tables must have two columns, a count column and an upper bound column.
The count is the number of values that are less than or equal to the upper bound value.
The table can have any number of records, each representing an entry in the histogram.
The counts must be monotonically increasing when sorted by upper bound.

Linear interpolation between the two closest bounds is used to compute the quantile.
If the either of the bounds used in interpolation are infinite, then the other finite bound is used and no interpolation is performed.

The output table will have a the same group key as the input table.
The columns not part of the group key will be removed and a single value column of type float will be added.
The count and upper bound columns must not be part of the group key.
The value column represents the value of the desired quantile from the histogram.

HistogramQuantile has the following properties:

* `quantile` float
  * Quantile is a value between 0 and 1 indicating the desired quantile to compute.
* `countColumn` string
  * CountColumn is the name of the column containing the histogram counts.
  * The count column type must be float.
  * Defaults to `_value`.
* `upperBoundColumn` string
  * UpperBoundColumn is the name of the column containing the histogram upper bounds.
  * The upper bound column type must be float.
  * Defaults to `le`.
* `valueColumn` string
  * `valueColumn` is the name of the output column which will contain the computed quantile.
  * Defaults to `_value`.
* `minValue` float
  * MinValue is the assumed minumum value of the dataset.
  * When the quantile falls below the lowest upper bound, interpolation is performed between `minValue` and the lowest upper bound.
  * When minValue is equal to negative infinity, the lowest upper bound is used.
    Defaults to `0`.

**Example**

```
histogramQuantile(quantile:0.9)  // compute the 90th quantile using histogram data.
```
