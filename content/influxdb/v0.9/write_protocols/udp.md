---
title: Service - UDP
---

InfluxDB accepts writes over UDP. By default, no ports are open to UDP. To configure InfluxDB to support writes over UDP you must adjust your config file.

## Config File

The target database and listening port for all UDP writes must be specified in the configuration file.

```
...

[[udp]]
  enabled = true
  bind-address = ":8089" # the bind address
  database = "foo" # Name of the database that will be written to
  batch-size = 1000 # will flush if this many points get buffered
  batch-timeout = "1s" # will flush at least this often even if the batch-size is not reached
  batch-pending = 5 # number of batches that may be pending in memory

...
```

Multiple configurations can be specified to support multiple listening ports or multiple target databases. For example:

```
...

[[udp]]
  enabled = true
  bind-address = ":8089"
  database = "foo"
  batch-size = 1000
  batch-timeout = "1s"
  batch-pending = 5

[[udp]]
  enabled = true
  bind-address = ":4444"
  database = "bar"
  batch-size = 1000
  batch-timeout = "1s"
  batch-pending = 5

...
```

## Writing Points

To write, just send newline separated [line protocol](/docs/v0.9/write_protocols/line.html) over UDP. For better performance send batches of points rather than multiple single points.

```bash
$ echo "cpu value=1"> /dev/udp/localhost/8089
```

## More Information

For more information about the UDP plugin, please see the UDP plugin [README](https://github.com/influxdb/influxdb/blob/master/services/udp/README.md).
