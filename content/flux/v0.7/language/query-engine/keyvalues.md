









KeyValues outputs a table with the input table's group key, plus two columns  `_key` and `_value` that correspond to unique
(column, value) pairs from the input table.  

KeyValues has the following properties:
*  `keyCols` list of strings
   A list of columns from which values are extracted
*  `fn` schema function that may by used instead of `keyCols` to identify the set of columns.  

Additional requirements:
*  Only one of `keyCols` or `fn` may be used in a single call.  
*  All columns indicated must be of the same type.

```
from(bucket: "telegraf/autogen")
    |> range(start: -30m)
    |> filter(fn: (r) => r._measurement == "cpu")
    |> keyValues(keyCols: ["usage_idle", "usage_user"])
```

```
from(bucket: "telegraf/autogen")
    |> range(start: -30m)
    |> filter(fn: (r) => r._measurement == "cpu")
    |> keyValues(fn: (schema) => schema.columns |> filter(fn:(v) =>  v.label =~ /usage_.*/))
```

```
filterCols = (fn) => (schema) => schema.columns |> filter(fn:(v) => fn(col:v))

from(bucket: "telegraf/autogen")
    |> range(start: -30m)
    |> filter(fn: (r) => r._measurement == "cpu")
    |> keyValues(fn: filterCols(fn: (col) => col.label =~ /usage_.*/))
```
