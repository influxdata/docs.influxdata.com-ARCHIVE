---
title: How to join data with Flux
description: This guide walks through joining data with Flux and outlines how it shapes your data in the process.
menu:
  flux_0_7:
    name: Join data
    parent: Guides
    weight: 2
---

The [`join()` function](/flux/v.07/functions/transformations/join) merges two or more
input streams whose values are equal on a set of common columns into a single output stream.
Flux allows you to join on any columns common between two data streams and opens the door
for operations such as cross-measurement joins and math across measurements.

To illustrate a join operation, use data captured by Telegraf and and stored in
InfluxDB with a default TICK stack installation - memory usage and processes.

> If using the [InfluxData Sandbox](/platform/installation/platform-install) or other
> "Dockerized" instances of the TICK stack, these measurements may not be available.

In this guide, we'll join two data streams, one representing memory usage and the other representing the
total number of running process, then calculate the average memory usage per running process.

## Define stream variables
In order to perform a join, you must have two streams of data.
Assign a variable to each data stream.

### Memory used variable
Define a `memUsed` variable that filters on the `mem` measurement and the `used` field.
This returns the amount of memory (in bytes) used.

###### memUsed stream definition
```js
memUsed = from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "mem" AND
    r._field == "used"
  )
```

{{% condense %}}
###### memUsed data output
```
Table: keys: [_start, _stop, _field, _measurement, host]
                   _start:time                      _stop:time           _field:string     _measurement:string               host:string                      _time:time                  _value:int
------------------------------  ------------------------------  ----------------------  ----------------------  ------------------------  ------------------------------  --------------------------
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:50:00.000000000Z                 10956333056
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:50:10.000000000Z                 11014008832
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:50:20.000000000Z                 11373428736
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:50:30.000000000Z                 11001421824
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:50:40.000000000Z                 10985852928
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:50:50.000000000Z                 10992279552
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:51:00.000000000Z                 11053568000
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:51:10.000000000Z                 11092242432
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:51:20.000000000Z                 11612774400
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:51:30.000000000Z                 11131961344
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:51:40.000000000Z                 11124805632
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:51:50.000000000Z                 11332464640
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:52:00.000000000Z                 11176923136
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:52:10.000000000Z                 11181068288
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:52:20.000000000Z                 11182579712
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:52:30.000000000Z                 11238862848
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:52:40.000000000Z                 11275296768
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:52:50.000000000Z                 11225411584
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:53:00.000000000Z                 11252690944
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:53:10.000000000Z                 11227029504
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:53:20.000000000Z                 11201646592
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:53:30.000000000Z                 11227897856
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:53:40.000000000Z                 11330428928
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:53:50.000000000Z                 11347976192
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:54:00.000000000Z                 11368271872
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:54:10.000000000Z                 11269623808
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:54:20.000000000Z                 11295637504
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:54:30.000000000Z                 11354423296
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:54:40.000000000Z                 11379687424
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:54:50.000000000Z                 11248926720
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                    used                     mem               host1.local  2018-11-06T05:55:00.000000000Z                 11292524544
```
{{% /condense %}}

### Total processes variable
Define a `procTotal` variable that filters on the `processes` measurement and the `total` field.
This returns the number of running processes.

###### procTotal stream definition
```js
procTotal = from(bucket: "telegraf/autogen")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "processes" AND
    r._field == "total"
  )
```

{{% condense %}}
###### procTotal data output
```
Table: keys: [_start, _stop, _field, _measurement, host]
                   _start:time                      _stop:time           _field:string     _measurement:string               host:string                      _time:time                  _value:int
------------------------------  ------------------------------  ----------------------  ----------------------  ------------------------  ------------------------------  --------------------------
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:50:00.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:50:10.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:50:20.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:50:30.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:50:40.000000000Z                         469
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:50:50.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:51:00.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:51:10.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:51:20.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:51:30.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:51:40.000000000Z                         469
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:51:50.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:52:00.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:52:10.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:52:20.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:52:30.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:52:40.000000000Z                         472
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:52:50.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:53:00.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:53:10.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:53:20.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:53:30.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:53:40.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:53:50.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:54:00.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:54:10.000000000Z                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:54:20.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:54:30.000000000Z                         473
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:54:40.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:54:50.000000000Z                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z                   total               processes               host1.local  2018-11-06T05:55:00.000000000Z                         471
```
{{% /condense %}}

## Join the two data streams
With the two data streams defined, use the `join()` function to join them together.
`join()` requires two parameters:

##### `tables`
A map of tables to join with keys by which they will be aliased.
In the example below, `mem` is the alias for `memUsed` and `proc` is the alias for `procTotal`.

##### `on`
An array of strings defining the columns on which the tables will be joined.
_**Both tables must have all columns defined in this list.**_

```js
join(
  tables: {mem:memUsed, proc:procTotal},
  on: ["_time", "_stop", "_start", "host"]
)
```

{{% condense %}}
###### Joined output table
```
Table: keys: [_start, _stop, _field, _measurement, host]
                   _start:time                      _stop:time               host:string                      _time:time       _field_mem:string      _field_proc:string   _measurement_mem:string   _measurement_proc:string              _value_mem:int             _value_proc:int
------------------------------  ------------------------------  ------------------------  ------------------------------  ----------------------  ----------------------  ------------------------  -------------------------  --------------------------  --------------------------
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:50:00.000000000Z                    used                   total                       mem                  processes                 10956333056                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:50:10.000000000Z                    used                   total                       mem                  processes                 11014008832                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:50:20.000000000Z                    used                   total                       mem                  processes                 11373428736                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:50:30.000000000Z                    used                   total                       mem                  processes                 11001421824                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:50:40.000000000Z                    used                   total                       mem                  processes                 10985852928                         469
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:50:50.000000000Z                    used                   total                       mem                  processes                 10992279552                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:51:00.000000000Z                    used                   total                       mem                  processes                 11053568000                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:51:10.000000000Z                    used                   total                       mem                  processes                 11092242432                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:51:20.000000000Z                    used                   total                       mem                  processes                 11612774400                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:51:30.000000000Z                    used                   total                       mem                  processes                 11131961344                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:51:40.000000000Z                    used                   total                       mem                  processes                 11124805632                         469
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:51:50.000000000Z                    used                   total                       mem                  processes                 11332464640                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:52:00.000000000Z                    used                   total                       mem                  processes                 11176923136                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:52:10.000000000Z                    used                   total                       mem                  processes                 11181068288                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:52:20.000000000Z                    used                   total                       mem                  processes                 11182579712                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:52:30.000000000Z                    used                   total                       mem                  processes                 11238862848                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:52:40.000000000Z                    used                   total                       mem                  processes                 11275296768                         472
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:52:50.000000000Z                    used                   total                       mem                  processes                 11225411584                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:53:00.000000000Z                    used                   total                       mem                  processes                 11252690944                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:53:10.000000000Z                    used                   total                       mem                  processes                 11227029504                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:53:20.000000000Z                    used                   total                       mem                  processes                 11201646592                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:53:30.000000000Z                    used                   total                       mem                  processes                 11227897856                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:53:40.000000000Z                    used                   total                       mem                  processes                 11330428928                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:53:50.000000000Z                    used                   total                       mem                  processes                 11347976192                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:54:00.000000000Z                    used                   total                       mem                  processes                 11368271872                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:54:10.000000000Z                    used                   total                       mem                  processes                 11269623808                         470
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:54:20.000000000Z                    used                   total                       mem                  processes                 11295637504                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:54:30.000000000Z                    used                   total                       mem                  processes                 11354423296                         473
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:54:40.000000000Z                    used                   total                       mem                  processes                 11379687424                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:54:50.000000000Z                    used                   total                       mem                  processes                 11248926720                         471
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z               host1.local  2018-11-06T05:55:00.000000000Z                    used                   total                       mem                  processes                 11292524544                         471
```
{{% /condense %}}

Notice the output table includes the following columns:

- `_field_mem`
- `_field_proc`
- `_measurement_mem`
- `_measurement_proc`
- `_value_mem`
- `_value_proc`

These represent the columns with values unique to the two input tables.

## Calculate and create a new table
With the two streams of data joined into a single table, use the [`map()` function](/flux/v0.7/functions/transformations/map)
to build a new table by mapping the existing `_time` column to a new `_time` column and dividing `_value_mem` by `_value_proc`
and mapping it to a new `_value` column.

```js
join(tables: {mem:memUsed, proc:procTotal}, on: ["_time", "_stop", "_start", "host"])
  |> map(fn: (r) => ({
    _time: r._time,
    _value: (r._value_mem / r._value_proc)
  }))
```

{{% condense %}}
###### Mapped table
```
Table: keys: [_start, _stop, _field, _measurement, host]
                   _start:time                      _stop:time                      _time:time              _value:int
------------------------------  ------------------------------  ------------------------------  --------------------------
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:50:00.000000000Z                 23311346    
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:50:10.000000000Z                 23434061
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:50:20.000000000Z                 24147407
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:50:30.000000000Z                 23407280
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:50:40.000000000Z                 23423993
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:50:50.000000000Z                 23338173
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:51:00.000000000Z                 23518229
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:51:10.000000000Z                 23600515
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:51:20.000000000Z                 24708030
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:51:30.000000000Z                 23685024
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:51:40.000000000Z                 23720267
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:51:50.000000000Z                 24060434
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:52:00.000000000Z                 23730197
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:52:10.000000000Z                 23789506
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:52:20.000000000Z                 23792722
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:52:30.000000000Z                 23861704
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:52:40.000000000Z                 23888340
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:52:50.000000000Z                 23833145
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:53:00.000000000Z                 23941895
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:53:10.000000000Z                 23887296
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:53:20.000000000Z                 23833290
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:53:30.000000000Z                 23838424
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:53:40.000000000Z                 24056112
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:53:50.000000000Z                 24093367
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:54:00.000000000Z                 24136458
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:54:10.000000000Z                 23977922
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:54:20.000000000Z                 23982245
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:54:30.000000000Z                 24005123
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:54:40.000000000Z                 24160695
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:54:50.000000000Z                 23883071
2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  2018-11-06T05:55:00.000000000Z                 23975635
```
{{% /condense %}}

This table represents the average amount of memory in bytes per running process.


## Real world example
The following function calculates the batch sizes written to an InfluxDB cluster by joining
fields from `httpd` and `write` measurements in order to compare `_pointReq` and `_writeReq`.
The results are grouped by cluster ID so you can make comparisons across clusters.

```js
batchSize = (cluster_id, start=-1m, interval=10s) => {
  httpd = from(bucket:"telegraf")
    |> range(start:start)
    |> filter(fn:(r) =>
      r._measurement == "influxdb_httpd" AND
      r._field == "writeReq" AND
      r.cluster_id == cluster_id
    )
    |> aggregateWindow(every: interval, fn: mean)
    |> derivative(nonNegative:true,unit:60s)

  write = from(bucket:"telegraf")
    |> range(start:start)
    |> filter(fn:(r) =>
      r._measurement == "influxdb_write" AND
      r._field == "pointReq" AND
      r.cluster_id == cluster_id
    )
    |> aggregateWindow(every: interval, fn: max)
    |> derivative(nonNegative:true,unit:60s)

  return join(
      tables:{httpd:httpd, write:write},
      on:["_time","_stop","_start","host"]
    )
    |> map(fn:(r) => ({
        _time: r._time,
        _value: r._value_httpd / r._value_write,
    }))
    |> group(by: cluster_id)
}

batchSize(cluster_id: "enter cluster id here")
```
