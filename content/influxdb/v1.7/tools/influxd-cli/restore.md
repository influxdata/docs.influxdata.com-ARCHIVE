---
title: influxd restore
description: The `influxd restore` command restores backup data and metadata from an InfluxDB backup directory.
menu:
  influxdb_1_7:
    name: influxd restore
    weight: 10
    parent: influxd-cli
---
The `influxd restore` command restores backup data and metadata from an InfluxDB backup directory.

Shut down the `influxd` server before restoring data.

## Usage

```
influxd restore [flags]
```

## Flags

| Flag        | Description                                                                                                                                                                                                                             | Maps To                |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `-portable` | Activates portable restore mode, which consumes files in an improved Enterprise-compatible format that includes a manifest. If not specified, the legacy restore mode is used.                                                          | `INFLUXDB_CONFIG_PATH` |
| `-host`     | InfluxDB OSS host to connect to where the data will be restored                                                                                                                                                                         |                        |
| `-db`       | Name of database to be restored from the backup (InfluxDB OSS or InfluxDB Enterprise).                                                                                                                                                  |                        |
| `-newdb`    | Name of the InfluxDB OSS database into which the archived data will be imported on the target system. Optional. If not specified, then the value of `-db <db_name>` is used. The new database name must be unique to the target system. |                        |
| `-rp`       | Name of retention policy from the backup that will be restored. Optional. Requires that `db` is specified.                                                                                                                              |                        |
| `-newrp`    | Name of retention policy from the backup that will be restored. Optional. Requires that `-rp` is specified.                                                                                                                             |                        |
| `-shard`    | Identifier of the shard to be restored. Optional. Requires that `-db` and `-rp` are specified.                                                                                                                                          |                        |
