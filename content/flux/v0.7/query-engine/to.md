









The To operation takes data from a stream and writes it to a bucket.
To has the following properties:

* `bucket` string  
    The bucket to which data will be written.
* `bucketID` string  
    The ID of the bucket to which data will be written.
* `org` string  
    The organization name of the above bucket.
* `orgID` string  
    The organization ID of the above bucket.
* `host` string  
    The remote host to write to.
* `token` string  
    The authorization token to use when writing to a remote host.
* `timeColumn` string  
    The time column of the output.  
    **Default:** `"_time"`
* `tagColumns` list of strings  
    The tag columns of the output.  
    **Default:** All columns of type string, excluding all value columns and the `_field` column if present.
* `fieldFn` function(record) object  
    Function that takes a record from the input table and returns an object.  
    For each record from the input table `fieldFn` returns on object that maps output field key to output value.  
    **Default:** `(r) => ({ [r._field]: r._value })`

Either `bucket` or `bucketID` is required.
Both are mutually exclusive.
Similarly `org` and `orgID` are mutually exclusive and only required when writing to a remote host.
Both `host` and `token` are optional parameters, however if `host` is specified, `token` is required.


For example, given the following table:

| _time | _start | _stop | _measurement | _field | _value |
| ----- | ------ | ----- | ------------ | ------ | ------ |
| 0005  | 0000   | 0009  | "a"          | "temp" | 100.1  |
| 0006  | 0000   | 0009  | "a"          | "temp" | 99.3   |
| 0007  | 0000   | 0009  | "a"          | "temp" | 99.9   |

The default `to` operation `to(bucket:"my-bucket", org:"my-org")` is equivalent to writing the above data using the following line protocol:

```
_measurement=a temp=100.1 0005
_measurement=a temp=99.3 0006
_measurement=a temp=99.9 0007
```

For an example overriding `to`'s default settings, given the following table:

| _time | _start | _stop | tag1 | tag2 | hum | temp |
| ----- | ------ | ----- | ---- | ---- | ---- | ---- |
| 0005  | 0000   | 0009  | "a"  | "b"  | 55.3 | 100.1  |
| 0006  | 0000   | 0009  | "a"  | "b"  | 55.4 | 99.3   |
| 0007  | 0000   | 0009  | "a"  | "b"  | 55.5 | 99.9   |

The operation `to(bucket:"my-bucket", org:"my-org", tagColumns:["tag1"], fieldFn: (r) => return {"hum": r.hum, "temp": r.temp})` is equivalent to writing the above data using the following line protocol:

```
_tag1=a hum=55.3,temp=100.1 0005
_tag1=a hum=55.4,temp=99.3 0006
_tag1=a hum=55.5,temp=99.9 0007
```

**Note:** The `to` function produces side effects.
