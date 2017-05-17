---
title: Line Protocol Tutorial
aliases:
    - influxdb/v1.2/write_protocols/line/
menu:
  influxdb_1_2:
    weight: 0
    parent: write_protocols
---

InfluxDB's Line Protocol is a text based format for writing points to the
database.
Points must be in Line Protocol format for InfluxDB to successfully parse and
write points (unless you're using a [service plugin](/influxdb/v1.2/tools/#service-plugins)).

Using fictional temperature data, this page introduces Line Protocol.
It covers:

<table style="width:100%">
  <tr>
    <td><a href="#syntax">Syntax</a></td>
    <td><a href="#data-types">Data Types</a></td>
    <td><a href="#quoting">Quoting</a></td>
    <td><a href="#special-characters-and-keywords">Special Characters and Keywords</a></td>
  </tr>
</table>

The final section, [Writing data to InfluxDB](#writing-data-to-influxdb),
describes how to get data into InfluxDB and how InfluxDB handles Line
Protocol duplicates.

## Syntax

A single line of Line Protocol represents one data point in InfluxDB.
It informs InfluxDB of the point's measurement, tag set, field set, and
timestamp.
The following code block shows a sample of Line Protocol and breaks it into its
individual components:

```
weather,location=us-midwest temperature=82 1465839830100400200
  |    -------------------- --------------  |
  |             |             |             |
  |             |             |             |
+-----------+--------+-+---------+-+---------+
|measurement|,tag_set| |field_set| |timestamp|
+-----------+--------+-+---------+-+---------+
```

Moving across each element in the diagram:

### Measurement

The name of the [measurement](/influxdb/v1.2/concepts/glossary/#measurement)
that you want to write your data to.
The measurement is required in Line Protocol.

In the example, the measurement name is `weather`.

### Tag set

The [tag(s)](/influxdb/v1.2/concepts/glossary/#tag) that you want to include
with your data point.
Tags are optional in Line Protocol.
Notice that the measurement and tag set are separated by a comma and no spaces.

Separate tag key-value pairs with an equals sign `=` and no spaces:
```
<tag_key>=<tag_value>
```

Separate multiple tag-value pairs with a comma and no spaces:
```
<tag_key>=<tag_value>,<tag_key>=<tag_value>
```

In the example, the tag set consists of one tag: `location=us-midwest`.
Adding another tag (`season=summer`) to the example looks like this:
```
weather,location=us-midwest,season=summer temperature=82 1465839830100400200
```

For best performance you should sort tags by key before sending them to the
database.
The sort should match the results from the
[Go bytes.Compare function](http://golang.org/pkg/bytes/#Compare).

### Whitespace I

Separate the measurement and the field set or, if you're including a tag set
with your data point, separate the tag set and the field set with a whitespace.
The whitespace is required in Line Protocol.

Valid Line Protocol with no tag set:
```
weather temperature=82 1465839830100400200
```

### Field set

The [field(s)](/influxdb/v1.2/concepts/glossary/#field) for your data point.
Every data point requires at least one field in Line Protocol.

Separate field key-value pairs with an equals sign `=` and no spaces:
```
<field_key>=<field_value>
```

Separate multiple field-value pairs with a comma and no spaces:
```
<field_key>=<field_value>,<field_key>=<field_value>
```

In the example, the field set consists of one field: `temperature=82`.
Adding another field (`bug_concentration=98`) to the example looks like this:
```
weather,location=us-midwest temperature=82,bug_concentration=98 1465839830100400200
```

### Whitespace II

Separate the field set and the optional timestamp with a whitespace.
The whitespace is required in Line Protocol if you're including a timestamp.

### Timestamp

The [timestamp](/influxdb/v1.2/concepts/glossary/#timestamp) for your data
point in nanosecond-precision Unix time.
The timestamp is optional in Line Protocol.
If you do not specify a timestamp for your data point InfluxDB uses the server's
local nanosecond timestamp in UTC.

In the example, the timestamp is `1465839830100400200` (that's
`2016-06-13T17:43:50.1004002Z` in RFC3339 format).
The Line Protocol below is the same data point but without the timestamp.
When InfluxDB writes it to the database it uses your server's
local timestamp instead of `2016-06-13T17:43:50.1004002Z`.
```
weather,location=us-midwest temperature=82
```

Use the HTTP API to specify timestamps with a precision other than nanoseconds,
such as microseconds, milliseconds, or seconds.
We recommend using the coarsest precision possible as this can result in
significant improvements in compression.
See the [API Reference](/influxdb/v1.2/tools/api/#write) for more information.

> #### Setup Tip:
>
Use the Network Time Protocol (NTP) to synchronize time between hosts.
InfluxDB uses a host's local time in UTC to assign timestamps to data; if
hosts' clocks aren't synchronized with NTP, the timestamps on the data written
to InfluxDB can be inaccurate.

## Data types

This section covers the data types of Line Protocol's major components:
[measurements](/influxdb/v1.2/concepts/glossary/#measurement),
[tag keys](/influxdb/v1.2/concepts/glossary/#tag-key),
[tag values](/influxdb/v1.2/concepts/glossary/#tag-value),
[field keys](/influxdb/v1.2/concepts/glossary/#field-key),
[field values](/influxdb/v1.2/concepts/glossary/#field-value), and
[timestamps](/influxdb/v1.2/concepts/glossary/#timestamp).


Measurements, tag keys, tag values, and field keys are always strings.

> **Note:**
Because InfluxDB stores tag values as strings, InfluxDB cannot perform math on
tag values.
In addition, InfluxQL [functions](/influxdb/v1.2/query_language/functions/)
do not accept a tag value as a primary argument.
It's a good idea to take into account that information when designing your
[schema](/influxdb/v1.2/concepts/glossary/#schema).

Timestamps are UNIX timestamps.
The minimum valid timestamp is `-9223372036854775806` or `1677-09-21T00:12:43.145224194Z`.
The maximum valid timestamp is `9223372036854775806` or `2262-04-11T23:47:16.854775806Z`.
As mentioned above, by default, InfluxDB assumes that timestamps have
nanosecond precision.
See the [API Reference](/influxdb/v1.2/tools/api/#write) for how to specify
alternative precisions.

Field values can be floats, integers, strings, or booleans:

* Floats - by default, InfluxDB assumes all numerical field values are floats.

    Store the field value `82` as a float:

    ```
weather,location=us-midwest temperature=82 1465839830100400200
    ```

* Integers - append an `i` to the field value to tell InfluxDB to store the
number as an integer.

    Store the field value `82` as an integer:

    ```
weather,location=us-midwest temperature=82i 1465839830100400200
    ```

* Strings - double quote string field values (more on quoting in Line Protocol
[below](#quoting)).

    Store the field value `too warm` as a string:

    ```
weather,location=us-midwest temperature="too warm" 1465839830100400200
    ```

* Booleans - specify TRUE with `t`, `T`, `true`, `True`, or `TRUE`. Specify
FALSE with `f`, `F`, `false`, `False`, or `FALSE`.

    Store the field value `true` as a boolean:

    ```
weather,location=us-midwest too_hot=true 1465839830100400200
    ```

    > **Note:** Acceptable boolean syntax differs for data writes and data
    queries. See
    [Frequently Asked Questions](/influxdb/v1.2/troubleshooting/frequently-asked-questions/#why-can-t-i-query-boolean-field-values)
    for more information.

Within a measurement, a field's type cannot differ within a
[shard](/influxdb/v1.2/concepts/glossary/#shard), but it can differ across
shards. For example, writing an integer to a field that previously accepted
floats fails if InfluxDB attempts to store the integer in the same shard as the
floats:
```
> INSERT weather,location=us-midwest temperature=82 1465839830100400200
> INSERT weather,location=us-midwest temperature=81i 1465839830100400300
ERR: {"error":"field type conflict: input field \"temperature\" on measurement \"weather\" is type int64, already exists as type float"}
```

But, writing an integer to a field that previously accepted floats succeeds if
InfluxDB stores the integer in a new shard:
```
> INSERT weather,location=us-midwest temperature=82 1465839830100400200
> INSERT weather,location=us-midwest temperature=81i 1467154750000000000
>
```

See
[Frequently Asked Questions](/influxdb/v1.2/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-field-type-discrepancies-across-shards)
for how field value type discrepancies can affect `SELECT *` queries.

## Quoting

This section covers when not to and when to double (`"`) or single (`'`)
quote in Line Protocol.
Moving from never quote to please do quote:

* Never double or single quote the timestamp.
It's not valid Line Protocol.

    Example:

    ```
> INSERT weather,location=us-midwest temperature=82 "1465839830100400200"
ERR: {"error":"unable to parse 'weather,location=us-midwest temperature=82 \"1465839830100400200\"': bad timestamp"}
    ```

* Never single quote field values (even if they're strings!).
It's also not valid Line Protocol.

    Example:

    ```
> INSERT weather,location=us-midwest temperature='too warm'
ERR: {"error":"unable to parse 'weather,location=us-midwest temperature='too warm'': invalid boolean"}
    ```

* Do not double or single quote measurement names, tag keys, tag values, and field
keys.
It is valid Line Protocol but InfluxDB assumes that the quotes are part of the
name.

    Example:

    ```
> INSERT weather,location=us-midwest temperature=82 1465839830100400200
> INSERT "weather",location=us-midwest temperature=87 1465839830100400200
> SHOW MEASUREMENTS
name: measurements
------------------
name
"weather"
weather
    ```

    To query data in `"weather"` you need to double quote the measurement name and
escape the measurement's double quotes:

    ```
> SELECT * FROM "\"weather\""
name: "weather"
---------------
time				            location	 temperature
2016-06-13T17:43:50.1004002Z	us-midwest	 87
    ```

* Do not double quote field values that are floats, integers, or booleans.
InfluxDB will assume that those values are strings.

    Example:

    ```
> INSERT weather,location=us-midwest temperature="82"
> SELECT * FROM weather WHERE temperature >= 70
>
    ```

* Do double quote field values that are strings.

    Example:

    ```
> INSERT weather,location=us-midwest temperature="too warm"
> SELECT * FROM weather
name: weather
-------------
time				            location	 temperature
2016-06-13T19:10:09.995766248Z	us-midwest	 too warm
    ```

## Special characters and keywords

### Special characters

For tag keys, tag values, and field keys always use a backslash character `\`
to escape:

* commas `,`

    ```
weather,location=us\,midwest temperature=82 1465839830100400200
    ```
* equal signs `=`

    ```
weather,location=us-midwest temp\=rature=82 1465839830100400200
    ```
* spaces

    ```
weather,location\ place=us-midwest temperature=82 1465839830100400200
    ```

For measurements always use a backslash character `\` to escape:

* commas `,`

    ```
wea\,ther,location=us-midwest temperature=82 1465839830100400200
    ```

* spaces

    ```
wea\ ther,location=us-midwest temperature=82 1465839830100400200
    ```

For string field values use a backslash character `\` to escape:

* double quotes `"`

    ```
weather,location=us-midwest temperature="too\"hot\"" 1465839830100400200
    ```

Line Protocol does not require users to escape the backslash character `\`.
All other special characters also do not require escaping.
For example, Line Protocol handles emojis with no problem:

```
> INSERT we⛅️ther,location=us-midwest temper🔥ture=82 1465839830100400200
> SELECT * FROM "we⛅️ther"
name: we⛅️ther
------------------
time			              location	   temper🔥ture
1465839830100400200	 us-midwest	 82
```

### Keywords

Line Protocol accepts
[InfluxQL keywords](/influxdb/v1.2/query_language/spec/#keywords)
as [identifier](/influxdb/v1.2/concepts/glossary/#identifier) names.
In general, we recommend avoiding using InfluxQL keywords in your schema as
it can cause
[confusion](/influxdb/v1.2/troubleshooting/errors/#error-parsing-query-found-expected-identifier-at-line-char) when querying the data.

The keyword `time` is a special case.
`time` can be a
[continuous query](/influxdb/v1.2/concepts/glossary/#continuous-query-cq) name,
database name,
[measurement](/influxdb/v1.2/concepts/glossary/#measurement) name,
[retention policy](/influxdb/v1.2/concepts/glossary/#retention-policy-rp) name,
[subscription](/influxdb/v1.2/concepts/glossary/#subscription) name, and
[user](/influxdb/v1.2/concepts/glossary/#user) name.
In those cases, `time` does not require double quotes in queries.
`time` cannot be a [field key](/influxdb/v1.2/concepts/glossary/#field-key) or
[tag key](/influxdb/v1.2/concepts/glossary/#tag-key).
IIn versions 1.2.0-1.2.3,
InfluxDB accepts writes with `time` as a field or tag key but it silently drops the field key or tag key and its associated value.
In version 1.2.4, InfluxDB rejects writes with `time` as a field key or tag key and returns an error.
See [Frequently Asked Questions](/influxdb/v1.2/troubleshooting/frequently-asked-questions/#time) for more information.

## Writing data to InfluxDB

### Getting data in the database
Now that you know all about Line Protocol, how do you actually get the
Line Protocol to InfluxDB?
Here, we'll give two quick examples and then point you to the
[Tools](/influxdb/v1.2/tools/) sections for further
information.

#### HTTP API
Write data to InfluxDB using the HTTP API.
Send a `POST` request to the `/write` endpoint and provide your Line Protocol in
the request body:

```
curl -i -XPOST "http://localhost:8086/write?db=science_is_cool" --data-binary 'weather,location=us-midwest temperature=82 1465839830100400200'
```

For in-depth descriptions of query string parameters, status codes, responses,
and more examples, see the [API Reference](/influxdb/v1.2/tools/api/#write).

#### CLI
Write data to InfluxDB using InfluxDB's Command Line Interface (CLI).
[Launch](/influxdb/v1.2/tools/shell/#launch-influx) the CLI, use the relevant
database, and put `INSERT` in
front of your Line Protocol:

```
INSERT weather,location=us-midwest temperature=82 1465839830100400200
```

You can also use the CLI to
[import](/influxdb/v1.2/tools/shell/#import-data-from-a-file-with-import) Line
Protocol from a file.

There are several ways to write data to InfluxDB.
See the [Tools](/influxdb/v1.2/tools/) section for more
on the [HTTP API](/influxdb/v1.2/tools/api/#write), the
[CLI](/influxdb/v1.2/tools/shell/), and the available Service Plugins (
[UDP](/influxdb/v1.2/tools/udp/),
[Graphite](/influxdb/v1.2/tools/graphite/),
[CollectD](/influxdb/v1.2/tools/collectd/), and
[OpenTSDB](/influxdb/v1.2/tools/opentsdb/)).

### Duplicate points

A point is uniquely identified by the measurement name, tag set, and timestamp.
If you submit Line Protocol with the same measurement, tag set, and timestamp,
but with a different field set, the field set becomes the union of the old
field set and the new field set, where any conflicts favor the new field set.

See
[Frequently Asked Questions](/influxdb/v1.2/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-duplicate-points)
for a complete example of this behavior and how to avoid it.
