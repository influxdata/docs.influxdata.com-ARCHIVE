---
title: Frequently asked questions
description: Frequently asked questions about time series data and the InfluxData platform.
menu:
  platform:
    name: Frequently asked questions
    weight: 70
---

[What is time series data?](#what-is-time-series-data)  
[Why shouldn't I just use a relational database?](#why-shouldn-t-i-just-use-a-relational-database)  

## What is time series data?
Time series data is a series of data points each associated with a specific time.
Examples include:

- Server performance metrics
- Financial averages over time
- Sensor data, such as temperature, barometric pressure, wind speeds, etc.

## Why shouldn't I just use a relational database?
Relational databases can be used to store and analyze time series data, but depending
on the precision of your data, a query can involve potentially millions of rows.
InfluxDB is purpose-built to store and query data by time, providing out-of-the-box
functionality that optionally downsamples data after a specific age and a query
engine optimized for time-based data.
