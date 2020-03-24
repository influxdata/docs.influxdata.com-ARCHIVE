---
title: query.filterFields() function
description: >
  The `query.filterFields()` function filters input data by field.
menu:
  flux_0_64:
    name: query.filterFields
    parent: Query
weight: 1
---

The `query.filterFields()` function filters input data by field.

_**Function type:** Transformation_

```js
import "experimental/query"

query.filterFields(
  fields: ["exampleField1", "exampleField2"]
)
```

## Parameters

### fields
Fields to filter by.
Must be exact string matches.

_**Data type:** Array of strings_

## Examples

```js
import "experimental/query"

query.fromRange(bucket: "telegraf/autogen", start: -1h)
  |> query.filterFields(
    fields: ["used_percent", "available_percent"]
  )
```

## Function definition
```js
package query

filterFields = (tables=<-, fields=[]) =>
  if length(arr: fields) == 0 then
    tables
  else
    tables
      |> filter(fn: (r) => contains(value: r._field, set: fields))
```

_**Used functions:**_  
[contains()](/flux/v0.64/stdlib/built-in/tests/contains/)  
[filter()](/flux/v0.64/stdlib/built-in/transformations/filter/)  
[length()](/flux/v0.64/stdlib/built-in/misc/length/)  
