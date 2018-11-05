







Range filters records based on provided time bounds.
Each input tables records are filtered to contain only records that exist within the time bounds.
Each input table's group key value is modified to fit within the time bounds.
Tables where all records exists outside the time bounds are filtered entirely.


[IMPL#244](https://github.com/influxdata/platform/issues/244) Update range to default to aligned window ranges.

Range has the following properties:

* `start` duration or timestamp
    Specifies the oldest time to be included in the results
* `stop` duration or timestamp
    Specifies the exclusive newest time to be included in the results.
    Defaults to the value of the `now` option time.

Example:
```
from(bucket:"telegraf/autogen")
    |> range(start:-12h, stop: -15m)
    |> filter(fn: (r) => r._measurement == "cpu" AND
               r._field == "usage_system")
```
Example:
```
from(bucket:"telegraf/autogen")
    |> range(start:2018-05-22T23:30:00Z, stop: 2018-05-23T00:00:00Z)
    |> filter(fn: (r) => r._measurement == "cpu" AND
               r._field == "usage_system")
```
