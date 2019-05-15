---
title: getRecord() function
description: >
  The `getRecord()` function extracts a record from a table given its index.
  If the index is out of bounds, the function errors.
menu:
  flux_0_x:
    name: getRecord
    parent: Stream & table
weight: 1
---

The `getRecord()` function extracts a record from a table given the record's index.
If the index is out of bounds, the function errors.

_**Function type:** Stream and table_  

```js
getRecord(idx: 0)
```

## Parameters

### idx
The index of the record to extract.

_**Data type:** Integer_

## Example
```js
r0 = from(bucket:"telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn:(r) => r._measurement == "cpu")
    |> tableFind(fn: (key) => key._field == "usage_idle")
    |> getRecord(idx: 0)

// Use record values
x = r0._field + "--" + r0._measurement
```
