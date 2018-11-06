---
title: histogram() function
description: The histogram() function approximates the cumulative distribution of a dataset by counting data frequencies for a list of buckets.
menu:
  flux_0_7:
    name: histogram
    parent: Transformations
    weight: 1
---

The `histogram()` function approximates the cumulative distribution of a dataset by counting data frequencies for a list of buckets.
A bucket is defined by an upper bound where all data points that are less than or equal to the bound are counted in the bucket.
The bucket counts are cumulative.

Each input table is converted into a single output table representing a single histogram.
The output table has a the same group key as the input table.
Columns not part of the group key are removed and an upper bound column and a count column are added.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
histogram(column: "_value", upperBoundColumn: "le", countColumn: "_value", buckets: [50.0, 75.0, 90.0], normalize: false)
```

## Parameters

### column
The name of a column containing input data values.
The column type must be float.
Defaults to `"_value"`.

_**Data type:** String_

### upperBoundColumn
The name of the column in which to store the histogram's upper bounds.
Defaults to `"le"`.

_**Data type:** String_

### countColumn
The name of the column in which to store the histogram counts.
Defaults to `"_value"`.

_**Data type:** String_

### buckets
A list of upper bounds to use when computing the histogram frequencies.
Buckets should contain a bucket whose bound is the maximum value of the data set.
This value can be set to positive infinity if no maximum is known.

_**Data type:** Array of floats_

### normalize
When `true`, will convert the counts into frequency values between 0 and 1.
Defaults to `false`.

_**Data type:** Boolean_

> Normalized histograms cannot be aggregated by summing their counts.

## Examples

##### Histogram with dynamically generated buckets
```js
// Dynamically generate 10 buckets from 0,10,20,...,100
histogram(buckets: linearBuckets(start:0.0, width:10.0, count:10))
```
