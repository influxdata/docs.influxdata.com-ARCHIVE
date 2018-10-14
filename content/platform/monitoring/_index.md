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

## [Monitoring setup (Monitoring TICK with TICK)](#)

## [Internal monitoring vs external monitoring](#)

## [Setting up monitoring dashboards](#)

## [InfluxDB OSS Stats monitoring dashboard](/platform/monitoring/oss-monitoring-dashboard/)

## [InfluxDB Enterprise Cluster Stats monitoring dashboard](/platform/monitoring/cluster-monitoring-dashboard)

## [Measurements for monitoring InfluxDB OSS and InfluxDB Enterprise dashboards](/platform/monitoring/measurements-internal/)

## [Using the /debug/vars HTTP endpoint for monitoring InfluxDB](/platform/monitoring/debug-vars-endpoint-influxdb/)

## [Using the /debug/vars HTTP endpoint for monitoring Kapacitor](/platform/monitoring/debug-vars-endpoint-kapa/)

## [Using the SHOW STATISTICS command for monitoring InfluxDB](/platform/monitoring/show-statistics/)

## [Using the SHOW DIAGNOSTICS command for monitoring InfluxDB](/platform/monitoring/show-diagnostics/)
