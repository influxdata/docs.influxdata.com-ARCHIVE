







Selector operations output a table for every input table they receive.
A single column on which to operate must be provided to the operation.

Any output table will have the following properties:

* It will have the same group key as the input table.
* It will contain the same columns as the input table.
* It will have a column `_time` which represents the time of the selected record.
    This can be set as the value of any time column on the input table.
    By default the `_stop` time column is used.

All selector operations have the following properties:

* `column` string
    column specifies a which column to use when selecting.

##### First

First is a selector operation.
First selects the first non null record from the input table.

Example:
`from(bucket:"telegraf/autogen") |> first()`

##### Last

Last is a selector operation.
Last selects the last non null record from the input table.

Example:
`from(bucket: "telegraf/autogen") |> last()`

##### Max

Max is a selector operation.
Max selects the maximum record from the input table.

Example:
```
from(bucket:"telegraf/autogen")
    |> range(start:-12h)
    |> filter(fn: (r) => r._measurement == "cpu" AND r._field == "usage_system")
    |> max()
```

##### Min

Min is a selector operation.
Min selects the minimum record from the input table.

Example:

```
from(bucket:"telegraf/autogen")
    |> range(start:-12h)
    |> filter(fn: (r) => r._measurement == "cpu" AND r._field == "usage_system")
    |> min()
```

##### Percentile (selector)

Percentile is both an aggregate operation and a selector operation depending on selected options.
In the aggregate methods, it outputs the value that represents the specified percentile of the non null record as a float.

Percentile has the following properties:

* `column` string
    column indicates which column will be used for the percentile computation. Defaults to `"_value"`
* `percentile` float
    A value between 0 and 1 indicating the desired percentile.
* `method` string
    percentile provides 3 methods for computation:
    * `estimate_tdigest`: See Percentile (Aggregate)
    * `exact_mean`: See Percentile (Aggregate)
    * `exact_selector`: a selector result that returns the data point for which at least `percentile` points are less than.

Example:
```
// Determine 99th percentile cpu system usage:
from(bucket: "telegraf/autogen")
	|> range(start: -5m)
	|> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
	|> percentile(p: 0.99, method: "exact_selector")
```


##### Sample

Sample is a selector operation.
Sample selects a subset of the records from the input table.

The following properties define how the sample is selected.

* `n`
    Sample every Nth element
* `pos`
    Position offset from start of results to begin sampling.
    The `pos` must be less than `n`.
    If `pos` is less than 0, a random offset is used.
    Default is -1 (random offset).

Example:

```
from(bucket:"telegraf/autogen")
    |> filter(fn: (r) => r._measurement == "cpu" AND
               r._field == "usage_system")
    |> range(start:-1d)
    |> sample(n: 5, pos: 1)
```
