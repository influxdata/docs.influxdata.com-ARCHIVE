---
title: Prometheus endpoints support in InfluxDB

menu:
  influxdb_1_5:
    name: Prometheus
    weight: 40
    parent: Supported protocols
---




## Prometheus remote read and write API support

<dt>
Note: The Prometheus [API Stability Guarantees](https://prometheus.io/docs/prometheus/latest/stability/) states that remote read and remote write endpoints are features listed as experimental or subject to change, and thus considered unstable for 2.x". Any breaking changes will be included in the InfluxDB release notes.
</dt>

InfluxDB support for the Prometheus remote read and write API adds the following two HTTP endpoints to the InfluxDB `httpd` handler:

* `/api/v1/prom/read`
* `/api/v1/prom/write`
* `/api/v1/prom/metrics`

### Configuration

To enable the use of the Prometheus remote read and write API with InfluxDB, you need to add URL values to the following settings in the [Prometheus configuration file](https://prometheus.io/docs/prometheus/latest/configuration/configuration/):

- [`remote_write`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#<remote_write>)
- [`remote_read`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#<remote_read>)


#### Example of Prometheus endpoint configuration

```
# Remote write endpoint configuration (for Graphite, OpenTSDB, or InfluxDB).
remote_write:
* url: "http://localhost:8086/api/v1/prom/write?u=paul&p=foo&db=prometheus"
# Remote read endpoint configuration (for InfluxDB only at the moment).
remote_read:
* url: "http://localhost:8086/api/v1/prom/read?u=paul&p=foo&db=prometheus"
```

You can use query parameters to pass in an optional database user and password.

>***Note:*** Including the password in the config file is not ideal.  See this Prometheus issue: ["Support for environment variable substitution in configuration file"](https://github.com/prometheus/prometheus/issues/2357).
