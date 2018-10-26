









Keys outputs a table with the input table's group key columns, plus a `_value` column containing the names of the input table's columns.  

Keys has the following property:
*  `except` list of strings
   Do not include the given names in the output.  Defaults to `["_time", "_value"]`

```
from(bucket: "telegraf/autogen")
    |> range(start: -30m)
    |> keys(except: ["_time", "_start", "_stop", "_field", "_measurement", "_value"])
```
