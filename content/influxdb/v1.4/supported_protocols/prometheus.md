---
title: Prometheus

menu:
  influxdb_1_4:
    weight: 90
    parent: supported_protocols
    url: https://github.com/influxdb/influxdb/blob/master/supported_protocols/prometheus.md
---


##Prometheus

Adds two new endpoints to the `httpd` handler to support prometheus remote read at `/api/v1/prom/read` and remote write at `/api/v1/prom/write`.

##Configuration

To enable the use of the Prometheus read and write APIs with InfluxDB, you need to set remote read and write configurations in the following two sections of the [Prometheus configuration file](https://prometheus.io/docs/prometheus/latest/configuration/configuration/):
- [`remote_write`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#<remote_write>)
- [`remote_read`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#<remote_read>)
-

Prometheus configuration example:

```
[remote]
# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
remote_write:
- url: "http://localhost:8086/api/v1/prom/write?u=paul&p=foo&db=prometheus"
# Remote read configuration (for InfluxDB only at the moment).
remote_read:
- url: "http://localhost:8086/api/v1/prom/read?u=paul&p=foo&db=prometheus"

```

##Use
AFter configuring InfluxDB to support the Prometheus read and write APIs, the new endpoints are:
- `/api/v1/prom/read`
- `/api/v1/prom/write`

You can use query parameters to pass in the database to write data to and optional user and password.

>***Note:*** Including the password in the config file is not ideal so it would be nice to update Prometheus to be able to read this from an environment variable.
