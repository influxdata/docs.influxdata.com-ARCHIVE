---
title: Diamond
---

## Saving Diamond Metrics into InfluxDB

Diamond is a metrics collection and delivery daemon written in Python.  It is capable of collecting cpu, memory, network, i/o, load and disk metrics. Additionally, it features an API for implementing custom collectors for gathering metrics from almost any source.

[Diamond homepage](https://github.com/python-diamond)

Diamond started supporting InfluxDB at version 3.5.

## Configuring Diamond to send metrics to InfluxDB

Prerequisites: Diamond depends on the [influxdb python client](https://github.com/influxdb/influxdb-python). InfluxDB-version-specific installation instructions for the influxdb python client can be found on their [github page](https://github.com/influxdb/influxdb-python). 

[Diamond InfluxdbHandler configuration page](https://github.com/python-diamond/Diamond/wiki/handler-InfluxdbHandler)
 
