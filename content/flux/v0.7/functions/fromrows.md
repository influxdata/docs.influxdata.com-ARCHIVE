---
title: fromRows() function
description: placeholder
menu:
  flux_0_7:
    name: fromRows
    parent: Functions
    weight: 1
---

The `fromRows()` function is a special application of the `pivot()` function that will
automatically align fields within each measurement that have the same timestamp.

_**Function type:** transformation_  
_**Output data type:** table(s)_

```js
fromRows("bucket-name")
```

## Parameters

### bucket
The name of the bucket to query.

_**Data type:** string_

## Function definition
```js
fromRows = (bucket) => from(bucket:bucket)
  |> pivot(
    rowKey:["_time"],
    colKey: ["_field"],
    valueCol: "_value"
  )
```

## Examples
```js
fromRows(bucket:"telegraf/autogen")
  |> range(start: 2018-05-22T19:53:26Z)
```
