---
title: Configuring Telegraf

menu:
  telegraf_010:
    name: Configuring Telegraf
    weight: 10
    parent: introduction
---

## Configuring Telegraf

### Create a configuration file with every input and output
```
telegraf -sample-config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf -sample-config -input-filter <pluginname>[:<pluginname>] -output-filter <outputname>[:<outputname>] > telegraf.conf
```

> **Note:** In most cases, you will need to edit the configuration file to match your needs.
