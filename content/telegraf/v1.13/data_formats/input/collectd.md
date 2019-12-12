---
title: Collectd input data format
description: Use the collectd input data format to parse the collectd network binary protocol to create tags for host, instance, type, and type instance.
menu:
  telegraf_1_13:
    name: collectd
    weight: 10
    parent: Input data formats
---

The collectd input data format parses the collectd network binary protocol to create tags for host, instance, type, and type instance.  All collectd values are added as float64 fields.

For more information, see [binary protocol](https://collectd.org/wiki/index.php/Binary_protocol) in the collectd Wiki.

You can control the cryptographic settings with parser options.  
Create an authentication file and set `collectd_auth_file` to the path of the file, then set the desired security level in `collectd_security_level`.

For more information, including client setup, see
[Cryptographic setup](https://collectd.org/wiki/index.php/Networking_introduction#Cryptographic_setup) in the collectd Wiki.

You can also change the path to the typesdb or add additional typesdb using
`collectd_typesdb`.

## Configuration

```toml
[[inputs.file]]
  files = ["example"]

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ##   https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "collectd"

  ## Authentication file for cryptographic security levels
  collectd_auth_file = "/etc/collectd/auth_file"
  ## One of none (default), sign, or encrypt
  collectd_security_level = "encrypt"
  ## Path of to TypesDB specifications
  collectd_typesdb = ["/usr/share/collectd/types.db"]

  ## Multi-value plugins can be handled two ways.
  ## "split" will parse and store the multi-value plugin data into separate measurements
  ## "join" will parse and store the multi-value plugin as a single multi-value measurement.
  ## "split" is the default behavior for backward compatability with previous versions of influxdb.
  collectd_parse_multivalue = "split"
```
