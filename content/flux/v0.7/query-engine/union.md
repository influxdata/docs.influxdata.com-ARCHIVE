










Union concatenates two or more input streams into a single output stream.  In tables that have identical
schema and group keys, contents of the tables will be concatenated in the output stream.  The output schemas of
the Union operation shall be the union of all input schemas.

Union does not preserve the sort order of the rows within tables. A sort operation may be added if a specific sort order is needed.

Union has the following properties:
* `tables` a list of streams
    tables specifies the streams to union together.  There must be at least two streams.

For example, given this stream, `SF_Weather` with group key `"_field"` on both tables:

   |  _time |  _field |  _value |
   | ----- | ------ | ------ |
   | 0001  | "temp" | 70 |
   | 0002  | "temp" | 75 |

   | _time | _field | _value |
   | ----- | ------ | ------ |
   | 0001  | "humidity" | 81 |
   | 0002  | "humidity" | 82 |

And this stream, `NY_Weather`, also with group key `"_field"` on both tables:

   | _time | _field | _value |
   | ----- | ------ | ------ |
   | 0001  | "temp" | 55 |
   | 0002  | "temp" | 56 |

   | _time | _field | _value |
   | ----- | ------ | ------ |
   | 0001  | "pressure" | 29.82 |
   | 0002  | "pressure" | 30.01 |

`union(tables: [SF_Weather, NY_Weather])` produces this stream (whose tables are grouped by `"_field"`):

   | _time | _field | _value |
   | ----- | ------ | ------ |
   | 0001  | "temp" | 70 |
   | 0002  | "temp" | 75 |
   | 0001  | "temp" | 55 |
   | 0002  | "temp" | 56 |

   | _time | _field | _value |
   | ----- | ------ | ------ |
   | 0001  | "humidity" | 81 |
   | 0002  | "humidity" | 82 |

   | _time | _field | _value |
   | ----- | ------ | ------ |
   | 0001  | "pressure" | 29.82 |
   | 0002  | "pressure" | 30.01 |
