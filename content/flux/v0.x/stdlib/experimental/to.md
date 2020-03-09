---
title: experimental.to() function
description: >
  The `experimental.to()` function writes data to an InfluxDB v2.0 bucket.
  The function structures data differently than the built-in `to()` function.
menu:
  flux_0_x:
    name: experimental.to
    parent: Experimental
weight: 1
---

The `experimental.to()` function writes data to an InfluxDB v2.0 bucket, but in
a [different structure](#expected-data-structure) than the
[built-in `to()` function](/flux/v0.x/stdlib/built-in/outputs/to/).

_**Function type:** Output_

{{% warn %}}
The `experimental.to()` function is subject to change at any time.
By using this function, you accept the [risks of experimental functions](/flux/v0.x/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental"

experimental.to(
  bucket: "my-bucket",
  org: "my-org"
)

// OR

experimental.to(
  bucketID: "1234567890",
  orgID: "0987654321"
)
```

### Expected data structure

#### Data structure expected by built-in to()
The built-in `to()` function requires `_time`, `_measurement`, `_field`, and `_value` columns.
The `_field` column stores the **field key** and the `_value` column stores the **field value**.

| _time     | _measurement     | _field    | _value      |
| -----     | ------------     | ------    | ------      |
| timestamp | measurement-name | field key | field value |

#### Data structure expected by experimental to()
`experimental.to()` requires `_time` and `measurement` columns, but field keys
and values are stored in single columns with the **field key** as the **column name** and
the **field value** as the **column value**.

| _time     | _measurement     | field_key   |
| -----     | ------------     | ---------   |
| timestamp | measurement-name | field value |

If using the built-in `from()` function, use [`pivot()`](/flux/v0.x/stdlib/built-in/transformations/pivot/)
to transform data into the structure `experimetnal.to()` expects.
_[See the example below](#use-pivot-to-shape-data-for-experimental-to)._

## Parameters

### bucket
The bucket to write data to.
`bucket` and `bucketID` are mutually exclusive.

_**Data type:** String_

### bucketID
The ID of the bucket to write data to.
`bucketID` and `bucket` are mutually exclusive.

_**Data type:** String_

### org
The organization name of the specified [`bucket`](#bucket).
Only required when writing to a different organization or a remote host.
`org` and `orgID` are mutually exclusive.

_**Data type:** String_

### orgID
The organization ID of the specified [`bucket`](#bucket).
Only required when writing to a different organization or a remote host.
`orgID` and `org` are mutually exclusive.

_**Data type:** String_


## Examples

##### Use pivot() to shape data for experimental.to()
```js
import "experimental"

from(bucket: "telegraf/autogen")
  |> range(start: -1h)
  |> pivot(
      rowKey:["_time"],
      columnKey: ["_field"],
      valueColumn: "_value")
  |> experimental.to(
      bucket: "bucket-name",
      org: "org-name"
  )
```

---

### Related functions
- [to()](/flux/v0.x/stdlib/built-in/outputs/to/)
