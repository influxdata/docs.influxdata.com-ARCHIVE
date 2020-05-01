---
title: Group data in InfluxDB with Flux
list_title: Group
description: >
  Use the [`group()` function](/flux/v0.65/stdlib/built-in/transformations/group)
  to group data with common values in specific columns.
menu:
  flux_0_65:
    name: Group
    parent: Query with Flux
weight: 2
aliases:
  - /flux/v0.65/guides/grouping-data/
list_query_example: group
---

With Flux, you can group data by any column in your queried data set.
"Grouping" partitions data into tables in which each row shares a common value for specified columns.
This guide walks through grouping data in Flux and provides examples of how data is shaped in the process.

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/flux/v0.65/introduction/getting-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/flux/v0.65/guides/execute-queries/) to discover a variety of ways to run your queries.

## Group keys
Every table has a **group key** – a list of columns which for which every row in the table has the same value.

###### Example group key
```js
[_start, _stop, _field, _measurement, host]
```

Grouping data in Flux is essentially defining the group key of output tables.
Understanding how modifying group keys shapes output data is key to successfully
grouping and transforming data into your desired output.

## group() Function
Flux's [`group()` function](/flux/v0.65/stdlib/built-in/transformations/group) defines the
group key for output tables, i.e. grouping records based on values for specific columns.

###### group() example
```js
dataStream
  |> group(columns: ["cpu", "host"])
```

###### Resulting group key
```js
[cpu, host]
```

The `group()` function has the following parameters:

### columns
The list of columns to include or exclude (depending on the [mode](#mode)) in the grouping operation.

### mode
The method used to define the group and resulting group key.
Possible values include `by` and `except`.


## Example grouping operations
To illustrate how grouping works, define a `dataSet` variable that queries System
CPU usage from the `db/rp` bucket.
Filter the `cpu` tag so it only returns results for each numbered CPU core.

### Data set
CPU used by system operations for all numbered CPU cores.
It uses a regular expression to filter only numbered cores.

```js
dataSet = from(bucket: "db/rp")
  |> range(start: -2m)
  |> filter(fn: (r) =>
    r._field == "usage_system" and
    r.cpu =~ /cpu[0-9*]/
  )
  |> drop(columns: ["host"])
```

{{% note %}}
This example drops the `host` column from the returned data since the CPU data
is only tracked for a single host and it simplifies the output tables.
Don't drop the `host` column if monitoring multiple hosts.
{{% /note %}}

{{% truncate %}}
```
Table: keys: [_start, _stop, _field, _measurement, cpu]
                   _start:time                      _stop:time           _field:string     _measurement:string              cpu:string                      _time:time                  _value:float
------------------------------  ------------------------------  ----------------------  ----------------------  ----------------------  ------------------------------  ----------------------------
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:34:00.000000000Z             7.892107892107892
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:34:10.000000000Z                           7.2
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:34:20.000000000Z                           7.4
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:34:30.000000000Z                           5.5
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:34:40.000000000Z                           7.4
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:34:50.000000000Z                           7.5
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:35:00.000000000Z                          10.3
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:35:10.000000000Z                           9.2
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:35:20.000000000Z                           8.4
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:35:30.000000000Z                           8.5
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:35:40.000000000Z                           8.6
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:35:50.000000000Z                          10.2
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu0  2018-11-05T21:36:00.000000000Z                          10.6

Table: keys: [_start, _stop, _field, _measurement, cpu]
                   _start:time                      _stop:time           _field:string     _measurement:string              cpu:string                      _time:time                  _value:float
------------------------------  ------------------------------  ----------------------  ----------------------  ----------------------  ------------------------------  ----------------------------
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:34:00.000000000Z            0.7992007992007992
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:34:10.000000000Z                           0.7
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:34:20.000000000Z                           0.7
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:34:30.000000000Z                           0.4
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:34:40.000000000Z                           0.7
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:34:50.000000000Z                           0.7
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:35:00.000000000Z                           1.4
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:35:10.000000000Z                           1.2
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:35:20.000000000Z                           0.8
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:35:30.000000000Z            0.8991008991008991
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:35:40.000000000Z            0.8008008008008008
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:35:50.000000000Z             0.999000999000999
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu1  2018-11-05T21:36:00.000000000Z            1.1022044088176353

Table: keys: [_start, _stop, _field, _measurement, cpu]
                   _start:time                      _stop:time           _field:string     _measurement:string              cpu:string                      _time:time                  _value:float
------------------------------  ------------------------------  ----------------------  ----------------------  ----------------------  ------------------------------  ----------------------------
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:34:00.000000000Z                           4.1
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:34:10.000000000Z                           3.6
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:34:20.000000000Z                           3.5
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:34:30.000000000Z                           2.6
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:34:40.000000000Z                           4.5
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:34:50.000000000Z             4.895104895104895
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:35:00.000000000Z             6.906906906906907
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:35:10.000000000Z                           5.7
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:35:20.000000000Z                           5.1
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:35:30.000000000Z                           4.7
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:35:40.000000000Z                           5.1
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:35:50.000000000Z                           5.9
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu2  2018-11-05T21:36:00.000000000Z            6.4935064935064934

Table: keys: [_start, _stop, _field, _measurement, cpu]
                   _start:time                      _stop:time           _field:string     _measurement:string              cpu:string                      _time:time                  _value:float
------------------------------  ------------------------------  ----------------------  ----------------------  ----------------------  ------------------------------  ----------------------------
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:34:00.000000000Z            0.5005005005005005
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:34:10.000000000Z                           0.5
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:34:20.000000000Z                           0.5
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:34:30.000000000Z                           0.3
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:34:40.000000000Z                           0.6
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:34:50.000000000Z                           0.6
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:35:00.000000000Z            1.3986013986013985
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:35:10.000000000Z                           0.9
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:35:20.000000000Z            0.5005005005005005
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:35:30.000000000Z                           0.7
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:35:40.000000000Z                           0.6
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:35:50.000000000Z                           0.8
2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            usage_system                     cpu                    cpu3  2018-11-05T21:36:00.000000000Z                           0.9
```
{{% /truncate %}}

**Note that the group key is output with each table: `Table: keys: <group-key>`.**

![Group example data set](/img/grouping-data-set.png)

### Group by CPU
Group the `dataSet` stream by the `cpu` column.

```js
dataSet
  |> group(columns: ["cpu"])
```

This won't actually change the structure of the data since it already has `cpu`
in the group key and is therefore grouped by `cpu`.
However, notice that it does change the group key:

{{% truncate %}}
###### Group by CPU output tables
```
Table: keys: [cpu]
            cpu:string                      _stop:time                      _time:time                  _value:float           _field:string     _measurement:string                     _start:time
----------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:00.000000000Z             7.892107892107892            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:10.000000000Z                           7.2            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:20.000000000Z                           7.4            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:30.000000000Z                           5.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:40.000000000Z                           7.4            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:50.000000000Z                           7.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:00.000000000Z                          10.3            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:10.000000000Z                           9.2            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:20.000000000Z                           8.4            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:30.000000000Z                           8.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:40.000000000Z                           8.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:50.000000000Z                          10.2            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu0  2018-11-05T21:36:00.000000000Z  2018-11-05T21:36:00.000000000Z                          10.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [cpu]
            cpu:string                      _stop:time                      _time:time                  _value:float           _field:string     _measurement:string                     _start:time
----------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:00.000000000Z            0.7992007992007992            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:10.000000000Z                           0.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:20.000000000Z                           0.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:30.000000000Z                           0.4            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:40.000000000Z                           0.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:50.000000000Z                           0.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:00.000000000Z                           1.4            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:10.000000000Z                           1.2            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:20.000000000Z                           0.8            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:30.000000000Z            0.8991008991008991            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:40.000000000Z            0.8008008008008008            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:50.000000000Z             0.999000999000999            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu1  2018-11-05T21:36:00.000000000Z  2018-11-05T21:36:00.000000000Z            1.1022044088176353            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [cpu]
            cpu:string                      _stop:time                      _time:time                  _value:float           _field:string     _measurement:string                     _start:time
----------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:00.000000000Z                           4.1            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:10.000000000Z                           3.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:20.000000000Z                           3.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:30.000000000Z                           2.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:40.000000000Z                           4.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:50.000000000Z             4.895104895104895            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:00.000000000Z             6.906906906906907            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:10.000000000Z                           5.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:20.000000000Z                           5.1            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:30.000000000Z                           4.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:40.000000000Z                           5.1            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:50.000000000Z                           5.9            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu2  2018-11-05T21:36:00.000000000Z  2018-11-05T21:36:00.000000000Z            6.4935064935064934            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [cpu]
            cpu:string                      _stop:time                      _time:time                  _value:float           _field:string     _measurement:string                     _start:time
----------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:00.000000000Z            0.5005005005005005            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:10.000000000Z                           0.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:20.000000000Z                           0.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:30.000000000Z                           0.3            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:40.000000000Z                           0.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:50.000000000Z                           0.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:00.000000000Z            1.3986013986013985            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:10.000000000Z                           0.9            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:20.000000000Z            0.5005005005005005            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:30.000000000Z                           0.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:40.000000000Z                           0.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:35:50.000000000Z                           0.8            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
                  cpu3  2018-11-05T21:36:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.9            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
```
{{% /truncate %}}

The visualization remains the same.

![Group by CPU](/img/grouping-data-set.png)

### Group by time
Grouping data by the `_time` column is a good illustration of how grouping changes the structure of your data.

```js
dataSet
  |> group(columns: ["_time"])
```

When grouping by `_time`, all records that share a common `_time` value are grouped into individual tables.
So each output table represents a single point in time.

{{% truncate %}}
###### Group by time output tables
```
Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:34:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z             7.892107892107892            usage_system                     cpu                    cpu0
2018-11-05T21:34:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            0.7992007992007992            usage_system                     cpu                    cpu1
2018-11-05T21:34:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           4.1            usage_system                     cpu                    cpu2
2018-11-05T21:34:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            0.5005005005005005            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:34:10.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           7.2            usage_system                     cpu                    cpu0
2018-11-05T21:34:10.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.7            usage_system                     cpu                    cpu1
2018-11-05T21:34:10.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           3.6            usage_system                     cpu                    cpu2
2018-11-05T21:34:10.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.5            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:34:20.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           7.4            usage_system                     cpu                    cpu0
2018-11-05T21:34:20.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.7            usage_system                     cpu                    cpu1
2018-11-05T21:34:20.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           3.5            usage_system                     cpu                    cpu2
2018-11-05T21:34:20.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.5            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:34:30.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           5.5            usage_system                     cpu                    cpu0
2018-11-05T21:34:30.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.4            usage_system                     cpu                    cpu1
2018-11-05T21:34:30.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           2.6            usage_system                     cpu                    cpu2
2018-11-05T21:34:30.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.3            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:34:40.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           7.4            usage_system                     cpu                    cpu0
2018-11-05T21:34:40.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.7            usage_system                     cpu                    cpu1
2018-11-05T21:34:40.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           4.5            usage_system                     cpu                    cpu2
2018-11-05T21:34:40.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.6            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:34:50.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           7.5            usage_system                     cpu                    cpu0
2018-11-05T21:34:50.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.7            usage_system                     cpu                    cpu1
2018-11-05T21:34:50.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z             4.895104895104895            usage_system                     cpu                    cpu2
2018-11-05T21:34:50.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.6            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:35:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                          10.3            usage_system                     cpu                    cpu0
2018-11-05T21:35:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           1.4            usage_system                     cpu                    cpu1
2018-11-05T21:35:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z             6.906906906906907            usage_system                     cpu                    cpu2
2018-11-05T21:35:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            1.3986013986013985            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:35:10.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           9.2            usage_system                     cpu                    cpu0
2018-11-05T21:35:10.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           1.2            usage_system                     cpu                    cpu1
2018-11-05T21:35:10.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           5.7            usage_system                     cpu                    cpu2
2018-11-05T21:35:10.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.9            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:35:20.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           8.4            usage_system                     cpu                    cpu0
2018-11-05T21:35:20.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.8            usage_system                     cpu                    cpu1
2018-11-05T21:35:20.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           5.1            usage_system                     cpu                    cpu2
2018-11-05T21:35:20.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            0.5005005005005005            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:35:30.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           8.5            usage_system                     cpu                    cpu0
2018-11-05T21:35:30.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            0.8991008991008991            usage_system                     cpu                    cpu1
2018-11-05T21:35:30.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           4.7            usage_system                     cpu                    cpu2
2018-11-05T21:35:30.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.7            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:35:40.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           8.6            usage_system                     cpu                    cpu0
2018-11-05T21:35:40.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            0.8008008008008008            usage_system                     cpu                    cpu1
2018-11-05T21:35:40.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           5.1            usage_system                     cpu                    cpu2
2018-11-05T21:35:40.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.6            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:35:50.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                          10.2            usage_system                     cpu                    cpu0
2018-11-05T21:35:50.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z             0.999000999000999            usage_system                     cpu                    cpu1
2018-11-05T21:35:50.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           5.9            usage_system                     cpu                    cpu2
2018-11-05T21:35:50.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.8            usage_system                     cpu                    cpu3

Table: keys: [_time]
                    _time:time                     _start:time                      _stop:time                  _value:float           _field:string     _measurement:string              cpu:string
------------------------------  ------------------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ----------------------
2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                          10.6            usage_system                     cpu                    cpu0
2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            1.1022044088176353            usage_system                     cpu                    cpu1
2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z            6.4935064935064934            usage_system                     cpu                    cpu2
2018-11-05T21:36:00.000000000Z  2018-11-05T21:34:00.000000000Z  2018-11-05T21:36:00.000000000Z                           0.9            usage_system                     cpu                    cpu3
```
{{% /truncate %}}

Because each timestamp is structured as a separate table, when visualized, all
points that share the same timestamp appear connected.

![Group by time](/img/grouping-by-time.png)

{{% note %}}
With some further processing, you could calculate the average CPU usage across all CPUs per point
of time and group them into a single table, but we won't cover that in this example.
If you're interested in running and visualizing this yourself, here's what the query would look like:

```js
dataSet
  |> group(columns: ["_time"])
  |> mean()
  |> group(columns: ["_value", "_time"], mode: "except")
```
{{% /note %}}

## Group by CPU and time
Group by the `cpu` and `_time` columns.

```js
dataSet
  |> group(columns: ["cpu", "_time"])
```

This outputs a table for every unique `cpu` and `_time` combination:

{{% truncate %}}
###### Group by CPU and time output tables
```
Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:00.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z             7.892107892107892            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:00.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z            0.7992007992007992            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:00.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z                           4.1            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:00.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z            0.5005005005005005            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:10.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                           7.2            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:10.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z                           0.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:10.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z                           3.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:10.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z                           0.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:20.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                           7.4            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:20.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z                           0.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:20.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z                           3.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:20.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z                           0.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:30.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                           5.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:30.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z                           0.4            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:30.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z                           2.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:30.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z                           0.3            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:40.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                           7.4            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:40.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z                           0.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:40.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z                           4.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:40.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z                           0.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:50.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                           7.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:50.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z                           0.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:50.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z             4.895104895104895            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:34:50.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z                           0.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:00.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                          10.3            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:00.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z                           1.4            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:00.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z             6.906906906906907            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:00.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z            1.3986013986013985            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:10.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                           9.2            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:10.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z                           1.2            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:10.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z                           5.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:10.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z                           0.9            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:20.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                           8.4            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:20.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z                           0.8            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:20.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z                           5.1            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:20.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z            0.5005005005005005            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:30.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                           8.5            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:30.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z            0.8991008991008991            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:30.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z                           4.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:30.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z                           0.7            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:40.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                           8.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:40.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z            0.8008008008008008            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:40.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z                           5.1            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:40.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z                           0.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:50.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                          10.2            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:50.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z             0.999000999000999            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:50.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z                           5.9            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:35:50.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z                           0.8            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:36:00.000000000Z                    cpu0  2018-11-05T21:36:00.000000000Z                          10.6            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:36:00.000000000Z                    cpu1  2018-11-05T21:36:00.000000000Z            1.1022044088176353            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:36:00.000000000Z                    cpu2  2018-11-05T21:36:00.000000000Z            6.4935064935064934            usage_system                     cpu  2018-11-05T21:34:00.000000000Z

Table: keys: [_time, cpu]
                    _time:time              cpu:string                      _stop:time                  _value:float           _field:string     _measurement:string                     _start:time
------------------------------  ----------------------  ------------------------------  ----------------------------  ----------------------  ----------------------  ------------------------------
2018-11-05T21:36:00.000000000Z                    cpu3  2018-11-05T21:36:00.000000000Z                           0.9            usage_system                     cpu  2018-11-05T21:34:00.000000000Z
```
{{% /truncate %}}

When visualized, tables appear as individual, unconnected points.

![Group by CPU and time](/img/grouping-by-cpu-time.png)

Grouping by `cpu` and `_time` is a good illustration of how grouping works.

## In conclusion
Grouping is a powerful way to shape your data into your desired output format.
It modifies the group keys of output tables, grouping records into tables that
all share common values within specified columns.
