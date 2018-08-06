---
title: Influx Inspect disk utility
description: Use the "influx_inspect" commands to manage InfluxDB disks and shards.
menu:
  influxdb_1_5:
    weight: 50
    parent: Tools
---

Influx Inspect is an InfluxDB disk utility that can be used to:

* View detailed information about disk shards.
* Exporting data from a shard to [line protocol](/influxdb/v1.5/concepts/glossary/#line-protocol) that can be inserted back into the database.
* Converting TSM in-memory index shards to TSI disk-based shards.

## `influx_inspect` utility

### Syntax

```
influx_inspect [ [ command ] [ options ] ]`
```

`-help` is the default command and prints syntax and usage information for the tool.

### `influx_inspect` commands

The `influx_inspect` commands are summarized here, with links to detailed information on each of the commands.

* [`buildtsi`](#buildtsi): Converts in-memory (TSM-based) shards to TSI
* [`dumptsi`](#dumptsi): Dumps low-level details about TSI files.
* [`dumptsm`](#dumptsm): Dumps low-level details about TSM files.
* [`export`](#export): Exports raw data from a shard in Line Protocol format.
* [`help`](#help): Displays this help message format.
* [`report`](#report): Displays a shard level report.
* [`reporttsi`](#reporttsi): Provides a report about series cardinality in TSI indexes.
* [`verify`](#verify): Verifies the integrity of TSM files.
* [`verify-seriesfile`]: Verifies the integrity of TSI files.

### `buildtsi`

Builds TSI (Time Series Index) disk-based shard index files and associated series files.
The index is written to a temporary location until complete and then moved to a permanent location.
If an error occurs, then this operation will fall back to the original in-memory index.

> ***Note:*** **For offline conversion only.**
> When TSI is enabled, new shards use the TSI indexes.
> Existing shards continue as TSM-based shards until
> converted offline.

##### Syntax

```
influx_inspect buildtsi -datadir <data_dir> -waldir <wal_dir> [ options ]
```
> **Note:** Use the `buildtsi` command with the user account that you are going to run the database as,
> or ensure that the permissions match after running the command.


#### Options

Optional arguments are in brackets.

#### `[ -database <db_name> ]`

The name of the database.

#### `-datadir <data_dir>`

The path to the `data` directory.

#### `[ -retention <rp_name> ]`

The name of the retention policy.

#### `[ -shard <shard_ID> ]`

The identifier of the shard.

#### `[ -v ]`

Enable output in verbose mode.

#### `-waldir <wal_dir>`

The directory for the WAL (Write Ahead Log) files.


#### Examples

##### Converting all shards on a node

```
$ influx_inspect buildtsi -datadir ~/.influxdb/data -waldir ~/.influxdb/wal

```

##### Converting all shards for a database

```
$ influx_inspect buildtsi -database mydb -datadir ~/.influxdb/data -waldir ~/.influxdb/wal

```

##### Converting a specific shard

```
$ influx_inspect buildtsi -database stress -shard 1 -datadir ~/.influxdb/data -waldir ~/.influxdb/wal
```

### `dumptsi`

Dumps low-level details about TSI files, including `.tsl` log files and `.tsi` index files.

#### Syntax

```
influx_inspect dumptsi [ options ] <index_path>
```
If no options are specified, summary statistics are provided for each file.

#### Options

Optional arguments are in brackets.

##### `-series-file <series_path>`

Path to the `_series` directory under the database `data` directory. Required.

##### [ `-series` ]

Dump raw series data.

##### [ `-measurements` ]

Dump raw [measurement](/influxdb/v1.5/concepts/glossary/#measurement) data.

##### [ `-tag-keys` ]

Dump raw [tag keys](/influxdb/v1.5/concepts/glossary/#tag-key).

##### [ `-tag-values` ]

Dump raw [tag values](/influxdb/v1.5/concepts/glossary/#tag-value).

##### [ `-tag-value-series` ]

Dump raw series for each tag value.

##### [ `-measurement-filter` <regular_expression> ]

Filter data by measurement regular expression.

##### [ `-tag-key-filter <regular_expression>` ]

Filter data by tag key regular expression.

##### [ `-tag-value-filter <regular_expresssion>` ]

Filter data by tag value regular expression.

#### Examples

##### Specifying paths to the `_series` and `index` directories

```
$ influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index
```
##### Specifying paths to the `_series` directory and an `index` file**

```
$ influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index/file0
```
**Specifying paths to the `_series` directory and multiple `index` files**

```
$ influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index/file0 /path/to/index/file1 ...
```

### `dumptsm`

Dumps low-level details about [TSM](/influxdb/v1.6/concepts/glossary/#tsm-time-structured-merge-tree) files, including TSM (`.tsm`) files and WAL (`.wal`) files.

#### Syntax

```
influx_inspect dumptsm [ options ] <path>
```

##### `<path>`

Path to the `.tsm` file, located by default in the `data` directory.

#### Options

Optional arguments are in brackets.

##### [ `-index` ]

Flag to dump raw index data.
Default value is `false`.

##### [ `-blocks` ]

Flag to dump raw block data.
Default value is `false`.

##### [ `-all` ]

Flag to dump all data. Caution: This may print a lot of information.
Default value is `false`.

##### [ `-filter-key <key_name>` ]

Display only index data and block data that match this key substring.
Default value is `""`.


### `export`

Exports all TSM files in Line Protocol format.
This output file can be imported using the
[influx](/influxdb/v1.5/tools/shell/#import-data-from-a-file-with-import)
command.

#### Syntax

```
influx_inspect export [ options ]
```

#### Options

Optional arguments are in brackets.

##### [ `-compress` ]

The flag to compress the output.
Default value is `false`.

##### [ `-database <db_name>` ]

The name of the database to export.
Default value is `""`.


##### `-datadir <data_dir>`

The path to the `data` directory.
Default value is `"$HOME/.influxdb/data"`.

#### [ `-end <timestamp>` ]

The timestamp for the end of the time range.
The timestamp string must be in [RFC3339 format](/influxdb/v1.6/query_language/data_exploration/#absolute-time).

#### [ `-out <export_dir>` ]

The location for the export file.
Default value is `"$HOME/.influxdb/export"`.

#### [ `-retention <rp_name> ` ]

The name of the [retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy-rp) to export. Default value is `""`.

#### [ `-start <timestamp>` ]

The timestamp for the start of the time range.
The timestamp string must be in [RFC3339 format](/influxdb/v1.6/query_language/data_exploration/#absolute-time).


#### [ `-waldir <wal_dir>` ]

Path to the [write-ahead log (WAL)](/influxdb/v1.5/concepts/glossary/#wal-write-ahead-log). Default value is `"$HOME/.influxdb/wal"`.

#### Examples

##### Export entire database and compress the output

```
influx_inspect export -compress
```

##### Export data from a specific database and retention policy

```
influx_inspect export -database mydb -retention autogen
```

##### Example of output

```
# DDL
CREATE DATABASE MY_DB_NAME
CREATE RETENTION POLICY autogen ON MY_DB_NAME DURATION inf REPLICATION 1

# DML
# CONTEXT-DATABASE:MY_DB_NAME
# CONTEXT-RETENTION-POLICY:autogen
randset value=97.9296104805 1439856000000000000
randset value=25.3849066842 1439856100000000000
```

### `report`

Displays series metadata for all shards.
The default location is `$HOME/.influxdb`.

#### Syntax

```
influx_inspect report [ options ]
```
#### Options

Optional arguments are in brackets.

##### [ `-pattern "<regular expression/wildcard>"` ]

The regular expression or wildcard pattern to match included files.
Default value is `""`.

##### [ `-detailed` ]

Report detailed cardinality estimates.
Default value is `false`.


### `reporttsi`

Provides a report about the series cardinality in one or more TSI indexes.

This command is useful when there has been a change in cardinality, and it's not clear whcih measurement is responsible for this change, and further, roughly _when_ that change happened. Emitting an accurate cardinality breakdown for each measurement and for each shard will help answer those questions.

The report does the following:
* calculates the total exact series cardinality in the database
* segments cardinality by measurement and emits those cardinality values
* emits the total exact cardinality for each shard in the database
* segments for each shard the exact cardinality for each measurement in the shard
* optionally, limits the results to the top `n` when using the `-top <n>` argument

#### Syntax

```
$ influx_inspect reporttsi -db-path ~/.influxdb/data/stress -top 10
```
#### Arguments

Optional arguments are in brackets.

##### `-db-path`

##### `-top <n>`
Limits results to the top `<n>` cardinality by measurement.

### `verify`

Verifies the integrity of TSM files.

#### Syntax

```
influx_inspect verify [ options ]
```
#### Options

Optional arguments are in brackets.

##### `-dir <storage_root>`

The path to the storage root directory.
​Default value is `"/root/.influxdb"`.

### `verify-seriesfile [ <data_dir> ]`

# Caveats

The system does not have access to the metastore when exporting TSM shards.
As such, it always creates the [retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy-rp) with infinite duration and replication factor of 1.  
End users may want to change this prior to reimporting if they are importing to a cluster or want a different duration for retention.
