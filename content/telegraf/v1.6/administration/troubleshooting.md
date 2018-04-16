---
title: Troubleshooting Telegraf

menu:
  telegraf_1_6:
    name: Troubleshooting
    weight: 40
    parent: administration
---

This guide will show you how to capture Telegraf output, submit sample metrics, and see how Telegraf formats and emits points to its output plugins.

## Capture output

A quick way to view Telegraf output is by enabling a new UDP output plugin to run in parallel with the existing output plugins. Since each output plugin creates its own stream, the already existing outputs will not be affected. Traffic will be replicated to all active outputs.

> **NOTE:** This approach requires Telegraf to be restarted, which will cause a brief interruption to your metrics collection.

The minimal Telegraf configuration required to enable a UDP output is:

```
[[outputs.influxdb]]
  urls = ["udp://localhost:8089"]
```

This setup utilizes the UDP format of the [InfluxDB output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/influxdb) and emits points formatted in InfluxDB's [line protocol](/influxdb/v1.5/concepts/glossary/#line-protocol).
You will need to append this section to the Telegraf configuration file and restart Telegraf for the change to take effect.

Now you are ready to start listening on the destination port (`8089` in this example) using a simple tool like `netcat`:

```
nc -lu 8089
```

`nc` will print the exact Telegraf output on stdout.
You can also direct the output to a file for further inspection:

```
nc -lu 8089 > telegraf_dump.txt
```

## Submit test inputs

Once you have Telegraf's output arriving to your `nc` socket, you can enable the [inputs.socket_listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/socket_listener) plugins to submit some sample metrics.

Append the TCP or UDP input section to Telegraf's config file and restart Telegraf for the change to take effect.

```
 [[inputs.socket_listener]]
   service_address = "tcp://:8094"
   data_format = "influx"
```

Submit sample data to the Telegraf socket listener:

```
echo 'mymeasurement,my_tag_key=mytagvalue my_field="my field value"' | nc localhost 8094
```

The output from your `netcat` listener will look like the following:

```
mymeasurement,host=kubuntu,my_tag_key=mytagvalue my_field="my field value" 1478106104713745634
```

## Testing other plugins

The same approach can be used to test other plugins, like the [inputs.statsd](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/statsd) plugin.

Here is a basic configuration example of how to set up the Telegraf statsd input plugin:

```
 [[inputs.statsd]]
   service_address = ":8125"
   metric_separator = "_"
   allowed_pending_messages = 10000
```

Sending a sample metric to the Telegraf statsd port:

```
echo "a.b.c:1|g" | nc -u localhost 8125
```

The output from `nc` will look like the following:

```
a_b_c,host=myserver,metric_type=gauge value=1 1478106500000000000
```
