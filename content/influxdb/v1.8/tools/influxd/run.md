---
title: influxd run
description: The `influxd run` command starts and runs all the processes necessary for InfluxDB to function.
menu:
  influxdb_1_8:
    name: influxd run
    weight: 10
    parent: influxd-cli
---

The `influxd run` command is the default command for `influxd`.
It starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd run [flags]
```

Because `run` is the default command for `influxd`, the following commands are the same:

```bash
influxd
influxd run
```

## Flags

| Flag          | Description                                                                                                                                                                                                                                                                                                                    |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-config`     | Path to the configuration file. This defaults to the environment variable `INFLUXDB_CONFIG_PATH`, `~/.influxdb/influxdb.conf`, or `/etc/influxdb/influxdb.conf` if a file is present at either of these locations.  Disable the automatic loading of a configuration file using the null device (such as `/dev/null`). |
| `-pidfile`    | Write process ID to a file.                                                                                                                                                                                                                                                                                                    |
| `-cpuprofile` | Write CPU profiling information to a file.                                                                                                                                                                                                                                                                                     |
| `-memprofile` | Write memory usage information to a file.                                                                                                                                                                                                                                                                                      |
