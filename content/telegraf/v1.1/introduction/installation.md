---
title: Installation
menu:
  telegraf_1_1:
    weight: 10
    parent: introduction
---

This page provides directions for installing, starting, and configuring Telegraf.

## Requirements

Installation of the Telegraf package may require `root` or administrator privileges in order to complete successfully.

### Networking

Telegraf offers multiple [service plugins](/telegraf/v1.1/services) that may
require custom ports.
All port mappings can be modified through the configuration file
which is located at `/etc/telegraf/telegraf.conf` for default installations.

## Installation

{{< vertical-tabs >}}
{{% tabs %}}
  [Ubuntu & Debian](#)
  [RedHat & CentOS](#)
  [SLES & openSUSE](#)
  [FreeBSD/PC-BSD](#)
  [MAC OS X](#)
  [Windows](#)
{{% /tabs %}}
{{< tab-content-container >}}
{{% tab-content %}}
  For instructions on how to install the Debian package from a file, please see the [downloads page](https://influxdata.com/downloads/).

  Debian and Ubuntu users can install the latest stable version of Telegraf using the `apt-get` package manager.

  For Ubuntu users, add the InfluxData repository with the following commands:

  ```bash
  curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
  source /etc/lsb-release
  echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
  ```

  For Debian users, add the InfluxData repository with the following commands:

  ```bash
  curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
  source /etc/os-release
  test $VERSION_ID = "7" && echo "deb https://repos.influxdata.com/debian wheezy stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
  test $VERSION_ID = "8" && echo "deb https://repos.influxdata.com/debian jessie stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
  ```

  Then, install and start the Telegraf service:

  ```bash
  sudo apt-get update && sudo apt-get install telegraf
  sudo service telegraf start
  ```

  Or if your operating system is using systemd (Ubuntu 15.04+, Debian 8+):
  ```
  sudo apt-get update && sudo apt-get install telegraf
  sudo systemctl start telegraf
  ```
{{% /tab-content %}}
{{% tab-content %}}
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
  install and start the Telegraf service by running:

  ```bash
  sudo yum install telegraf
  sudo service telegraf start
  ```

  Or if your operating system is using systemd (CentOS 7+, RHEL 7+):
  ```
  sudo yum install telegraf
  sudo systemctl start telegraf
  ```
{{% /tab-content %}}
{{% tab-content %}}
  There are RPM packages provided by openSUSE Build Service for SUSE Linux users:

  ```bash
  # add go repository
  zypper ar -f obs://devel:languages:go/ go
  # install latest telegraf
  zypper in telegraf
  ```
{{% /tab-content %}}
{{% tab-content %}}
  Telegraf is part of the FreeBSD package system.
  It can be installed by running:

  ```bash
  sudo pkg install telegraf
  ```

  The configuration file is located at `/usr/local/etc/telegraf.conf` with examples in `/usr/local/etc/telegraf.conf.sample`.
{{% /tab-content %}}
{{% tab-content %}}
  Users of OS X 10.8 and higher can install Telegraf using the [Homebrew](http://brew.sh/) package manager.
  Once `brew` is installed, you can install Telegraf by running:

  ```bash
  brew update
  brew install telegraf
  ```

  To have launchd start telegraf at next login:
  ```
  ln -sfv /usr/local/opt/telegraf/*.plist ~/Library/LaunchAgents
  ```
  To load telegraf now:
  ```
  launchctl load ~/Library/LaunchAgents/homebrew.mxcl.telegraf.plist
  ```

  Or, if you don't want/need launchctl, you can just run:
  ```
  telegraf -config /usr/local/etc/telegraf.conf
  ```
{{% /tab-content %}}
{{% tab-content %}}
  Install Telegraf as a [Windows service](https://github.com/influxdata/telegraf/blob/master/docs/WINDOWS_SERVICE.md) (Windows support is still experimental):
  ```
  telegraf.exe -service install -config <path_to_config>
  ```
{{% /tab-content %}}
{{< /tab-content-container >}}
{{< /vertical-tabs >}}

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
[configuration documentation](/telegraf/v1.1/administration/configuration/).
