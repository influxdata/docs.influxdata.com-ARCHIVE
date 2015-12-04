---
title: Reading and Writing Data
---

There are many ways to write data into InfluxDB. Client libraries, data collectors, integrations to third parties. All of these go through one of InfluxDB's **input plugins**, which are documented below.

## Writing data through HTTP

The easiest way to write data is through the HTTP API. Most of the client libraries use this API. Simply send a `POST` to `/db/<database>/series?u=<user>&p=<pass>`. Replacing the things in angle brackets with their associated values. You can use HTTP Basic auth instead of putting the user credentials in the query parameters if you prefer.

The body of the POST should look something like this:

```json
[
  {
    "name" : "hd_used",
    "columns" : ["value", "host", "mount"],
    "points" : [
      [23.2, "serverA", "/mnt"]
    ]
  }
]
```

As you can see from that body, you can post multiple points to multiple series at the same time. In fact, if you want to get decent performance, it's in your best interest to batch up points into a single request. Times for points will be assigned automatically by the server, unless specified.

**Note** that InfluxDB is schemaless so the series and columns get created on the fly. You can add columns to existing series without penalty. It also means that if you change the column type later by writing in different data, InfluxDB won't complain, but you might get unexpected results when querying.

If you're running InfluxDB on your local host, for example, you can do:

```
curl -X POST -d '[{"name":"foo","columns":["val"],"points":[[23]]}]' 'http://localhost:8086/db/mydb/series?u=root&p=root'
```

That'll write a single point to the `foo` series in the `mydb` database. That's about all there is to writing via the HTTP API.

### Specifying Time and Sequence Number on writes

InfluxDB will assign a time and sequence number for every point written. If your data collection lags behind or you're writing in historical data, you'll want to specify the time. Simply include the time column in the body of the post with an epoch as the value. For example:

```json
[
  {
    "name": "log_lines",
    "columns": ["time", "line"],
    "points": [
      [1400425947368, "here's some useful log info"]
    ]
  }
]
```

Because InfluxDB is distributed, the order of points is only guaranteed by timestamp. If you need absolute ordering, you'll probably want to create a proxy and set times and sequence numbers yourself. For example:

```json
[
  {
    "name": "log_lines",
    "columns": ["time", "sequence_number", "line"],
    "points": [
      [1400425947368, 1, "this line is first"],
      [1400425947368, 2, "and this is second"]
    ]
  }
]
```

### Time Precision on Written Data

InfluxDB keeps a timestamp for every point written in. Under the hood this timestamp is a microsecond epoch. If you write data with a time you should specify the precision, which can be done via the `time_precision` query parameter. It can be set to either `s` for seconds, `ms` for milliseconds, or `u` for microseconds. Just add that to your `POST`.

## Writing data through Graphite Protocol

InfluxDB supports the Carbon protocol that Graphite uses. All you need to do is enable graphite in the `input-plugins` section of the [configuration file](https://github.com/influxdb/influxdb/blob/master/config.sample.toml). Then you'll be able to point anything that writes to Graphite to InfluxDB instead.

## Writing data through JSON + UDP

InfluxDB allows you to write data through JSON and UDP. It assumes that you will be writing data to a single database, which is configured through the [configuration file](https://github.com/influxdb/influxdb/blob/master/config.sample.toml). The data you write in should look exactly like what you'd `POST` to the HTTP API.

## Adding a method for writing data

We want to support data ingestion through a variety of protocols. We've structured the code base to make it easy to add new ingestion protocols. If you're up for writing a little bit of #golang, you can probably add a new ingestion protocol in an afternoon of work. For an example see this [pull request for adding a JSON UDP listener to InfluxDB](https://github.com/influxdb/influxdb/pull/477/files).

## Querying Through the HTTP API

Querying data in InfluxDB happens via the built in admin interface, client libraries, or command line interfaces. All of these use the HTTP API to connect and retrieve data. Simply send a `GET` to `/db/<database>/series?q=<query>&u=<user>&p=<pass>`. Substitute the angle brackets with their respective values.

For example, if querying a locally running InfluxDB with a database of `mydb` you can do this:

```
curl 'http://localhost:8086?u=root&p=root&q=select * from log_lines limit 1'
```

Which return data that looks like this:

```json
[
  {
    "name": "log_lines",
    "columns": ["time", "sequence_number", "line"],
    "points": [
      [1400425947368, 287780001, "here's some useful log info"]
    ]
  }
]
```

The `time` and `sequence_number` columns will always be returned when getting raw points even if you don't explicitly ask for them. When performing queries with a `group by time(...)` interval, the time will be in buckets based on the interval and no sequence number will be included since those apply only to raw data points and not summaries.

### Time Precision on Returned Results

The time precision of the epoch returned in the `time` column can be specified via the `time_precision` query parameter. It can be set to either `s` for seconds, `ms` for milliseconds, or `u` for microseconds.

Now that you know how to read and write data, let's take a look at the [InfluxDB query language](query_language.html) to see what you can do.
