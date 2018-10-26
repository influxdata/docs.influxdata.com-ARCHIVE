









Difference computes the difference between subsequent non null records.

Difference has the following properties:

* `nonNegative` bool
    nonNegative indicates if the derivative is allowed to be negative.
    If a value is encountered which is less than the previous value then it is assumed the previous value should have been a zero.
* `columns` list strings
    columns is a list of columns on which to compute the difference.

```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_user")
    |> difference()
```
