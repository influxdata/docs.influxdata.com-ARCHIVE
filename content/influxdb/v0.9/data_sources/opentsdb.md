---
title: OpenTSDB
---

InfluxDB supports the OpenTSDB ["telnet" protocol](http://opentsdb.net/docs/build/html/user_guide/writing.html#telnet). When OpenTSDB support is enabled, InfluxDB can act as a drop-in replacement for your OpenTSDB system.

An example input point, and how it is processed, is shown below.

```
put sys.cpu.user 1356998400 42.5 host=webserver01 cpu=0
```

When InfluxDB receives this data, a point is written to the database. The point's Measurement is `sys.cpu.user`, the timestamp is `1356998400`, and the value is `42.5`. The point is also tagged with `host=webserver01` and `cpu=0`. Tags allow fast and efficient queries to be performed on your data.

To learn more about enabling OpenTSDB support, check the example [configuration file](https://github.com/influxdb/influxdb/blob/master/etc/config.sample.toml).
