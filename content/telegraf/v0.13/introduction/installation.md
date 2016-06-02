---
title: Installation
menu:
  telegraf_013:
    weight: 10
    parent: introduction
---

This page provides directions for installing, starting, and configuring Telegraf.

## Requirements

Installation of the Telegraf package may require `root` or administrator privileges in order to complete successfully.

### Networking

Telegraf offers multiple [service plugins](/telegraf/v0.13/services) that may
require custom ports.
All port mappings can be modified through the configuration file 
which is located at `/etc/telegraf/telegraf.conf` for default installations.

## Installation

### Ubuntu & Debian

For instructions on how to install the Debian package from a file, please see the [downloads page](https://influxdata.com/downloads/).

Debian and Ubuntu users can install the latest stable version of Telegraf using the `apt-get` package manager.
For Ubuntu users, you can add the InfluxData repository by using the following commands:

```bash
curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```

For Debian users, you can add the InfluxData repository by using the following commands:

```bash
curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/os-release
test $VERSION_ID = "7" && echo "deb https://repos.influxdata.com/debian wheezy stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "8" && echo "deb https://repos.influxdata.com/debian jessie stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```

And then to install Telegraf:

```bash
sudo apt-get update && sudo apt-get install telegraf
```

### RedHat & CentOS

For instructions on how to install the RPM package from a file, please see the [downloads page](https://influxdata.com/downloads/).

RedHat and CentOS users can install the latest stable version of Telegraf using the `yum` package manager:

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/influxdb.repo
[influxdb]
name = InfluxDB Repository - RHEL \$releasever
baseurl = https://repos.influxdata.com/rhel/\$releasever/\$basearch/stable
enabled = 1
gpgcheck = 1
gpgkey = https://repos.influxdata.com/influxdb.key
EOF
```

Once repository is added to the `yum` configuration,
you can install telegraf

```bash
sudo yum install telegraf
```

### SLES & openSUSE
There are RPM packages provided by openSUSE Build Service for SUSE Linux users:

```bash
# add go repository
zypper ar -f obs://devel:languages:go/ go
# install latest telegraf
zypper in telegraf
```

### FreeBSD/PC-BSD

Telegraf is part of the FreeBSD package system.
It can be installed by running:

```bash
sudo pkg install telegraf
```

The configuration file is located at `/usr/local/etc/telegraf.conf` with examples in `/usr/local/etc/telegraf.conf.sample`.

### Mac OS X

Users of OS X 10.8 and higher can install Telegraf using the [Homebrew](http://brew.sh/) package manager.
Once `brew` is installed, you can install Telegraf by running:

```bash
brew update
brew install telegraf
```

### Start the Telegraf service

#### OS X (via Homebrew)
To have launchd start telegraf at login:
```
ln -sfv /usr/local/opt/telegraf/*.plist ~/Library/LaunchAgents
```
Then to load telegraf now:
```
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.telegraf.plist
```

Or, if you don't want/need launchctl, you can just run:
```
telegraf -config /usr/local/etc/telegraf.conf
```

#### sysv systems
```
sudo service telegraf start
```

#### systemd systems (such at Ubuntu 15+)
```
systemctl start Telegraf
```

## Configuration

### Create a configuration file with default input and output plugins.

Every plugin will be in the file, but most will be commented.

```
telegraf -sample-config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf -sample-config -input-filter <pluginname>[:<pluginname>] -output-filter <outputname>[:<outputname>] > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v0.13/administration/configuration/).
