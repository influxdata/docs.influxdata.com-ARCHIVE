---
title: influxd backup
description: The `influxd backup` command restores backup data and metadata from an InfluxDB backup directory.
menu:
  influxdb_1_7:
    name: influxd backup
    weight: 10
    parent: influxd
---

Creates a backup copy of specified InfluxDB OSS database(s) and saves the files in an Enterprise-compatible
format to PATH (directory where backups are saved).

Usage: influxd backup [options] PATH

    -portable
            Required to generate backup files in a portable format that can be restored to InfluxDB OSS or InfluxDB
            Enterprise. Use unless the legacy backup is required.
    -host <host:port>
            InfluxDB OSS host to back up from. Optional. Defaults to 127.0.0.1:8088.
    -db <name>
            InfluxDB OSS database name to back up. Optional. If not specified, all databases are backed up when
            using '-portable'.
    -rp <name>
            Retention policy to use for the backup. Optional. If not specified, all retention policies are used by
            default.
    -shard <id>
            The identifier of the shard to back up. Optional. If specified, '-rp <rp_name>' is required.
    -start <2015-12-24T08:12:23Z>
            Include all points starting with specified timestamp (RFC3339 format).
            Not compatible with '-since <timestamp>'.
    -end <2015-12-24T08:12:23Z>
            Exclude all points after timestamp (RFC3339 format).
            Not compatible with '-since <timestamp>'.
    -since <2015-12-24T08:12:23Z>
            Create an incremental backup of all points after the timestamp (RFC3339 format). Optional.
            Recommend using '-start <timestamp>' instead.
    -skip-errors
            Optional flag to continue backing up the remaining shards when the current shard fails to backup.
