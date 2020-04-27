---
title: experimental.join() function
description: >
  The `experimental.join()` function joins two streams of tables on the
  group key with the addition of the `_time` column.
menu:
  flux_0_65:
    name: experimental.join
    parent: Experimental
weight: 2
---

The `experimental.join()` function joins two streams of tables on the
[group key](/flux/v0.65/introduction/getting-started/#group-keys) and `_time` column.
Use the [`fn` parameter](#fn) to map new output tables using values from input tables.

{{% note %}}
To join streams of tables with different fields or measurements, use [`group()`](/flux/v0.65/stdlib/built-in/transformations/group/)
or [`drop()`](/flux/v0.65/stdlib/built-in/transformations/drop/) to remove
`_field` and `_measurement` from the group key before joining.
_See an example [below](#join-two-streams-of-tables-with-different-fields)._
{{% /note %}}

_**Function type:** Transformation_

```js
import "experimental"

// ...

experimental.join(
  left: left,
  right: right,
  fn: (left, right) => ({left with lv: left._value, rv: right._value })
)
```

{{% note %}}
This function will likely replace the [`join` function](/flux/v0.65/stdlib/built-in/transformations/join/)
when sufficiently vetted.
{{% /note %}}

## Parameters

### left
First of two streams of tables to join.

_**Data type:** Stream of tables_

### right
Second of two streams of tables to join.

_**Data type:** Stream of tables_

### fn
A function with `left` and `right` arguments that maps a new output object
using values from the `left` and `right` input objects.
The return value must be an object.

_**Data type:** Function_

## Examples

### Input and output tables

**Given the following input tables:**
{{< flex >}}
{{% flex-content %}}
##### left
| _time | _field | _value |
|:----- |:------:| ------:|
| 0001  | temp   | 80.1   |
| 0002  | temp   | 80.2   |
| 0003  | temp   | 79.9   |
| 0004  | temp   | 80.0   |
{{% /flex-content %}}
{{% flex-content %}}
##### right
| _time | _field | _value |
|:----- |:------:| ------:|
| 0001  | temp   | 72.1   |
| 0002  | temp   | 72.2   |
| 0003  | temp   | 71.9   |
| 0004  | temp   | 72.0   |
{{% /flex-content %}}
{{< /flex >}}

**The following `experimental.join()` function would output:**

```js
import "experimental"

experimental.join(
  left: left,
  right: right,
  fn: (left, right) => ({
    left with
    lv: left._value,
    rv: right._value,
    diff: left._value - right._value
  })
)
```

| _time | _field | lv   | rv   | diff |
|:----- |:------:|:--:  |:--:  | ----:|
| 0001  | temp   | 80.1 | 72.1 | 8.0  |
| 0002  | temp   | 80.2 | 72.2 | 8.0  |
| 0003  | temp   | 79.9 | 71.9 | 8.0  |
| 0004  | temp   | 80.0 | 72.0 | 8.0  |

---

###### Join two streams of tables
```js
import "experimental"

s1 = from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "foo")

s2 = from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "bar")

experimental.join(
  left: s1,
  right: s2,
  fn: (left, right) => ({
    left with
    s1_value: left._value,
    s2_value: right._value
  })
)
```

###### Join two streams of tables with different fields and measurements
```js
import "experimental"

s1 = from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "foo" and r._field == "bar")
  |> group(columns: ["_time", "_measurement", "_field", "_value"], mode: "except")

s2 = from(bucket: "db/rp")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "baz" and r._field == "quz")
  |> group(columns: ["_time", "_measurement", "_field", "_value"], mode: "except")

experimental.join(
  left: s1,
  right: s2,
  fn: (left, right) => ({
    left with
    bar_value: left._value,
    quz_value: right._value
  })
)
```
