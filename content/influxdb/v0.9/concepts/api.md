---
title: API Endpoints & Ports
menu:
  influxdb_09:
    weight: 60
    parent: concepts
---

## Endpoints

All current API Endpoints are listed below.

### /ping

The ping endpoint accepts both `GET` and `HEAD` HTTP requests.
The response body is empty.
The version of the InfluxDB server you issued the request to can be extracted through the `X-Influxdb-Version` field of the header.
For example this is the response from a server running `0.9.5-nightly-548b898` of InfluxDB:

```shell
$ curl -sl -I localhost:8086/ping

HTTP/1.1 204 No Content
Request-Id: 78addfb1-5335-11e5-87f5-000000000000
X-Influxdb-Version: 0.9.5-nightly-548b898
Date: Wed, 21 Oct 2015 16:29:02 GMT
```

In InfluxDB versions 0.9.5+ the `/ping` endpoint can also accept an optional query param, `wait_for_leader=Ns` where `N` is the number of seconds to wait before returning a response.
This will check with the leader of the [cluster](/influxdb/v0.9/concepts/glossary/#cluster) to ensure that the leader is available and ready.
One second is a good default, but for highly distributed clusters or clusters under significant load it may lead to false negatives.
Increasing the timeout gives the raft leader longer to respond.
The request will return `204` if successful and `503` in the case of a timeout.

```shell
$ curl -sl -I localhost:8086/ping?wait_for_leader=1s

HTTP/1.1 204 No Content
Request-Id: 78addfb1-5335-11e5-87f5-000000000000
X-Influxdb-Version: 0.9.5-nightly-548b898
Date: Wed, 21 Oct 2015 16:29:35 GMT
```

### /query
For more information on the `/query` endpoint see the [Querying Data](/influxdb/v0.9/guides/querying_data/) section of our docs.

### /write
For more information on the `/write` endpoint see the [Writing Data](/influxdb/v0.9/guides/writing_data/) section of our docs.

## Ports

### HTTP API PORT

By default the InfluxDB HTTP API listens on port `8086`.
The `/ping`, `/write`, and `/query` endpoints are all part of the HTTP API.

### Internal Communication port

By default the communication between instances of InfluxDB in a cluster happens on port `8088`.

### Admin interface port

The admin interface for InfluxDB runs on port `8083` and exposes web UI for the server.

### Secondary Ports

InfluxDB also supports communication through UDP, Graphite, Collectd, and OpenTSDB.
By default InfluxDB makes port `2003` available for Graphite.
No default ports are assigned for UDP, Collectd, or OpenTSDB.

