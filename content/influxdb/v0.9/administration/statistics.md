---
title: Server Monitoring
aliases:
  - /docs/v0.9/query_language/stats_diags.html
---

InfluxDB can display statistical and diagnostic information about each node. This information can be very useful for troubleshooting and performance monitoring.

## SHOW STATS
To see node stats execute the command `SHOW STATS`. An example is shown below.

```sql
SHOW STATS
```

```json
{
    "results": [
        {
            "series": [
                {
                    "name": "server",
                    "columns": [
                        "broadcastMessageRx",
                        "batchWriteRx",
                        "pointWriteRx",
                        "writeSeriesMessageTx"
                    ],
                    "values": [
                        [
                            37
                        ],
                        [
                            299984
                        ],
                        [
                            2789
                        ],
                        [
                            25
                        ]
                    ]
                }
            ]
        }
    ]
}
```

The statistics returned by `SHOW STATS` are stored in memory only, and are reset to zero when the node is restarted.

## SHOW DIAGNOSTICS
To see node diagnostics execute the command `SHOW DIAGNOSTICS`. This returns information such as build information, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics.

## Self Monitoring
InfluxDB also supports writing statistical and diagnostic information to an internal database named `_influxdb`, allowing server performance to be recorded over the long term. This data is written as standard time-series data, allowing the full power of `InfluxQL` to be used. Check the [example configuration file](https://github.com/influxdb/influxdb/blob/master/etc/config.sample.toml) for full details.
