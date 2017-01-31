---
title: Backup and Restore
menu:
  enterprise_1_2:
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
Backups are incremental by default; they backup only the shards that have changed since the last backup.
If there are no existing backups, the system automatically performs a full backup.
All backups also include a manifest, a JSON file describing what was collected during the backup.

The filenames reflect the UTC timestamp of when the backup was created, for example:

* Data backup: `20060102T150405Z.<shard_id>.tar.gz`
* Meta backup: `20060102T150405Z.meta`
* Manifest: `20060102T150405Z.manifest`

A **restore** adds the backed-up data to the cluster.
By default, a restore is incremental and writes to databases using the backed-up data's replication factor.
An alternate replication factor can be specified with the `-newrf` flag when restoring a single database.

## Syntax

### Backup
```
influxd-ctl [-bind <hostname>:8091] backup [options] <path-to-backup-directory>
```
Options:

* `-bind <hostname>:8091`: the hostname and HTTP port of a running meta server (defaults to `localhost:8091`)
* `-db <string>`: the name of the single database to back up
* `-from <TCP-address>`: the data node TCP address to prefer when backing up
* `-full`: perform a full backup
* `-rp <string>`: the name of the single retention policy to back up (must specify `-db` with `-rp`)
* `-shard <unit>`: the ID of the single shard to back up

Restoring a `-full` backup and restoring an incremental backup require different syntax.
To prevent issues with restore, keep `-full` backups and incremental backups in separate directories.

#### Examples

##### Example 1: Perform an incremental backup
<br>
Perform an incremental backup into the current directory with the command below.
If there are any existing backups the current directory, the system performs an incremental backup.
If there aren't any existing backups in the current directory, the system performs a backup of all data in InfluxDB.
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
##### Example 2: Perform a full backup
<br>
Perform a full backup into a specific directory with the command below.
The directory must already exist.

```
influxd-ctl backup -full <path-to-backup-directory>
```

Output:
```
$ influxd-ctl backup -full backup_dir
Backing up meta data... Done. 481 bytes transferred
Backing up node <hostname>:8088, db _internal, rp monitor, shard 1... Done. Backed up in 33.207375ms, 238080 bytes transferred
Backing up node <hostname>:8088, db telegraf, rp autogen, shard 2... Done. Backed up in 15.184391ms, 95232 bytes transferred
Backed up to backup_dir in 51.388233ms, transferred 333793 bytes
~# ls backup_dir
20170130T184058Z.manifest
20170130T184058Z.meta
20170130T184058Z.s1.tar.gz
20170130T184058Z.s2.tar.gz
```

##### Example 3: Perform an incremental backup on a single database
<br>
Point at a remote meta server and back up only one database into a given directory (the directory must already exist):
```
influxd-ctl -bind <metahost>:8091 backup -db <db-name> <path-to-backup-directory>
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

#### Incremental Restore
Use a incremental restore to restore an incremental backup to a new cluster or an existing cluster.
Note that the existing cluster must contain no data in the affected databases.*
Performing an incremental restore from an incremental backup requires the path to the incremental backup's directory.

<dt> In version 1.2.1, an incremental restore requires users to `cd` into
the backup directory and run `influxd-ctl restore [options] .` from that directory.
This issue will be fixed in the next point release.
</dt>

```
influxd-ctl [-bind <hostname>:8091] restore [options] <path-to-backup-directory>
```

\* The existing cluster can have data in the `_internal` database, the database
that the system creates by default.
The system automatically drops the `_internal` database when it performs an incremental restore.

Options:

* `-bind <hostname>:8091`: the hostname and HTTP port of a running meta server (defaults to `localhost:8091`)
* `-db <string>`: the name of the single database to restore
* `-list`: shows the contents of the backup
* `-newdb <string>`: the name of the new database to restore to (must specify with `-db`)
* `-newrf <int>`: the new replication factor to restore to (this is capped to the number of data nodes in the cluster)
* `-newrp <string>`: the name of the new retention policy to restore to (must specify with `-rp`)
* `-rp <string>`: the name of the single retention policy to restore
* `-shard <unit>`: the shard ID to restore

> **Note:**
An incremental restore requires that the cluster hardware has the same hostnames as during the backup.
If the hostnames have changed, you will need to restore the databases one-by-one.

#### Full Restore
Use a full restore to restore a full backup to a new cluster or an existing cluster.
Note that the existing cluster must contain no data in the affected databases.*
Performing a full restore from a full backup requires the `-full` flag and the path to the full backup's manifest file.

```
influxd-ctl [-bind <hostname>:8091] restore [options] -full <path-to-manifest-file>
```

\* The existing cluster can have data in the `_internal` database, the database
that the system creates by default.
The system automatically drops the `_internal` database when it performs a
full restore.

Options:

* `-bind <hostname>:8091`: the hostname and HTTP port of a running meta server (defaults to `localhost:8091`)
* `-db <string>`: the name of the single database to restore
* `-list`: shows the contents of the backup
* `-newdb <string>`: the name of the new database to restore to (must specify with `-db`)
* `-newrf <int>`: the new replication factor to restore to (this is capped to the number of data nodes in the cluster)
* `-newrp <string>`: the name of the new retention policy to restore to (must specify with `-rp`)
* `-rp <string>`: the name of the single retention policy to restore
* `-shard <unit>`: the shard ID to restore

> **Note:**
A full restore requires that the cluster hardware has the same hostnames as during the backup.
If the hostnames have changed, you will need to restore the databases one-by-one.

#### Examples

##### Example 1: Perform an incremental restore
<br>
```
cd <path-to-backup-directory>
influxd-ctl restore .
```

<dt> In version 1.2.1, an incremental restore requires users to `cd` into
the backup directory and run `influxd-ctl restore [options] .` from that directory.
This issue will be fixed in the next point release.
</dt>

Output:
```
$ cd cd my-incremental-backup/
$ influxd-ctl restore .
Using backup directory: .
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Error.
restore: operation exited with error: problem setting snapshot: cannot restore into non-empty cluster
<hostname>:~/my-incremental-backup# influxd-ctl restore .
Using backup directory: .
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 21.373019ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 61.046571ms, 588800 bytes transferred
Restored from . in 83.892591ms, transferred 588800 bytes
```

##### Example 2: Perform a full restore
<br>
```
influxd-ctl restore -full <path-to-manifest-file>
```

Output:
```
$ influxd-ctl restore -full my-full-backup/20170131T020341Z.manifest
Using manifest: my-full-backup/20170131T020341Z.manifest
Restoring meta data... Done. Restored in 9.585639ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 48.095082ms, 569344 bytes transferred
Restored from my-full-backup in 58.58301ms, transferred 569344 bytes
```

##### Example 3: Perform an incremental restore for a single database and give the database a new name
<br>
```
cd <path-to-backup-directory>
influxd-ctl restore -db <src> -newdb <dest> .
```

<dt> In version 1.2.1, an incremental restore requires users to `cd` into
the backup directory and run `influxd-ctl restore [options] .` from that directory.
This issue will be fixed in the next point release.
</dt>

Output:
```
$ cd my-incremental-backup
$ influxd-ctl restore -db telegraf -newdb restored_telegraf .
Using backup directory: .
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 8.119655ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 4...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 4 in 57.89687ms, 588800 bytes transferred
Restored from . in 66.715524ms, transferred 588800 bytes
```

##### Example 4: Perform an incremental restore for a backed up database and merge that database into an existing database
<br>
Your `telegraf` database was mistakenly dropped, but you have a recent backup so you've only lost a small amount of data.

If [Telegraf](/telegraf/v1.2/) is still running, it will recreate the `telegraf` database shortly after the database is dropped.
You might try to directly restore your `telegraf` backup just to find that you can't restore:

<dt> In version 1.2.1, an incremental restore requires users to `cd` into
the backup directory and run `influxd-ctl restore [options] .` from that directory.
This issue will be fixed in the next point release.
</dt>

```
$ cd my-incremental-backup
$ influxd-ctl restore -db telegraf .
Using backup directory: .
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Error.
restore: operation exited with error: problem setting snapshot: cannot restore into non-empty cluster
```

To work around this, you can restore your telegraf backup into a new database by specifying the `-db` flag for the source and the `-newdb` flag for the new destination:

```
$ cd my-incremental-backup
$ influxd-ctl restore -db telegraf -newdb restored_telegraf .
Using backup directory: .
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 19.915242ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 7...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 7 in 36.417682ms, 588800 bytes transferred
Restored from . in 56.623615ms, transferred 588800 bytes
```

Then, in the [`influx` client](/influxdb/v1.2/tools/shell/), use an [`INTO` query](/influxdb/v1.2/query_language/data_exploration/#relocate-data) to copy the data from the new database into the existing `telegraf` database:

```
$ influx
> USE restored_telegraf
Using database restored_telegraf
> SELECT * INTO telegraf..:MEASUREMENT FROM /.*/ GROUP BY *
name: result
------------
time                  written
1970-01-01T00:00:00Z  471
```
