---
title: Installation
menu:
  chronograf_1_0:
    weight: 10
    parent: Introduction
---

This page provides directions for installing, starting, and configuring Chronograf.

## Requirements

Installation of the Chronograf package may require `root` or administrator privileges in order to complete successfully.

### Networking

By default, Chronograf runs on `localhost` port `10000`. The port and
interface can be modified through the
[configuration file](/chronograf/v1.0/administration/configuration).


## Installation

Follow the instructions in the Chronograf Downloads section on the [Downloads page](https://influxdata.com/downloads).

### Start the Chronograf service

#### Mac OS X (via Homebrew)

To run Chronograf manually, you can specify the configuration file on the
command line:
```
chronograf -sample-config > chronograf.toml
chronograf -config=chronograf.toml
```

#### Linux DEB or RPM package:
```
sudo service chronograf start
```

## Configuration

See the
[configuration documentation](/chronograf/v1.0/administration/configuration/)
for more information.
