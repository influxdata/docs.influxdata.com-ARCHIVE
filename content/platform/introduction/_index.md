---
title: Introduction to the InfluxData Platform
description: placeholder
aliases:
  - /platform/
menu:
  platform:
    name: Introduction
    weight: 1
---

The InfluxData Platform is the leading [time-series](#) platform designed from the
ground up for modern metrics and events.
It is comprised of four core projects: Telegraf, InfluxDB, Chronograf, and Kapacitor
(often referred to as the [TICK stack](#the-tick-stack)).
Each fulfills a specific role in managing your time-series data: data collection,
data storage, data visualization, and data processing and alerting.

There are also [enterprise versions](#enterprise-offerings) of InfluxDB and Kapacitor
that provide clustering, access control, and incremental backup functionality as
for infrastructures at scale.


## The TICK stack

[<strong>T</strong>elegraf](#telegraf)  
[<strong>I</strong>nfluxDB](#influxdb)  
[<strong>C</strong>hronograf](#chronograf)  
[<strong>K</strong>apacitor](#kapacitor)  

### Telegraf

_**Data Collection**_  

Telegraf is a data collection agent that captures data from a growing list of sources
and translates it into [line-protocol](#) for storage in InfluxDB.
It's "pluggable", extensible architecture makes it easy to [create plugins](#) that both
pull and push data from and to different sources and endpoints.

### InfluxDB

_**Data Storage**_

InfluxDB stores data for any use case involving large amounts of time-stamped data,
including DevOps monitoring, log data, application metrics, IoT sensor data, and real-time analytics.
It provides functionality that allows you to conserve space on your machine by keeping
data for a defined length of time, then automatically downsampling or expiring and deleting
unneeded data from the system.

### Chronograf

_**Data Visuzalization**_

Chronograf is the user interface for the TICK stack that provides customizable dashboards,
data visualizations, and data exploration. It also allows you to view and manage
Kapacitor tasks.

### Kapacitor

_**Data Processing & Events**_

Kapacitor is a data processing framework that makes it easy to create alerts,
run ETL jobs, and detect anomalies.

## Enterprise offerings

### InfluxDB Enterprise

### Kapacitor Enterprise
