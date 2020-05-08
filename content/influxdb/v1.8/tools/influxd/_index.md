---
title: influxd - InfluxDB daemon
description: The influxd daemon starts and runs all the processes necessary for InfluxDB to function.
menu:
 influxdb_1_8:
    name: influxd
    weight: 10
    parent: Tools
---

The `influxd` command starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd [[command] [arguments]]
```

## Commands
| Command                                               | Description                                              |
|-------------------------------------------------------|----------------------------------------------------------|
| [backup](/influxdb/latest/tools/influxd/backup)   | Download a snapshot of a data node and saves it to disk. |
| [config](/influxdb/latest/tools/influxd/config)   | Display the default configuration.                       |
| help                                                  | Display the help message.                                |
| [restore](/influxdb/latest/tools/influxd/restore) | Use a snapshot of a data node to rebuild a cluster.      |
| [run](/influxdb/latest/tools/influxd/run)         | Run node with existing configuration.                    |
| [version](/influxdb/latest/tools/influxd/version) | Display the InfluxDB version.                            |
