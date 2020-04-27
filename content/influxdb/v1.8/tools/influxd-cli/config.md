---
title: influxd config
description: The `influxd config` command displays the default configuration.
menu:
  influxdb_1_8:
    name: influxd config
    weight: 10
    parent: influxd-cli
---
The `influxd config` command displays the default configuration.

## Usage

```
influxd config [flags]
```

## Flags

| Flag          | Description                                                                                                                                | Maps To                |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `-config`     | Set the path to the configuration file. Disable the automatic loading of a configuration file using the null device (such as `/dev/null`). | `INFLUXDB_CONFIG_PATH` |
| `-h`, `-help` | Help for the `influxd config` command.                                                                                                     |                        |
