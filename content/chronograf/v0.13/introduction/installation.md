---
title: Installation
menu:
  chronograf_013:
    weight: 10
    parent: Introduction
---

This page provides directions for installing, starting, and configuring Chronograf.

## Requirements

Installation of the Chronograf package may require `root` or administrator privileges in order to complete successfully.

### Networking

By default, Chronograf runs on `localhost` port `10000`. The port and
interface can be modified through the
[configuration file](/chronograf/v0.13/administration/configuration).


## Installation

Follow the instructions in the Chronograf Downloads section on the [Downloads page](https://influxdata.com/downloads).

### Start the Chronograf service

#### Mac OS X (via Homebrew)

To run Chronograf manually, you can specify the configuration file on the
command line:
```
chronograf -config=/usr/local/etc/chronograf.toml
```

To have launchd start homebrew/binary/chronograf at login:
```
ln -sfv /usr/local/opt/chronograf/*.plist ~/Library/LaunchAgents
```
Then to load homebrew/binary/chronograf now:
```
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.chronograf.plist
```

#### Linux DEB or RPM package:
```
sudo service chronograf start
```

#### Standalone OS X binary
Assuming you’re working with Chronograf version 0.13, from the
`chronograf-0.13/`` directory:
```
./chronograf-0.13-darwin_amd64
```

## Configuration

See the
[configuration documentation](/chronograf/v0.13/administration/configuration/)
for more information.
