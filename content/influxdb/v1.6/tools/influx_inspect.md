---
title: Influx Inspect disk shard utility

menu:
  influxdb_1_6:
    weight: 50
    parent: Tools
---

Influx Inspect is a disk shard utility that can be used to:

* View detailed information about disk shards
* Exporting data from a shard to [line protocol](/influxdb/v1.6/concepts/glossary/#line-protocol) that can be inserted back into the database
* Converting TSM-based shards to TSI disk-based shards

### `influx_inspect [[command] [arguments]]`

`-help` is the default command and will print usage for the tool.

## `influx_inspect` commands


* [`buildtsi`](#buildtsi): Convert in-memory (TSM-based) shards to TSI
* [`dumptsi`](#dumptsi): Dump low-level details about TSI files.
* [`dumptsm`](#dumptsm): Dump low-level details about TSM files.
* [`dumptsmwal`](#dumptsmwal): Dump all data from a WAL file.  
* [`export`](#export): Export raw data from a shard in Line Protocol format.
* [`help`](#help): Display this help message format.
* [`report`](#report): Display a shard level report.
* [`verify`](#verify): Verify the integrity of TSM files.


### `buildtsi`

Converts TSM-based shards to shards supporting TSI (Time Series Index) disk-based index files.
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
#### Options

Optional arguments are in brackets.

#### `[ -database string ]`
  Database name.

#### `-datadir string`
  Data directory.

#### `[ -retention string ]`
  Retention policy.

#### `[ -shard string ]`
  Shard ID.

#### `[ -v ]`
  Verbose output.

#### -waldir string
  WAL (Write Ahead Log) directory.

#### Examples
<br>

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

Dumps low-level details about tsi1 files.
`dumptsi` returns summary stats for each file if the command does not specify any options.

#### Usage
```
influx_inspect dumptsi [ options ] <path>
```

#### Options

Optional arguments are in brackets.

##### `-series`

Dump raw series data.

##### `-measurements`

Dump raw [measurement](/influxdb/v1.6/concepts/glossary/#measurement) data.

##### `-tag-keys`

Dump raw [tag keys](/influxdb/v1.6/concepts/glossary/#tag-key).

##### `-tag-values`

Dump raw [tag values](/influxdb/v1.6/concepts/glossary/#tag-value).

##### `-tag-value-series`

Dump raw series for each tag value.

##### `-measurement-filter` <regular_expression>

Filter data by measurement regular expression.

##### `-tag-key-filter` <regular_expression>

Filter data by tag key regular expression.

##### `-tag-value-filter` <regular_expresssion>

Filter data by tag value regular expression.

### `dumptsm`

Dumps low-level details about [tsm](/influxdb/v1.6/concepts/glossary/#tsm-time-structured-merge-tree) files.

#### Syntax

```
influx_inspect dumptsm [ options ] <path>
```

#### Options

Optional arguments are in brackets.

##### `-index { true | false }`

Dump raw index data.
Default value is `false`.

##### `-blocks { true | false }`

Dump raw block data.
Default value is `false`.

##### `-all`

Dump all data. Caution: This may print a lot of information.
Default value is `false`.

##### `-filter-key`

Only display index and block data that match this key substring.
Default value is `""`.

### `dumptsmwal`

Dumps all entries from from one or more WAL files.

#### Syntax

```
influx_inspect dumptsmwal [ options ] <wal_dir>
```

#### Options

Optional arguments are in brackets.

##### [ `-show-duplicates` ]

Show keys which have duplicate or out-of-order timestamps.
If a user writes points with timestamps set by the client, then multiple points with the same timestamp (or with time-descending timestamps) can be written.


### `export`

Export all TSM files in Line Protocol data format.
This output file can be imported using the
[influx](/influxdb/v1.6/tools/shell/#import-data-from-a-file-with-import) command.

#### Syntax

```
influx_inspect export [ options ]
```

#### Options

Optional arguments are in brackets.

#### [ `-compress { true | false }` ]

Compress the output.
Default value is `false`.

#### [ `-database <db_name>` ]

Name of the database to export.
Default value is `""`.

#### [ `-retention <rp_name> ` ]

Name of the [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) to export. Default value is `""`.

#### `-datadir <data_dir>`

Path to the `data` directory.
Default value is `"$HOME/.influxdb/data"`.

#### [ `-start <timestamp>` ]

Timestamp for the start of the time range.
The timestamp string must be in [RFC3339 format](/influxdb/v1.6/query_language/data_exploration/#absolute-time).

#### [ `-end <timestamp>` ]

Timestamp for the end of the time range.
The timestamp string must be in [RFC3339 format](/influxdb/v1.6/query_language/data_exploration/#absolute-time).

#### `-out <export_dir>`

Path to the export file.
Default value is `"$HOME/.influxdb/export"`.

#### `-waldir` string

Path to the [WAL](/influxdb/v1.6/concepts/glossary/#wal-write-ahead-log) directory.
Default value is `"$HOME/.influxdb/wal"`.

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

Displays series meta-data for all shards.
The default location is `$HOME/.influxdb`.

#### Syntax

```
influx_inspect report [ options s]
```
#### Options

Optional arguments are in brackets.

#### [ `-pattern <regex_pattern>` ]

Regular expression or wildcard pattern to match included files.
Default value is `""`.

#### `-detailed { true | false }`

Reports detailed cardinality estimates.
Default value is `false`.

### `verify`

Verifies the integrity of TSM files.

#### Syntax

```
influx_inspect verify [ options ]
```
#### Options

Optional arguments are in brackets.

#### `-dir <storage_root>`

Path to the storage root directory.
​Default value is `"/root/.influxdb"`.


# Caveats

The system does not have access to the metastore when exporting TSM shards.
As such, it always creates the [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) with infinite duration and replication factor of 1.  End users may want to change this prior to reimporting if they are importing to a cluster or want a different duration
for retention.
