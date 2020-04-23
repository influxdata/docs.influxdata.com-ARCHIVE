---
title: Influx Inspect disk utility
description: Use the "influx_inspect" commands to manage InfluxDB disks and shards.
menu:
  influxdb_1_7:
    weight: 50
    parent: Tools
---

Influx Inspect is an InfluxDB disk utility that can be used to:

* View detailed information about disk shards.
* Export data from a shard to [InfluxDB line protocol](/influxdb/v1.7/concepts/glossary/#influxdb-line-protocol) that can be inserted back into the database.
* Convert TSM index shards to TSI index shards.

## `influx_inspect` utility

### Syntax

```
influx_inspect [ [ command ] [ options ] ]
```

`-help` is the default command and prints syntax and usage information for the tool.

### `influx_inspect` commands

The `influx_inspect` commands are summarized here, with links to detailed information on each of the commands.

* [`buildtsi`](#buildtsi): Converts in-memory (TSM-based) shards to TSI.
* [`deletetsm`](#deletetsm): Bulk deletes a measurement from a raw TSM file.
* [`dumptsi`](#dumptsi): Dumps low-level details about TSI files.
* [`dumptsm`](#dumptsm): Dumps low-level details about TSM files.
* [`dumptsmwal`](#dumptsmwal): Dump all data from a WAL file.  
* [`export`](#export): Exports raw data from a shard in InfluxDB line protocol format.
* [`report`](#report): Displays a shard level report.
* [`reporttsi`](#reporttsi): Reports on cardinality for measurements and shards.
* [`verify`](#verify): Verifies the integrity of TSM files.
* [`verify-seriesfile`](#verify-seriesfile): Verifies the integrity of series files.


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

##### `[ -batch-size ]`

The size of the batches written to the index. Default value is `10000`.

{{% warn %}}**Warning:** Setting this value can have adverse effects on performance and heap size.{{% /warn %}}


##### `[ -concurrency ]`

The number of workers to dedicate to shard index building.
Defaults to [`GOMAXPROCS`](/influxdb/v1.7/administration/config#gomaxprocs-environment-variable) value.

##### `[ -database <db_name> ]`

The name of the database.

##### `-datadir <data_dir>`

The path to the `data` directory.

##### `[ -max-cache-size ]`

The maximum size of the cache before it starts rejecting writes.
This value overrides the configuration setting for
`[data] cache-max-memory-size`.
Default value is `1073741824`.

##### `[ -max-log-file-size ]`

The maximum size of the log file. Default value is `1048576`.

##### `[ -retention <rp_name> ]`

The name of the retention policy.

##### `[ -shard <shard_ID> ]`

The identifier of the shard.

##### `[ -v ]`

Flag to enable output in verbose mode.

##### `-waldir <wal_dir>`

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

### `deletetsm`

Bulk deletes a measurement from a raw TSM file.

{{% warn %}} **Warning:** Use the `deletetsm` command only when your InfluxDB instance is offline (`influxd` service is not running).{{% /warn %}}

#### Syntax

````
influx_inspect deletetsm -measurement <measurement_name> [ arguments ] <path>
````
##### `<path>`

Path to the `.tsm` file, located by default in the `data` directory.

When specifying the path, wildcards (`*`) can replace one or more characters.

#### Options

Optional arguments are in brackets.

##### `-measurement`

The name of the measurement to delete from TSM files.

##### [ `-sanitize` ]

Flag to remove all keys containing non-printable Unicode characters.

##### [ `-v` ]

Flag to enable verbose logging.

#### Examples

##### Delete a measurement from a single shard

```
./influx_inspect deletetsm -sanitize /influxdb/data/location/autogen/1384/*.tsm
```

##### Delete a measurement from all shards in the database

```
./influx_inspect deletetsm -sanitize /influxdb/data/location/autogen/*/*.tsm
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

Dump raw [measurement](/influxdb/v1.7/concepts/glossary/#measurement) data.

##### [ `-tag-keys` ]

Dump raw [tag keys](/influxdb/v1.7/concepts/glossary/#tag-key).

##### [ `-tag-values` ]

Dump raw [tag values](/influxdb/v1.7/concepts/glossary/#tag-value).

##### [ `-tag-value-series` ]

Dump raw series for each tag value.

##### [ `-measurement-filter <regular_expression>` ]

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

##### Specifying paths to the `_series` directory and an `index` file

```
$ influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index/file0
```
##### Specifying paths to the `_series` directory and multiple `index` files

```
$ influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index/file0 /path/to/index/file1 ...
```

### `dumptsm`

Dumps low-level details about [TSM](/influxdb/v1.7/concepts/glossary/#tsm-time-structured-merge-tree) files, including TSM (`.tsm`) files and WAL (`.wal`) files.

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

### `dumptsmwal`

Dumps all entries from one or more WAL (`.wal`) files only and excludes TSM (`.tsm`) files.

#### Syntax

```
influx_inspect dumptsmwal [ options ] <wal_dir>
```

#### Options

Optional arguments are in brackets.

##### [ `-show-duplicates` ]

Flag to show keys which have duplicate or out-of-order timestamps.
If a user writes points with timestamps set by the client, then multiple points with the same timestamp (or with time-descending timestamps) can be written.

### `export`

Exports all TSM files in InfluxDB line protocol data format.
Writes all WAL file data for `_internal/monitor`.
This output file can be imported using the
[influx](/influxdb/v1.7/tools/shell/#import-data-from-a-file-with-import) command.

#### Syntax

```
influx_inspect export [ options ]
```

#### Options

Optional arguments are in brackets.

##### [ `-compress` ]

The flag to compress the output using gzip compression.
Default value is `false`.

##### [ `-database <db_name>` ]

The name of the database to export.
Default value is `""`.

##### `-datadir <data_dir>`

The path to the `data` directory.
Default value is `"$HOME/.influxdb/data"`.

##### [ `-end <timestamp>` ]

The timestamp for the end of the time range. Must be in [RFC3339 format](https://tools.ietf.org/html/rfc3339).

RFC3339 requires very specific formatting. For example, to indicate no time zone offset (UTC+0), you must include Z or +00:00 after seconds. Examples of valid RFC3339 formats include:

**No offset**

```
YYYY-MM-DDTHH:MM:SS+00:00
YYYY-MM-DDTHH:MM:SSZ
YYYY-MM-DDTHH:MM:SS.nnnnnnZ (fractional seconds (.nnnnnn) are optional)
```

**With offset**

```
YYYY-MM-DDTHH:MM:SS-08:00
YYYY-MM-DDTHH:MM:SS+07:00
```

> **Note:** With offsets, avoid replacing the + or - sign with a Z. It may cause an error or print Z (ISO 8601 behavior) instead of the time zone offset.

##### [ `-out <export_dir>` ]

The location for the export file.
Default value is `"$HOME/.influxdb/export"`.

##### [ `-retention <rp_name> ` ]

The name of the [retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp) to export. Default value is `""`.

##### [ `-start <timestamp>` ]

The timestamp for the start of the time range.
The timestamp string must be in [RFC3339 format](https://tools.ietf.org/html/rfc3339).

##### [ `-waldir <wal_dir>` ]

Path to the [WAL](/influxdb/v1.7/concepts/glossary/#wal-write-ahead-log) directory.
Default value is `"$HOME/.influxdb/wal"`.

#### Examples

##### Export all databases and compress the output

```bash
influx_inspect export -compress
```

##### Export data from a specific database and retention policy

```bash
influx_inspect export -database mydb -retention autogen
```

##### Output file

```bash
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

The flag to report detailed cardinality estimates.
Default value is `false`.

##### [ `-exact` ]

The flag to report exact cardinality counts instead of estimates.
Default value is `false`.
Note: This can use a lot of memory.

### `reporttsi`

The report does the following:

* Calculates the total exact series cardinality in the database.
* Segments that cardinality by measurement, and emits those cardinality values.
* Emits total exact cardinality for each shard in the database.
* Segments for each shard the exact cardinality for each measurement in the shard.
* Optionally limits the results in each shard to the "top n".

The `reporttsi` command is primarily useful when there has been a change in cardinality
and it's not clear which measurement is responsible for this change, and further, _when_
that change happened. Estimating an accurate cardinality breakdown for each measurement
and for each shard will help answer those questions.

### Syntax

```
influx_inspect reporttsi -db-path <path-to-db> [ options ]
```

#### Options

Optional arguments are in brackets.

##### `-db-path <path-to-db>`

The path to the database.

##### [ `-top <n>` ]

Limits the results to the top specified number within each shard.

#### Performance

The `reporttsi` command uses simple slice/maps to store low cardinality measurements, which saves on the cost of initializing bitmaps.
For high cardinality measurements the tool uses [roaring bitmaps](https://roaringbitmap.org/), which means we don't need to store all series IDs on the heap while running the tool.
Conversion from low-cardinality to high-cardinality representations is done automatically while the tool runs.

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

### `verify-seriesfile`

Verifies the integrity of series files.

#### Syntax

```
influx_inspect verify-seriesfile [ options ]
```

#### Options

Optional arguments are in brackets.

##### [ `-c <number>` ]

Specifies the number of concurrent workers to run for this command. Default is equal to the value of GOMAXPROCS. If performance is adversely impacted, you can set a lower value.

##### [ `-dir <path>` ]

Specifies the root data path. Defaults to `~/.influxdb/data`.

##### [ `-db <db_name>` ]

Restricts verifying series files to the specified database in the data directory.

##### [ `-series-file <path>` ]

Path to a specific series file; overrides `-db` and `-dir`.

##### [ `-v` ]

Enables verbose logging.

## Caveats

The system does not have access to the metastore when exporting TSM shards.
As such, it always creates the [retention policy](/influxdb/v1.7/concepts/glossary/#retention-policy-rp) with infinite duration and replication factor of 1. If you're importing data into a cluster (or want to change this duration and replication factor), update the retention policy **prior to reimporting**.

> **Note:** To ensure data is successfully replicated across a cluster, the number of data nodes in a cluster **must be evenly divisible** by the replication factor.
