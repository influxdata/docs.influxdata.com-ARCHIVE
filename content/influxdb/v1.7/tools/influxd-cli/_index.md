---
title: `influxd` command line interface (CLI)

menu:
  influxdb_1_7:
    name: influxd
    weight: 10
    parent: Tools
---

The `influxd` command line interface (CLI) includes commands to manage many aspects of InfluxDB, including databases, organizations, users, and tasks.


## Usage

```
influxd [[command] [arguments]]
```



## Commands
| Command                                               | Description                                              |
|-------------------------------------------------------|----------------------------------------------------------|
| [backup](/influxdb/latest/tools/influxd-cli/backup)   | Download a snapshot of a data node and saves it to disk. |
| [config](/influxdb/latest/tools/influxd-cli/config)   | Display the default configuration.                       |
| help                                                  | Display the help message.                                |
| [restore](/influxdb/latest/tools/influxd-cli/restore) | Use a snapshot of a data node to rebuild a cluster.      |
| [run](/influxdb/latest/tools/influxd-cli/run)         | Run node with existing configuration.                    |
| [version](/influxdb/latest/tools/influxd-cli/version) | Display the InfluxDB version.                            |
