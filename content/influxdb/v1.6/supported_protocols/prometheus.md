---
title: Prometheus endpoints support in InfluxDB

menu:
  influxdb_1_6:
    name: Prometheus
    weight: 40
    parent: Supported protocols
---

## Prometheus remote read and write API support

<dt>
Note: The Prometheus [API Stability Guarantees](https://prometheus.io/docs/prometheus/latest/stability/)
states that remote read and remote write endpoints are features listed as experimental
or subject to change, and thus considered unstable for 2.x. Any breaking changes
will be included in the InfluxDB release notes.
</dt>

InfluxDB support for the Prometheus remote read and write API adds the following
HTTP endpoints to InfluxDB:

* `/api/v1/prom/read`
* `/api/v1/prom/write`
* `/api/v1/prom/metrics`

### Create a target database
Create a database in your InfluxDB instance to house data sent from Prometheus.
In the examples provided below, `prometheus` is used as the database name, but
you're welcome to use the whatever database name you like.

```sql
CREATE DATABASE "prometheus"
```

### Configuration

To enable the use of Prometheus' remote read and write APIs with InfluxDB, add URL
values to the following settings in the [Prometheus configuration file](https://prometheus.io/docs/prometheus/latest/configuration/configuration/):

- [`remote_write`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#%3Cremote_write%3E)
- [`remote_read`](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#%3Cremote_read%3E)

The URLs must be resolvable from your running Prometheus server and use the port
on which InfluxDB is running (`8086` by default).
Also include the database name using the `db=` query parameter.

_**Example endpoints in Prometheus configuration file**_  
```yaml
remote_write:
  url: "http://localhost:8086/api/v1/prom/write?db=prometheus"

remote_read:
  url: "http://localhost:8086/api/v1/prom/read?db=prometheus"
```

#### Read and write URLs with authentication
If [authentication is enabled on InfluxDB](/influxdb/v1.6/administration/authentication_and_authorization/),
pass the username and password of an InfluxDB user with read and write privileges
using the `u=` and `p=` query parameters respectively.

_**Example endpoints with authentication enabled**_  
```yaml
remote_write:
  url: "http://localhost:8086/api/v1/prom/write?db=prometheus&u=username&p=password"

remote_read:
  url: "http://localhost:8086/api/v1/prom/read?db=prometheus&u=username&p=password"
```

> Including plain text passwords in your Prometheus configuration file is not ideal.
> Unfortunately, environment variables and secrets are not supported in Prometheus configuration files.
> See this Prometheus issue for more information:
>
>[Support for environment variable substitution in configuration file](https://github.com/prometheus/prometheus/issues/2357)

## How Promethues metrics are parsed in InfluxDB
As Prometheus data is brought into InfluxDB, the following transformations are
made to match the InfluxDB data structure:

- The Prometheus metric name becomes the InfluxDB [measurement](/influxdb/v1.6/concepts/key_concepts/#measurement) name.
- The Prometheus sample (value) becomes an InfluxDB field using the `value` field key. It is always a float.
- Prometheus labels become InfluxDB tags.
- All `# HELP` and `# TYPE` lines are ignored.

_**Example Prometheus to InfluxDB parsing**_  
```bash
# Prometheus metric
example_metric{queue="0:http://example:8086/api/v1/prom/write?db=prometheus",le="0.005"} 308

# Same metric parsed into InfluxDB
measurement
  example_metric
tags
  queue = "0:http://example:8086/api/v1/prom/write?db=prometheus"
  le = "0.005"
  job = "prometheus"
  instance = "localhost:9090"
  __name__ = "example_metric"
fields
  value = 308
```

> In InfluxDB v1.5 and earlier, all measurement names written from remote endpoints
> are prepended with an underscore (`_`).
> In InfluxDB v1.6+, this is no longer the case.

<dt>
This format is different than the format used by the Telegraf Prometheus input plugin,
which is documented [here](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/prometheus).
</dt>
