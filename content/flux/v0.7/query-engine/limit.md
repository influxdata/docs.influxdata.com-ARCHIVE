







Limit caps the number of records in output tables to a fixed size n.
One output table is produced for each input table.
The output table will contain the first n records from the input table.
If the input table has less than n records all records will be output.

Limit has the following properties:

* `n` int
    The maximum number of records to output.

Example: `from(bucket: "telegraf/autogen") |> limit(n: 10)`
