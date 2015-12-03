---
title: Installing Kapacitor
---

Kapacitor has two binaries:

* kapacitor -- a CLI program for calling the Kapacitor API.
* kapacitord -- the Kapacitor server daemon.

You can either download the binaries directly from the [downloads](/download/#download) page or `go get` them:

```sh
go get github.com/influxdb/kapacitor/cmd/kapacitor
go get github.com/influxdb/kapacitor/cmd/kapacitord
```


### Configuration

An example configuration file can be found [here](https://github.com/influxdb/kapacitor/blob/master/kapacitor.config.sample)

Kapacitor can also provide an example config for you using this command:

```sh
kapacitord config
```

