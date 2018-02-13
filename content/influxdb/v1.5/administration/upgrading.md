---
title: Upgrading to InfluxDB 1.5

menu:
  influxdb_1_5:
    weight: 60
    parent: administration
---


This page outlines process for upgrading from:

<table style="width:100%">
  <tr>
    <td><a href="#upgrade-from-0-12-1-2-to-1-3">Version 0.12-1.3 to 1.4</a></td>
    <td><a href="#upgrade-from-0-10-or-0-11-to-1-3">Version 0.10 or 0.11 to 1.4</a></td>
  </tr>
</table>

## Upgrading from 1.4 to 1.5

1. [Download](https://influxdata.com/downloads/#influxdb) InfluxDB version
1.5

2. Update the configuration file

    Migrate any customizations in the 1.4 configuration file to the [1.5 configuration file](/influxdb/v1.5/administration/config/).


    Enable TSI (recommended):

     1. Uncomment the [`index-version` setting](/influxdb/v1.5/administration/config/#index-version-inmem) and set it to `tsi1`.
    The `index-version` setting is in the `[data]` section of the configuration file.
    
    ```
    [data]
      dir = "/var/lib/influxdb/data"
      index-version = "tsi1"
    ```

3. Restart the process

4. Check out the new features outlined in
[Differences between InfluxDB 1.4 and 1.3](/influxdb/v1.5/administration/differences/)

## Upgrade from 0.10 or 0.11 to 1.4

> **Note:** 0.10 users will need to
[convert](/influxdb/v0.10/administration/upgrading/#convert-b1-and-bz1-shards-to-tsm1)
any remaining `b1` and `bz1` shards to `TSM` format before following the
instructions below.
InfluxDB 1.4 cannot read non-`TSM` shards.
Check for non-`TSM` shards in your data directory:
>
* Non-`TSM` shards are files of the form: `data/<database>/<retention_policy>/<shard_id>``
* `TSM` shards are files of the form: `data/<database>/<retention_policy>/<shard_id>/<file>.tsm`

In versions prior to 0.12, InfluxDB stores
[metastore](/influxdb/v1.5/concepts/glossary/#metastore) information in
`raft.db` using the raft services.
In versions 0.12+, InfluxDB stores metastore information in `meta.db`, a binary
protobuf file.

The following steps outline how to transfer metastore information to the new
format.
They also outline when to upgrade the binary to 1.4 and when to generate a
new configuration file.

To start out, you must be working with version 0.10 or 0.11 (don't upgrade the
`influxd` binary yet!).
If you've already upgraded the binary to 1.4, [reinstall 0.11.1](/influxdb/v0.12/administration/upgrading/#urls-for-influxdb-0-11);
InfluxDB 1.4 will yield an error
(`run: create server: detected /var/lib/influxdb/meta/raft.db. [...]`) if you
attempt to start the process without completing the steps below.
The examples below assume you are working with a version of linux.

> Before you start, we recommend making a copy of the entire 0.10 or 0.11 `meta`
directory in case you experience problems with the upgrade. The upgrade process
removes the `raft.db` and `node.json` files from the `meta` directory:
>
```
cp -r <path_to_meta_directory> <path_to_011_meta_directory_backup>
```
>
Example:
>
Create a copy of the 0.10 or 0.11 `meta` directory in `backups/`:
```
~# cp -r /var/lib/influxdb/meta backups/
```

**1.** While still running 0.10 or 0.11, export the metastore data to a different
directory:

```
influxd backup <path_to_metastore_backup>
```

The directory will be created if it doesn't already exist.

Example:

Export the 0.10 or 0.11 metastore to `/tmp/backup`:
```
~# influxd backup /tmp/backup/
2016/04/01 15:33:35 backing up metastore to /tmp/backup/meta.00
2016/04/01 15:33:35 backup complete
```

**2.** Stop the `influxdb` service:

```
sudo service influxdb stop
```

**3.** [Upgrade](https://influxdata.com/downloads/#influxdb) the `influxd`
binary to 1.4. but do not start the service.

**4.** Upgrade your metastore to the 1.4 store by performing a `restore` with
the backup you created in step 1:

```
influxd restore -metadir=<path_to_1.4_meta_directory> <path_to_metastore_backup>
```

Example:

Restore `/tmp/backup` to the meta directory in `/var/lib/influxdb/meta`:
```
~# influxd restore -metadir=/var/lib/influxdb/meta /tmp/backup
Using metastore snapshot: /tmp/backup/meta.00
```

**5.** Update the permissions on the meta database:

```
chown influxdb:influxdb <path_to_1.4_meta_directory>/meta.db
```

Example:

```
~# chown influxdb:influxdb /var/lib/influxdb/meta/meta.db
```

**6.** Update the configuration file:

Compare your old configuration file against the [1.4 configuration file](/influxdb/v1.5/administration/config/)
and manually update any defaults with your localized settings.

**7.** Start the 1.4 service:

```
sudo service influxdb start
```

**8.** Confirm that your metastore data are present:

The 1.4 output from the queries `SHOW DATABASES`,`SHOW USERS` and
`SHOW RETENTION POLICIES ON <database_name>` should match the 0.10 or 0.11
output.

If your metastore data do not appear to be present, stop the service, reinstall
InfluxDB 0.10 or 0.11, restore the copy you made of the entire 0.10 or 0.11 `meta` directory to
the `meta` directory, and try working through these steps again.

**9.** Check out the new features outlined in
[Differences between InfluxDB 1.4 and 1.2](/influxdb/v1.5/administration/differences/).
