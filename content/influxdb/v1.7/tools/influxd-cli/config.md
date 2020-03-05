---
title: influxd config
description: The `influxd config` command restores backup data and metadata from an InfluxDB backup directory.
menu:
  influxdb_1_7:
    name: influxd config
    weight: 10
    parent: influxd
---
Displays the default configuration.

Usage: influxd config [flags]

    -config <path>
            Set the path to the initial configuration file.
            This defaults to the environment variable INFLUXDB_CONFIG_PATH,
            ~/.influxdb/influxdb.conf, or /etc/influxdb/influxdb.conf if a file
            is present at any of these locations.
            Disable the automatic loading of a configuration file using
            the null device (such as /dev/null).
