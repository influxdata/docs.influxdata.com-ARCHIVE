---
title: Writing Data
aliases:
  - /docs/v0.9/concepts/reading_and_writing_data.html
---

There are many ways to write data into InfluxDB including [client libraries](../clients/api.html) and plugins for common data formats such as [Graphite](../write_protocols/graphite.html). Here we'll show you how to create a database and write data to that database using the built-in HTTP API.

## Creating a database using the HTTP API
To create a database send a `GET` request to the `/query` endpoint and set the URL parameter `q` to `CREATE DATABASE <new_database_name>`. The example below sends a request to InfluxDB running on `localhost` and creates the database `mydb`:  
<br>

```sh
curl -G http://localhost:8086/query --data-urlencode "q=CREATE DATABASE mydb"
```

## Writing data using the HTTP API
The HTTP API is the primary means of putting data into InfluxDB. To write data send a `POST` request to the `/write` endpoint. The example below writes a single point to the `mydb` database. The data consist of the [measurement](../concepts/glossary.html#measurement) `cpu_load_short`, the [tag keys](../concepts/glossary.html#tag-key) `host` and `region` with the [tag values](../concepts/glossary.html#tag-value) `server01` and `us-west`, the [field key](../concepts/glossary.html#field-key) `value` with a [field value](../concepts/glossary.html#field-value) of `0.64`, and the [timestamp](../concepts/glossary.html#timestamp) `1434055562000000000`.  
<br>

```sh
curl -i -XPOST 'http://localhost:8086/write?db=mydb' --data-binary 'cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000'
```
When writing points, you must specify an existing database in the `db` query parameter. See the [HTTP section](../write_protocols/write_syntax.html#http) on the Write Syntax page for a complete list of the available query parameters.

The body of the POST - we call this the [Line Protocol](../write_protocols/line.html) - contains the time-series data that you wish to store. They consist of a measurement, tags, fields, and a timestamp. InfluxDB requires a measurement name. Strictly speaking, tags are optional but most series include tags to differentiate data sources and to make querying both easy and efficient. Both tag keys and tag values are strings. Field keys are required and are always strings, and, [by default](../write_protocols/write_syntax.html#line-protocol), field values are floats. The timestamp - supplied at the end of the line in Unix time in nanoseconds since January 1, 1970 UTC - is optional. If you do not specify a timestamp InfluxDB uses the server's local nanosecond timestamp in Unix epoch. Anything that has to do with time in InfluxDB is always UTC.

### Writing multiple points
---
Post multiple points to multiple series at the same time by separating each point with a new line. Batching points in this manner results in much higher performance.

The following example writes three points to the database `mydb`. The first point belongs to the series with the measurement `cpu_load_short` and tag set `host=server02` and has the server's local timestamp. The second point belongs to the series with the measurement `cpu_load_short` and tag set `host=server02,region=us-west` and has the specified timestamp `1422568543702900257`. The third point has the same specified timestamp as the second point, but it is written to the series with the measurement `cpu_load_short` and tag set `direction=in,host=server01,region=us-west`.  
<br>

```sh
curl -i -XPOST 'http://localhost:8086/write?db=mydb' --data-binary 'cpu_load_short,host=server02 value=0.67
cpu_load_short,host=server02,region=us-west value=0.55 1422568543702900257
cpu_load_short,direction=in,host=server01,region=us-west value=2.0 1422568543702900257'
```

### Writing points from a file
---
Write points from a file by passing `@filename` to `curl`. The data in the file should follow InfluxDB's [line protocol syntax](../write_protocols/write_syntax.html).

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

### Schemaless Design
---
InfluxDB is a schemaless database. You can add new measurements, tags, and fields at any time. Note that if you attempt to write data with a different type than previously used (for example, writing a string to a field that previously accepted integers), InfluxDB will reject those data.

### A note on REST...
---
InfluxDB uses HTTP solely as a convenient and widely supported data transfer protocol.  

Modern web APIs have settled on REST because it addresses a common need. As the number of endpoints grows the need for an organizing system becomes pressing. REST is the industry agreed style for organizing large numbers of endpoints. This consistency is good for those developing and consuming the API: everyone involved knows what to expect.

REST, however, is a convention. InfluxDB makes due with three API endpoints. This simple, easy to understand system uses HTTP as a transfer system for [InfluxQL](https://github.com/influxdb/influxdb/blob/master/influxql/INFLUXQL.md).  The InfluxDB API makes no attempt to be RESTful.


### HTTP response summary
---
* 2xx: If it's `HTTP 204 No Content`, success! If it's  `HTTP 200 OK`, InfluxDB understood the request but couldn't complete it. The body of the response will contain additional error information.
* 4xx: InfluxDB could not understand the request.
* 5xx: The system is overloaded or significantly impaired.

**Examples of error responses:**

* Writing a float to a field that previously accepted booleans:
```sh
curl -i -XPOST 'http://localhost:8086/write?db=hamlet' --data-binary 'tobeornottobe booleanonly=true'  

curl -i -XPOST 'http://localhost:8086/write?db=hamlet' --data-binary 'tobeornottobe booleanonly=5'
```
returns:  
<br>
```sh
HTTP/1.1 400 Bad Request
[...]
write failed: field type conflict: input field "booleanonly" on measurement "tobeornottobe" is type float64, already exists as type boolean
```
* Writing a point to a database that doesn't exist:
```sh
curl -i -XPOST 'http://localhost:8086/write?db=atlantis' --data-binary 'liters value=10'
```
returns:  
<br>
```sh
HTTP/1.1 404 Not Found
[...]
database not found: "atlantis"
```

### Next steps
---
Now that you know how to write data with the built-in HTTP API discover how to query them with the [Querying Data](../guides/querying_data.html) guide!
