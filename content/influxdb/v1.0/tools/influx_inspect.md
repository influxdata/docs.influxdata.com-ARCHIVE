---
title: Influx Inspect

menu:
  influxdb_1_0:
    weight: 0
    parent: tools
---

Influx Inspect is a tool designed to view detailed information about on disk
shards, as well as export data from a shard to [line protocol](/influxdb/v0.10/write_protocols/line/)
that can be inserted back into the database.

### `influx_inspect`
Will print usage for the tool.

### `influx_inspect report`
Displays series meta-data for all shards.  Default location [$HOME/.influxdb]

### `influx_inspect dumptsm`
Dumps low-level details about tsm1 files

#### Flags

##### `-index` bool
Dump raw index data.

`default` = false

#### `-blocks` bool
Dump raw block data.

`default` = false

#### `-all`
Dump all data. Caution: This may print a lot of information.

`default` = false

#### `-filter-key`
Only display index and block data match this key substring.

`default` = ""

### `influx_inspect export`
Exports all tsm files to line protocol.  This output file can be imported via
the
[influx](https://github.com/influxdata/influxdb/tree/master/importer#running-the-import-command)
command.

#### `-dir` string
Root storage path.

`default` = "$HOME/.influxdb"

#### `-out` string
Destination file to export to

`default` = "$HOME/.influxdb/export"

#### `-db` string (optional)
Database to export.

`default` = ""

#### `-rp` string (optional)
Retention policy to export.

`default` = ""

#### `-compress` bool (optional)
Compress the output.

`default` = false

#### Sample Commands

Export entire database and compress output:
```
influx_inspect export --compress
```

Export specific retention policy:
```
influx_inspect export --db mydb --rp autogen
```

##### Sample Data
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

# Caveats

The system does not have access to the meta store when exporting TSM shards.
As such, it always creates the retention policy with infinite duration and
replication factor of 1.  End users may want to change this prior to
re-importing if they are importing to a cluster or want a different duration
for retention.
