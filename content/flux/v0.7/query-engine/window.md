









Window groups records based on a time value.
New columns are added to uniquely identify each window and those columns are added to the group key of the output tables.

A single input record will be placed into zero or more output tables, depending on the specific windowing function.

Window has the following properties:

* `every` duration
    Duration of time between windows.
    Defaults to `period`'s value
    One of `every`, `period` or `intervals` must be provided.
* `period` duration
    Duration of the window.
    Period is the length of each interval.
    It can be negative, indicating the start and stop boundaries are reversed.
    Defaults to `every`'s value
    One of `every`, `period` or `intervals` must be provided.
* `offset` time
    The offset duration relative to the location offset.
    It can be negative, indicating that the offset goes backwards in time.
    The default aligns the window boundaries to line up with the `now` option time.
* `intervals` function that returns an interval generator
    A set of intervals to be used as the windows.
    One of `every`, `period` or `intervals` must be provided.
    When `intervals` is provided, `every`, `period`, and `offset` must be zero.
* `timeCol` string
    Name of the time column to use.
    Defaults to `_time`.
* `startCol` string
    Name of the column containing the window start time.
    Defaults to `_start`.
* `stopCol` string
    Name of the column containing the window stop time.
    Defaults to `_stop`.

Example:
```
from(bucket:"telegraf/autogen")
    |> range(start:-12h)
    |> window(every:10m)
    |> max()
```

```
window(every:1h) // window the data into 1 hour intervals
window(intervals: intervals(every:1d, period:8h, offset:9h)) // window the data into 8 hour intervals starting at 9AM every day.
```
