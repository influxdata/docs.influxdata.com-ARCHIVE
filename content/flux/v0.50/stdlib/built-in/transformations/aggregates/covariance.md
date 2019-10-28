---
title: covariance() function
description: The covariance() function computes the covariance between two columns.
aliases:
  - /flux/v0.50/functions/transformations/aggregates/covariance
  - /flux/v0.50/functions/built-in/transformations/aggregates/covariance/
menu:
  flux_0_50:
    name: covariance
    parent: Aggregates
    weight: 1
---

The `covariance()` function computes the covariance between two columns.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
covariance(columns: ["column_x", "column_y"], pearsonr: false, valueDst: "_value")
```

## Parameters

### columns
A list of **two columns** on which to operate. <span class="required">Required</span>

_**Data type:** Array of strings_

### pearsonr
Indicates whether the result should be normalized to be the Pearson R coefficient.

_**Data type:** Boolean_

### valueDst
The column into which the result will be placed. Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "telegraf/autogen")
  |> range(start:-5m)
  |> covariance(columns: ["x", "y"])
```
