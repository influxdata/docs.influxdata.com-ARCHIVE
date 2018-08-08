---
title: Influx Tools data utility
description:
menu:
  enterprise_influxdb_1_6:
    name: Influx Tools data utility
    weight: 15
    parent: Enterprise features
---



Influx Tools is an InfluxDB utility that can be used to manage and query InfluxDB data.

## `influx_tools` utility

An InfluxDB utility used to manage and query InfluxDB data.

### Syntax

```
influx_tools [ [ command [ arguments ] ] ]`
```

`-help` is the default command and prints syntax and usage information for the tool.

### `influx_tools` commands

The `influx_inspect` commands are summarized here, with links to detailed information on each of the commands.

* [`compact-shard`](#compact-shard): Fully compacts the specified shard.
* [`export`](#export): Reshapes existing shards to a new shard duration.
* [`help`](#help): Display this help message format.


### `compact-shard`

Fully compacts a shard with the specified shard path.

> ***Note:*** **For offline use only.**

When only the `-path` option is specified, the compact shard tool will prompt the user before proceeding; the `-force` option disables this behavior.

#### Syntax

```
influx_tools compact-shard -path <shard_path> [ `-force` ] [ `-verbose` ]
```

#### Arguments

Optional arguments are in brackets.

#### `[ -force ]`

Disables the default prompt asking the user if they wish to proceed with compaction.

#### `-path <shard_path>`

Path of the shard to be compacted. Only TSM files are compacted; the WAL is not modified.

#### `[ -verbose ]`

Logs additional information to `stdout`, including progress as each `.tsm` file is opened in preparation for compaction. This is usefule when compacting large shards (> 100s of GBs) that take some time to open.

### `export`

Transforms existing shards to a new shard duration in order to consolidate into fewer shards. It is also possible to separate into a greater number of shards.

#### Syntax

```
influx_tools export -range  [ `-config <config_file>` ] [ `-print-only` ]
```

#### Arguments

Optional arguments are in brackets.

##### `-database`

Database name.

#### [ `-conflict-path <conflict_path>` ]

All conflicting data will be written as line protocol and gzipped to the path specified.

##### Field type conflicts

A field type for a given measurement can be different per shard. This creates the potential for field type conflicts when exporting new shard durations. If this happens, the field type will be determined by the first shard containing data for that field in order to fulfill the target shard duration.

#### [ `-no-conflict-path` ]



#### [ `-range` ]

Specifies which target shards should be exported, based on their sequence number. See example below.

##### `-config`

##### `-rp`

##### `-duration`

Duration in hours (e.g., "24h") for retention policy duration.

#### [ `-print-only` ]

Flag to display the plan and exit without exporting any data.

#### Examples

##### Use the `-range` option to parallelize the reshaping of a large data set

A use case for the `-range` option is to parallelize the reshaping of a large data set. A machine with 4 cores could run two export or import jobs concurrently over a subset of the total target shards.

In the following example, the sequence number is included in the plan output.

```
$ influx-tools export -config config.toml -database foo -rp autogen -duration 24h -format=binary -no-conflict-path -print-only
Source data from: 2018-02-19 00:00:00 +0000 UTC -> 2018-04-09 00:00:00 +0000 UTC

Converting source from 4 shard group(s) to 28 shard groups

Seq #           ID              Start                           End
0               608             2018-02-19 00:00:00 +0000 UTC   2018-02-26 00:00:00 +0000 UTC
1               609             2018-03-19 00:00:00 +0000 UTC   2018-03-26 00:00:00 +0000 UTC
2               610             2018-03-26 00:00:00 +0000 UTC   2018-04-02 00:00:00 +0000 UTC
3               612             2018-04-02 00:00:00 +0000 UTC   2018-04-09 00:00:00 +0000 UTC

Seq #           ID              Start                           End
0               0               2018-02-19 00:00:00 +0000 UTC   2018-02-20 00:00:00 +0000 UTC
1               1               2018-02-20 00:00:00 +0000 UTC   2018-02-21 00:00:00 +0000 UTC
2               2               2018-02-21 00:00:00 +0000 UTC   2018-02-22 00:00:00 +0000 UTC
3               3               2018-02-22 00:00:00 +0000 UTC   2018-02-23 00:00:00 +0000 UTC
4               4               2018-02-23 00:00:00 +0000 UTC   2018-02-24 00:00:00 +0000 UTC
5               5               2018-02-24 00:00:00 +0000 UTC   2018-02-25 00:00:00 +0000 UTC
6               6               2018-02-25 00:00:00 +0000 UTC   2018-02-26 00:00:00 +0000 UTC
7               28              2018-03-19 00:00:00 +0000 UTC   2018-03-20 00:00:00 +0000 UTC
8               29              2018-03-20 00:00:00 +0000 UTC   2018-03-21 00:00:00 +0000 UTC
9               30              2018-03-21 00:00:00 +0000 UTC   2018-03-22 00:00:00 +0000 UTC
...
26              47              2018-04-07 00:00:00 +0000 UTC   2018-04-08 00:00:00 +0000 UTC
27              48              2018-04-08 00:00:00 +0000 UTC   2018-04-09 00:00:00 +0000 UTC
```

Adding `-range 2-4` would return the following plan.

```
$ influx-tools export -config config.toml -database foo -rp autogen -duration 24h -format=binary -no-conflict-path -print-only -range=2-4
Source data from: 2018-02-19 00:00:00 +0000 UTC -> 2018-04-09 00:00:00 +0000 UTC

Converting source from 4 shard group(s) to 3 shard groups

Seq #           ID              Start                           End
0               608             2018-02-19 00:00:00 +0000 UTC   2018-02-26 00:00:00 +0000 UTC
1               609             2018-03-19 00:00:00 +0000 UTC   2018-03-26 00:00:00 +0000 UTC
2               610             2018-03-26 00:00:00 +0000 UTC   2018-04-02 00:00:00 +0000 UTC
3               612             2018-04-02 00:00:00 +0000 UTC   2018-04-09 00:00:00 +0000 UTC

Seq #           ID              Start                           End
2               2               2018-02-21 00:00:00 +0000 UTC   2018-02-22 00:00:00 +0000 UTC
3               3               2018-02-22 00:00:00 +0000 UTC   2018-02-23 00:00:00 +0000 UTC
4               4               2018-02-23 00:00:00 +0000 UTC   2018-02-24 00:00:00 +0000 UTC
```

A range can either be a single sequence number or an interval as shown previously.

Hint: Include the `-print-only` argument to display the plan and exit without exporting any data.


### `import`


#### Syntax

```
influx_tools import `-config <config_path>` -database <db_name> -rp <retention_policy> [ -duration <rp_duration> ] [ -shard-duration <shard_duration> ] [ -build-tsi ] [ -replace ]
```

#### Arguments

Optional arguments are in brackets.

##### [ `-build-tsi` ]

Flag to enable building the on-disk TSI.

##### `-config`

Path to the configuration file.

##### `-database`

Database name.

##### [ `-duration` ]

Retention policy duration.

##### [ `-replace` ]

Flag that enables replacing an existing retention policy.

##### [ `-replicaton` ]

Integer value of the retention policy replication factor.

##### `-rp`

Retention policy.

##### [ `-shard-duration` ]

Retention policy shard duration.


### `help`
