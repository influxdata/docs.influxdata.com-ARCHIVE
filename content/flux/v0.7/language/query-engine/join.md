









Join merges two or more input streams, whose values are equal on a set of common columns, into a single output stream.
The resulting schema is the union of the input schemas, and the resulting group key is the union of the input group keys.
**Join** has the following properties:

* `tables` object  
    The map of streams to be joined.  
* `on` list of strings  
    The list of columns on which to join.  
* `method` string  
    The method of join.  
    **Default:** `"inner"`  
    **Possible Values:** `"inner", "cross", "left", "right", "full"`  

Both `tables` and `on` are required parameters.
The `on` parameter and the `cross` method are mutually exclusive.
Join currently only supports two input streams.

[IMPL#83](https://github.com/influxdata/flux/issues/83) Add support for joining more than 2 streams  
[IMPL#84](https://github.com/influxdata/flux/issues/84) Add support for different join types  

Example:

Given the following two streams of data:

* SF_Temperature

    | _time | _field | _value |
    | ----- | ------ | ------ |
    | 0001  | "temp" | 70     |
    | 0002  | "temp" | 75     |
    | 0003  | "temp" | 72     |

* NY_Temperature

    | _time | _field | _value |
    | ----- | ------ | ------ |
    | 0001  | "temp" | 55     |
    | 0002  | "temp" | 56     |
    | 0003  | "temp" | 55     |

And the following join query:

    join(tables: {sf: SF_Temperature, ny: NY_Temperature}, on: ["_time", "_field"])

The output will be:

| _time | _field | _value_ny | _value_sf |
| ----- | ------ |---------- | --------- |
| 0001  | "temp" | 55        | 70        |
| 0002  | "temp" | 56        | 75        |
| 0003  | "temp" | 55        | 72        |


##### output schema

The column schema of the output stream is the union of the input schemas, and the same goes for the output group key.
Columns that must be renamed due to ambiguity (i.e. columns that occur in more than one input stream) are renamed
according to the template `<column>_<table>`.

Example:

* SF_Temperature
* Group Key for table `{ _field }`

    | _time | _field | _value |
    | ----- | ------ | ------ |
    | 0001  | "temp" | 70     |
    | 0002  | "temp" | 75     |
    | 0003  | "temp" | 72     |

* NY_Temperature
* Group Key for all tables `{ _time, _field }`

    | _time | _field | _value |
    | ----- | ------ | ------ |
    | 0001  | "temp" | 55     |

    | _time | _field | _value |
    | ----- | ------ | ------ |
    | 0002  | "temp" | 56     |

    | _time | _field | _value |
    | ----- | ------ | ------ |
    | 0003  | "temp" | 55     |

`join(tables: {sf: SF_Temperature, ny: NY_Temperature}, on: ["_time"])` produces:

* Group Key for all tables `{ _time, _field_ny, _field_sf }`

    | _time | _field_ny | _field_sf | _value_ny | _value_sf |
    | ----- | --------- | --------- |---------- | --------- |
    | 0001  | "temp"    | "temp"    | 55        | 70        |

    | _time | _field_ny | _field_sf | _value_ny | _value_sf |
    | ----- | --------- | --------- |---------- | --------- |
    | 0002  | "temp"    | "temp"    | 56        | 75        |

    | _time | _field_ny | _field_sf | _value_ny | _value_sf |
    | ----- | --------- | --------- |---------- | --------- |
    | 0003  | "temp"    | "temp"    | 55        | 72        |
