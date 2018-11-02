---
title: cov() function
description: placeholder
menu:
  flux_0_7:
    name: cov
    parent: Functions
    weight: 1
---

The `cov()` function computes the covariance between two streams by first joining the streams,
then performing the covariance operation.

_**Function type:** transformation_  
_**Output data type:** float_

```js
cov(x: table1, y: table2, on: ["_time", "_field"], pearsonr: false)
```

## Parameters

### x
One input stream used to calculate the covariance.

_**Data type:** table object_

### y
The other input table used to calculate the covariance.

_**Data type:** table object_


### on
The list of columns on which to join.

_**Data type:** array of strings_


### pearsonr
Indicates whether the result should be normalized to be the Pearson R coefficient.

_**Data type:** boolean_


## Examples

```js
table1 = from(bucket: "telegraf/autogen")
  |> range(start: -15m)
  |> filter(fn: (r) => r._measurement == "measurement_1")

table2 = from(bucket: "telegraf/autogen")
  |> range(start: -15m)
  |> filter(fn: (r) => r._measurement == "measurement_2")

cov(x: table1, y: table2, on: ["_time", "_field"])
```

## Function definition
```js
cov = (x,y,on,pearsonr=false) =>
  join( tables:{x:x, y:y}, on:on )
    |> covariance(pearsonr:pearsonr, columns:["_value_x","_value_y"])
```
