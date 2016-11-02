---
title: Troubleshooting
menu:
  telegraf_1_0:
    name: Troubleshooting Telegraf
    weight: 10
    parent: administration
---


An easy way to view Telegraf's output is to enable a UDP output plugin to run in parallel with the existing output plugins. Since each plugin creates a new output stream, the existing outputs will not be affected. Traffic will be replicated to all of the active output plugins.

The minimal Telegraf configuration to enable a UDP output in Influx Line protocol is:

```
[[outputs.influxdb]]
  urls = ["udp://localhost:8089"] 
```

This setup utilizes the UDP format of the [InfluxDB output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/influxdb). You will need to append it to /etc/telegraf/telegraf.conf and restart Telegraf for the change to take effect.

Then, you can start listening on the configured port (8089 in this example) with a simple tool like netcat:

```
nc -lu 8089
```

This way you will see the exact Telegraf output printed on stdout.

