









Yield indicates that the stream received by the yield operation should be delivered as a result of the query.
A query may have multiple results, each identified by the name provided to yield.

Yield outputs the input stream unmodified.

Yield has the following properties:

* `name` string
    unique name to give to yielded results

Example:
`from(bucket: "telegraf/autogen") |> range(start: -5m) |> yield(name:"1")`

**Note:** The `yield` function produces side effects.
