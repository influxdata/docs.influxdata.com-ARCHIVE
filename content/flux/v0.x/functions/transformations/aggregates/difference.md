---
title: difference() function
description: The difference() function computes the difference between subsequent non-null records.
menu:
  flux_0_x:
    name: difference
    parent: Aggregates
    weight: 1
---

The `difference()` function computes the difference between subsequent records.  
Every user-specified column of numeric type is subtracted while others are kept intact.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
difference(nonNegative: false, columns: ["_value"])
```

## Parameters

### nonNegative
Indicates if the difference is allowed to be negative.
When set to `true`, if a value is less than the previous value, it is assumed the previous value should have been a zero.

_**Data type:** Boolean_

### columns
A list of columns on which to compute the difference.
Defaults to `["_value"]`.

_**Data type:** Array of strings_

## Subtraction rules for numeric types
- The difference between two non-null values is their algebraic difference;
  or `null`, if the result is negative and `nonNegative: true`;
- `null` minus some value is always `null`;
- Some value `v` minus `null` is `v` minus the last non-null value seen before `v`;
  or `null` if `v` is the first non-null value seen.


## Examples

```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> difference()
```
```js
from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> difference(nonNegative: true)
```

### Example data transformation

###### Input table
| _time |   A  |   B  |   C  | tag |
|:-----:|:----:|:----:|:----:|:---:|
|  0001 | null |   1  |   2  |  tv |
|  0002 |   6  |   2  | null |  tv |
|  0003 |   4  |   2  |   4  |  tv |
|  0004 |  10  |  10  |   2  |  tv |
|  0005 | null | null |   1  |  tv |

#### With nonNegative set to false
```js
|> difference(nonNegative: false)
```
###### Output table
| _time |   A  |   B  |   C  | tag |
|:-----:|:----:|:----:|:----:|:---:|
|  0002 | null |   1  | null |  tv |
|  0003 |  -2  |   0  |   2  |  tv |
|  0004 |   6  |   8  |  -2  |  tv |
|  0005 | null | null |  -1  |  tv |

#### With nonNegative set to true
```js
|> difference(nonNegative: true):
```
###### Output table
| _time |   A  |   B  |   C  | tag |
|:-----:|:----:|:----:|:----:|:---:|
|  0002 | null |   1  | null |  tv |
|  0003 | null |   0  |   2  |  tv |
|  0004 |   6  |   8  | null |  tv |
|  0005 | null | null | null |  tv |

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[DIFFERENCE()](/influxdb/latest/query_language/functions/#difference)
