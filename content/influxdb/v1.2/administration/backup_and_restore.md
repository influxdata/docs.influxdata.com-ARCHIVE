---
title: Backup and Restore

menu:
  influxdb_1_2:
    weight: 30
    parent: administration
---

## Backups

InfluxDB has the ability to snapshot an instance at a point-in-time and restore it.
All backups are full backups.
InfluxDB does not yet support incremental backups.
There are two types of data to backup, the metastore and the metrics themselves.
The [metastore](/influxdb/v1.2/concepts/glossary/#metastore) is backed up in its entirety.
The metrics are backed up per-database in a separate operation from the metastore backup.

> **Note:** Backups are not interchangeable between OSS InfluxDB and [InfluxEnterprise](/enterprise_influxdb/v1.2/).
You cannot restore an OSS backup to an InfluxEnterprise data node, nor can you restore
an InfluxEnterprise backup to an OSS instance.
>
If you are working with an InfluxEnterprise cluster, please see the [Backup
and Restore Guide](/enterprise_influxdb/v1.2/guides/backup-and-restore/) in the
InfluxEnterprise documentation.

### Backing up the Metastore

InfluxDB's metastore contains internal information about the status of
the system, including user information, database/shard metadata, CQs, RPs,
and subscriptions. While a node is running, you can
create a backup of your instance's metastore by running the command:

```
influxd backup <path-to-backup>
```

Where `path-to-backup` can be replaced with the directory where you
would like the backup to be written to. Without any other arguments,
the backup will only record the current state of the system
metastore. For example, the command:

```bash
$ influxd backup /tmp/backup
2016/02/01 17:15:03 backing up metastore to /tmp/backup/meta.00
2016/02/01 17:15:03 backup complete
```

Will create a metastore backup in the directory `/tmp/backup` (the
directory will be created if it doesn't already exist).

### Backing up a Database

Each database must be backed up individually.

To backup a database, you will need to add the `-database` flag:

```bash
influxd backup -database <mydatabase> <path-to-backup>
```

Where `mydatabase` is the name of the database you would like to
backup, and `path-to-backup` is where the backup data should be
stored. Optional flags also include:

- `-retention <retention policy name>` - This flag can be used to
  backup a specific retention policy. For more information on
  retention policies, please see
  [here](/influxdb/v1.2/query_language/database_management/#retention-policy-management). If
  not specified, all retention policies will be backed up.

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

### Remote Backups

The default port for remote backups is set to `8088`.
That setting is [configurable](/influxdb/v1.2/administration/config/#bind-address-8088).

To capture a backup from a remote node, specify the host and port of
the remote instance using the `-host` configuration switch:

```bash
$ influxd backup -database mydatabase -host 10.0.0.1:8088 /tmp/mysnapshot
```

Where all of the flags above still apply to remote hosts.

## Restore

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
steps. First, the metastore needs to be restored so that InfluxDB
knows which databases exist:

```
$ influxd restore -metadir /var/lib/influxdb/meta /tmp/backup
Using metastore snapshot: /tmp/backup/meta.00
```

Once the metastore has been restored, we can now recover the backed up
data. In the real-world example above, we backed up the `telegraf`
database to `/tmp/backup`, so let's restore that same dataset. To
restore the `telegraf` database:

```
$ influxd restore -database telegraf -datadir /var/lib/influxdb/data /tmp/backup                                                                         
Restoring from backup /tmp/backup/telegraf.*
unpacking /var/lib/influxdb/data/telegraf/default/2/000000004-000000003.tsm
unpacking /var/lib/influxdb/data/telegraf/default/2/000000005-000000001.tsm
```

> **Note:** Once the backed up data has been recovered, the
permissions on the shards may no longer be accurate. To ensure
the file permissions are correct, please run:

> `$ sudo chown -R influxdb:influxdb /var/lib/influxdb`

Once the data and metastore are recovered, it's time to start the database:

```bash
$ service influxdb start
```

As a quick check, we can verify the database is known to the metastore
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
