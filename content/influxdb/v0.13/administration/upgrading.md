---
title: Upgrading from previous versions

menu:
  influxdb_013:
    weight: 50
    parent: administration
---


This page outlines process for upgrading from:

* [Version 0.12 to 0.13](/influxdb/v0.13/administration/upgrading/#upgrading-from-0-12-to-0-13)
* [Version 0.11 to 0.13](/influxdb/v0.13/administration/upgrading/#upgrading-from-0-11-to-0-13)
* [Version 0.10 to 0.13](/influxdb/v0.13/administration/upgrading/#upgrading-from-0-10-to-0-13)

## Upgrading from 0.12 to 0.13

1. [Download](https://influxdata.com/downloads/#influxdb) InfluxDB version
0.13

2. [Generate](/influxdb/v0.13/administration/config/#using-configuration-files)
a new configuration file

    Users must
[update](/influxdb/v0.13/administration/config/#using-configuration-files) their
configuration file to take into account breaking configuration changes in
version 0.13:

    InfluxDB 0.13 supports multiple listeners for the collectd and OpenTSDB inputs.
Update the relevant headers in their configuration files from
`[collectd]` to `[[collectd]]` and from `[opentsdb]` to `[[opentsdb]]`.
The InfluxDB service will not start if the old headers remain, and it will
return the error:
```
run: parse config: Type mismatch for 'run.Config.opentsdb': Expected slice but found 'map[string]interface {}'.
```

3. Check out the new features outlined in
[Differences between InfluxDB 0.13 and 0.12](/influxdb/v0.13/administration/012_vs_013/)

## Upgrading from 0.11 to 0.13

In versions prior to 0.12, InfluxDB stores
[metastore](/influxdb/v0.13/concepts/glossary/#metastore) information in
`raft.db` via the raft services.
In versions 0.12+, InfluxDB stores metastore information in `meta.db`, a binary
protobuf file.
0.11 users will need to follow
[these steps](/influxdb/v0.12/administration/upgrading/) to transfer their
metastore information to the new format (just replace all the 0.12 mentions with
0.13).

Those steps also outline when to upgrade the binary and when to generate a
new configuration file. Please see
[Upgrading from 0.12 to 0.13](/influxdb/v0.13/administration/upgrading/#upgrading-from-0-12-to-0-13)
for why users must upgrade their configuration file to work with version 0.13.

## Upgrading from 0.10 to 0.13

1. [Convert](/influxdb/v0.10/administration/upgrading/#convert-b1-and-bz1-shards-to-tsm1)
any remaining `b1` and `bz1` shards to `TSM` format

    InfluxDB 0.13 cannot read non-`TSM` shards.
    Check for non-`TSM` shards in your data directory:

    * Non-`TSM` shards are files of the form: `data/<database>/<retention_policy>/<shard_id>``
    * `TSM` shards are files of the form: `data/<database>/<retention_policy>/<shard_id>/<file>.tsm`

2. [Transfer](/influxdb/v0.12/administration/upgrading/) metastore information
to the format for versions 0.12+

    In versions prior to 0.12, InfluxDB stores
[metastore](/influxdb/v0.13/concepts/glossary/#metastore) information in
`raft.db` via the raft services.
In versions 0.12+, InfluxDB stores metastore information in `meta.db`, a binary
protobuf file.
0.10 users will need to follow
[these steps](/influxdb/v0.12/administration/upgrading/) to transfer their
metastore information to the new format (just replace all the 0.12 mentions with
0.13).

    Those steps also outline when to upgrade the binary and when to generate a
new configuration file. Please see
[Upgrading from 0.12 to 0.13](/influxdb/v0.13/administration/upgrading/#upgrading-from-0-12-to-0-13)
for why users must upgrade their configuration file to work with version 0.13.
