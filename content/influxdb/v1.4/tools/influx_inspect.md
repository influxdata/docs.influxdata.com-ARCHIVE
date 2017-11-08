---
title: Influx Inspect

menu:
  influxdb_1_4:
    weight: 40
    parent: tools
---

Influx Inspect is a tool designed to view detailed information about on disk
shards, as well as export data from a shard to [line protocol](/influxdb/v1.4/concepts/glossary/#line-protocol)
that can be inserted back into the database.

### `influx_inspect [[command] [arguments]]`
-help is the default command and will print usage for the tool.

The commands are:
```
    dumptsm              dumps low-level details about tsm1 files.
    dumptsi              dumps low-level details about tsi1 files.
    export               exports raw data from a shard to line protocol
    help                 display this help message
    report               displays a shard level report
    verify               verifies integrity of TSM files
```

### `influx_inspect dumptsm`
Dumps low-level details about [tsm](/influxdb/v1.4/concepts/glossary/#tsm-time-structured-merge-tree) files.

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
Dump raw [measurement](/influxdb/v1.4/concepts/glossary/#measurement) data.

##### `-tag-keys`
Dump raw [tag keys](/influxdb/v1.4/concepts/glossary/#tag-key).

##### `-tag-values`
 Dump raw [tag values](/influxdb/v1.4/concepts/glossary/#tag-value).

##### `-tag-value-series`
Dump raw series for each tag value.

##### `-measurement-filter` <regular_expression>
Filters data by measurement regular expression.

##### `-tag-key-filter` <regular_expression>
Filters data by tag key regular expression.

##### `-tag-value-filter` <regular_expresssion>
Filters data by tag value regular expression.


### `influx_inspect export`
Exports all tsm files to line protocol.  This output file can be imported via
the
[influx](/influxdb/v1.4/tools/shell/#import-data-from-a-file-with-import)
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
[Retention policy](/influxdb/v1.4/concepts/glossary/#retention-policy-rp) to export.

`default` = ""

#### `-datadir` string
Data storage path.

`default` = "$HOME/.influxdb/data"

#### `-start` string (optional)
The start of the time range.
The date-time string must be [RFC3339 format](/influxdb/v1.4/query_language/data_exploration/#absolute-time).

#### `-end` string (optional)
The end of the time range.
The date-time string must be [RFC3339 format](/influxdb/v1.4/query_language/data_exploration/#absolute-time).

#### `-out` string
Specifies location for export file 

`default` = "$HOME/.influxdb/export"

#### `-waldir` string
[WAL](/influxdb/v1.4/concepts/glossary/#wal-write-ahead-log) storage path.

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

#### `-pattern` boolean 
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
           
`default` = "/root/.influxdb"


# Caveats

The system does not have access to the meta store when exporting TSM shards.
As such, it always creates the [retention policy](/influxdb/v1.4/concepts/glossary/#retention-policy-rp) with infinite duration and
replication factor of 1.  End users may want to change this prior to
re-importing if they are importing to a cluster or want a different duration
for retention.


