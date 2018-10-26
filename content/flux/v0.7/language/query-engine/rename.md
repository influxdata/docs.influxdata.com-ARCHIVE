







Rename will rename specified columns in a table.
There are two variants: one which takes a map of old column names to new column names,
and one which takes a mapping function.
If a column is renamed and is part of the group key, the column name in the group key will be updated.

Rename has the following properties:
* `columns` object
	A map of columns to rename and their corresponding new names. Cannot be used with `fn`.
* `fn` function
    A function which takes a single string parameter (the old column name) and returns a string representing
    the new column name. Cannot be used with `columns`.

Example usage:

Rename a single column:
```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> rename(columns:{host: "server"})
```
Rename all columns using `fn` parameter:
```
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> rename(fn: (col) => "{col}_new")
```
