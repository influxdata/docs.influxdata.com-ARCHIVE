---
title: Line Protocol
---

The line protocol is a text based format for writing points to InfluxDB.  Each line defines a single point. 
Multiple lines must be separated by the newline character `\n`. The format of the line consists of three parts:

```
[key] [fields] [timestamp]
```

Each section is separated by spaces.  The minimum required point consists of a measurement name and at least one field. Points without a specified timestamp will be written using the server's local timestamp. Timestamps are assumed to be in nanoseconds unless a `precision` value is passed in the query string.

## Key

The key is the measurement name and any optional tags separated by commas.  Measurement names, tag keys, and tag values must escape any spaces or commas using a backslash (`\`). For example: `\ ` and `\,`.  All tag values are stored as strings and should not be surrounded in quotes. 

Tags should be sorted by key before being sent for best performance. The sort should match that from the Go `bytes.Compare` function (http://golang.org/pkg/bytes/#Compare).

### Examples

```
# measurement only
cpu

# measurement and tags
cpu,host=serverA,region=us-west

# measurement with commas
cpu\,01,host=serverA,region=us-west

# tag value with spaces
cpu,host=server\ A,region=us\ west
```

## Fields

Fields are key-value metrics associated with the measurement.  Every line must have at least one field.  Multiple fields must be separated with commas and not spaces.

Field keys are always strings and follow the same syntactical rules as described above for tag keys and values. Field values can be one of four types.  The first value written for a given field on a given measurement defines the type of that field for all series under that measurement.

**Integers** are numeric values that do not include a decimal and are followed by a trailing `i` when inserted (e.g. 1i, 345i, 2015i, -10i). Note that all values _must_ have a trailing `i`. If they do not they will be written as floats.

**Floats** are numeric values that are not followed by a trailing `i`. (e.g. 1, 1.0, -3.14, 6.0e5, 10).

**Boolean** values indicate true or false.  Valid boolean strings are (t, T, true, TRUE, f, F, false, and FALSE).

**Strings** are text values.  All string values _must_ be surrounded in double-quotes `"`.  If the string contains
a double-quote, it must be escaped with a backslash, e.g. `\"`.


```
# integer value
cpu value=1i

# float value
cpu_load value=1

cpu_load value=1.0

cpu_load value=1.2

# boolean value
error fatal=true

# string value
event msg="logged out"

# multiple values
cpu load=10,alert=true,reason="value above maximum threshold"
```

## Timestamp

The timestamp section is optional but should be specified if possible.  The value is an integer representing nanoseconds since the epoch. If the timestamp is not provided the point will inherit the server's local timestamp.

Some write APIs allow passing a lower precision.  If the API supports a lower precision, the timestamp may also be
an integer epoch in microseconds, milliseconds, seconds, minutes or hours.

## Full Example
A full example is shown below.
```
cpu,host=server01,region=uswest value=1 1434055562000000000
cpu,host=server02,region=uswest value=3 1434055562000010000
temperature,machine=unit42,type=assembly internal=32,external=100 1434055562000000035
temperature,machine=unit143,type=assembly internal=22,external=130 1434055562005000035
```
In this example the first line shows a `measurement` of "cpu", there are two tags "host" and "region, the `value` is 1.0, and the `timestamp` is 1434055562000000000. Following this is a second line, also a point in the `measurement` "cpu" but belonging to a different "host".
```
cpu,host=server\ 01,region=uswest value=1,msg="all systems nominal"
cpu,host=server\ 01,region=us\,west value_int=1i
```
In these examples, the "host" is set to `server 01`. The field value associated with field key `msg` is double-quoted, as it is a string. The second example shows a region of `us,west` with the comma properly escaped. In the first example `value` is written as a floating point number. In the second, `value_int` is an integer.

> **Note:** Prior to version 0.9.3, integers were numeric values that did not include a decimal (e.g. 1, 345, 2015, -10) and were not followed by a trailing `i`. Including a trailing `i` when writing integers will cause an error in versions 0.9.2 and prior. See [issue](https://github.com/influxdb/influxdb/issues/3519) for more information.
