---
title: API Endpoints & Ports
menu:
  influxdb_013:
    weight: 80
    parent: concepts
---

## Endpoints

All current API Endpoints are listed below.

### /ping

The ping endpoint accepts both `GET` and `HEAD` HTTP requests.
The response body is empty.
The version of the InfluxDB server you issued the request to can be extracted through the `X-Influxdb-Version` field of the header.
For example this is the response from a server running `0.13.x` of InfluxDB:

```bash
$ curl -sl -I localhost:8086/ping

HTTP/1.1 204 No Content
Request-Id: 7d641f0b-e23b-11e5-8005-000000000000
X-Influxdb-Version: 0.13.x
Date: Fri, 04 Mar 2016 19:01:23 GMT
```

### /query
For more information on the `/query` endpoint see the [Querying Data](/influxdb/v0.13/guides/querying_data/) section of our docs.

Starting with InfluxDB 0.13, all queries sent to the `/query` endpoint that are not `SELECT` or `SHOW` queries should be `POST` requests. non-`SELECT` and non-`SHOW` queries will continue to work with `GET` requests but this behavior is deprecated in version 0.13 and will no longer work in version 1.0.

### /write
For more information on the `/write` endpoint see the [Writing Data](/influxdb/v0.13/guides/writing_data/) section of our docs.

## Ports

### HTTP API PORT

By default the InfluxDB HTTP API listens on port `8086`.
The `/ping`, `/write`, and `/query` endpoints are all part of the HTTP API.

### Admin interface port

The admin interface for InfluxDB runs on port `8083` and exposes web UI for the server.

### Secondary Ports

InfluxDB also supports communication through UDP, Graphite, Collectd, and OpenTSDB.

Default ports:

* Graphite: `2003`
* OpenTSDB: `4242`

No default ports are assigned for UDP and Collectd.
