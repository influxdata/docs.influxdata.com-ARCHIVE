---
title: Backup and Restore
menu:
  enterprise_1_0:
    weight: 0
    parent: Guides
---

## Overview

Backup and restore is available starting with InfluxEnterprise Clustering version 0.7.1.
Please note that this feature is considered experimental and is subject to change.

The primary use cases for backup/restore are:

* Disaster recovery
* Debugging
* Restoring clusters to a consistent state

Currently, users can perform backups and restores for all data in the cluster.
They can be carried out on down clusters or on running clusters.
Note that this feature does not support conflict resolution; any backed up data that conflict with existing data will not overwrite the existing data during the restore.

As of version 0.7.3, InfluxEnterprise Clustering does not support backups or restores:

* Per database
* Per database and retention policy
* Per shard
* For specific time ranges (incremental backups are not currently available)

## Terminology and behavior

A **backup** creates a copy of the cluster’s data and meta data at that point in time and stores the copy in the specified directory.
The filenames reflect the UTC timestamp of when the backup was created, for example:

Data backup: `20060102T150405Z.<shard_id>.<shard_owner>.tar.gz`  
Meta backup: `20060102T150405Z.manifest` and `20060102T150405Z.meta`

A **restore** adds the backed-up data to the cluster.
A restore does not rebalance the cluster.
If the user creates a backup of a two node cluster with a replication factor of two and restores that backup to a three node cluster, the data will be distributed to two of three data nodes in the cluster.
Similarly, if the user creates a backup of a three node cluster with a replication factor of three and restores that backup to a two node cluster, the data will be distributed to as many nodes as possible (in this case, to two data nodes).

## Syntax

### Backup
```
influxd-ctl backup [options] <backup-directory>
```
Options:

`-addr <hostname>:8088`: specifies the hostname and TCP port of the data node to backup

### Restore
```
influxd-ctl restore [options] <backup-directory>
```
Options:

* `-manifest <manifest-file>`: specifies the manifest file to restore
* `-addr <hostname>:8088`: specifies the hostname and TCP port of the data node to restore to
* `-from <hostname>:8088`: specifies the hostname and TCP port of the relevant backed up data node
* `-list`: shows the contents of the backup

## Example

In the following example, we create a backup of a running cluster, drop data from the cluster that are in that backup, and add those data back into the cluster with a restore.

### 1. Create a backup directory

From a meta node in the InfluxEnterprise Cluster, run:
```
mkdir /tmp/backup
```
### 2. Create a backup

From the same meta node in the InfluxEnterprise Cluster, run:
```
influxd-ctl backup /tmp/backup
```
Output:
```
Backing up meta data... Done. Backed up in 16.422251ms, 845 bytes transferred
Backing up node enterprise-beta-data-01:8088, db _internal, rp monitor, shard 1... Done. Backed up in 58.935179ms, 138752 bytes transferred
Backing up node enterprise-beta-data-01:8088, db _internal, rp monitor, shard 5... Done. Backed up in 4.365603ms, 0 bytes transferred
Backing up node enterprise-beta-data-02:8088, db _internal, rp monitor, shard 5... Done. Backed up in 6.633594ms, 0 bytes transferred
Backing up node enterprise-beta-data-02:8088, db telegraf, rp autogen, shard 4... Done. Backed up in 57.37225ms, 50176 bytes transferred
Backing up node enterprise-beta-data-01:8088, db telegraf, rp autogen, shard 4... Done. Backed up in 54.302327ms, 50176 bytes transferred
Backed up to /tmp/backup in 202.083765ms, transferred 239949 bytes
```
Files in /tmp/backup:
```
20160708T234243Z.manifest
20160708T234243Z.meta
20160708T234243Z.s1.n4.tar.gz
20160708T234243Z.s4.n4.tar.gz
20160708T234243Z.s4.n7.tar.gz
20160708T234243Z.s5.n4.tar.gz
20160708T234243Z.s5.n7.tar.gz
```
### 3. Drop some data

In this step, we drop data from the telegraf database that are older than 2016-07-08 23:42:43 (the time at which we created the backup).

From the [CLI](https://docs.influxdata.com/influxdb/v1.0/tools/shell/):
```
> USE telegraf
Using database telegraf

> SELECT "cpu","usage_idle" FROM "cpu" WHERE time < '2016-07-08T23:42:43Z'
name: cpu
---------
time                   cpu         usage_idle
2016-07-08T23:10:50Z   cpu-total   98.29999999999927
2016-07-08T23:10:50Z   cpu0        98.29999999999927
[...]
2016-07-08T23:42:40Z   cpu-total   96.49298597195832
2016-07-08T23:42:40Z   cpu0        96.49298597195832

> DELETE FROM "cpu" WHERE time < '2016-07-08T23:42:43Z'

> SELECT "cpu","usage_idle" FROM "cpu" WHERE time < '2016-07-08T23:42:43Z'
>
```
### 4. Restore the backup

From a meta node in the InfluxEnterprise Cluster, run:
```
influxd-ctl restore /tmp/backup
```
Output:
```
Using manifest: /tmp/backup/20160708T234243Z.manifest
Restoring meta data... Done. Restored in 10.364389ms, 845 bytes transferred
Restoring node enterprise-beta-data-01:8088 from node enterprise-beta-data-01:8088 db _internal, rp monitor, shard 1... Done. Restored into shard 1 in 670.744498ms, 138752 bytes transferred
Restoring node enterprise-beta-data-01:8088 from node enterprise-beta-data-01:8088 db _internal, rp monitor, shard 5... Done. Restored into shard 5 in 23.896962ms, 0 bytes transferred
Restoring node enterprise-beta-data-02:8088 from node enterprise-beta-data-02:8088 db _internal, rp monitor, shard 5... Done. Restored into shard 5 in 16.545994ms, 0 bytes transferred
Restoring node enterprise-beta-data-02:8088 from node enterprise-beta-data-02:8088 db telegraf, rp autogen, shard 4... Done. Restored into shard 4 in 1.012699974s, 50176 bytes transferred
Restoring node enterprise-beta-data-01:8088 from node enterprise-beta-data-01:8088 db telegraf, rp autogen, shard 4... Done. Restored into shard 4 in 1.081072281s, 50176 bytes transferred
Restored from /tmp/backup in 2.816704644s, transferred 239104 bytes
```
### 5. Query the restored data

From the CLI:
```
> USE telegraf
Using database telegraf

> SELECT "cpu","usage_idle" FROM "cpu" WHERE time < '2016-07-08T23:42:43Z'
name: cpu
---------
time                   cpu         usage_idle
2016-07-08T23:10:50Z   cpu-total   98.29999999999927
2016-07-08T23:10:50Z   cpu0        98.29999999999927
[...]
2016-07-08T23:42:40Z   cpu-total   96.49298597195832
2016-07-08T23:42:40Z   cpu0        96.49298597195832
```
