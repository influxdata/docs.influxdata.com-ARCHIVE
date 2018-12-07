---
title: Monitoring the InfluxData Platform
description: How to use InfluxData's TICK stack to monitor itself and other TICK stacks in order to identify and alert on anomalies.
menu:
  platform:
    name: Monitoring
    weight: 40
---

One of the primary use cases for the InfluxData Platform is as server and infrastructure
monitoring solution. No matter what type of data you're using the TICK stack to collect and
store, it's important to monitor the health of your stack and identify any potential issues.

The following pages provide information about setting up a TICK stack that monitors
another OSS or Enterprise TICK stack. They cover different potential monitoring strategies
and visualizing the monitoring data in a way that makes it easy to recognize, alert on,
and address anomalies as they happen.

## [Internal versus external monitoring](/platform/monitoring/internal-vs-external)
An explanation of internal and external monitoring strategies for your Enterprise
or OSS TICK stack with the pros and cons of each.

## [Set up an external monitor](/platform/monitoring/external-monitor-setup)
How to set up an external InfluxData TICK stack that monitors another Enterprise or OSS TICK stack.

## [Dashboards for monitoring](/platform/monitoring/monitoring-dashboards)
Set up dashboards to help visualize and monitor the health and performance of your InfluxData TICK stack.

## [Monitoring tools](/platform/monitoring/tools)
The InfluxData platform provides tools to help you monitor and troubleshoot issues if they arise.
