---
title: Influx Inspect disk shard utility

menu:
  influxdb_1_5:
    weight: 50
    parent: Tools
---

Influx Inspect is a disk shard utility that can be used to:

* View detailed information about disk shards.
* Exporting data from a shard to [line protocol](/influxdb/v1.5/concepts/glossary/#line-protocol) that can be inserted back into the database.
* Converting TSM in-memory index shards to TSI disk-based shards.

### `influx_inspect [ [ command ] [ options ] ]`

`-help` is the default command and will print usage for the tool.

The `influx_inspect` commands are:

* [`buildtsi`](#influx-inspect-buildtsi): Converts in-memory (TSM-based) shards to TSI.
* [`dumptsi`](#influx-inspect-dumptsi): Dumps low-level details about TSI files.
* [`dumptsm`](#influx-inspect-dumptsm): Dumps low-level details about TSM files.
* [`export`](#influx-inspect-export): Exports raw data from a shard to Line Protocol.
* [`help`](#influx-inspect-help): Displays this help message format.
* [`report`](#influx-inspect-report): Displays a shard level report.
* [`verify`](#influx-inspect-verify): Verifies integrity of TSM files.


### `influx_inspect buildtsi`

Converts shards using in-memory indexes to shards supporting TSI (time series index) disk-based index files.
The index is written to a temporary location until complete and then moved to a permanent location.
If an error occurs, then this operation will fall back to the original in-memory index.

> ***Note:*** This tool is for offline conversion only.
> When TSI is enabled, new shards use the TSI indexes.
> Existing shards continue as TSM-based shards until
> converted offline.

#### Usage

> **Note:** Run the `buildtsi` command using the user account that you are going to run the database as,
> or ensure that the permissions match afterward.

```
influx_inspect buildtsi -datadir <data_directory> -waldir <WAL_directory> [ options ]
```
#### Arguments

Optional arguments are in brackets.

##### [ `-database <db_name>` ]
  Database name.

##### `-datadir <data_dir>`
  Data directory.

##### [ `-retention <rp_name>` ]
  Retention policy.

##### [ `-shard <shard_ID>` ]
  Shard ID.

##### [ `-v` ]
  Verbose output.

##### `-waldir <wal_dir>`
  WAL (Write Ahead Log) directory.

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

### `influx_inspect dumptsi`

Dumps low-level details about TSI files, including `.tsl` log files and `.tsi` index files.

#### Usage

```
influx_inspect dumptsi [ options ] <index_path>
```

##### `<index_path>`
Path to the `index` directory, or space-separated paths to individual `index` files. Paths are space-separated. Specify the `index` directory unless you need to target individual `index` files for debugging. See the examples below.


#### Arguments

Optional arguments are in brackets.
If optional arguments are not specified, the `dumptsi` command returns summary statistics for each file.

##### `-series-file <series_path>`
Path to the `_series` directory. Required.

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

**Specifying paths to the `_series` and `index` directories**

```
$ influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index
```
**Specifying paths to the `_series` directory and an `index` file**

```
$ influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index/file0
```
**Specifying paths to the `_series` directory and multiple `index` files**

```
$ influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index/file0 /path/to/index/file1 ...
```

### `influx_inspect dumptsm`

Dumps low-level details about [TSM](/influxdb/v1.5/concepts/glossary/#tsm-time-structured-merge-tree) files.

#### Usage

```
influx_inspect dumptsm [ options ] <path>
```

##### `<path>`
Path to the `.tsm` file, located by default in the `data` directory.

#### Arguments

Optional arguments are in brackets.

##### [ `-index true|false` ]
Dump raw index data.
Default value is `false`.

##### [ `-blocks true|false` ]
Dump raw block data. Default is `false`.

##### [ `-all true|false` ]
Dump all data.  Default is `false`.
Caution: This may print a lot of information.

##### [ `-filter-key <filter_key>` ]

Only display index and block data that match this key substring. Default value is `""`.


### `influx_inspect export`

Export all TSM files to Line Protocol format.
This output file can be imported using the
[influx](/influxdb/v1.5/tools/shell/#import-data-from-a-file-with-import)
command.

#### Usage
```
influx_inspect export [options]
```

#### Arguments

Optional arguments are in brackets.

##### [ `-compress true|false` ]

Compress the output.
Default value is `false`.

##### [ `-database <db_name>` ]

Database to export.
Default value is `""`.

##### [ `-retention <rp_name>` ]

[Retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy-rp) to export. Default value is `""`.

##### `-datadir <data_dir>`

Data storage path. Required.
Default value is `"$HOME/.influxdb/data"`.

##### [ `-start <timestamp>` ]

Timestamp representing the start of the time range.
The timestamp string must be in [RFC3339 format](/influxdb/v1.5/query_language/data_exploration/#absolute-time).

##### [ `-end <timestamp>` ]
Timestamp representing the end of the time range.
The timestamp string must be in [RFC3339 format](/influxdb/v1.5/query_language/data_exploration/#absolute-time).

##### `-out <export_location>`
Specifies the location for the export file.
Default value is `"$HOME/.influxdb/export"`.

##### `-waldir <wal_dir>`

Path to the [write-ahead log (WAL)](/influxdb/v1.5/concepts/glossary/#wal-write-ahead-log). Default value is `"$HOME/.influxdb/wal"`.

#### Examples

**Export entire database and compress the output:**

```
influx_inspect export -compress
```

##### Export data from a specific database and retention policy

```
influx_inspect export -database mydb -retention autogen
```

##### Example of the output

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

### `influx_inspect report`
Displays series meta-data for all shards.
The default location is [$HOME/.influxdb].

#### Usage
```
influx_inspect report [ options ]
```
#### Arguments

Optional arguments are in brackets.

##### [ `-pattern "<regular expression/wildcard>"` ]
Include only files matching the specified pattern.
Default value is `""`.

##### [ `-detailed true|false` ]
Report detailed cardinality estimates.
Default value is `false`.


### `influx_inspect verify`
Verifies the integrity of TSM files.

#### Usage
```
influx_inspect verify [ options ]
```
#### Arguments

Optional arguments are in brackets.

##### [ `-dir <root_storage>` ]

Root storage path.
​Default value is `"/root/.influxdb"`.


# Caveats

The system does not have access to the metastore when exporting TSM shards.
As such, it always creates the [retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy-rp) with infinite duration and replication factor of 1.  End users may want to change this prior to reimporting if they are importing to a cluster or want a different duration
for retention.
