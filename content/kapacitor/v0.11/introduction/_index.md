---
title: Introduction

menu:
  kapacitor_011:
    name: Introduction
    identifier: introduction
    weight: 0
---

Kapacitor is a time series data processing engine.
Kapacitor is the final piece of the TICK stack.

Kapacitor provides a way for you to define a pipeline for processing time series data.
You can use Kapacitor to perform monitoring and alerting or to do large ETL jobs.
Kapacitor can process both streaming data and batch data.
Kapacitor will query data from InfluxDB on a schedule,
as well as receive data via the line protocol and any other method InfluxDB supports.

* T - Telegraf -- Data collection
* I - InfluxDB -- Data storage
* C - Chronograf -- Data visualization
* K - Kapacitor -- Data processing

See the [getting started guides](/kapacitor/v0.11/introduction/getting_started/) for walk through on getting up and running with Kapacitor.

