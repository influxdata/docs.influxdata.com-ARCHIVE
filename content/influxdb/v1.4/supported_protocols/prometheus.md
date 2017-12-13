---
title: Prometheus remote read and write API

menu:
  influxdb_1_4:
    weight: 90
    parent: supported_protocols
    url: https://github.com/influxdb/influxdb/blob/master/supported_protocols/prometheus.md
---


##Prometheus

>***Note:*** InfluxDB support for the Prometheus remote read and write API is experimental for both Prometheus and InfluxDB.
>Prometheus configuration documentation states that their remote_read and remote_write configuration settings are "experimental: breaking changes to configuration are likely in future releases."


InfluxDB support for the Prometheus remote read and write API adds the following two HTTP endpoints to the InfluxDB `httpd` handler:
- `/api/v1/prom/read`
- `/api/v1/prom/write`

##Configuration

To enable the use of the Prometheus remote read and write API with InfluxDB, you need to add URL values to the following settings in the [Prometheus configuration file](https://prometheus.io/docs/prometheus/latest/configuration/configuration/):
- [`remote_write`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#<remote_write>)
- [`remote_read`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#<remote_read>)


Example (Prometheus configuration):

```
# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
remote_write:
- url: "http://localhost:8086/api/v1/prom/write?u=paul&p=foo&db=prometheus"
# Remote read configuration (for InfluxDB only at the moment).
remote_read:
- url: "http://localhost:8086/api/v1/prom/read?u=paul&p=foo&db=prometheus"
```

You can use query parameters to pass in the database to write data to and optional user and password.

>***Note:*** Including the password in the config file is not ideal.  See Prometheus issue: ["Support for environment variable substitution in configuration file"](https://github.com/prometheus/prometheus/issues/2357).
