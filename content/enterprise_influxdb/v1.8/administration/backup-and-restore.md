---
title: Back up and restore InfluxDB Enterprise clusters
aliases:
    - /enterprise/v1.8/guides/backup-and-restore/
menu:
  enterprise_influxdb_1_8:
    name: Back up and restore
    weight: 80
    parent: Administration
---

## Overview

When deploying InfluxDB Enterprise in production environments, you should have a strategy and procedures for backing up and restoring your InfluxDB Enterprise clusters to be prepared for unexpected data loss.

The tools provided by InfluxDB Enterprise can be used to:

- Provide disaster recovery due to unexpected events
- Migrate data to new environments or servers
- Restore clusters to a consistent state
- Debugging

Depending on the volume of data to be protected and your application requirements, InfluxDB Enterprise offers two methods, described below, for managing backups and restoring data:

- [Backup and restore utilities](#backup-and-restore-utilities) — For most applications
- [Exporting and importing data](#exporting-and-importing-data) — For large datasets

> **Note:** Use the [`backup` and `restore` utilities (InfluxDB OSS 1.5 and later)](/influxdb/latest/administration/backup_and_restore/) to:
>
> - Restore InfluxDB Enterprise backup files to InfluxDB OSS instances.
> - Back up InfluxDB OSS data that can be restored in InfluxDB Enterprise clusters.

## Backup and restore utilities

InfluxDB Enterprise supports backing up and restoring data in a cluster, a single database, a single database and retention policy, and single shards. Most InfluxDB Enterprise applications can use the backup and restore utilities.

Use the `backup` and `restore` utilities to back up and restore between `influxd` instances with the same versions or with only minor version differences. For example, you can backup from 1.7.3 and restore on 1.8.0.

### Backup utility

A backup creates a copy of the [metastore](/influxdb/v1.8/concepts/glossary/#metastore) and [shard](/influxdb/v1.8/concepts/glossary/#shard) data at that point in time and stores the copy in the specified directory.

Or, back up **only the cluster metastore** using the `-strategy only-meta` backup option. For more information, see [perform a metastore only backup](#perform-a-metastore-only-backup).

All backups include a manifest, a JSON file describing what was collected during the backup.
The filenames reflect the UTC timestamp of when the backup was created, for example:

- Metastore backup: `20060102T150405Z.meta` (includes usernames and passwords)
- Shard data backup: `20060102T150405Z.<shard_id>.tar.gz`
- Manifest: `20060102T150405Z.manifest`

Backups can be full, metastore only, or incremental, and they are incremental by default:

- **Full backup**: Creates a copy of the metastore and shard data.
- **Incremental backup**: Creates a copy of the metastore and shard data that have changed since the last incremental backup. If there are no existing incremental backups, the system automatically performs a complete backup.
- **Metastore only backup**: Creates a copy of the metastore data only.

Restoring different types of backups requires different syntax.
To prevent issues with [restore](#restore-utility), keep full backups, metastore only backups, and incremental backups in separate directories.

>**Note:** The backup utility copies all data through the meta node that is used to
execute the backup. As a result, performance of a backup and restore is typically limited by the network IO of the meta node. Increasing the resources available to this meta node (such as resizing the EC2 instance) can significantly improve backup and restore performance.

#### Syntax

```bash
influxd-ctl [global-options] backup [backup-options] <path-to-backup-directory>
```

> **Note:** The `influxd-ctl backup` command exits with `0` for success and `1` for failure. If the backup fails, output can be directed to a log file to troubleshoot.

##### Global options

Please see the [influxd-ctl documentation](/enterprise_influxdb/v1.8/administration/cluster-commands/#global-options)
for a complete list of the global `influxd-ctl` options.

##### Backup options

- `-db <string>`: name of the single database to back up
- `-from <TCP-address>`: the data node TCP address to prefer when backing up
- `-strategy`: select the backup strategy to apply during backup
    - `incremental`: _**(Default)**_ backup only data added since the previous backup.
    - `full` perform a full backup. Same as `-full`
    - `only-meta` perform a backup for meta data only: users, roles,
      databases, continuous queries, retention policies. Shards are not exported.
- `-full`: perform a full backup. Deprecated in favour of `-strategy=full`
- `-rp <string>`: the name of the single retention policy to back up (must specify `-db` with `-rp`)
- `-shard <unit>`: the ID of the single shard to back up

### Backup examples

Store the following incremental backups in different directories.
The first backup specifies `-db myfirstdb` and the second backup specifies
different options: `-db myfirstdb` and `-rp autogen`.

```bash
influxd-ctl backup -db myfirstdb ./myfirstdb-allrp-backup

influxd-ctl backup -db myfirstdb -rp autogen ./myfirstdb-autogen-backup
```

Store the following incremental backups in the same directory.
Both backups specify the same `-db` flag and the same database.

```bash
influxd-ctl backup -db myfirstdb ./myfirstdb-allrp-backup

influxd-ctl backup -db myfirstdb ./myfirstdb-allrp-backup
```

#### Perform an incremental backup

Perform an incremental backup into the current directory with the command below.
If there are any existing backups the current directory, the system performs an incremental backup.
If there aren't any existing backups in the current directory, the system performs a backup of all data in InfluxDB.

```bash
# Syntax
influxd-ctl backup .

# Example
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

#### Perform a full backup

Perform a full backup into a specific directory with the command below.
The directory must already exist.

```bash
# Sytnax
influxd-ctl backup -full <path-to-backup-directory>

# Example
$ influxd-ctl backup -full backup_dir
Backing up meta data... Done. 481 bytes transferred
Backing up node <hostname>:8088, db _internal, rp monitor, shard 1... Done. Backed up in 33.207375ms, 238080 bytes transferred
Backing up node <hostname>:8088, db telegraf, rp autogen, shard 2... Done. Backed up in 15.184391ms, 95232 bytes transferred
Backed up to backup_dir in 51.388233ms, transferred 333793 bytes
$ ls backup_dir
20170130T184058Z.manifest
20170130T184058Z.meta
20170130T184058Z.s1.tar.gz
20170130T184058Z.s2.tar.gz
```

#### Perform an incremental backup on a single database

Point at a remote meta server and back up only one database into a given directory (the directory must already exist):

```bash
# Syntax
influxd-ctl -bind <metahost>:8091 backup -db <db-name> <path-to-backup-directory>

# Example
$ influxd-ctl -bind 2a1b7a338184:8091 backup -db telegraf ./telegrafbackup
Backing up meta data... Done. 318 bytes transferred
Backing up node 7ba671c7644b:8088, db telegraf, rp autogen, shard 4... Done. Backed up in 997.168449ms, 399872 bytes transferred
Backed up to ./telegrafbackup in 1.002358077s, transferred 400190 bytes
$ ls ./telegrafbackup
20160803T222811Z.manifest  20160803T222811Z.meta  20160803T222811Z.s4.tar.gz
```

#### Perform a metastore only backup

Perform a meta store only backup into a specific directory with the command below.
The directory must already exist.

```bash
# Syntax
influxd-ctl backup -strategy only-meta <path-to-backup-directory>

# Example
$ influxd-ctl backup -strategy only-meta backup_dir
Backing up meta data... Done. 481 bytes transferred
Backed up to backup_dir in 51.388233ms, transferred 481 bytes
~# ls backup_dir
20170130T184058Z.manifest
20170130T184058Z.meta
```

### Restore utility

#### Disable anti-entropy (AE) before restoring a backup

> Before restoring a backup, stop the anti-entropy (AE) service (if enabled) on **each data node in the cluster, one at a time**.

>
> 1. Stop the `influxd` service.
> 2. Set `[anti-entropy].enabled` to `false` in the influx configuration file (by default, influx.conf).
> 3. Restart the `influxd` service and wait for the data node to receive read and write requests and for the [hinted handoff queue](/enterprise_influxdb/v1.8/concepts/clustering/#hinted-handoff) to drain.
> 4. Once AE is disabled on all data nodes and each node returns to a healthy state, you're ready to restore the backup. For details on how to restore your backup, see examples below.
> 5. After restoring the backup, restart AE services on each data node.

##### Restore a backup

Restore a backup to an existing cluster or a new cluster.
By default, a restore writes to databases using the backed-up data's [replication factor](/influxdb/v1.8/concepts/glossary/#replication-factor).
An alternate replication factor can be specified with the `-newrf` flag when restoring a single database.
Restore supports both `-full` backups and incremental backups; the syntax for
a restore differs depending on the backup type.

##### Restores from an existing cluster to a new cluster

Restores from an existing cluster to a new cluster restore the existing cluster's
[users](/influxdb/v1.8/concepts/glossary/#user), roles,
[databases](/influxdb/v1.8/concepts/glossary/#database), and
[continuous queries](/influxdb/v1.8/concepts/glossary/#continuous-query-cq) to
the new cluster.

They do not restore Kapacitor [subscriptions](/influxdb/v1.8/concepts/glossary/#subscription).
In addition, restores to a new cluster drop any data in the new cluster's
`_internal` database and begin writing to that database anew.
The restore does not write the existing cluster's `_internal` database to
the new cluster.

#### Syntax to restore from incremental and metadata backups

Use the syntax below to restore an incremental or metadata backup to a new cluster or an existing cluster.
**The existing cluster must contain no data in the affected databases.**
Performing a restore from an incremental backup requires the path to the incremental backup's directory.

```bash
influxd-ctl [global-options] restore [restore-options] <path-to-backup-directory>
```

{{% note %}}
The existing cluster can have data in the `_internal` database (the database InfluxDB creates if
[internal monitoring](/platform/monitoring/influxdata-platform/tools/measurements-internal) is enabled).
The system automatically drops the `_internal` database when it performs a complete restore.
{{% /note %}}

##### Global options

Please see the [influxd-ctl documentation](/enterprise_influxdb/v1.8/administration/cluster-commands/#global-options)
for a complete list of the global `influxd-ctl` options.

##### Restore options

- `-db <string>`: the name of the single database to restore
- `-list`: shows the contents of the backup
- `-newdb <string>`: the name of the new database to restore to (must specify with `-db`)
- `-newrf <int>`: the new replication factor to restore to (this is capped to the number of data nodes in the cluster)
- `-newrp <string>`: the name of the new retention policy to restore to (must specify with `-rp`)
- `-rp <string>`: the name of the single retention policy to restore
- `-shard <unit>`: the shard ID to restore

#### Syntax to restore from a full or manifest only backup

Use the syntax below to restore a full or manifest only backup to a new cluster or an existing cluster.
Note that the existing cluster must contain no data in the affected databases.*
Performing a restore requires the `-full` flag and the path to the backup's manifest file.

```bash
influxd-ctl [global-options] restore [options] -full <path-to-manifest-file>
```

\* The existing cluster can have data in the `_internal` database, the database
that the system creates by default.
The system automatically drops the `_internal` database when it performs a
complete restore.

##### Global options

Please see the [influxd-ctl documentation](/enterprise_influxdb/v1.8/administration/cluster-commands/#global-options)
for a complete list of the global `influxd-ctl` options.

##### Restore options

- `-db <string>`: the name of the single database to restore
- `-list`: shows the contents of the backup
- `-newdb <string>`: the name of the new database to restore to (must specify with `-db`)
- `-newrf <int>`: the new replication factor to restore to (this is capped to the number of data nodes in the cluster)
- `-newrp <string>`: the name of the new retention policy to restore to (must specify with `-rp`)
- `-rp <string>`: the name of the single retention policy to restore
- `-shard <unit>`: the shard ID to restore

#### Examples

##### Restore from an incremental backup

```bash
# Syntax
influxd-ctl restore <path-to-backup-directory>

# Example
$ influxd-ctl restore my-incremental-backup/
Using backup directory: my-incremental-backup/
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 21.373019ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 61.046571ms, 588800 bytes transferred
Restored from my-incremental-backup/ in 83.892591ms, transferred 588800 bytes
```

##### Restore from a metadata backup

In this example, the `restore` command restores an metadata backup stored
in the `metadata-backup/` directory.

```bash
# Syntax
influxd-ctl restore <path-to-backup-directory>

# Example
$ influxd-ctl restore metadata-backup/
Using backup directory: metadata-backup/
Using meta backup: 20200101T000000Z.meta
Restoring meta data... Done. Restored in 21.373019ms, 1 shards mapped
Restored from my-incremental-backup/ in 19.2311ms, transferred 588 bytes
```

##### Restore from a `-full` backup

```bash
# Syntax
influxd-ctl restore -full <path-to-manifest-file>

# Example
$ influxd-ctl restore -full my-full-backup/20170131T020341Z.manifest
Using manifest: my-full-backup/20170131T020341Z.manifest
Restoring meta data... Done. Restored in 9.585639ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 48.095082ms, 569344 bytes transferred
Restored from my-full-backup in 58.58301ms, transferred 569344 bytes
```

{{% note %}}
Restoring from a full backup **does not** restore metadata.
To restore metadata, [restore a metadata backup](#restore-from-a-metadata-backup) separately.
{{% /note %}}

##### Restore from an incremental backup for a single database and give the database a new name

```bash
# Syntax
influxd-ctl restore -db <src> -newdb <dest> <path-to-backup-directory>

# Example
$ influxd-ctl restore -db telegraf -newdb restored_telegraf my-incremental-backup/
Using backup directory: my-incremental-backup/
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 8.119655ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 4...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 4 in 57.89687ms, 588800 bytes transferred
Restored from my-incremental-backup/ in 66.715524ms, transferred 588800 bytes
```

##### Restore from an incremental backup for a database and merge that database into an existing database

Your `telegraf` database was mistakenly dropped, but you have a recent backup so you've only lost a small amount of data.

If Telegraf is still running, it will recreate the `telegraf` database shortly after the database is dropped.
You might try to directly restore your `telegraf` backup just to find that you can't restore:

```bash
$ influxd-ctl restore -db telegraf my-incremental-backup/
Using backup directory: my-incremental-backup/
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Error.
restore: operation exited with error: problem setting snapshot: database already exists
```

To work around this, you can restore your telegraf backup into a new database by specifying the `-db` flag for the source and the `-newdb` flag for the new destination:

```bash
$ influxd-ctl restore -db telegraf -newdb restored_telegraf my-incremental-backup/
Using backup directory: my-incremental-backup/
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 19.915242ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 7...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 7 in 36.417682ms, 588800 bytes transferred
Restored from my-incremental-backup/ in 56.623615ms, transferred 588800 bytes
```

Then, in the [`influx` client](/influxdb/v1.8/tools/shell/), use an [`INTO` query](/influxdb/v1.8/query_language/data_exploration/#the-into-clause) to copy the data from the new database into the existing `telegraf` database:

```bash
$ influx
> USE restored_telegraf
Using database restored_telegraf
> SELECT * INTO telegraf..:MEASUREMENT FROM /.*/ GROUP BY *
name: result
------------
time                  written
1970-01-01T00:00:00Z  471
```

#### Common issues with restore

##### Restore writes information not part of the original backup

If a [restore from an incremental backup](#syntax-to-restore-from-incremental-and-metadata-backups)
does not limit the restore to the same database, retention policy, and shard specified by the backup command,
the restore may appear to restore information that was not part of the original backup.
Backups consist of a shard data backup and a metastore backup.
The **shard data backup** contains the actual time series data: the measurements, tags, fields, and so on.
The **metastore backup** contains user information, database names, retention policy names, shard metadata, continuous queries, and subscriptions.

When the system creates a backup, the backup includes:

* the relevant shard data determined by the specified backup options
* all of the metastore information in the cluster regardless of the specified backup options

Because a backup always includes the complete metastore information, a restore that doesn't include the same options specified by the backup command may appear to restore data that were not targeted by the original backup.
The unintended data, however, include only the metastore information, not the shard data associated with that metastore information.

##### Restore a backup created prior to version 1.2.0

InfluxDB Enterprise introduced incremental backups in version 1.2.0.
To restore a backup created prior to version 1.2.0, be sure to follow the syntax
for [restoring from a full backup](#syntax-to-restore-from-a-full-backup).

## Exporting and importing data

For most InfluxDB Enterprise applications, the [backup and restore utilities](#backup-and-restore-utilities) provide the tools you need for your backup and restore strategy. However, in some cases, the standard backup and restore utilities may not adequately handle the volumes of data in your application.  

As an alternative to the standard backup and restore utilities, use the InfluxDB `influx_inspect export` and `influx -import` commands to create backup and restore procedures for your disaster recovery and backup strategy. These commands can be executed manually or included in shell scripts that run the export and import operations at scheduled intervals (example below).

### Exporting data

Use the [`influx_inspect export` command](/influxdb/latest/tools/influx_inspect#export) to export data in line protocol format from your InfluxDB Enterprise cluster. Options include:

- Exporting all, or specific, databases
- Filtering with starting and ending timestamps
- Using gzip compression for smaller files and faster exports

For details on optional settings and usage, see [`influx_inspect export` command](/influxdb/latest/tools/influx_inspect#export).

In the following example, the database is exported filtered to include only one day and compressed for optimal speed and file size.

```bash
influx_inspect export -database myDB -compress -start 2019-05-19T00:00:00.000Z -end 2019-05-19T23:59:59.999Z
```

### Importing data

After exporting the data in line protocol format, you can import the data using the [`influx -import` CLI command](https://docs.influxdata.com/influxdb/latest/tools/shell/#import).

In the following example, the compressed data file is imported into the specified database.

```bash
influx -import -database myDB -compress
```

For details on using the `influx -import` command, see [Import data from a file with -import](https://docs.influxdata.com/influxdb/latest/tools/shell/#import-data-from-a-file-with-import).

### Example

For an example of using the exporting and importing data approach for disaster recovery, see the Capital One presentation from Influxdays 2019 on ["Architecting for Disaster Recovery."](https://www.youtube.com/watch?v=LyQDhSdnm4A). In this presentation, Capital One discusses the following:

- Exporting data every 15 minutes from an active cluster to an AWS S3 bucket.
- Replicating the export file in the S3 bucket using the AWS S3 copy command.
- Importing data every 15 minutes from the AWS S3 bucket to a cluster available for disaster recovery.
- Advantages of the export-import approach over the standard backup and restore utilities for large volumes of data.
- Managing users and scheduled exports and imports with a custom administration tool.
