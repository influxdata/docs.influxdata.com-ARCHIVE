---
title: histogramQuantile() function
description: The `histogramQuantile()` function approximates a quantile given a histogram that approximates the cumulative distribution of the dataset.
menu:
  flux_0_12:
    name: histogramQuantile
    parent: Aggregates
    weight: 1
---

The `histogramQuantile()` function approximates a quantile given a histogram that
approximates the cumulative distribution of the dataset.
Each input table represents a single histogram.
The histogram tables must have two columns – a count column and an upper bound column.

The count is the number of values that are less than or equal to the upper bound value.
The table can have any number of records, each representing an entry in the histogram.
The counts must be monotonically increasing when sorted by upper bound.

Linear interpolation between the two closest bounds is used to compute the quantile.
If the either of the bounds used in interpolation are infinite,
then the other finite bound is used and no interpolation is performed.

The output table has the same group key as the input table.
Columns not part of the group key are removed and a single value column of type float is added.
The count and upper bound columns must not be part of the group key.
The value column represents the value of the desired quantile from the histogram.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
histogramQuantile(quantile: 0.5, countColumn: "_value", upperBoundColumn: "le", valueColumn: "_value", minValue: 0)
```

## Parameters

### quantile
A value between 0 and 1 indicating the desired quantile to compute.

_**Data type:** Float_

### countColumn
The name of the column containing the histogram counts.
The count column type must be float.
Defaults to `"_value"`.

_**Data type:** String_

### upperBoundColumn
The name of the column containing the histogram upper bounds.
The upper bound column type must be float.
Defaults to `"le"`.

_**Data type:** String_

### valueColumn
The name of the output column which will contain the computed quantile.
Defaults to `"_value"`.

_**Data type:** String_

### minValue
The assumed minimum value of the dataset.
When the quantile falls below the lowest upper bound, interpolation is performed between `minValue` and the lowest upper bound.
When `minValue` is equal to negative infinity, the lowest upper bound is used.
Defaults to `0`.

_**Data type:** Float_

## Examples

##### Compute the 90th quantile
```js
histogramQuantile(quantile: 0.9)
```
