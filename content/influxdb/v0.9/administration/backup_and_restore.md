---
title: Backup and Restore
aliases:
  - /docs/v0.9/concepts/backup_and_restore.html
---

Starting with v0.9.0, InfluxDB has the ability to snapshot a single data node at a point-in-time and restore it.


## Usage

While a data node is running, you can create a hot backup to a snapshot file (e.g. `/tmp/mysnapshot`):

```sh
$ influxd backup /tmp/mysnapshot
```

By default, this can only be run from the data node itself. See configuration options below to snapshot from another machine.

To capture a backup from a remote node, specify the host and port using the -host configuration switch:

```sh
$ influxd backup -host 10.0.0.0:8808 /tmp/mysnapshot
```

Once you have your snapshot file, you can copy it to another machine and restore it. Be sure to first shut down any running influxd process

```sh
$ influxd restore -config /path/to/influxdb.conf /path/to/mysnapshot
```

This command will remove the broker and data directories listed in the configuration file provided and replace them with the data in the snapshot. Once the restore is complete make sure the newly written files are readable and writeable by the `influxdb` user. Once that's ensured you can start the `influxd` server normally.


## Configuration Options

A configuration section has been added for the snapshot handler with the following defaults:

```
[snapshot]
enabled = true # Disabled by default if not set.
```

If set to false InfluxDB will not allow snapshots. Any attempt will return a 404 error. The process must be restarted for configuration changes to take effect.

## Implementation

The snapshot file is one or more `tar` archives that contain a `manifest` file at the beginning, the data node's `meta` file next, and then a list of all shard files. The metastore and shards all use Bolt so they contain a point-in-time copy of the database when the backup was initiated.

The broker node is not backed up because it can be materialized from the data in the data node. The restore command generates a broker meta store based on the highest index in the data node and generates a raft configuration based on the InfluxDB config passed in.


## Incremental Backups

InfluxDB also has support for incremental backups. Snapshotting from the server now creates a full backup if one does not exist and creates numbered incremental backups after that.

For example, if you ran:

```sh
$ influxd backup /tmp/snapshot
```

Then you'll see a full snapshot in `/tmp/snapshot`. If you run the backup
command again using the identical filename then an incremental snapshot will be created at
`/tmp/snapshot.0`. Running it again will create `/tmp/snapshot.1`, etc. 

Running the backup command with a new filename will create a new full backup with that filename, not an incremental backup.


## Caveats

This approach currently only works in clusters where the replication factor is the same as the number of nodes in the cluster. A cluster wide backup and restore will be done in the future.
