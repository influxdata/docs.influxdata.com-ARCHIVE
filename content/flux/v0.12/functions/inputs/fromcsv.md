---
title: fromCSV() function
description: The fromCSV() function retrieves data from a CSV data source.
menu:
  flux_0_12:
    name: fromCSV
    parent: Inputs
    weight: 1
---

The `fromCSV()` function retrieves data from a comma-separated value (CSV) data source.
It returns a stream of tables.
Each unique series is contained within its own table.
Each record in the table represents a single point in the series.

_**Function type:** Input_  
_**Output data type:** Object_

```js
fromCSV(file: "/path/to/data-file.csv")

// OR

fromCSV(csv: csvData)
```

## Parameters

### file
The file path of the CSV file to query.
The path can be absolute or relative.
If relative, it is relative to the working directory of the `influxd` process.

_**Data type:** String_

### csv
Raw CSV-formatted text.

> CSV data must be in the CSV format produced by the Flux HTTP response standard.
> See the [Flux technical specification](https://github.com/influxdata/flux/blob/master/docs/SPEC.md#csv)
> for information about this format.


_**Data type:** String_

## Examples

### Query CSV data from a file
```js
fromCSV(file: "/path/to/data-file.csv")
```

### Query raw CSV-formatted text
```js
csvData = "
result,table,_start,_stop,_time,region,host,_value
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:00Z,east,A,15.43
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:20Z,east,B,59.25
mean,0,2018-05-08T20:50:00Z,2018-05-08T20:51:00Z,2018-05-08T20:50:40Z,east,C,52.62
"

fromCSV(csv: csvData)
```
