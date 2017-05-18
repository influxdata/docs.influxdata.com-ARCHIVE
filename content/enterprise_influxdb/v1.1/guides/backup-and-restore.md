---
title: Backup and Restore
menu:
  enterprise_influxdb_1_1:
    weight: 0
    parent: Guides
---

## Overview

The primary use cases for backup/restore are:

* Disaster recovery
* Debugging
* Restoring clusters to a consistent state

Currently, InfluxEnterprise supports backups and restores for all data in the
cluster; a single database; a single database and retention policy; and a
single [shard](/influxdb/v0.13/concepts/glossary/#shard).

> **Note:** Backups are not interchangeable between OSS InfluxDB and InfluxEnterprise. 
You cannot restore an OSS backup to an InfluxEnterprise data node, nor can you restore
an InfluxEnterprise backup to an OSS instance.

## Terminology and behavior

A **backup** creates a copy of the cluster’s data and meta data at that point in time and stores the copy in the specified directory.
The backup also includes a manifest, a JSON file describing what was collected during the backup.

The filenames reflect the UTC timestamp of when the backup was created, for example:

* Data backup: `20060102T150405Z.<shard_id>.tar.gz`
* Meta backup: `20060102T150405Z.meta`
* Manifest: `20060102T150405Z.manifest`

A **restore** adds the backed-up data to the cluster.
By default, a restore attempts to write databases using backed-up data's replication factor.
An alternate replication factor can be specified with the `-newrf` flag when restoring a single database.

## Syntax

### Backup
```
influxd-ctl [-bind <hostname>:8091] backup [options] <backup-directory>
```
Options:

* `-bind <hostname>:8091`: the hostname and HTTP port of a running meta server (defaults to `localhost:8091`)
* `-db <string>`: the name of the single database to back up
* `-from <TCP-address>`: the data node TCP address to prefer when backing up
* `-rp <string>`: the name of the single retention policy to back up (must specify `-db` with `-rp`)
* `-shard <unit>`: the ID of the single shard to back up

#### Examples

##### Back up all data
<br>
To perform a full backup into the current directory:
```
influxd-ctl backup .
```

Output:
```
$ influxd-ctl backup .
Backing up meta data... Done. 421 bytes transferred
Backing up node 7ba671c7644b:8088, db telegraf, rp autogen, shard 4... Done. Backed up in 903.539567ms, 307712 bytes transferred
Backing up node bf5a5f73bad8:8088, db _internal, rp monitor, shard 1... Done. Backed up in 138.694402ms, 53760 bytes transferred
Backing up node 9bf0fa0c302a:8088, db _internal, rp monitor, shard 2... Done. Backed up in 101.791148ms, 40448 bytes transferred
Backing up node 7ba671c7644b:8088, db _internal, rp monitor, shard 3... Done. Backed up in 144.477159ms, 39424 bytes transferred
Backed up to . in 1.293710883s, transferred 441765 bytes
$ ls
20160803T222310Z.manifest  20160803T222310Z.s1.tar.gz  20160803T222310Z.s3.tar.gz
20160803T222310Z.meta      20160803T222310Z.s2.tar.gz  20160803T222310Z.s4.tar.gz
```

##### Back up a single database
<br>
Point at a remote meta server and back up only one database into a given directory (the directory must already exist):
```
influxd-ctl -bind <metahost>:8091 backup -db <db-name> <path-to-directory>
```

Output:
```
$ influxd-ctl -bind 2a1b7a338184:8091 backup -db telegraf ./telegrafbackup
Backing up meta data... Done. 318 bytes transferred
Backing up node 7ba671c7644b:8088, db telegraf, rp autogen, shard 4... Done. Backed up in 997.168449ms, 399872 bytes transferred
Backed up to ./telegrafbackup in 1.002358077s, transferred 400190 bytes
$ ls ./telegrafbackup
20160803T222811Z.manifest  20160803T222811Z.meta  20160803T222811Z.s4.tar.gz
```

### Restore
```
influxd-ctl [-bind <hostname>:8091] restore [options] <path-to-manifest-file>
```
Options:

* `-bind <hostname>:8091`: the hostname and HTTP port of a running meta server (defaults to `localhost:8091`)
* `-db <string>`: the name of the single database to restore
* `-list`: shows the contents of the backup
* `-newdb <string>`: the name of the new database to restore to (must specify with `-db`)
* `-newrf <int>`: the new replication factor to restore to (this is capped to the number of data nodes in the cluster)
* `-newrp <string>`: the name of the new retention policy to restore to (must specify with `-rp`)
* `-rp <string>`: the name of the single retention policy to restore
* `-shard <unit>`: the shard ID to restore

#### Examples

##### Restore a full backup
<br>
A full restore requires that the cluster hardware has the same hostnames as during the backup.
If the hostnames have changed, you will need to restore the databases one-by-one.

`influxd-ctl restore <path-to-manifest>`

Output:
```
$ influxd-ctl restore ./20160803T225759Z.manifest
Using manifest: ./20160803T225759Z.manifest
Restoring meta data... Done. Restored in 76.049631ms, 4 shards mapped
Restoring db telegraf, rp autogen, shard 4 to shard 4...
Copying data to bdb2c4b56071:8088... Copying data to 95bc5959b985:8088... Copying data to a9f8bbb35cad:8088... Done. Restored shard 4 into shard 4 in 96.756767ms, 198144 bytes transferred
Restoring db _internal, rp monitor, shard 1 to shard 1...
Copying data to bdb2c4b56071:8088... Done. Restored shard 1 into shard 1 in 34.089374ms, 25088 bytes transferred
Restoring db _internal, rp monitor, shard 2 to shard 2...
Copying data to 95bc5959b985:8088... Done. Restored shard 2 into shard 2 in 1.618344596s, 38912 bytes transferred
Restoring db _internal, rp monitor, shard 3 to shard 3...
Copying data to a9f8bbb35cad:8088... Done. Restored shard 3 into shard 3 in 36.137453ms, 19456 bytes transferred
Restored from . in 1.864106729s, transferred 281600 bytes
```

##### Restore a single database and give it a new name
<br>
`influxd-ctl restore -db <src> -newdb <dest> <path-to-manifest>`

Output:
```
$ influxd-ctl restore -db telegraf -newdb restored_telegraf ./20160803T225759Z.manifest
Using manifest: ./20160803T225759Z.manifest
Restoring meta data... Done. Restored in 57.729885ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 4 to shard 5...
Copying data to bdb2c4b56071:8088... Copying data to 95bc5959b985:8088... Copying data to a9f8bbb35cad:8088... Done. Restored shard 4 into shard 5 in 93.415749ms, 198144 bytes transferred
Restored from . in 151.33582ms, transferred 198144 bytes
```

##### Restore a backed up database and merge it into an existing database
<br>
Your `telegraf` database was mistakenly dropped, but you have a recent backup so you've only lost a small amount of data.

If [Telegraf](/telegraf/v1.1/) is still running, it will recreate the `telegraf` database shortly after the database is dropped.
You might try to directly restore your `telegraf` backup just to find that you can't restore:

```
$ influxd-ctl restore -db telegraf ./20160803T225759Z.manifest
Using manifest: ./20160803T225759Z.manifest
Restoring meta data... Error.
restore: operation exited with error: problem setting snapshot: database already exists
```

To work around this, you can restore your telegraf backup into a new database by specifying the `-db` flag for the source and the `-newdb` flag for the new destination:

```
$ # influxd-ctl restore -db telegraf -newdb restored_telegraf ./20160803T225759Z.manifest
Using manifest: ./20160803T225759Z.manifest
Restoring meta data... Done. Restored in 119.785611ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 4 to shard 5...
Copying data to 13787a2bf2c6:8088... Copying data to cc8d090d7a5c:8088... Copying data to b0e32efdfda7:8088... Done. Restored shard 4 into shard 5 in 73.217002ms, 198144 bytes transferred
Restored from . in 193.480371ms, transferred 198144 bytes
```

Then, in the [`influx` client](/influxdb/v1.1/tools/shell/), use an [`INTO` query](/influxdb/v1.1/query_language/data_exploration/#relocate-data) to copy the data from the new database into the existing `telegraf` database:

```
$ influx
> use restored_telegraf
Using database restored_telegraf
> SELECT * INTO telegraf..:MEASUREMENT FROM /.*/ GROUP BY *
name: result
------------
time                  written
1970-01-01T00:00:00Z  471
```
