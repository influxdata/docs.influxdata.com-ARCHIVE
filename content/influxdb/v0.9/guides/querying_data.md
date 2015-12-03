---
title: Querying Data
alias:
  -/docs/v0.9/query_language/querying_data.html
---

## Querying data using the HTTP API
The HTTP API is the primary means for querying data in InfluxDB. To perform a query send a `GET` request to the `/query` endpoint, set the URL parameter `db` as the target database, and set the URL parameter `q` as your query. The example below uses the HTTP API to query the same database that you encountered in [Writing Data](../guides/writing_data.html).  
<br>
```sh
curl -G 'http://localhost:8086/query?pretty=true' --data-urlencode "db=mydb" --data-urlencode "q=SELECT value FROM cpu_load_short WHERE region='us-west'"
```

InfluxDB returns JSON. The results of your query appear in the `"results"` array. If an error occurs, InfluxDB sets an `"error"` key with an explanation of the error.  
<br>

```json
{
    "results": [
        {
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
                            0.55
                        ],
                        [
                            "2015-01-29T21:55:43.702900257Z",
                            23422
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

> **Note:** Appending `pretty=true` to the URL enables pretty-printed JSON output. While this is useful for debugging or when querying directly with tools like `curl`, it is not recommended for production use as it consumes unnecessary network bandwidth.

### Multiple queries
---
Send multiple queries to InfluxDB in a single API call. Simply delimit each query using a semicolon, for example:  
<br>
```sh
curl -G 'http://localhost:8086/query?pretty=true' --data-urlencode "db=mydb" --data-urlencode "q=SELECT value FROM cpu_load_short WHERE region='us-west';SELECT count(value) FROM cpu_load_short WHERE region='us-west'"
```

returns:  
<br>
```json
{
    "results": [
        {
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
                            0.55
                        ],
                        [
                            "2015-01-29T21:55:43.702900257Z",
                            23422
                        ],
                        [
                            "2015-06-11T20:46:02Z",
                            0.64
                        ]
                    ]
                }
            ]
        },
        {
            "series": [
                {
                    "name": "cpu_load_short",
                    "columns": [
                        "time",
                        "count"
                    ],
                    "values": [
                        [
                            "1970-01-01T00:00:00Z",
                            3
                        ]
                    ]
                }
            ]
        }
    ]
}
```

### Other options when querying data
---
#### Timestamp Format
Everything in InfluxDB is stored and reported in UTC. By default, timestamps are returned in RFC3339 UTC and have nanosecond precision, for example `2015-08-04T19:05:14.318570484Z`. If you want timestamps in Unix epoch format include in your request the query string parameter `epoch` where `epoch=[h,m,s,ms,u,ns]`. For example, get epoch in seconds with:  
<br>
```sh
curl -G 'http://localhost:8086/query' --data-urlencode "db=mydb" --data-urlencode "epoch=s" --data-urlencode "q=SELECT value FROM cpu_load_short WHERE region='us-west'"
```

#### Authentication
Authentication in InfluxDB is disabled by default. See [Authentication and Authorization](../administration/authentication_and_authorization.html) for how to enable and set up authentication.

#### Chunk size
For large queries, results are returned in batches of 10,000 points unless you use the query string parameter `chunk_size` to explicitly set the batch size. For example, get your results in batches of 20,000 points with:  
<br>
```sh
curl -G 'http://localhost:8086/query' --data-urlencode "db=deluge" --data-urlencode "chunk_size=20000" --data-urlencode "q=SELECT * FROM liters"
```

### InfluxQL
---
Now that you know how to query data, check out the [Data Exploration page](../query_language/data_exploration.html) to get acquainted with InfluxQL.
