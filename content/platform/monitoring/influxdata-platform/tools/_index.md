---
title: Tools for monitoring the InfluxData Platform (TICK stack)
description: Use the "_internal" measurements, SHOW DIAGNOSTICS, and SHOW STATS to monitor your InfluxData Platform.
menu:
  platform:
    name: Tools for monitoring InfluxDB
    parent: Monitoring the InfluxData Platform
    weight: 40
---

The following tools are available to help monitor and troubleshoot the InfluxData platform.

## [Measurements for monitoring (`_internal`)](/platform/monitoring/tools/measurements-internal)
Use and understand InfluxDB `_internal` measurements statistics and field keys that can be used to monitor InfluxDB OSS servers and InfluxDB Enterprise clusters.

## [The SHOW DIAGNOSTICS statement ](/platform/monitoring/tools/show-diagnostics)
Use the `SHOW DIAGNOSTICS` statement to get current InfluxDB instance information, including build details, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics.

## [The SHOW STATS statement](/platform/monitoring/tools/show-stats)
Use the `SHOW STATS` statement for current measurement statistics of InfluxDB servers and available (enabled) components.
