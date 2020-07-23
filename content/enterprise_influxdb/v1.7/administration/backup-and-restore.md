---
title: Back up and restore InfluxDB Enterprise clusters
aliases:
    - /enterprise/v1.7/guides/backup-and-restore/
menu:
  enterprise_influxdb_1_7:
    name: Back up and restore
    weight: 80
    parent: Administration
---

When deploying InfluxDB Enterprise in a production environment, we recommend that you prepare for unexpected data loss with a strategy for backing up and restoring your InfluxDB Enterprise clusters.

## Plan your back up and restore strategy

For each of the following scenarios, plan a back up and restore strategy that suits your needs:

- Disaster recovery due to unexpected events
- Migrating data to new environments or servers
- Restoring clusters to a consistent state
- Debugging

To choose a strategy that best suits your use case, we recommend considering your volume of data, application requirements, acceptable recovery time, and budget. We offer the following methods for backup and restore:

- [Backup and restore utilities](#backup-and-restore-utilities) (suits **most InfluxDB Enterprise applications**)
- [Export and import commands](#export-and-import-commands) (best for **backfill or recovering shards as files**)
- [Take AWS snapshot with EBS volumes as backup for data recovery](#take-aws-snapshots-with-ebs-volumes) (optimal **convenience if budget permits**)
- [Run two clusters in separate AWS regions](#run-two-clusters-in-separate-aws-regions) (also optimal **convenience if budget permits**, more custom work upfront)

 > Test your backup and restore strategy for all applicable scenarios.

## Backup and restore utilities

Use `backup` and `restore` utilities to back up and restore InfluxDB data from any of the following:

- Cluster
- Database
- Database and retention policy
- Single shard
- From InfluxDB Enterprise to InfluxDB OSS or OSS to Enterprise

Back up and restore data between `influxd` instances with the same versions or with only minor version differences. For example, you can backup from 1.7.3 and restore on 1.7.10.

### Backup utility

> **Important:** Save backups to a new cluster or existing cluster with a different database name.

Backup creates a copy of the [metastore](/influxdb/v1.7/concepts/glossary/#metastore) and [shard](/influxdb/v1.7/concepts/glossary/#shard) data **on disk** at that point in time and stores the copy in the specified directory.

>**Note:** `backup` ignores WAL files and in-memory cache data.

Backups also include a manifest (JSON file) describing what was collected during the backup.
Backup filenames reflect the UTC timestamp of when the backup **from disk** was created, for example:

- Metastore backup: `20060102T150405Z.meta` (includes usernames and passwords)
- Shard data backup: `20060102T150405Z.<shard_id>.tar.gz`
- Manifest: `20060102T150405Z.manifest`

>**Note:** The backup utility copies all data through the meta node used to execute the backup.
As a result, performance of a backup and restore is typically limited by the network IO of the meta node.
Increasing the resources available to this meta node (such as resizing the EC2 instance) can significantly improve backup and restore performance.

#### Full versus incremental backup

Backups can be full (using the `-full` flag) or incremental (by default):

- Full backups include a copy of the metastore (users, credentials, and permissions) and shard data.
- Incremental backups include a copy of the metastore and shard data that have changed since the last incremental backup.
If there are no existing incremental backups, the system automatically performs a full backup.
- Keep full backups and incremental backups in separate directories.

#### Syntax

```bash
influxd-ctl [global-options] backup [backup-options] <path-to-backup-directory>
```

> **Note:** The `influxd-ctl backup` command exits with `0` for success and `1` for failure. If the backup fails, output can be directed to a log file to troubleshoot.

##### Global options

For a complete list of the global `influxd-ctl` options, see the [influxd-ctl documentation](/enterprise_influxdb/v1.7/administration/cluster-commands/#global-options).

##### Backup options

- `-db <string>`: the name of the single database to back up
- `-from <TCP-address>`: the data node TCP address to prefer when backing up
- `-full`: perform a full backup
- `-rp <string>`: the name of the single retention policy to back up (must specify `-db` with `-rp`)
- `-shard <unit>`: the ID of the single shard to back up

### Backup examples

{{%expand "> Store incremental backups in different directories" %}}

> If you're backing up different units, for example all retention policies in a database and a specific retention policy, store backups in different directories.

```bash

influxd-ctl backup -db myfirstdb ./myfirstdb-allrp-backup

influxd-ctl backup -db myfirstdb -rp autogen ./myfirstdb-autogen-backup
```

{{% /expand%}}

{{%expand "> Store incremental backups in the same directory" %}}

> If you're backing up multiple copies of the same database, store backups in the same directory.

```bash
influxd-ctl backup -db myfirstdb ./myfirstdb-allrp-backup

influxd-ctl backup -db myfirstdb ./myfirstdb-allrp-backup
```

{{% /expand%}}

{{%expand "> Perform an incremental back up" %}}

> Perform an incremental backup into the current directory with the command below.

If there are any existing backups the current directory, the system performs an incremental backup.
If there aren't any existing backups in the current directory, the system performs a backup of all data in InfluxDB.

```bash
influxd-ctl backup .
```

Output:

```bash
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

{{% /expand%}}

{{%expand "> Perform an full back up" %}}

> Perform a full backup into a specific directory with the command below:

```bash
influxd-ctl backup -full <path-to-backup-directory>
```

> Note: The directory must already exist.

Output:

```bash
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

{{% /expand%}}

{{%expand "> Perform an incremental back up on a single database" %}}

> Point at a remote meta server and back up only one database into a given directory (the directory must already exist):

```bash
influxd-ctl -bind <metahost>:8091 backup -db <db-name> <path-to-backup-directory>
```

Output:

```bash
$ influxd-ctl -bind 2a1b7a338184:8091 backup -db telegraf ./telegrafbackup
Backing up meta data... Done. 318 bytes transferred
Backing up node 7ba671c7644b:8088, db telegraf, rp autogen, shard 4... Done. Backed up in 997.168449ms, 399872 bytes transferred
Backed up to ./telegrafbackup in 1.002358077s, transferred 400190 bytes
$ ls ./telegrafbackup
20160803T222811Z.manifest  20160803T222811Z.meta  20160803T222811Z.s4.tar.gz
```
{{% /expand%}}

### Restore utility

- Restores [users](/influxdb/v1.7/concepts/glossary/#user), roles,
[databases](/influxdb/v1.7/concepts/glossary/#database), and [continuous queries](/influxdb/v1.7/concepts/glossary/#continuous-query-cq).
- Does not restore Kapacitor [subscriptions](/influxdb/v1.7/concepts/glossary/#subscription).
- Drops data in the new cluster's `_internal` database and begins writing to `_internal` anew.
- By default, restore writes to databases using the backed-up data's [replication factor](/influxdb/v1.7/concepts/glossary/#replication-factor).
To specify an alternate replication factor when restoring a single database, use the `-newrf` flag.

> **Important:** Restore backups to a new cluster or existing cluster with a different database name. Otherwise, the restore may fail.

#### Disable anti-entropy (AE) before restoring a backup

Before restoring a backup, stop the anti-entropy (AE) service (if enabled) on **each data node in the cluster, one at a time**.

1. Stop the `influxd` service.
2. Set `[anti-entropy].enabled` to `false` in the influx configuration file (by default, influx.conf).
3. Restart the `influxd` service and wait for the data node to receive read and write requests and for the [hinted handoff queue](/enterprise_influxdb/v1.7/concepts/clustering/#hinted-handoff) to drain.
4. Once AE is disabled on all data nodes and each node returns to a healthy state, you're ready to restore the backup. For details on how to restore your backup, see examples below.
5. After restoring the backup, restart AE services on each data node.

#### Syntax

**Incremental backup**

```bash
influxd-ctl [global-options] restore [restore-options] <path-to-backup-directory>
```

**Full backup**

```bash
influxd-ctl [global-options] restore [options] -full <path-to-manifest-file>
```

##### Global options

For a complete list of the global `influxd-ctl` options, see the [influxd-ctl documentation](/enterprise_influxdb/v1.7/administration/cluster-commands/#global-options).

##### Restore options

- `-db <string>`: the name of the single database to restore
- `-list`: shows the contents of the backup
- `-newdb <string>`: the name of the new database to restore to (must specify with `-db`)
- `-newrf <int>`: the new replication factor to restore to (this is capped to the number of data nodes in the cluster)
- `-newrp <string>`: the name of the new retention policy to restore to (must specify with `-rp`)
- `-rp <string>`: the name of the single retention policy to restore
- `-shard <unit>`: the shard ID to restore

#### Restore examples

{{%expand "> Restore from an incremental backup" %}}

```bash
influxd-ctl restore <path-to-backup-directory>
```

Output:

```bash
$ influxd-ctl restore my-incremental-backup/
Using backup directory: my-incremental-backup/
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 21.373019ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 61.046571ms, 588800 bytes transferred
Restored from my-incremental-backup/ in 83.892591ms, transferred 588800 bytes
```

{{% /expand%}}

{{%expand "> Restore from a full backup" %}}

```bash
influxd-ctl restore -full <path-to-manifest-file>
```

Output:

```bash
$ influxd-ctl restore -full my-full-backup/20170131T020341Z.manifest
Using manifest: my-full-backup/20170131T020341Z.manifest
Restoring meta data... Done. Restored in 9.585639ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 48.095082ms, 569344 bytes transferred
Restored from my-full-backup in 58.58301ms, transferred 569344 bytes
```

{{% /expand%}}

{{%expand "> Restore from an incremental backup for a single database and give the database a new name" %}}

```bash
influxd-ctl restore -db <src> -newdb <dest> <path-to-backup-directory>
```

Output:

```bash
$ influxd-ctl restore -db telegraf -newdb restored_telegraf my-incremental-backup/
Using backup directory: my-incremental-backup/
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 8.119655ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 4...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 4 in 57.89687ms, 588800 bytes transferred
Restored from my-incremental-backup/ in 66.715524ms, transferred 588800 bytes
```

{{% /expand%}}

{{%expand "> Restore from an incremental backup for a single database and give the database a new name" %}}

> Your `telegraf` database was mistakenly dropped, but you have a recent backup so you've only lost a small amount of data.

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

Then, in the [`influx` client](/influxdb/v1.7/tools/shell/), use an [`INTO` query](/influxdb/v1.7/query_language/data_exploration/#the-into-clause) to copy the data from the new database into the existing `telegraf` database:

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

{{% /expand%}}

#### Common issues with restore

{{%expand "> Restore writes information not part of the original backup" %}}

##### Restore writes information not part of the original backup

If a [restore from an incremental backup](#syntax-to-restore-from-an-incremental-backup) does not limit the restore to the same database, retention policy, and shard specified by the backup command, the restore may appear to restore information that was not part of the original backup.
Backups consist of a shard data backup and a metastore backup.
The **shard data backup** contains the actual time series data: the measurements, tags, fields, and so on.
The **metastore backup** contains user information, database names, retention policy names, shard metadata, continuous queries, and subscriptions.

When the system creates a backup, the backup includes:

* the relevant shard data determined by the specified backup options
* all of the metastore information in the cluster regardless of the specified backup options

Because a backup always includes the complete metastore information, a restore that doesn't include the same options specified by the backup command may appear to restore data that were not targeted by the original backup.
The unintended data, however, include only the metastore information, not the shard data associated with that metastore information.

{{% /expand%}}

{{%expand "> Restore a backup created prior to version 1.2.0" %}}

##### Restore a backup created prior to version 1.2.0

InfluxDB Enterprise introduced incremental backups in version 1.2.0.
To restore a backup created prior to version 1.2.0, be sure to follow the syntax
for [restoring from a full backup](#syntax-to-restore-from-a-full-backup).

{{% /expand%}}

## Export and import commands

Use the InfluxDB `influx_inspect export` and `influx -import` commands to create backup and restore procedures for your disaster recovery and backup strategy. Execute these commands manually or include them in shell scripts to run at scheduled intervals.

### Export data

Use the [`influx_inspect export` command](/influxdb/latest/tools/influx_inspect#export) to export data in line protocol format from your InfluxDB Enterprise cluster. Options include:

- Exporting all, or specific, databases
- Filtering with starting and ending timestamps
- Using gzip compression for smaller files and faster exports

For details on optional settings and usage, see [`influx_inspect export` command](/influxdb/latest/tools/influx_inspect#export).

In the following example, the database is exported filtered to include only one day and compressed for optimal speed and file size.

```bash
influx_inspect export -database myDB -compress -start 2019-05-19T00:00:00.000Z -end 2019-05-19T23:59:59.999Z
```

### Import data

After exporting the data in line protocol format, you can import the data using the [`influx -import` CLI command](https://docs.influxdata.com/influxdb/latest/tools/shell/#import).

In the following example, the compressed data file is imported into the specified database.

```bash
influx -import -database myDB -compress
```

For details on using the `influx -import` command, see [Import data from a file with -import](https://docs.influxdata.com/influxdb/latest/tools/shell/#import-data-from-a-file-with-import).

## Take AWS snapshots as backup

Use AWS snapshots of data nodes to recover data by exporting line protocol of historical data from shards on disk.

1. Schedule AWS snapshots. For example, take snapshots of data node directories (include `/data` directory at minimum, `wal` directory, and other directories as needed.)
2. To recover data from a snapshot, create an EC2 system with InfluxDB data node programs (the data node process doesn't need to run).
3. Attach the snapshot to your recovery EC2 system. Attach additional volumes as needed for more space. 
>**Note:** Extracting shards via `influx_inspect` (using compress) uses roughly 1.5 times the space as the shard. We recommend provisioning 2.5 times the space that the shards use on disk. (See AWS documentation for procedures to upsize AWS volumes in use.)
4. Use `influx_inspect export` to extract line protocol (based on database, rp and time) as needed.
5. [Re-import extracted line protocol](#import-data).

## Run two clusters in separate AWS regions

The advantages to running 2 clusters is you can set the following up in advance:

- How often to export data from an active cluster to an AWS S3 bucket.
- How often to replicate the export file in the S3 bucket (use AWS S3 copy command).
- How often to import data from the AWS S3 bucket to a cluster available for disaster recovery.

> To further automate the recovery process, create a customer administration tool to manage users and schedule exports and imports.

First, run two clusters in separate AWS regions, and then transfer your data using custom scripts and S3 buckets.

1. Create two AWS regions to use:

  - one for disaster recovery (DR)
  - one for actively working with data

2. In both regions, create separate “availability zones” for each data node in your cluster.
3. In your “active” region, use `influx inspect export` to export data from your cluster to an AWS S3 bucket. This S3 bucket automatically replicates cluster data to an S3 bucket in your disaster recovery region.
4. Create a script to import data (`influx-import`) from your disaster recovery S3 bucket into your disaster recovery cluster.
5. (Optional) Create an admin tool to administer data traffic to your clusters and ensure all users go through this tool.
6. On the “active” cluster, create a script to run on one data node, and then run your script from cron (for example, every 15 minutes) to gather all of the databases. In your script, use a “for loop” to gather data from each database with the `influx_inspect tool,` and then move data to your S3 bucket.

    > **Note:** Consider your import/export time interval; what is an acceptable time frame difference between your active region and disaster recovery region?

7. On the “disaster recovery” cluster, create another script to run from cron (for your specified interval). In this script, include the following:

  - Pull files from the S3 bucket and store them locally.
  - Run `influx -import` to move data to the cluster.

      > Note: For best performance, make sure each database has a separate file.
  - Delete files from the S3 bucket.

8. Run your admin commands, for example, `CREATE DB` or `CREATE USERS` on both your disaster recovery and active clusters, which can be handled by your custom admin tool.

9. Use a separate data node for monitoring metrics.

    > **Limitations:** This solution cannot handle much backfill. To capture backfill, you must create an ad hoc solution. Also, if your disaster recovery site goes down, data on the active site is still getting backed up into S3, but isn’t imported until your disaster recovery cluster is back up and your import script runs.