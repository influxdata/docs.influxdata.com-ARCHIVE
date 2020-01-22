---
title: Using the HTTP input plugin
description:
menu:
  telegraf_1_13:
    name: Using HTTP plugin
    weight: 30
    parent: Plugins
---

The HTTP input plugin collects metrics from one or more HTTP(S) URL endpoints. The endpoint should have metrics formatted in one of the supported input data formats.

Note: Each data format has its own unique set of configuration options which may need to be added to the input configuration. See <data format link>.

## Configure the HTTP Input plugin
To retrieve data from an HTTP url endpoint, enable the `inputs.http` input plugin in the `telegraf.conf`.

Specify the following options:

### `urls`
One or more URLs from which you wanted to read metrics from.

### `method`
Action to perform for a given HTTP resource. Requests using the default configuration `method = “GET”` value will perform the action to retrieve data from your HTTP endpoint.

### `data_format`
The format of the data in the HTTP endpoints that Telegraf will ingest.
Each data format has its own unique set of configuration options that you'll need to add.  
[list of data formats that links to parser information]


## Telegraf Parsers

### JSON
#### strict
When strict is set to true, all objects in the JSON array must be valid

#### `json_query`
To parse only a specific portion of JSON, you need to specific the `json_query`, otherwise the whole document will be parsed.  The `json_query` is a GJSON path that can be used to limit the portion of the overall JSON document that should be parsed. The result of the query should contain a JSON object or an array of objects.
Refer to the GJSON path syntax for details and examples or test out your query on the GJSON playground.
https://github.com/influxdata/telegraf/tree/master/plugins/parsers/json#query

#### tag_keys
List of one or more JSON keys that should be added as tags.

#### json_string_fields
List of one or more string keys in your JSON file that need to be configured as string type fields.

#### json_name_key
A key in your JSON file to be used as the measurement name.

#### json_time_key
Key from the JSON file that will be used in creating the timestamp metric.  If no key is specified, the time that the data is read will be set as the timestamp.

#### json_time_format
The format used to interpret the designated `json_time_key`.  The time must be set to `unix`, `unix_ms`, `unix_us`, `unix_ns`, or a time in Go “reference time”
Ex: `json_time_format = "2006-01-02T15:04:05Z07:00"``

#### json_timezone
When parsing times that don't include a timezone specifier, times are assumed to be UTC. To default to another timezone, or to local time, specify the json_timezone option. This option should be set to a Unix TZ value, such as America/New_York, to Local to utilize the system timezone, or to UTC.


[EXAMPLE Configurations]

### CSV

#### csv_header_row_count
This field indicates how many rows to treat as a header. By default, the parser assumes there is no header and will parse the first row as data. If set to anything more than 1, column names will be concatenated with the name listed in the next header row. If `csv_column_names` is specified, the column names in header will be overridden.

#### csv_column_names
For assigning custom names to columns. If this is specified, all columns should have a name unnamed columns will be ignored by the parser.  If `csv_header_row_count` is set to 0, this config must be used

#### csv_timestamp_column, csv_timestamp_format
By default, the current time will be used for all created metrics, to set the time using the JSON document you can use the csv_timestamp_column and csv_timestamp_format options together to set the time to a value in the parsed document.

The csv_timestamp_column option specifies the key containing the time value and csv_timestamp_format must be set to unix, unix_ms, unix_us, unix_ns, or a format string in using the Go "reference time" which is defined to be the specific time: Mon Jan 2 15:04:05 MST 2006.

#### Example
`[agent]
  debug = true

[[outputs.influxdb]]
  urls = ["http://influxdb:8086"]
  database = "telegraf"

[[inputs.tail]]
  files = ["/data/**.csv"]
  from_beginning = true

  data_format = "csv"
  csv_header_row_count = 1
  csv_trim_space = true

  csv_tag_columns = ["ComputerName", "UserName", "ProcessName"]

#   csv_timestamp_column = "Time"
#   csv_timestamp_format = "02.01.2006 15.04.05"`
