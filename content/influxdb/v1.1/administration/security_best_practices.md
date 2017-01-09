---
title: Security Best Practices
menu:
  influxdb_1_1:
    weight: 110
    parent: administration
---

## InfluxDB security best practices


These are best practices for exposing InfluxDB to the open internet.
We always recommend never opening InfluxDB to the open internet if possible.


Things to do on InfluxDB
- Use HTTPS (valid cert), might need a separate doc
- Turn on auth
- Create users with only read/write permissions

Things to do on Telegraf
- Set credentials in the config

Things to do on host (AWS specific)
- Close all ports except 8086 or use a proxy to 8086
- Encrypt the disk/volume

