---
title: JavaScript
---

The [InfluxDB javascript library lives on GitHub](https://github.com/influxdb/influxdb-js)

You can get the most recent version here:

    <script type="text/javascript" src="http://get.influxdb.org/influxdb-latest.js"

### Initialization

First, create a new InfluxDB object by connecting to a running instance.

    influxdb = new InfluxDB(host, port, username, password, database);

### Available Functions

#### createDatabase(_databaseName_)

This will allow you to create a new database. This function is restricted to cluster admins.

#### deleteDatabase(_databaseName_)

This will allow you to delete a database. This function is restricted to cluster admins.

#### writePoint(_seriesName_, _values_)

This will allow you to write a point to a time series. The content of values should be an associative array,
where the keys are the column names.

#### readPoint(_fieldNames_, _seriesNames_)

This will allow you to read a point from a time series. The query will be constructed in the form of:

    SELECT [fieldNames] FROM [seriesNames];

