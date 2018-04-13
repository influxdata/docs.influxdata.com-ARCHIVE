---
title: API Endpoints & Ports
newversionredirect: tools/api/
menu:
  influxdb_012:
    weight: 80
    parent: concepts
---

## Endpoints

All current API Endpoints are listed below.

### /ping

The ping endpoint accepts both `GET` and `HEAD` HTTP requests.
The response body is empty.
The version of the InfluxDB server you issued the request to can be extracted through the `X-Influxdb-Version` field of the header.
For example this is the response from a server running `0.12.0` of InfluxDB:

```bash
$ curl -sl -I localhost:8086/ping

HTTP/1.1 204 No Content
Request-Id: 7d641f0b-e23b-11e5-8005-000000000000
X-Influxdb-Version: 0.12.0
Date: Fri, 04 Mar 2016 19:01:23 GMT
```

### /query
For more information on the `/query` endpoint see the [Querying Data](/influxdb/v0.12/guides/querying_data/) section of our docs.

### /write
For more information on the `/write` endpoint see the [Writing Data](/influxdb/v0.12/guides/writing_data/) section of our docs.

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
