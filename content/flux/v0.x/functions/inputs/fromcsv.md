---
title: fromCSV() function
description: The fromCSV() function retrieves data from a CSV data source.
menu:
  flux_0_x:
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
from(file: "/path/to/data-file.csv")

// OR

from(csv: csvData)
```

## Parameters

### file
The file path of the CSV file to query.
The path can be absolute or relative.
If relative, it is relative to the working directory of the `influxd` process.

_**Data type:** String_

### csv
Raw CSV-formatted text.

_**Data type:** String_

## Examples

### Query CSV data from a file
```js
from(file: "/path/to/data-file.csv")
```

### Query raw CSV-formatted text
```js
csvData = "
_time,_measurement,_field,_value
2018-05-22T19:53:24.421470485Z,mem,percent_used,56.4
2018-05-22T19:53:25.421470485Z,mem,percent_used,52.3
2018-05-22T19:53:26.421470485Z,mem,percent_used,55.8
"

from(csv: csvData)
```
