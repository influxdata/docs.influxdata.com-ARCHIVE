---
title: Writing data with the HTTP API

menu:
  influxdb_1_4:
    weight: 0
    parent: guides
---

There are many ways to write data into InfluxDB including the [command line interface](/influxdb/v1.4/tools/shell/), [client libraries](/influxdb/v1.4/clients/api/) and plugins for common data formats such as [Graphite](/influxdb/v1.4/write_protocols/graphite/).
Here we'll show you how to create a database and write data to it using the built-in HTTP API.

## Creating a database using the HTTP API
To create a database send a `POST` request to the `/query` endpoint and set the URL parameter `q` to `CREATE DATABASE <new_database_name>`.
The example below sends a request to InfluxDB running on `localhost` and creates the database `mydb`:
<br>

```bash
curl -i -XPOST http://localhost:8086/query --data-urlencode "q=CREATE DATABASE mydb"
```

## Writing data using the HTTP API
The HTTP API is the primary means of writing data into InfluxDB, by sending `POST` requests to the `/write` endpoint.
The example below writes a single point to the `mydb` database.
The data consist of the [measurement](/influxdb/v1.4/concepts/glossary/#measurement) `cpu_load_short`, the [tag keys](/influxdb/v1.4/concepts/glossary/#tag-key) `host` and `region` with the [tag values](/influxdb/v1.4/concepts/glossary/#tag-value) `server01` and `us-west`, the [field key](/influxdb/v1.4/concepts/glossary/#field-key) `value` with a [field value](/influxdb/v1.4/concepts/glossary/#field-value) of `0.64`, and the [timestamp](/influxdb/v1.4/concepts/glossary/#timestamp) `1434055562000000000`.
<br>

```bash
curl -i -XPOST 'http://localhost:8086/write?db=mydb' --data-binary 'cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000'
```
When writing points, you must specify an existing database in the `db` query parameter.
Points will be written to `db`'s default retention policy if you do not supply a retention policy using the `rp` query parameter.
See the [API Reference](/influxdb/v1.4/tools/api/#write) documentation for a complete list of the available query parameters.

The body of the POST - we call this the [Line Protocol](/influxdb/v1.4/concepts/glossary/#line-protocol) - contains the time-series data that you wish to store.
They consist of a measurement, tags, fields, and a timestamp.
InfluxDB requires a measurement name.
Strictly speaking, tags are optional but most series include tags to differentiate data sources and to make querying both easy and efficient.
Both tag keys and tag values are strings.
Field keys are required and are always strings, and, [by default](/influxdb/v1.4/write_protocols/line_protocol_reference/#data-types), field values are floats.
The timestamp - supplied at the end of the line in Unix time in nanoseconds since January 1, 1970 UTC - is optional.
If you do not specify a timestamp InfluxDB uses the server's local nanosecond timestamp in Unix epoch.
Anything that has to do with time in InfluxDB is always UTC.

### Writing multiple points
---
Post multiple points to multiple series at the same time by separating each point with a new line.
Batching points in this manner results in much higher performance.

The following example writes three points to the database `mydb`.
The first point belongs to the series with the measurement `cpu_load_short` and tag set `host=server02` and has the server's local timestamp.
The second point belongs to the series with the measurement `cpu_load_short` and tag set `host=server02,region=us-west` and has the specified timestamp `1422568543702900257`.
The third point has the same specified timestamp as the second point, but it is written to the series with the measurement `cpu_load_short` and tag set `direction=in,host=server01,region=us-west`.
<br>

```bash
curl -i -XPOST 'http://localhost:8086/write?db=mydb' --data-binary 'cpu_load_short,host=server02 value=0.67
cpu_load_short,host=server02,region=us-west value=0.55 1422568543702900257
cpu_load_short,direction=in,host=server01,region=us-west value=2.0 1422568543702900257'
```

### Writing points from a file
---
Write points from a file by passing `@filename` to `curl`.
The data in the file should follow InfluxDB's [line protocol syntax](/influxdb/v1.4/write_protocols/write_syntax/).

Example of a properly-formatted file (`cpu_data.txt`):
<br>
```txt
cpu_load_short,host=server02 value=0.67
cpu_load_short,host=server02,region=us-west value=0.55 1422568543702900257
cpu_load_short,direction=in,host=server01,region=us-west value=2.0 1422568543702900257
```

Write the data in `cpu_data.txt` to the `mydb` database with:
<br>
`curl -i -XPOST 'http://localhost:8086/write?db=mydb' --data-binary @cpu_data.txt`

> **Note:** If your data file has more than 5,000 points, it may be necessary to split that file into several files in order to write your data in batches to InfluxDB.
By default, the HTTP request times out after five seconds.
InfluxDB will still attempt to write the points after that time out but there will be no confirmation that they were successfully written.

### Schemaless Design
---
InfluxDB is a schemaless database.
You can add new measurements, tags, and fields at any time.
Note that if you attempt to write data with a different type than previously used (for example, writing a string to a field that previously accepted integers), InfluxDB will reject those data.

### A note on REST...
---
InfluxDB uses HTTP solely as a convenient and widely supported data transfer protocol.


Modern web APIs have settled on REST because it addresses a common need.
As the number of endpoints grows the need for an organizing system becomes pressing.
REST is the industry agreed style for organizing large numbers of endpoints.
This consistency is good for those developing and consuming the API: everyone involved knows what to expect.

REST, however, is a convention.
InfluxDB makes do with three API endpoints.
This simple, easy to understand system uses HTTP as a transfer method for [InfluxQL](/influxdb/v1.4/query_language/spec/).
The InfluxDB API makes no attempt to be RESTful.

### HTTP response summary
---
* 2xx: If your write request received `HTTP 204 No Content`, it was a success!
* 4xx: InfluxDB could not understand the request.
* 5xx: The system is overloaded or significantly impaired.

**Examples of error responses:**

* Writing a float to a field that previously accepted booleans:

```bash
curl -i -XPOST 'http://localhost:8086/write?db=hamlet' --data-binary 'tobeornottobe booleanonly=true'

curl -i -XPOST 'http://localhost:8086/write?db=hamlet' --data-binary 'tobeornottobe booleanonly=5'
```

returns:
<br>

```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.4.x
Date: Wed, 01 Mar 2017 19:38:01 GMT
Content-Length: 150

{"error":"field type conflict: input field \"booleanonly\" on measurement \"tobeornottobe\" is type float, already exists as type boolean dropped=1"}
```

* Writing a point to a database that doesn't exist:

```bash
curl -i -XPOST 'http://localhost:8086/write?db=atlantis' --data-binary 'liters value=10'
```

returns:
<br>

```bash
HTTP/1.1 404 Not Found
Content-Type: application/json
Request-Id: [...]
X-Influxdb-Version: 1.4.x
Date: Wed, 01 Mar 2017 19:38:35 GMT
Content-Length: 45

{"error":"database not found: \"atlantis\""}
```

### Next steps
---
Now that you know how to write data with the built-in HTTP API discover how to query them with the [Querying Data](/influxdb/v1.4/guides/querying_data/) guide!
For more information about writing data with the HTTP API, please see the [API reference documentation](/influxdb/v1.4/tools/api/#write).
