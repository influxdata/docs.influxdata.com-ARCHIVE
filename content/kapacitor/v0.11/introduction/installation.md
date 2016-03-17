---
title: Installing Kapacitor

menu:
  kapacitor_011:
    weight: 20
    parent: introduction
---

Kapacitor has two binaries:

* kapacitor -- a CLI program for calling the Kapacitor API.
* kapacitord -- the Kapacitor server daemon.

You can either download the binaries directly from the [downloads](https://influxdata.com/downloads/#kapacitor) page or `go get` them:

```bash
go get github.com/influxdb/kapacitor/cmd/kapacitor
go get github.com/influxdb/kapacitor/cmd/kapacitord
```

### Configuration

An example configuration file can be found [here](https://github.com/influxdb/kapacitor/blob/master/etc/kapacitor/kapacitor.conf)

Kapacitor can also provide an example config for you using this command:

```bash
kapacitord config
```

