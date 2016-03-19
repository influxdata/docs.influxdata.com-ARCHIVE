---
title: API Endpoints & Ports
menu:
  influxdb_011:
    weight: 80
    parent: concepts
---

## Endpoints

All current API Endpoints are listed below.

### /ping

The ping endpoint accepts both `GET` and `HEAD` HTTP requests.
The response body is empty.
The version of the InfluxDB server you issued the request to can be extracted through the `X-Influxdb-Version` field of the header.
For example this is the response from a server running `0.11.0` of InfluxDB:

```bash
$ curl -sl -I localhost:8086/ping

HTTP/1.1 204 No Content
Request-Id: 7d641f0b-e23b-11e5-8005-000000000000
X-Influxdb-Version: 0.11.0
Date: Fri, 04 Mar 2016 19:01:23 GMT
```

The `/ping` endpoint can also accept an optional query param, `wait_for_leader=Ns` where `N` is the number of seconds to wait before returning a response.
This will check with the leader of the [cluster](/influxdb/v0.11/concepts/glossary/#cluster) to ensure that the leader is available and ready.
One second is a good default, but for highly distributed clusters, or clusters under significant load, it may lead to false negatives.
Increasing the timeout gives the raft leader longer to respond.
The request will return `204` if successful and `503` in the case of a timeout.

```bash
$ curl -sl -I localhost:8086/ping?wait_for_leader=1s

HTTP/1.1 204 No Content
Request-Id: b280e5eb-e23b-11e5-8019-000000000000
X-Influxdb-Version: 0.11.0
Date: Fri, 04 Mar 2016 19:02:53 GMT
```

### /query
For more information on the `/query` endpoint see the [Querying Data](/influxdb/v0.11/guides/querying_data/) section of our docs.

### /write
For more information on the `/write` endpoint see the [Writing Data](/influxdb/v0.11/guides/writing_data/) section of our docs.

## Ports

### HTTP API PORT

By default the InfluxDB HTTP API listens on port `8086`.
The `/ping`, `/write`, and `/query` endpoints are all part of the HTTP API.

### Internal Communication port

By default, the communication between clustered instances of InfluxDB occurs over ports `8088` and `8091`.

### Admin interface port

The admin interface for InfluxDB runs on port `8083` and exposes web UI for the server.

### Secondary Ports

InfluxDB also supports communication through UDP, Graphite, Collectd, and OpenTSDB.
By default InfluxDB makes port `2003` available for Graphite.
No default ports are assigned for UDP, Collectd, or OpenTSDB.
