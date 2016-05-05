---
title: Installation
menu:
  chronograf_013:
    weight: 10
    parent: Introduction
---

This page provides directions for installing, starting, and configuring Chronograf.

## Requirements

TODO: More here

### Networking

By default, Chronograf runs on `localhost` port `10000`.

## Installation

TODO: More here

### Start the Chronograf service

#### OS X (via Homebrew)
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

#### Debian or RPM package:
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
