









Shift add a fixed duration to time columns.
The output table schema is the same as the input table.

Shift has the following properties:

* `shift` duration
    shift is the amount to add to each time value.
    May be a negative duration.
* `columns` list of strings
    columns is the list of all columns that should be shifted.
    Defaults to `["_start", "_stop", "_time"]`
Example:
```
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> shift(shift: 1000h)
```
