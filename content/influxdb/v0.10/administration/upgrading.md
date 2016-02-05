---
title: Upgrading from previous versions

menu:
  influxdb_010:
    weight: 30
    parent: administration
---

InfluxDB version 0.10.0 uses a new default storage engine, `tsm1`.
The data storage format change requires a manual conversion for data written using the `b1` or `bz1` engines.

## Converting b1 and bz1 shards to tsm1

`influx_tsm` is a tool for converting `b1` and `bz1` shards to `tsm1` format.
Converting shards to `tsm1` format results in a significant reduction in disk usage, and significantly improved write-throughput, when writing data into those shards.

Conversion can be controlled on a database-by-database basis.
By default a database is backed up before it is converted, allowing you to roll back any changes.
Because of the backup process, ensure the host system has at least as much free disk space as the disk space consumed by the data directory of your InfluxDB system.

The tool automatically ignores `tsm1` shards, and can be run idempotently on any database.

Conversion is an offline process, and the InfluxDB system must be stopped during conversion.
However the conversion process reads and writes shards directly on disk and should be fast.

### Steps


1. Stop all write traffic to your InfluxDB system.
2. Stop the InfluxDB service.
3. Ensure that all data are present in shards by restarting the InfluxDB service and waiting until all WAL data is flushed to disk. This is complete when the system responds to queries.
4. Stop the InfluxDB service. Do not restart the service until the conversion is complete.
5. Create a directory for the backup:

    ```
mkdir ~/influxdb_backup
    ```
6. Run the conversion tool.

    Where `~/influxdb_backup` is the directory for the backup and `~/.influxdb/data` is your data directory:

    ```
influx_tsm -backup ~/influxdb_backup ~/.influxdb/data
    ```

    The tool will first list the shards to be converted and will ask for confirmation. You can abort the conversion process at this step if you just wish to see what would be converted, or if the list of shards does not look correct.

    For a list of options for the conversion tool, enter `influx_tsm -h`.

    > **Note:** By default, the conversion operation performs each operation in a serial manner. This minimizes load on the host system performing the conversion, but also takes the most time. If you wish to minimize the time conversion takes, enable parallel mode with `-parallel`:
    ```
    influx_tsm -backup ~/influxdb_backup -parallel ~/.influxdb/data
    ```
    Conversion will then perform as many operations as possible in parallel, but the process may place significant load on the host system (CPU, disk, and RAM, usage will all increase).
7. If you ran the conversion tool as a different user from the user who runs InfluxDB, check and, if necessary, set the correct read and write permissions on the new `tsm1` directories.
8. Restart InfluxDB and ensure that the data look correct.
9. If everything looks OK, you may then wish to remove or archive the backed-up databases in `~/influxdb_backup`:
    ```
rm -r ~/influxdb_backup
    ```
10. Restart write traffic.

## Rolling back a conversion
After a successful backup, you have a duplicate of you database(s) in the backup directory you provided on the command line.
If, when checking your data after a successful conversion, you notice things missing or something just isn't right, you can "undo" the conversion.

1. Shut down your node (this is very important).
2. Remove the database's directory from the influxdb data directory. Where `~/.influxdb/data/` is your data directory and `stats` is the name of the database you'd like to remove:

    ```
    rm -r ~/.influxdb/data/stats
    ```
3. Copy the database's directory from the backup directory you created (`~/influxdb_backup/stats`) into the data directory (`~/.influxdb/data/`):

    ```
     cp -r ~/influxdb_backup/stats ~/.influxdb/data/
    ```
4. Restart InfluxDB.
