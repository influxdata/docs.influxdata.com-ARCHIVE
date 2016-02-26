---
title: Kapacitor Version 0.10 Documentation

menu:
  kapacitor:
    name: v0.10
    identifier: kapacitor_010
    weight: 0
---

Kapacitor is a time series data processing engine and the final piece of the TICK stack.  
Kapacitor provides a way for you to define a pipeline for processing time series data.  

You can use Kapacitor to perform monitoring and alerting or to do large ETL jobs.  
Kapacitor will query data from InfluxDB on a schedule,
as well as receive data via the line protocol and any other method InfluxDB supports.  

## Key Features

Here are some of the features that Kapacitor currently supports that make it a great choice for working with time series data.

* Kapacitor can process both streaming data and batch data.  
* Make your own binary/scripts interact with Kapacitor with its User Defined Function.  
* Kapacitor can detect silent failure with its “dead man’s switches” feature.  
* Kapacitor can perform alerting to a number of handler such as Slack, Email, HipChat, Sensu, OpsGenie, VictorOps, PagerDuty and more.  
* Kapacitor can mapReduce your data and send it back to InfluxDB
