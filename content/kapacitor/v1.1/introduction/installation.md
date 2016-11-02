---
title: Installation

menu:
  kapacitor_1_1:
    weight: 10
    parent: introduction
---

This page provides directions for installing, starting, and configuring Kapacitor.

## Requirements

Installation of the InfluxDB package may require `root` or administrator privileges in order to complete successfully.

### Networking

Kapacitor listens on TCP port `9092` for all API and write
calls.

Kapacitor may also bind to randomized UDP ports
for handling of InfluxDB data via subscriptions.

## Installation

Kapacitor has two binaries:

* kapacitor -- a CLI program for calling the Kapacitor API.
* kapacitord -- the Kapacitor server daemon.

You can download the binaries directly from the
[downloads](https://influxdata.com/downloads/#kapacitor) page.

### Start the Kapacitor Service

For packaged installations, please see the respective sections below
for your operating system. For non-packaged installations (tarballs or
from source), you will need to start the Kapacitor application
manually by running:

```
./kapacitord -config <PATH TO CONFIGURATION>
```

#### OS X (via Homebrew)

To have `launchd` start Kapacitor at login:

```
ln -sfv /usr/local/opt/kapacitor/*.plist ~/Library/LaunchAgents
```

Then to load Kapacitor now:

```
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.kapacitor.plist
```

Or, if you don't want/need `lanchctl`, you can just run:

```
kapacitord -config /usr/local/etc/kapacitor.conf
```

#### Linux - SysV or Upstart Systems

To start the Kapacitor service, run:

```
sudo service kapacitor start
```

#### Linux - systemd Systems

To start the Kapacitor service, run:

```
sudo systemctl start kapacitor
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
