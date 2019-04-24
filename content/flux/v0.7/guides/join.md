---
title: How to join data with Flux
description: This guide walks through joining data with Flux and outlines how it shapes your data in the process.
menu:
  flux_0_7:
    name: Join data
    parent: Guides
    weight: 5
---

The [`join()` function](/flux/v0.7/functions/transformations/join) merges two or more
input streams whose values are equal on a set of common columns into a single output stream.
Flux allows you to join on any columns common between two data streams and opens the door
for operations such as cross-measurement joins and math across measurements.

To illustrate a join operation, use data captured by Telegraf and and stored in
InfluxDB with a default TICK stack installation - memory usage and processes.

> If using the [InfluxData Sandbox](/platform/install-and-deploy/deploying/sandbox-install) or other
> "Dockerized" instances of the TICK stack, these measurements may not be available.

In this guide, we'll join two data streams, one representing memory usage and the other representing the
total number of running processes, then calculate the average memory usage per running process.

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

{{% truncate %}}
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
{{% /truncate %}}

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

{{% truncate %}}
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
{{% /truncate %}}

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

{{% truncate %}}
###### Joined output table
```
Table: keys: [_field_mem, _field_proc, _measurement_mem, _measurement_proc, _start, _stop, host]
     _field_mem:string      _field_proc:string  _measurement_mem:string  _measurement_proc:string                     _start:time                      _stop:time               host:string                      _time:time              _value_mem:int             _value_proc:int
----------------------  ----------------------  -----------------------  ------------------------  ------------------------------  ------------------------------  ------------------------  ------------------------------  --------------------------  --------------------------
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:00.000000000Z                 10956333056                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:10.000000000Z                 11014008832                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:20.000000000Z                 11373428736                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:30.000000000Z                 11001421824                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:40.000000000Z                 10985852928                         469
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:50.000000000Z                 10992279552                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:00.000000000Z                 11053568000                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:10.000000000Z                 11092242432                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:20.000000000Z                 11612774400                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:30.000000000Z                 11131961344                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:40.000000000Z                 11124805632                         469
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:50.000000000Z                 11332464640                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:00.000000000Z                 11176923136                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:10.000000000Z                 11181068288                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:20.000000000Z                 11182579712                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:30.000000000Z                 11238862848                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:40.000000000Z                 11275296768                         472
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:50.000000000Z                 11225411584                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:00.000000000Z                 11252690944                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:10.000000000Z                 11227029504                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:20.000000000Z                 11201646592                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:30.000000000Z                 11227897856                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:40.000000000Z                 11330428928                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:50.000000000Z                 11347976192                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:00.000000000Z                 11368271872                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:10.000000000Z                 11269623808                         470
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:20.000000000Z                 11295637504                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:30.000000000Z                 11354423296                         473
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:40.000000000Z                 11379687424                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:50.000000000Z                 11248926720                         471
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:55:00.000000000Z                 11292524544                         471
```
{{% /truncate %}}

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
    _value: r._value_mem / r._value_proc
  }))
```

{{% truncate %}}
###### Mapped table
```
Table: keys: [_field_mem, _field_proc, _measurement_mem, _measurement_proc, _start, _stop, host]
     _field_mem:string      _field_proc:string  _measurement_mem:string  _measurement_proc:string                     _start:time                      _stop:time               host:string                      _time:time                  _value:int
----------------------  ----------------------  -----------------------  ------------------------  ------------------------------  ------------------------------  ------------------------  ------------------------------  --------------------------
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:00.000000000Z                    23311346
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:10.000000000Z                    23434061
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:20.000000000Z                    24147407
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:30.000000000Z                    23407280
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:40.000000000Z                    23423993
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:50:50.000000000Z                    23338173
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:00.000000000Z                    23518229
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:10.000000000Z                    23600515
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:20.000000000Z                    24708030
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:30.000000000Z                    23685024
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:40.000000000Z                    23720267
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:51:50.000000000Z                    24060434
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:00.000000000Z                    23730197
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:10.000000000Z                    23789506
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:20.000000000Z                    23792722
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:30.000000000Z                    23861704
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:40.000000000Z                    23888340
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:52:50.000000000Z                    23833145
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:00.000000000Z                    23941895
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:10.000000000Z                    23887296
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:20.000000000Z                    23833290
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:30.000000000Z                    23838424
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:40.000000000Z                    24056112
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:53:50.000000000Z                    24093367
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:00.000000000Z                    24136458
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:10.000000000Z                    23977922
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:20.000000000Z                    23982245
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:30.000000000Z                    24005123
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:40.000000000Z                    24160695
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:54:50.000000000Z                    23883071
                  used                   total                      mem                 processes  2018-11-06T05:50:00.000000000Z  2018-11-06T05:55:00.000000000Z  Scotts-MacBook-Pro.local  2018-11-06T05:55:00.000000000Z                    23975635
```
{{% /truncate %}}

This table represents the average amount of memory in bytes per running process.


## Real world example
The following function calculates the batch sizes written to an InfluxDB cluster by joining
fields from `httpd` and `write` measurements in order to compare `pointReq` and `writeReq`.
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
