









FromRows is a special application of pivot that will automatically align fields within each measurement that have the same time stamp.
Its definition is:

```
  fromRows = (bucket) => from(bucket:bucket) |> pivot(rowKey:["_time"], colKey: ["_field"], valueCol: "_value")
```

Example:

```
fromRows(bucket:"telegraf/autogen")
  |> range(start: 2018-05-22T19:53:26Z)
```
