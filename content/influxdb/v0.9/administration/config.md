---
title: Database Configuration
---

## Generating a Configuration file

To generate an InfluxDB configuration file run the command

```
influxd config  > influx.conf
```

## Authentication

To add authentication to InfluxDB set `auth-enabled = true` in the `[http]` section of your config file.

```
[http]
...
auth-enabled = true
...
```

## Anonymous Statistics

By default, InfluxDB sends anonymous statistics about your InfluxDB instance. If you would like to disable this functionality, set `enabled = false` in the `[monitoring]` section of your config file.

```
[monitoring]
enabled = false
```

## A Note about `dir` in `[meta]` and `[data]`

In both the `[meta]` and `[data]` the `dir` configuration setting must be on the same filesystem.
