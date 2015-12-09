---
title: Configuring Telegraf

menu:
  telegraf_02:
    name: Configuring Telegraf
    identifier: configuring telegraf
    weight: 0
---

## Configuring Telegraf

### Create a configuration file with every plugin and output
```
telegraf -sample-config > telegraf.conf
```

### Create a configuration file with specific plugins and outputs
```
telegraf -sample-config -filter <pluginname>[:<pluginname>] -outputfilter <outputname>[:<outputname>] > telegraf.conf
```

> **Note:** In most cases, you will need to edit the configuration file to match your needs. 

