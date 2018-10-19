---
title: Monitoring the InfluxData Platform
description: How to use InfluxData's TICK stack to monitor itself and other TICK stacks in order to identify and alert on anomalies.
menu:
  platform:
    name: Monitoring
    weight: 3
---

One of the primary use cases for the InfluxData Platform is as server and infrastructure
monitoring solution. No matter what type of data you're using the TICK stack to collect and
store, it's important to monitor the health of your stack and identify any potential issues.

The following pages provide information about setting up a TICK stack that monitors
another OSS or Enterprise TICK stack. They cover different potential monitoring strategies
and visualizing the monitoring data in a way that makes it easy to recognize, alert on,
and address anomalies as they happen.

<!-- ## [Monitoring setup (Monitoring TICK with TICK)](#) -->

<!-- ## [Internal monitoring vs external monitoring](#) -->

## [Setting up monitoring dashboards](#)

## [Dashboards for monitoring performance](/platform/monitoring/monitoring-dashboards/)

## [InfluxDB OSS Stats monitoring dashboard](/platform/monitoring/dashboard-oss-monitoring/)

The [InfluxDB OSS Cluster Stats monitoring dashboard](/platform/monitoring/dashboard-enterprise-monitoring) includes commonly monitored metrics that are important for monitoring and maintaining your InfluxDB OSS servers and for troubleshooting.

## [InfluxDB Enterprise Cluster Stats monitoring dashboard](/platform/monitoring/dashboard-enterprise-monitoring)

The [InfluxDB Enterprise Cluster Stats monitoring dashboard](/platform/monitoring/dashboard-enterprise-monitoring) includes commonly monitored metrics that are important for monitoring and maintaining your InfluxDB Enterprise clusters and for troubleshooting.

## [Measurements for monitoring InfluxDB OSS and InfluxDB Enterprise dashboards](/platform/monitoring/measurements-internal/)

[Measurements for monitoring InfluxDB OSS and InfluxDB Enterprise dashboards](/platform/monitoring/measurements-internal/) includes all available `_internal` database measurement statistics that can be used for monitoring, altering, and troubleshooting.

## [Using the SHOW STATS command to monitor InfluxDB](/platform/monitoring/show-statistics/)

[Using the SHOW STATS command to monitor InfluxDB](/platform/monitoring/show-statistics/) covers the use of the `SHOW STATS` command for current measurement statistics of InfluxDB servers and available (enabled) components.

## [Using the SHOW DIAGNOSTICS command to monitor InfluxDB](/platform/monitoring/show-diagnostics/)

[Using the SHOW DIAGNOSTICS command to monitor InfluxDB](/platform/monitoring/show-diagnostics/)
covers the use of the `SHOW DIAGNOSTICS` command to get current InfluxDB instance information, including build details, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics.
