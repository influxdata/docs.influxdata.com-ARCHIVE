---
title: Installation

menu:
  kapacitor_013:
    weight: 10
    parent: introduction
---

This page provides directions for installing, starting, and configuring Kapacitor.

## Requirements

TODO: More here

### Networking

TODO: More here

## Installation

Kapacitor has two binaries:

* kapacitor -- a CLI program for calling the Kapacitor API.
* kapacitord -- the Kapacitor server daemon.

You can either download the binaries directly from the [downloads](https://influxdata.com/downloads/#kapacitor) page or `go get` them:

```bash
go get github.com/influxdb/kapacitor/cmd/kapacitor
go get github.com/influxdb/kapacitor/cmd/kapacitord
```

### Start the Kapacitor service:

TODO: Confirm

#### OS X (via Homebrew)
To have launchd start kapacitor at login:
```
ln -sfv /usr/local/opt/kapacitor/*.plist ~/Library/LaunchAgents
```
Then to load kapacitor now:
```
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.kapacitor.plist
```

Or, if you don't want/need lanchctl, you can just run:
```
kapacitord -config /usr/local/etc/kapacitor.conf
```

#### Ubuntu, Debian, RedHat, & CentOS
```
sudo service kapacitor start
```

## Configuration

An example configuration file can be found [here](https://github.com/influxdb/kapacitor/blob/master/etc/kapacitor/kapacitor.conf)

Kapacitor can also provide an example config for you using this command:

```bash
kapacitord config
```

To generate a new configuration file, run:
```
kapacitord config > kapacitor.generated.conf
```
