---
title: API Endpoints & Ports
---

## Endpoints

All current API Endpoints are listed below.


### /ping

The ping endpoint accepts both `GET` and `HEAD` HTTP requests. There are no query parameters that can be passed to the endpoint. The response body is empty. The version of the InfluxDB server you issued the request to can be extracted through the `X-Influxdb-Version` field of the header.

For example this is the `/ping` response from a server running `0.9.4-nightly-548b898` of InfluxDB:

```sh
HTTP/1.1 204 No Content
Request-Id: 78addfb1-5335-11e5-87f5-000000000000
X-Influxdb-Version: 0.9.4-nightly-548b898
Date: Fri, 04 Sep 2015 18:48:02 GMT
```

### /query
For more information on the `/query` endpoint see the [Querying Data](/docs/v0.9/guides/querying_data.html) section of our docs.

### /write
For more information on the `/write` endpoint see the [Writing Data](/docs/v0.9/guides/writing_data.html) section of our docs.

## Ports

### HTTP API PORT

By default the InfluxDB HTTP API listens on port `8086`. The `/ping`, `/write`, and `/query` endpoints are all part of the HTTP API.

### Internal Communication port

By default the communication between instances of InfluxDB in a cluster happens on port `8088`.

### Admin interface port

The admin interface for InfluxDB runs on port `8083` and exposes web UI for the server.

### Secondary Ports

InfluxDB also supports communication through UDP, Graphite, Collectd, and OpenTSDB. By default InfluxDB makes port `2003` available for Graphite. No default ports are assigned for UDP, Collectd, or OpenTSDB.

