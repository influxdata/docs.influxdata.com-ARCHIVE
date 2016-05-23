---
title: Write Syntax
menu:
  influxdb_013:
    weight: 10
    parent: write_protocols
---

Syntax is always a challenge to remember, so here's a reference

## Line Protocol

The syntax for the line protocol is

`measurement[,tag_key1=tag_value1...] field_key=field_value[,field_key2=field_value2] [timestamp]`

For example:

```bash
measurement,tkey1=tval1,tkey2=tval2 fkey=fval,fkey2=fval2 1234567890000000000
```

### Whitespace

A space must exist between the measurement and the field(s), or between the tag(s) and the field(s) if tags are
provided.
The measurement and tags must be separated by a single comma `,` with no whitespace.

There must also be whitespace between the field(s) and the timestamp, if one is provided.

Valid (`value` and `otherval` are fields, `foo` and `bat` are tags)
```bash
measurement value=12
measurement value=12 1439587925
measurement,foo=bar value=12
measurement,foo=bar value=12 1439587925
measurement,foo=bar,bat=baz value=12,otherval=21 1439587925
```

Invalid
```bash
measurement,value=12
measurement value=12,1439587925
measurement foo=bar value=12
measurement,foo=bar,value=12 1439587925
measurement,foo=bar
measurement,foo=bar 1439587925
```

### Timestamps

Timestamps are not required.
When no timestamp is provided the server will insert the point with the local server
timestamp.
If a timestamp is provided it must be separated from the field(s) by a space.
Timestamps must be in Unix time and are assumed to be in nanoseconds.
A different precision can be specified, see the [HTTP syntax](/influxdb/v0.13/write_protocols/write_syntax/#http) for details.
We recommend using the least precise precision possible as this can result in
significant improvements in compression.

### Key-value Separator

Tag keys and values, and field keys and values must be separated by the equals sign `=` without spaces.

### Escaping Characters

If a tag key, tag value, or field key contains a space ` `, comma `,`, or an equals sign `=` it must be escaped using the backslash character `\`.
Backslash characters do not need to be escaped.
Commas `,` and spaces ` ` will also need to be escaped for measurements, though equals signs `=` do not.

### Comments

`#` at the beginning of the line is a valid comment character for the line protocol.
All subsequent characters are ignored.

### Data Types

Measurements, tag keys, tag values, and field keys are always stored as strings in the database.

`string` values have a length limit of 64 KB.
All Unicode characters should be valid, although commas and spaces require escaping.
Backslash characters do not require escaping, but may not be used directly preceding a comma or space.
(Note that `string` field values have different quoting and escaping rules than the measurement, tag, and field name `string` syntax.) The field `location="us-west"` stores a string value.

Field values may be stored as `float64`, `int64`, `boolean`, or `string`.
All subsequent field values must match the type of the first point written to given measurement.

`float64` values are the default numerical type.
`1` is a float, `1i` is an integer.

`int64` values must have a trailing `i`.
The field `bikes_present=15i` stores an integer and the field `bikes_present=15` stores a float.

`boolean` values are `t`, `T`, `true`, `True`, or `TRUE` for TRUE, and  `f`, `F`, `false`, `False`, or `FALSE` for FALSE

`string` values for field values must be double-quoted.
Double-quotes contained within the string must be escaped.
All other characters are supported without escaping.

### Examples

#### Simplest Valid Point (measurement + field)
```
disk_free value=442221834240i
```

#### With Timestamp
```
disk_free value=442221834240i 1435362189575692182
```

#### With Tags
```
disk_free,hostname=server01,disk_type=SSD value=442221834240i
```

#### With Tags, With Timestamp
```
disk_free,hostname=server01,disk_type=SSD value=442221834240i 1435362189575692182
```

#### Multiple Fields
```
disk_free free_space=442221834240i,disk_type="SSD" 1435362189575692182
```

#### Escaping Commas and Spaces
```
total\ disk\ free,volumes=/net\,/home\,/ value=442221834240i 1435362189575692182
```

In the above example, the measurement is written as `total disk free` and the tag key `volumes` has a tag value of `/net,/home,/`

#### Escaping Equals Signs
```
disk_free,a\=b=y\=z value=442221834240i
```

In the above example, the tag key `a=b` has a tag value of `y=z`

#### With Backslash in Tag Value
```
disk_free,path=C:\Windows value=442221834240i
```

Backslashes do not need to be escaped when used in strings.
Unless followed by a comma, space, or equals sign backslashes are treated as a normal character.

#### Escaping Field Key
```
disk_free value=442221834240i,working\ directories="C:\My Documents\Stuff for examples,C:\My Documents"
```

In the above example, the second field key is `working directories` and the corresponding field value is `C:\My Documents\Stuff for examples,C:\My Documents`.

#### Showing all escaping and quoting behavior

```
"measurement\ with\ quotes",tag\ key\ with\ spaces=tag\,value\,with"commas" field_key\\\\="string field value, only \" need be quoted"
```

In the above example, the measurement is `"measurement with quotes"`, the tag key is `tag key with spaces`, the
tag value is `tag,value,with"commas"`, the field key is `field_key\\\\` and the field value is `string field value, only " need be quoted`.

### Caveats

If you write points in a batch all points without explicit timestamps will receive the same timestamp when inserted.
Since a point is defined only by its measurement, tag set, and timestamp, that can lead to duplicate points.
When InfluxDB encounters a duplicate point, the [field set](/influxdb/v0.13/concepts/glossary/#field-set) becomes the union of the old field set and the new field set, where any ties go to the new field set.
It is a best practice to provide explicit timestamps with all points.

Measurements, tag keys, tag values, and field keys are never quoted.
Spaces and commas must be escaped.
Field values that are stored as strings must always be double-quoted.
Only double-quotes should be escaped.

Querying measurements or tags that contain double-quotes `"` can be difficult, since double-quotes are also the syntax for an identifier.
It's possible to work around the limitations with regular expressions but it's not easy.

Avoid using Keywords as identifiers (database names, retention policy names, measurement names, tag keys, or field keys) whenever possible.
Keywords in InfluxDB are referenced on the [InfluxQL Syntax](/influxdb/v0.13/query_language/spec/#keywords) page.
There is no need to quote or escape keywords in the write syntax.

All values in InfluxDB are case-sensitive: `MyDB` != `mydb` != `MYDB`.
The exception is Keywords, which are case-insensitive.

## CLI

To write points using the command line interface, use the `insert` command.

#### Write a Point with the CLI

```bash
> insert disk_free,hostname=server01 value=442221834240i 1435362189575692182
```

The CLI will return nothing on success and should give an informative parser error if the point cannot be written.
See [InfluxDB CLI/Shell](/influxdb/v0.13/tools/shell/#import-data-from-a-file-with-import) for how to import data from a file using the CLI.

## HTTP

To write points using HTTP, POST to the `/write` endpoint at port `8086`.
You must specify the target database in the query string using `db=<target_database>`.

You may optionally provide a target retention policy, specify the precision of any supplied timestamps, and pass any required authentication in the query string.

Successful writes will return a `204` HTTP Status Code.
Writes will return a `400` for invalid syntax.

### Query String Parameters for Writes

The following query string parameters can be passed as part of the GET string when using the HTTP API:

- `db=<database>` REQUIRED - sets the target database for the write
- `rp=<retention_policy>` - sets the target retention policy for the write.
If not present the default retention policy is used
- `u=<username>`, `p=<password>` - if authentication is enabled, you must authenticate as a user with write permissions to the target database
- `precision=[n,u,ms,s,m,h]` - sets the precision of the supplied Unix time values.
If not present timestamps are assumed to be in nanoseconds

#### Write a Point with `curl`

```bash
curl -X POST 'http://localhost:8086/write?db=mydb' --data-binary 'disk_free,hostname=server01 value=442221834240i 1435362189575692182'
```

#### Write a Point to a non-default Retention Policy

Use the `rp=<retention_policy` query string parameter to supply a target retention policy.
If not specified, the default retention policy for the target database will be used.

```bash
curl -X POST 'http://localhost:8086/write?db=mydb&rp=six_month_rollup' --data-binary 'disk_free,hostname=server01 value=442221834240i 1435362189575692182'
```

#### Write a Point Using Authentication

Use the `u=<user>` and `p=<password>` to pass the authentication details, if required.

```bash
curl -X POST 'http://localhost:8086/write?db=mydb&u=root&p=123456' --data-binary 'disk_free,hostname=server01 value=442221834240i 1435362189575692182'
```

#### Specify Non-nanosecond Timestamps

Use the `precision=[n,u,ms,s,m,h]` query string parameter to supply a precision for the timestamps.

All timestamps are assumed to be Unix nanoseconds unless otherwise specified.
If you provide timestamps in any unit other than nanoseconds, you must supply the appropriate precision in the URL query string.
Use `n`, `u`, `ms`, `s`, `m`, and `h` for nanoseconds, microseconds, milliseconds, seconds, minutes, and hours, respectively.

```bash
curl -X POST 'http://localhost:8086/write?db=mydb&precision=ms' --data-binary 'disk_free value=442221834240i 1435362189575'
```

#### Write a Batch of Points with `curl`

You can also pass a file using the `@` flag.
The file can contain a batch of points, one per line.
Points must be separated by newline characters `\n`.
We recommend writing points in batches of 5,000 to 10,000 points.
Smaller batches, and more HTTP requests, will result in sub-optimal performance.

`curl -X POST 'http://localhost:8086/write?db=<database>' --data-binary @<filename>`

### Caveats

Use `curl`'s `--data-binary` encoding method for all writes in the line protocol format.
Using any encoding method other than `--data-binary` is likely to lead to issues with writing points.
`-d`, `--data-urlencode`, and `--data-ascii` may all strip out newlines or introduce new unintended formatting.

When passing a file to `curl`, the points must be separated by newline characters only (`\n`).
Files containing carriage returns will cause parser errors.
