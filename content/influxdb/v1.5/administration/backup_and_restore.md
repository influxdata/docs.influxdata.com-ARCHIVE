---
title: Backing up and restoring in InfluxDB OSS
description: Using InfluxDB OSS backup and restore utilities for online, Enterprise-compatible use and portability between InfluxDB Enterprise and InfluxDB OSS servers.
aliases:
  - /influxdb/v1.5/administration/backup-and-restore/
menu:
  influxdb_1_5:
    name: Backing up and restoring
    weight: 60
    parent: Administration
---

## Overview

Starting in version 1.5, the InfluxDB OSS `backup` utility provides:

* Option to run backup and restore functions on online (live) databases.
* Backup and restore functions for single or multiple databases, along with optional timestamp filtering.
* Data can be imported from [InfluxDB Enterprise](/enterprise_influxdb/latest/) clusters
* Backup files that can be imported into an InfluxDB Enterprise database.

> **Note:** Note: This section covers the InfluxDB OSS backup/restore utility.  If you are using an InfluxDB Enterprise cluster, see [Backing up and restoring in InfluxDB Enterprise](/enterprise_influxdb/v1.5/administration/backup-and-restore/) in the InfluxDB Enterprise documentation.

> ***Note:*** The offline backup and restore functions provided in InfluxDB OSS versions 1.4 and earlier are retained in version 1.5 without change, and are detailed below in [Backward compatible offline backup and restore](#backward-compatible-offline-backup-and-restore-legacy-format).

> ***Note:*** Prior to version 1.5, the InfluxDB OSS `backup` utility created  backup file formats, now referred to as the _legacy_ format, that were incompatible with the InfluxDB Enterprise version.  This legacy format is fully supported in the new `backup` utility as input for the new online restore function. If you are creating new backup processes, InfluxData recommends using the new InfluxDB Enterprise-compatible backup format, which uses less disk space and provides a clear transfer path for data between the InfluxDB Enterprise and InfluxDB OSS versions.

## Online backup and restore (for InfluxDB OSS)

### Configuring remote connections

The online backup and restore processes execute over a TCP connection to the database.

**To enable the port for the backup and restore service:**

1. At the root level of the InfluxDB config file (`influxdb.conf`), uncomment the [`bind-address` configuration setting](/influxdb/v1.5/administration/config/#bind-address-127-0-0-1-8088) on the remote node.

2. Update the `bind-address` value to `<remote-node-IP>:8088`

3. Provide the IP address and port to the `-host` parameter when you run commands.

**Example**

```
$ influxd backup -portable -database mydatabase -host <remote-node-IP>:8088 /tmp/mysnapshot
```

### `backup`
The improved `backup` command is similar to previous versions, except that it
generates backups in an InfluxDB Enterprise-compatible format and has some new filtering options to constrain the range of data points that are exported to the backup.

```
influxd backup
    [ -database <db_name> ]
    [ -portable ]
    [ -host <host:port> ]
    [ -retention <rp_name> ] | [ -shard <shard_ID> -retention <rp_name> ]
    [ -start <timestamp> [ -end <timestamp> ] | -since <timestamp> ]
    <path-to-backup>
```


To invoke the new InfluxDB Enterprise-compatible format, run the `influxd backup` command with the `-portable` flag, like this:

```
influxd backup -portable [options] <path-to-backup>
```

##### Arguments

Optional arguments are enclosed in brackets.

- `[ -database <db_name> ]`: The database to back up. If not specified, all databases are backed up.

- `[ -portable ]`: Generates backup files in the newer InfluxDB Enterprise-compatible format. Highly recommended for all InfluxDB OSS users.

<dt>
**Important:** If `-portable` is not specified, the default legacy backup utility is used -- only the host metastore is backed up, unless `-database` is specified. If not using `-portable`, review [Backup (legacy)](#backup-legacy) below for expected behavior.
</dt>

- `[ -host <host:port> ]`: Host and port for InfluxDB OSS instance . Default value is `'127.0.0.1:8088'`. Required for remote connections. Example: `-host 127.0.0.1:8088`

- `[ -retention <rp_name> ]`: Retention policy for the backup. If not specified, the default is to use all retention policies. If specified, then `-database` is required.

- `[ -shard <ID> ]`: Shard ID of the shard to be backed up. If specified, then `-retention <name>` is required.

- `[ -start <timestamp> ]`: Include all points starting with the specified timestamp ([RFC3339 format](https://www.ietf.org/rfc/rfc3339.txt)). Not compatible with `-since`. Example: `-start 2015-12-24T08:12:23Z`

- `[ -end <timestamp> ]` ]: Exclude all results after the specified timestamp ([RFC3339 format](https://www.ietf.org/rfc/rfc3339.txt)). Not compatible with `-since`. If used without `-start`, all data will be backed up starting from 1970-01-01. Example: `-end 2015-12-31T08:12:23Z`

- `[ -since <timestamp> ]`: Perform an incremental backup after the specified timestamp [RFC3339 format](https://www.ietf.org/rfc/rfc3339.txt). Use `-start` instead, unless needed for legacy backup support.


#### Backup examples

To back up everything:
```
influxd backup -portable <path-to-backup>
```

To backup all databases recently changed at the filesystem level

```
influxd backup -portable -start <timestamp> <path-to-backup>
```

To backup only the `telegraf` database:

```
influxd backup -portable -database telegraf <path-to-backup>
```

To backup a database for a specified time interval:

```
influxd backup  -portable -database mytsd -start 2017-04-28T06:49:00Z -end 2017-04-28T06:50:00Z /tmp/backup/influxdb
```

### `restore`

An online `restore` process is initiated by using the `restore` command with either the `-portable` argument (indicating the new Enterprise-compatible backup format) or `-online` flag (indicating the legacy backup format).

```
influxd restore [ -db <db_name> ]
    -portable | -online
    [ -host <host:port> ]
    [ -rp <rp_name> ]
    [ -newrp <newrp_name> ]
    [ -shard <shard_ID> ]
    <path-to-backup-files>
```

#### Arguments

Optional arguments are enclosed in brackets.

- `-portable`: Use the new Enterprise-compatible backup format for InfluxDB OSS. Recommended instead of `-online`.  A backup created on InfluxDB Enterprise can be restored to an InfluxDB OSS instance.

- `-online`: Use the legacy backup format. Only use if the newer `-portable` option cannot be used.

- `[ -host <host:port> ]`: Host and port for InfluxDB OSS instance . Default value is `'127.0.0.1:8088'`. Required for remote connections. Example: `-host 127.0.0.1:8088`

- `[ -db <db_name> | -database <db_name> ]`: Name of the database to be restored from the backup. If not specified, all databases will be restored.

- `[ -newdb <newdb_name> ]`: Name of the database into which the archived data will be imported on the target system. If not specified, then the value for `-db` is used.  The new database name must be unique to the target system.

- `[ -rp <rp_name> ]`: Name of the retention policy from the backup that will be restored.  Requires that `-db` is set. If not specified, all retention policies will be used.

- `[ -newrp <newrp_name> ]`: Name of the retention policy to be created on the target system. Requires that `-rp` is set. If not specified, then the `-rp` value is used.

- `[ -shard <shard_ID> ]`: Shard ID of the shard to be restored. If specified, then `-db` and `-rp` are required.

> **Note:** For automated backups using the legacy format, consider using the new online feature for legacy backups.  The new backup utility lets you restore a single database to a live (online) instance, while leaving all existing data on the server in place.  The [offline restore method (described below)](#restore-legacy) may result in data loss, since it clears all existing databases on the server.

### Backward compatible offline backup and restore (legacy format)

> ***Note:*** The backward compatible backup and restore for InfluxDB OSS described below are now supported as the legacy format. InfluxData recommends using the newer Enterprise-compatible backup and restore utilities with InfluxDB OSS servers.

InfluxDB OSS has the ability to snapshot an instance at a point-in-time and restore it.
All backups are full backups; incremental backups are not supported.
Two types of data can be backed up, the metastore and the metrics themselves.
The [metastore](/influxdb/v1.5/concepts/glossary/#metastore) is backed up in its entirety.
The metrics are backed up on a per-database basis in an operation separate from the metastore backup.

#### Backing up the metastore

InfluxDB's metastore contains internal information about the status of
the system, including user information, database and shard metadata, continuous queries, retention policies, and subscriptions.
While a node is running, you can create a backup of your instance's metastore by running the command:

```
influxd backup <path-to-backup>
```

Where `<path-to-backup>` is the directory where you
want the backup to be written to. Without any other arguments,
the backup will only record the current state of the system
metastore. For example, the command:

```bash
$ influxd backup /tmp/backup
2016/02/01 17:15:03 backing up metastore to /tmp/backup/meta.00
2016/02/01 17:15:03 backup complete
```

Will create a metastore backup in the directory `/tmp/backup` (the
directory will be created if it doesn't already exist).

#### Backup (legacy)

Each database must be backed up individually.

To backup a database, add the `-database` flag:

```bash
influxd backup -database <mydatabase> <path-to-backup>
```

Where `<mydatabase>` is the name of the database you would like to
backup, and `<path-to-backup>` is where the backup data should be
stored.

Optional flags also include:

- `-retention <retention-policy-name>`
  - This flag can be used to backup a specific retention policy. For more information on retention policies, see
  [Retention policy management](/influxdb/v1.5/query_language/database_management/#retention-policy-management). If unspecified, all retention policies will be backed up.

- `-shard <shard ID>` - This flag can be used to backup a specific
  shard ID. To see which shards are available, you can run the command
  `SHOW SHARDS` using the InfluxDB query language. If not specified,
  all shards will be backed up.

- `-since <date>` - This flag can be used to create a backup _since_ a
  specific date, where the date must be in
  [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format (for example,
  `2015-12-24T08:12:23Z`). This flag is important if you would like to
  take incremental backups of your database. If not specified, all
  timeranges within the database will be backed up.

> **Note:** Metastore backups are also included in per-database backups

As a real-world example, you can take a backup of the `autogen`
retention policy for the `telegraf` database since midnight UTC on
February 1st, 2016 by using the command:

```
$ influxd backup -database telegraf -retention autogen -since 2016-02-01T00:00:00Z /tmp/backup
2016/02/01 18:02:36 backing up rp=default since 2016-02-01 00:00:00 +0000 UTC
2016/02/01 18:02:36 backing up metastore to /tmp/backup/meta.01
2016/02/01 18:02:36 backing up db=telegraf rp=default shard=2 to /tmp/backup/telegraf.default.00002.01 since 2016-02-01 00:00:00 +0000 UTC
2016/02/01 18:02:36 backup complete
```

Which will send the resulting backup to `/tmp/backup`, where it can
then be compressed and sent to long-term storage.

#### Remote backups (legacy)

The legacy backup mode also supports live, remote backup functionality.
Follow the directions in [Configuring remote connections](#configuring-remote-connections) above to configure this feature.

## Restore (legacy)

<dt> This offline restore method described here may result in data loss -- it clears all existing databases on the server. Consider using the `-online` flag with the newer [`restore` method (described above)](#restore) to import legacy data without any data loss.
</dt>

To restore a backup, you will need to use the `influxd restore` command.

> **Note:** Restoring from backup is only supported while the InfluxDB daemon is stopped.

To restore from a backup you will need to specify the type of backup,
the path to where the backup should be restored, and the path to the backup.
The command:

```
influxd restore [ -metadir | -datadir ] <path-to-meta-or-data-directory> <path-to-backup>
```

The required flags for restoring a backup are:

- `-metadir <path-to-meta-directory>` - This is the path to the meta
  directory where you would like the metastore backup recovered
  to. For packaged installations, this should be specified as
  `/var/lib/influxdb/meta`.

- `-datadir <path-to-data-directory>` - This is the path to the data
  directory where you would like the database backup recovered to. For
  packaged installations, this should be specified as
  `/var/lib/influxdb/data`.

The optional flags for restoring a backup are:

- `-database <database>` - This is the database that you would like to
  restore the data to. This option is required if no `-metadir` option
  is provided.

- `-retention <retention policy>` - This is the target retention policy
  for the stored data to be restored to.

- `-shard <shard id>` - This is the shard data that should be
  restored. If specified, `-database` and `-retention` must also be
  set.

Following the backup example above, the backup can be restored in two
steps.

1. The metastore needs to be restored so that InfluxDB
knows which databases exist:

```
$ influxd restore -metadir /var/lib/influxdb/meta /tmp/backup
Using metastore snapshot: /tmp/backup/meta.00
```

2. Once the metastore has been restored, we can now recover the backed up
data. In the real-world example above, we backed up the `telegraf`
database to `/tmp/backup`, so let's restore that same dataset. To
restore the `telegraf` database:

```
$ influxd restore -database telegraf -datadir /var/lib/influxdb/data /tmp/backup
Restoring from backup /tmp/backup/telegraf.*
unpacking /var/lib/influxdb/data/telegraf/default/2/000000004-000000003.tsm
unpacking /var/lib/influxdb/data/telegraf/default/2/000000005-000000001.tsm
```

> **Note:** Once the backed up data has been recovered, the permissions on the shards may no longer be accurate. To ensure the file permissions are correct, please run this command: `$ sudo chown -R influxdb:influxdb /var/lib/influxdb`

Once the data and metastore are recovered, start the database:

```bash
$ service influxdb start
```

As a quick check, you can verify that the database is known to the metastore
by running a `SHOW DATABASES` command:

```
influx -execute 'show databases'
name: databases
---------------
name
_internal
telegraf
```

The database has now been successfully restored!
