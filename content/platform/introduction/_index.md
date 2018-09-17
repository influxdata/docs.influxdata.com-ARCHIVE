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
It is comprised of four core projects, often referred to as the TICK stack:

[<strong>T</strong>elegraf](#telegraf)  
[<strong>I</strong>nfluxDB](#influxdb)  
[<strong>C</strong>hronograf](#chronograf)  
[<strong>K</strong>apacitor](#kapacitor)  

## Telegraf

_Data Collection_  

Telegraf is a data collection agent that captures data from a growing list of sources
and translates into [line-protocol](#) for storage in InfluxDB.
It's "pluggable", extensible architecture makes it to [create plugins](#) that both
pull and push data from and to different endpoints and sources.

## InfluxDB

_Data Storage_

InfluxDB stores data for any use case involving large amounts of time-stamped data,
including DevOps monitoring, log data, application metrics, IoT sensor data, and real-time analytics.
It provides functionality that allows you to conserve space on your machine by keeping
data for a defined length of time, then automatically downsampling or expiring and deleting
unneeded data from the system.

## Chronograf

_Data Visuzalization_

Chronograf is the user interface for the TICK stack that provides customizable dashboards,
data visualizations, and data exploration. It also allows you to view and manage
Kapacitor tasks.

## Kapacitor

_Data Processing & Events_

Kapacitor is a data processing framework that makes it easy to create alerts,
run ETL jobs, and detect anomalies.



- What is time-series data?
- Why shouldn't I just use a relational database?
