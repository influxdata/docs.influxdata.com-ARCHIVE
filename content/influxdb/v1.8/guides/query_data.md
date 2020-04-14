---
title: Query data with the InfluxDB API
alias:
  -/docs/v1.8/query_language/querying_data/
menu:
  influxdb_1_8:
    weight: 20
    parent: Guides
aliases:
  - /influxdb/v1.8/guides/querying_data/
---


The InfluxDB API is the primary means for querying data in InfluxDB (see the [command line interface](/influxdb/v1.8/tools/shell/) and [client libraries](/influxdb/v1.8/tools/api_client_libraries/) for alternative ways to query the database).

Query data with the InfluxDB API using [Flux](#query-data-with-flux) or [InfluxQL](#query-data-with-influxql).

> **Note**: The following examples use `curl`, a command line tool that transfers data using URLs. Learn the basics of `curl` with the [HTTP Scripting Guide](https://curl.haxx.se/docs/httpscripting.html).

## Query data with Flux

The `/api/v2/query` endpoint accepts `POST` HTTP requests. Use the following HTTP headers:
- `Accept: application/csv`
- `Content-type: application/vnd.flux`

if you have authentication enabled, need to provide username and password. in authorization header

The following example queries data with the 'SELECT' command:

```bash
$ curl -XPOST localhost:8086/api/v2/query -sS \
  -H 'Accept:application/csv' \
  -H 'Content-type:application/vnd.flux' \
  -d 'from(bucket:"telegraf")
        |> range(start:-5m)
        |> filter(fn:(r) => r._measurement == "cpu")'  'q=SELECT * FROM "mymeas"'
```
Flux returns annotated CSV:

```
{"results":[{"statement_id":0,"series":[{"name":"mymeas","columns":["time","myfield","mytag1","mytag2"],"values":[["2017-03-01T00:16:18Z",33.1,null,null],["2017-03-01T00:17:18Z",12.4,"12","14"]]}]}]}
```

The `mymeas` [measurement](/influxdb/v1.8/concepts/glossary/#measurement) has two points.
The first point has the [timestamp](/influxdb/v1.8/concepts/glossary/#timestamp) `2017-03-01T00:16:18Z`, a `myfield` value of `33.1`, and no tag values for the `mytag1` and `mytag2` [tag keys](/influxdb/v1.8/concepts/glossary/#tag-key).
The second point has the timestamp `2017-03-01T00:17:18Z`, a `myfield` value of `12.4`, a `mytag1` value of `12`, and a `mytag2` value of `14`.


## Query data with InfluxQL

To perform a query send a `GET` request to the `/query` endpoint, set the URL parameter `db` as the target database, and set the URL parameter `q` as your query.
You may also use a `POST` request by sending the same parameters either as URL parameters or as part of the body with `application/x-www-form-urlencoded`.
The example below uses the InfluxDB API to query the same database that you encountered in [Writing Data](/influxdb/v1.8/guides/writing_data/).

```bash
curl -G 'http://localhost:8086/query?pretty=true' --data-urlencode "db=mydb" --data-urlencode "q=SELECT \"value\" FROM \"cpu_load_short\" WHERE \"region\"='us-west'"
```

InfluxDB returns JSON:


```json
{
    "results": [
        {
            "statement_id": 0,
            "series": [
                {
                    "name": "cpu_load_short",
                    "columns": [
                        "time",
                        "value"
                    ],
                    "values": [
                        [
                            "2015-01-29T21:55:43.702900257Z",
                            2
                        ],
                        [
                            "2015-01-29T21:55:43.702900257Z",
                            0.55
                        ],
                        [
                            "2015-06-11T20:46:02Z",
                            0.64
                        ]
                    ]
                }
            ]
        }
    ]
}
```

> **Note:** Appending `pretty=true` to the URL enables pretty-printed JSON output.
While this is useful for debugging or when querying directly with tools like `curl`, it is not recommended for production use as it consumes unnecessary network bandwidth.
