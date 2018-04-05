---
title: Influx Inspect disk shard utility

menu:
  influxdb_1_5:
    weight: 50
    parent: tools
---

Influx Inspect is a disk shard utility that can be used to:

* View detailed information about disk shards
* Exporting data from a shard to [line protocol](/influxdb/v1.5/concepts/glossary/#line-protocol) that can be inserted back into the database
* Converting TSM-based shards to TSI disk-based shards

### `influx_inspect [[command] [arguments]]`

`-help` is the default command and will print usage for the tool.

The commands are:
```
    buildtsi             convert in-memory (TSM-based) shards to TSI
    dumptsi              dumps low-level details about tsi1 files.
    dumptsm              dumps low-level details about tsm1 files.
    export               exports raw data from a shard to line protocol
    help                 display this help message format
    report               displays a shard level report
    verify               verifies integrity of TSM files
```

### `influx_inspect buildtsi`

Converts TSM-based shards to shards supporting TSI (time series index) disk-based index files.
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
#### Flags

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

### influx_inspect dumptsi
Dumps low-level details about tsi1 files.
`dumptsi` returns summary stats for each file if the command does not specify any flags.

#### Usage
```
influx_inspect dumptsi [<flags>] <path>
```

#### Flags

##### `-series`
Dump raw series data.

##### `-measurements`
Dump raw [measurement](/influxdb/v1.5/concepts/glossary/#measurement) data.

##### `-tag-keys`
Dump raw [tag keys](/influxdb/v1.5/concepts/glossary/#tag-key).

##### `-tag-values`
Dump raw [tag values](/influxdb/v1.5/concepts/glossary/#tag-value).

##### `-tag-value-series`
Dump raw series for each tag value.

##### `-measurement-filter` <regular_expression>
Filter data by measurement regular expression.

##### `-tag-key-filter` <regular_expression>
Filter data by tag key regular expression.

##### `-tag-value-filter` <regular_expresssion>
Filter data by tag value regular expression.

### `influx_inspect dumptsm`
Dumps low-level details about [tsm](/influxdb/v1.5/concepts/glossary/#tsm-time-structured-merge-tree) files.

#### Usage
```
influx_inspect dumptsm [<flags>] <path>
```

#### Flags

##### `-index` bool
Dump raw index data.

`default` = false

##### `-blocks` bool
Dump raw block data.

`default` = false

##### `-all`
Dump all data. Caution: This may print a lot of information.

`default` = false

##### `-filter-key`
Only display index and block data that match this key substring.

`default` = ""


### `influx_inspect export`
Export all TSM files to line protocol.
This output file can be imported using the
[influx](/influxdb/v1.5/tools/shell/#import-data-from-a-file-with-import)
command.

#### Usage
```
influx_inspect export [flags]
```

#### Flags

#### `-compress` boolean (optional)
Compress the output.

`default` = false

#### `-database` string (optional)
Database to export.

`default` = ""

#### `-retention` string (optional)
[Retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy-rp) to export.

`default` = ""

#### `-datadir` string
Data storage path.

`default` = "$HOME/.influxdb/data"

#### `-start` string (optional)
The start of the time range.
The date-time string must be [RFC3339 format](/influxdb/v1.5/query_language/data_exploration/#absolute-time).

#### `-end` string (optional)
The end of the time range.
The date-time string must be [RFC3339 format](/influxdb/v1.5/query_language/data_exploration/#absolute-time).

#### `-out` string
Specifies location for export file

`default` = "$HOME/.influxdb/export"

#### `-waldir` string
[WAL](/influxdb/v1.5/concepts/glossary/#wal-write-ahead-log) storage path.

`default` =  "$HOME/.influxdb/wal"

#### Sample Commands

Export entire database and compress the output:
```
influx_inspect export -compress
```

Export data from a specific database and retention policy:
```
influx_inspect export -database mydb -retention autogen
```

#### Sample Data
This is a sample of what the output will look like.

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
influx_inspect report [flags]
```
#### Flags

#### `-pattern` regular expression/wildcard (optional)
Include only files matching the specified pattern.

`default` = ""

#### `-detailed` boolean
Report detailed cardinality estimates.

`default` = false

### `influx_inspect verify`
Verifies the integrity of TSM files.

#### Usage
```
influx_inspect verify [flags]
```
#### Flags

#### `-dir` string (optional)
Root storage path
​
`default` = "/root/.influxdb"


# Caveats

The system does not have access to the metastore when exporting TSM shards.
As such, it always creates the [retention policy](/influxdb/v1.5/concepts/glossary/#retention-policy-rp) with infinite duration and replication factor of 1.  End users may want to change this prior to reimporting if they are importing to a cluster or want a different duration
for retention.
