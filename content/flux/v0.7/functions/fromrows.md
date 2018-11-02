---
title: fromRows() function
description: The fromRows() function is pivots a table and automatically aligns fields within each measurement that have the same timestamp.
menu:
  flux_0_7:
    name: fromRows
    parent: Functions
    weight: 1
---

The `fromRows()` function is a special application of the `pivot()` function that
automatically aligns fields within each measurement that have the same timestamp.

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
fromRows(bucket: "bucket-name")

// OR

fromRows(bucketID: "0261d8287f4d6000")
```

## Parameters

### bucket
The name of the bucket to query.

_**Data type:** String_

## Function definition
```js
fromRows = (bucket) => from(bucket:bucket)
  |> pivot(rowKey:["_time"], colKey: ["_field"], valueCol: "_value")
```

## Examples
```js
fromRows(bucket: "telegraf/autogen")
  |> range(start: 2018-05-22T19:53:26Z)
```
```js
fromRows(bucketID: "0261d8287f4d6000")
  |> range(start: 2018-05-22T19:53:26Z)
```
