---
title: to() function
description: The to() function writes data to an InfluxDB v2.0 bucket.
aliases:
  - /flux/v0.33/functions/outputs/to
menu:
  flux_0_33:
    name: to
    parent: Outputs
    weight: 1
draft: true
---

The `to()` function writes data to an **InfluxDB v2.0** bucket.

_**Function type:** Output_  
_**Output data type:** Object_

```js
to(
  bucket: "my-bucket",
  org: "my-org",
  timeColumn: "_time",
  tagColumns: ["tag1", "tag2", "tag3"],
  fieldFn: (r) => ({ [r._field]: r._value })
)

// OR

to(
  bucketID: "1234567890",
  orgID: "0987654321",
  timeColumn: "_time",
  tagColumns: ["tag1", "tag2", "tag3"],
  fieldFn: (r) => ({ [r._field]: r._value })
)
```

## Parameters

> `bucket` OR `bucketID` is **required**.

### bucket
The bucket to which data is written. Mutually exclusive with `bucketID`.

_**Data type:** String_

### bucketID
The ID of the bucket to which data is written. Mutually exclusive with `bucket`.

_**Data type:** String_

### org
The organization name of the specified [`bucket`](#bucket).
Only required when writing to a remote host.
Mutually exclusive with `orgID`

_**Data type:** String_

> Specify either an `org` or an `orgID`, but not both.

### orgID
The organization ID of the specified [`bucket`](#bucket).
Only required when writing to a remote host.
Mutually exclusive with `org`.

_**Data type:** String_

<!-- ### host
The remote InfluxDB host to which to write.
_If specified, a `token` is required._

_**Data type:** String_

### token
The authorization token to use when writing to a remote host.
_Required when a `host` is specified._

_**Data type:** String_ -->

### timeColumn
The time column of the output.
Default is `"_time"`.

_**Data type:** String_

### tagColumns
The tag columns of the output.
Defaults to all columns with type `string`, excluding all value columns and the `_field` column if present.

_**Data type:** Array of strings_

### fieldFn
Function that takes a record from the input table and returns an object.
For each record from the input table, `fieldFn` returns an object that maps output the field key to the output value.
Default is `(r) => ({ [r._field]: r._value })`

_**Data type:** Function_
_**Output data type:** Object_

## Examples

### Default to() operation
Given the following table:

| _time | _start | _stop | _measurement | _field | _value |
| ----- | ------ | ----- | ------------ | ------ | ------ |
| 0005  | 0000   | 0009  | "a"          | "temp" | 100.1  |
| 0006  | 0000   | 0009  | "a"          | "temp" | 99.3   |
| 0007  | 0000   | 0009  | "a"          | "temp" | 99.9   |

The default `to` operation:

```js
// ...
|> to(bucket:"my-bucket", org:"my-org")
```

is equivalent to writing the above data using the following line protocol:

```
_measurement=a temp=100.1 0005
_measurement=a temp=99.3 0006
_measurement=a temp=99.9 0007
```

### Custom to() operation
The `to()` functions default operation can be overridden. For example, given the following table:

| _time | _start | _stop | tag1 | tag2 | hum  | temp  |
| ----- | ------ | ----- | ---- | ---- | ---- | ----- |
| 0005  | 0000   | 0009  | "a"  | "b"  | 55.3 | 100.1 |
| 0006  | 0000   | 0009  | "a"  | "b"  | 55.4 | 99.3  |
| 0007  | 0000   | 0009  | "a"  | "b"  | 55.5 | 99.9  |

The operation:

```js
// ...
|> to(bucket:"my-bucket", org:"my-org", tagColumns:["tag1"], fieldFn: (r) => return {"hum": r.hum, "temp": r.temp})
```

is equivalent to writing the above data using the following line protocol:

```
_tag1=a hum=55.3,temp=100.1 0005
_tag1=a hum=55.4,temp=99.3 0006
_tag1=a hum=55.5,temp=99.9 0007
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[SELECT INTO](/influxdb/latest/query_language/data_exploration/#the-into-clause)
