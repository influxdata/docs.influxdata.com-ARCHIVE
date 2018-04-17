---
title: Configuring Telegraf
newversionredirect: administration/configuration/
menu:
  telegraf_012:
    name: Configuring Telegraf
    weight: 10
    parent: introduction
---

## Configuring Telegraf

### Create a configuration file with default input and output plugins.

> Every plugin will be in the file, but most will be commented.

```
telegraf -sample-config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf -sample-config -input-filter <pluginname>[:<pluginname>] -output-filter <outputname>[:<outputname>] > telegraf.conf
```

For more advanced configuration details, see the [Telegraf configuration doc](https://github.com/influxdata/telegraf/blob/master/docs/CONFIGURATION.md)

> **Note:** In most cases, you will need to edit the configuration file to match your needs.

### Running Telegraf on Windows

For information about how to run Telegraf as a Windows service, see the [Telegraf Windows Service doc](https://github.com/influxdata/telegraf/blob/master/docs/WINDOWS_SERVICE.md)
