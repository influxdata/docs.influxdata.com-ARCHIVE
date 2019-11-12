---
title: Extract scalar values in Flux
description: >
  Use Flux stream and table functions to extract scalar values from Flux query output.
  This lets you, for example, dynamically set variables using query results.
menu:
  flux_0_50:
    name: Extract scalar values
    parent:  Guides
weight: 10
---

Use Flux [stream and table functions](/flux/v0.50/stdlib/built-in/transformations/stream-table/)
to extract scalar values from Flux query output.
This lets you, for example, dynamically set variables using query results.

**To extract scalar values from output:**

1. [Extract a table](#extract-a-table).
2. [Extract a column from the table](#extract-a-column-from-the-table)
   _**or**_ [extract a row from the table](#extract-a-row-from-the-table).

_The samples on this page use the [sample data provided below](#sample-data)._

{{% warn %}}
#### Current limitations
- The InfluxDB user interface (UI) does not currently support raw scalar output.
  Use [`map()`](/flux/v0.50/stdlib/built-in/transformations/map/) to add
  scalar values to output data.
- The [Flux REPL](/flux/v0.50/guides/executing-queries/#influx-cli-in-flux-mode) does not currently support
  Flux stream and table functions (also known as "dynamic queries").
  See [#15321](https://github.com/influxdata/influxdb/issues/15231).
{{% /warn %}}

## Extract a table
Flux formats query results as a stream of tables.
To extract a scalar value from a stream of tables, you must first extract a single table.

to extract a single table from the stream of tables.

{{% note %}}
If query results include only one table, it is still formatted as a stream of tables.
You still must extract that table from the stream.
{{% /note %}}

Use [`tableFind()`](/flux/v0.50/stdlib/built-in/transformations/stream-table/tablefind/)
to extract the **first** table whose [group key](/flux/v0.50/introduction/getting-started/#group-keys)
values match the `fn` predicate function.
The predicate function requires a `key` object, which represents the group key of
each table.

```js
sampleData
  |> tableFind(fn: (key) =>
      key._field == "temp" and
      key.location == "sfo"
  )
```

The example above returns a single table:

| _time                | location | _field | _value |
|:-----                |:--------:|:------:| ------:|
| 2019-11-01T12:00:00Z | sfo      | temp   | 65.1   |
| 2019-11-01T13:00:00Z | sfo      | temp   | 66.2   |
| 2019-11-01T14:00:00Z | sfo      | temp   | 66.3   |
| 2019-11-01T15:00:00Z | sfo      | temp   | 66.8   |

{{% note %}}
#### Extract the correct table
Flux functions do not guarantee table order and `tableFind()` returns only the
**first** table that matches the `fn` predicate.
To extract the table that includes the data you actually want, be very specific in
your predicate function or filter and transform your data to minimize the number
of tables piped-forward into `tableFind()`.
{{% /note %}}

## Extract a column from the table
Use the [`getColumn()` function](/flux/v0.50/stdlib/built-in/transformations/stream-table/getcolumn/)
to output an array of values from a specific column in the extracted table.


```js
sampleData
  |> tableFind(fn: (key) =>
      key._field == "temp"  and
      key.location == "sfo"
  )
  |> getColumn(column: "_value")

// Returns [65.1, 66.2, 66.3, 66.8]
```

### Use extracted column values
Use a variable to store the array of values.
In the example below, `SFOTemps` represents the array of values.
Reference a specific index (integer starting from `0`) in the array to return the
value at that index.

```js
SFOTemps = sampleData
  |> tableFind(fn: (key) =>
      key._field == "temp" and
      key.location == "sfo"
  )
  |> getColumn(column: "_value")

SFOTemps
// Returns [65.1, 66.2, 66.3, 66.8]

SFOTemps[0]
// Returns 65.1

SFOTemps[2]
// Returns 66.3
```

## Extract a row from the table
Use the [`getRecord()` function](/flux/v0.50/stdlib/built-in/transformations/stream-table/getrecord/)
to output data from a single row in the extracted table.
Specify the index of the row to output using the `idx` parameter.
The function outputs an object with key-value pairs for each column.

```js
sampleData
  |> tableFind(fn: (key) =>
      key._field == "temp" and
      key.location == "sfo"
  )
  |> getRecord(idx: 0)

// Returns {
//   _time:2019-11-11T12:00:00Z,
//   _field:"temp",
//   location:"sfo",
//   _value: 65.1
// }
```

### Use an extracted row object
Use a variable to store the extracted row object.
In the example below, `tempInfo` represents the extracted row.
Use [dot notation](/flux/v0.50/introduction/getting-started/syntax-basics/#objects)
to reference keys in the object.

```js
tempInfo = sampleData
  |> tableFind(fn: (key) =>
      key._field == "temp" and
      key.location == "sfo"
  )
  |> getRecord(idx: 0)

tempInfo
// Returns {
//   _time:2019-11-11T12:00:00Z,
//   _field:"temp",
//   location:"sfo",
//   _value: 65.1
// }

tempInfo._time
// Returns 2019-11-11T12:00:00Z

tempInfo.location
// Returns sfo
```

## Example helper functions
Create custom helper functions to extract scalar values from query output.

##### Extract a scalar field value
```js
// Define a helper function to extract field values
getFieldValue = (tables=<-, field) => {
  extract = tables
    |> tableFind(fn: (key) => key._field == field)
    |> getColumn(column: "_value")
  return extract[0]
}

// Use the helper function to define a variable
lastJFKTemp = sampleData
  |> filter(fn: (r) => r.location == "kjfk")
  |> last()
  |> getFieldValue(field: "temp")

lastJFKTemp
// Returns 71.2
```

##### Extract scalar row data
```js
// Define a helper function to extract a row as an object
getRow = (tables=<-, field, idx=0) => {
  extract = tables
    |> tableFind(fn: (key) => true)
    |> getRecord(idx: idx)
  return extract
}

// Use the helper function to define a variable
lastReported = sampleData
  |> last()
  |> getRow(idx: 0)

"The last location to report was ${lastReported.location}.
The temperature was ${string(v: lastReported._value)}°F."

// Returns:
// The last location to report was kord.
// The temperature was 38.9°F.
```

---

## Sample data

The following sample data set represents fictional temperature metrics collected
from three locations.
It's formatted in annotated CSV and imported into the Flux query using the
[`csv.from()` function](/flux/v0.50/stdlib/csv/from/).

Place the following at the beginning of your query to use the sample data:

{{% truncate %}}
```js
import "csv"

sampleData = csv.from(csv: "
#datatype,string,long,dateTime:RFC3339,string,string,double
#group,false,true,false,true,true,false
#default,,,,,,
,result,table,_time,location,_field,_value
,,0,2019-11-01T12:00:00Z,sfo,temp,65.1
,,0,2019-11-01T13:00:00Z,sfo,temp,66.2
,,0,2019-11-01T14:00:00Z,sfo,temp,66.3
,,0,2019-11-01T15:00:00Z,sfo,temp,66.8
,,1,2019-11-01T12:00:00Z,kjfk,temp,69.4
,,1,2019-11-01T13:00:00Z,kjfk,temp,69.9
,,1,2019-11-01T14:00:00Z,kjfk,temp,71.0
,,1,2019-11-01T15:00:00Z,kjfk,temp,71.2
,,2,2019-11-01T12:00:00Z,kord,temp,46.4
,,2,2019-11-01T13:00:00Z,kord,temp,46.3
,,2,2019-11-01T14:00:00Z,kord,temp,42.7
,,2,2019-11-01T15:00:00Z,kord,temp,38.9
")
```
{{% /truncate %}}
