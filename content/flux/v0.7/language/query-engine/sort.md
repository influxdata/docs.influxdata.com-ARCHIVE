












Sorts orders the records within each table.
One output table is produced for each input table.
The output tables will have the same schema as their corresponding input tables.

Sort has the following properties:

* `columns` list of strings
    List of columns used to sort; precedence from left to right.
    Default is `["_value"]`
* `desc` bool
    Sort results in descending order.

Example:
```
from(bucket:"telegraf/autogen")
    |> filter(fn: (r) => r._measurement == "system" AND
               r._field == "uptime")
    |> range(start:-12h)
    |> sort(cols:["region", "host", "value"])
```
