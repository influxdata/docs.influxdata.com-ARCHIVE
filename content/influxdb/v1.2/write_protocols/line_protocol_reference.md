---
title: Line Protocol Reference
aliases:
    - influxdb/v1.2/write_protocols/write_syntax/
menu:
  influxdb_1_2:
    weight: 10
    parent: write_protocols
---


The Line Protocol is a text based format for writing points to InfluxDB.

## Line Protocol Syntax
```
<measurement>[,<tag_key>=<tag_value>[,<tag_key>=<tag_value>]] <field_key>=<field_value>[,<field_key>=<field_value>] [<timestamp>]
```

Each line, separated by the newline character `\n`, represents a single point
in InfluxDB.
Line Protocol is whitespace sensitive.

## Line Protocol Elements

Line Protocol informs InfluxDB of the data's measurement, tag set, field set,
and timestamp.

| Element | Optional/Required | Description | Type<br>(See [data types](#data-types) for more information.) |
| :-------| :---------------- |:----------- |:----------------
| [Measurement](/influxdb/v1.2/concepts/glossary/#measurement) | Required | The measurement name. InfluxDB accepts one measurement per point. | String
| [Tag set](/influxdb/v1.2/concepts/glossary/#tag-set) | Optional | All tag key-value pairs for the point.  | [Tag keys](/influxdb/v1.2/concepts/glossary/#tag-key) and [tag values](/influxdb/v1.2/concepts/glossary/#tag-value) are both strings.
| [Field set](/influxdb/v1.2/concepts/glossary/#field-set) | Required. Points must have at least one field. | All field key-value pairs for the point. | [Field keys](/influxdb/v1.2/concepts/glossary/#field-key) are strings. [Field values](/influxdb/v1.2/concepts/glossary/#field-value) can be floats, integers, strings, or booleans.
| [Timestamp](/influxdb/v1.2/concepts/glossary/#timestamp) | Optional. InfluxDB uses the server's local nanosecond timestamp in UTC if the timestamp is not included with the point. | The timestamp for the data point. InfluxDB accepts one timestamp per point. | Unix nanosecond timestamp. Specify alternative precisions with the [HTTP API](/influxdb/v1.2/tools/api/#write).

> **Performance tips:**
>
* Sort tags by key before sending them to the database.
The sort should match the results from the
[Go bytes.Compare function](http://golang.org/pkg/bytes/#Compare).
>
* Use the coarsest
[precision](/influxdb/v1.2/tools/api/#write) possible for timestamps.
This can result in significant improvements in compression.

## Data Types

| Datatype     | Element(s)  | Description  |
| :----------- | :------------------------ |:------------ |
| Float | Field values |  IEEE-754 64-bit floating-point numbers. This is the default numerical type. |
| Integer | Field values | Signed 64-bit integers (-9223372036854775808 to 9223372036854775807). Specify an integer with a trailing `i` on the number. |
| String | Measurements, tag keys, tag values, field keys, field values | Length limit 64KB. |
| Boolean | Field values | Stores TRUE or FALSE values.<br><br>TRUE write syntax:`[t, T, true, True, TRUE]`.<br><br>FALSE write syntax:`[f, F, false, False, FALSE]` |
| Timestamp | Timestamps | Unix nanosecond timestamp. Specify alternative precisions with the [HTTP API](/influxdb/v1.2/tools/api/#write). The minimum valid timestamp is `-9223372036854775806` or `1677-09-21T00:12:43.145224194Z`. The maximum valid timestamp is `9223372036854775806` or `2262-04-11T23:47:16.854775806Z`. |

### More on field value types

#### Boolean syntax for writes vs. queries
Acceptable boolean syntax differs for data writes and data queries.
See
[Frequently Asked Questions](/influxdb/v1.2/troubleshooting/frequently-asked-questions/#why-can-t-i-query-boolean-field-values)
for more information.

#### Field type discrepancies
Within a measurement, a field's type cannot differ within a
[shard](/influxdb/v1.2/concepts/glossary/#shard), but it can differ across
shards.
See
[Frequently Asked Questions](/influxdb/v1.2/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards)
for how field value type discrepancies can affect `SELECT *` queries.

### Examples

Write the field value `1.0` as a float to InfluxDB:
```
> INSERT mymeas value=1.0
```

Write the field value `1` as a float to InfluxDB:
```
> INSERT mymeas value=1
```

Write the field value `1` as an integer to InfluxDB:
```
> INSERT mymeas value=1i
```

Write the field value `stringing along` as a string to InfluxDB.
Always double quote string field values. More on quoting [below](#quoting).
```
> INSERT mymeas value="stringing along"
```

Write the field value `true` as a boolean to InfluxDB.
Do not quote boolean field values.
```
> INSERT mymeas value=true
```

Write the field value `true` as a string to InfluxDB:
```
> INSERT mymeas value="true"
```

Attempt to write a string to a field that previous accepted floats.
The float and string would live in the same shard.
```
> INSERT mymeas value=3 1465934559000000000
> INSERT mymeas value="stringing along" 1465934559000000001
ERR: {"error":"field type conflict: input field \"value\" on measurement \"mymeas\" is type string, already exists as type float"}
```

Attempt to write a string to a field that previous accepted floats.
The float and string are not in the same shard.
```
> INSERT mymeas value=3 1465934559000000000
> INSERT mymeas value="stringing along" 1466625759000000000
>
```

## Quoting, Special Characters, and Additional Naming Guidelines

### Quoting

| Element | Double quotes | Single quotes |
| :------ | :------------ |:------------- |
| Timestamp | Never | Never |
| Measurements, tag keys, tag values, field keys | Never* | Never* |
| Field values | Double quote string field values. Do not double quote floats, integers, or booleans. | Never |

\* Line Protocol allows users to double and single quoting measurements, tag
keys, tag values, and field keys.
It will, however, assume that the double or single quotes are part of the name.
This can complicate query syntax (see the example below).

#### Examples

Double quote the timestamp. This is invalid Line Protocol:
```
> INSERT mymeas value=9 "1466625759000000000"
ERR: {"error":"unable to parse 'mymeas value=9 \"1466625759000000000\"': bad timestamp"}
```

Double quote a boolean field value. InfluxDB assumes that the value is a string:
```
> INSERT mymeas value="true"
> SHOW FIELD KEYS FROM "mymeas"
name: mymeas
------------
fieldKey	 fieldType
value		   string
```

Write to `mymeas` and `"mymeas"` and query their data:
```
> INSERT mymeas value=2
> INSERT "mymeas" value=200
> SHOW MEASUREMENTS
name: measurements
------------------
name
"mymeas"
mymeas
> SELECT * FROM mymeas
name: mymeas
------------
time				                        value
2016-06-14T20:36:11.939713972Z	 2

> SELECT * FROM "mymeas"
name: mymeas
------------
time				                        value
2016-06-14T20:36:11.939713972Z	 2

> SELECT * FROM "\"mymeas\""
name: "mymeas"
--------------
time				                        value
2016-06-14T20:36:21.836131014Z	 200
```

### Special Characters

For tag keys, tag values, and field keys always use a backslash character `\`
to escape:

* commas `,`
* equal signs `=`
* spaces ` `

For measurements always use a backslash character `\` to escape:

* commas `,`
* spaces ` `

For string field values use a backslash character `\` to escape:

* double quotes `"`

Line Protocol does not require users to escape the backslash character `\`.
Users do not need to escape all other special characters.

#### Example

Write a point where the measurement is `"measurement with quo⚡️es and emoji"`, the tag key is `tag key with sp🚀ces`, the
tag value is `tag,value,with"commas"`, the field key is `field_k\ey` and the field value is `string field value, only " need be esc🍭ped`.

```
> INSERT "measurement\ with\ quo⚡️es\ and\ emoji",tag\ key\ with\ sp🚀ces=tag\,value\,with"commas" field_k\ey="string field value, only \" need be esc🍭ped"
```

### Additional Naming Guidelines

`#` at the beginning of the line is a valid comment character for Line Protocol.
InfluxDB will ignore all subsequent characters until the next newline `\n`.

Measurement names, tag keys, tag values, field keys, and field values are
case sensitive.

Line Protocol accepts
[InfluxQL keywords](/influxdb/v1.2/query_language/spec/#keywords)
as [identifier](/influxdb/v1.2/concepts/glossary/#identifier) names.
In general, we recommend avoiding using InfluxQL keywords in your schema as
it can cause
[confusion](/influxdb/v1.2/troubleshooting/errors/#error-parsing-query-found-expected-identifier-at-line-char) when querying the data.

## Line Protocol in Practice

See the [Tools](/influxdb/v1.2/tools/) section for how to
write Line Protocol to the database.

### Duplicate points

A point is uniquely identified by the measurement name, tag set, and timestamp.
If you submit Line Protocol with the same measurement, tag set, and timestamp,
but with a different field set, the field set becomes the union of the old
field set and the new field set, where any conflicts favor the new field set.

See
[Frequently Asked Questions](/influxdb/v1.2/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-duplicate-points)
for a complete example of this behavior and how to avoid it.
