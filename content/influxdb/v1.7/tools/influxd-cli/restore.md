---
title: influxd restore
description: The `influxd restore` command restores backup data and metadata from an InfluxDB backup directory.
menu:
  influxdb_1_7:
    name: influxd restore
    weight: 10
    parent: influxd
---
The `influxd restore` command restores backup data and metadata from an InfluxDB backup directory.

{{% warn %}}
Shut down the `influxd` server before restoring data.
{{% /warn %}}
