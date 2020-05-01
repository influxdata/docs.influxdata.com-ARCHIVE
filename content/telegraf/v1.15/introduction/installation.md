---
title: Installing Telegraf

menu:
  telegraf_1_15:
    name: Installing
    weight: 20
    parent: Introduction
---

This page provides directions for installing, starting, and configuring Telegraf.

## Requirements

Installation of the Telegraf package may require `root` or administrator privileges in order to complete successfully.

### Networking

Telegraf offers multiple service [input plugins](/telegraf/v1.14/plugins/inputs/) that may
require custom ports.
All port mappings can be modified through the configuration file (`telegraf.conf`).

For Linux distributions, this file is located at `/etc/telegraf` for default installations.

For Windows distributions, the configuration file is located in the directory where you unzipped the Telegraf ZIP archive.
The default location is `C:\InfluxData\telegraf`.

### NTP

Telegraf uses a host's local time in UTC to assign timestamps to data.
Use the Network Time Protocol (NTP) to synchronize time between hosts; if hosts' clocks
aren't synchronized with NTP, the timestamps on the data can be inaccurate.

## Installation

{{< tab-labels >}}
{{% tabs %}}
  [Ubuntu & Debian](#)
  [RedHat & CentOS](#)
  [SLES & openSUSE](#)
  [FreeBSD/PC-BSD](#)
  [macOS](#)
  [Windows](#)
{{% /tabs %}}
{{< tab-content-container >}}
<!---------- BEGIN Ubuntu & Debian ---------->
{{% tab-content %}}
For instructions on how to manually install the Debian package from a file, please see the [downloads page](https://influxdata.com/downloads/).

Debian and Ubuntu users can install the latest stable version of Telegraf using the `apt-get` package manager.

**Ubuntu:** Add the InfluxData repository with the following commands:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[wget](#)
[curl](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}  

**Debian:** Add the InfluxData repository with the following commands:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[wget](#)
[curl](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
# Before adding Influx repository, run this so that apt will be able to read the repository.

sudo apt-get update && sudo apt-get install apt-transport-https

# Add the InfluxData key

wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/os-release
test $VERSION_ID = "7" && echo "deb https://repos.influxdata.com/debian wheezy stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "8" && echo "deb https://repos.influxdata.com/debian jessie stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "9" && echo "deb https://repos.influxdata.com/debian stretch stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "10" && echo "deb https://repos.influxdata.com/debian buster stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
# Before adding Influx repository, run this so that apt will be able to read the repository.

sudo apt-get update && sudo apt-get install apt-transport-https

# Add the InfluxData key

curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/os-release
test $VERSION_ID = "7" && echo "deb https://repos.influxdata.com/debian wheezy stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "8" && echo "deb https://repos.influxdata.com/debian jessie stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "9" && echo "deb https://repos.influxdata.com/debian stretch stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

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

{{% telegraf-verify %}}

## Configuration

### Create a configuration file with default input and output plugins.

Every plugin will be in the file, but most will be commented out.

```
telegraf config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.14/administration/configuration/).
{{% /tab-content %}}
<!---------- BEGIN RedHat & CentOS ---------->
{{% tab-content %}}
  For instructions on how to manually install the RPM package from a file, please see the [downloads page](https://influxdata.com/downloads/).

  **RedHat and CentOS:** Install the latest stable version of Telegraf using the `yum` package manager:

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
  
{{% telegraf-verify %}}

## Configuration

### Create a configuration file with default input and output plugins.

Every plugin will be in the file, but most will be commented out.

```
telegraf config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.14/administration/configuration/).
{{% /tab-content %}}
<!---------- BEGIN SLES & openSUSE ---------->
{{% tab-content %}}
  There are RPM packages provided by openSUSE Build Service for SUSE Linux users:

  ```bash
  # add go repository
  zypper ar -f obs://devel:languages:go/ go
  # install latest telegraf
  zypper in telegraf
  ```
  
{{% telegraf-verify %}}

## Configuration

### Create a configuration file with default input and output plugins.

Every plugin will be in the file, but most will be commented out.

```
telegraf config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.14/administration/configuration/).
{{% /tab-content %}}
<!---------- BEGIN FreeBSD/PC-BSD ---------->
{{% tab-content %}}
  Telegraf is part of the FreeBSD package system.
  It can be installed by running:

  ```bash
  sudo pkg install telegraf
  ```

  The configuration file is located at `/usr/local/etc/telegraf.conf` with examples in `/usr/local/etc/telegraf.conf.sample`.
  
{{% telegraf-verify %}}

## Configuration

### Create a configuration file with default input and output plugins.

Every plugin will be in the file, but most will be commented out.

```
telegraf config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.14/administration/configuration/).
{{% /tab-content %}}
<!---------- BEGIN macOS ---------->
{{% tab-content %}}
  Users of macOS 10.8 and higher can install Telegraf using the [Homebrew](http://brew.sh/) package manager.
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

## Configuration

### Create a configuration file with default input and output plugins.

Every plugin will be in the file, but most will be commented out.

```
telegraf config > telegraf.conf
```

### Create a configuration file with specific inputs and outputs
```
telegraf --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.14/administration/configuration/). 
{{% /tab-content %}}
<!---------- BEGIN Windows ---------->
{{% tab-content %}}
  Install Telegraf as a [Windows service](https://github.com/influxdata/telegraf/blob/master/docs/WINDOWS_SERVICE.md) (Windows support is experimental):
  ```
  telegraf.exe -service install -config <path_to_config>
  ```

## Installation
If you are performing a first time installation and followed the PowerShell commands provided on the 
[InfluxData download page](https://portal.influxdata.com/downloads), you have expanded the archive file into
`C:\InfluxData\telegraf` (or another directory of your chosing).

The Telegraf ZIP archive file for Windows contains a default configuration file with an input plugin for capturing basic
Windows System metrics enabled.  Specifically, the 
[inputs.win_perf_counters](/telegraf/v1.14/plugins/plugin-list/#win_perf_counters) is enabled and it captures metrics 
from the following defined Windows Operating System objects:

- Processor
- LogicalDisk 
- PhysicalDisk
- Network Interface
- System
- Memory
- Paging File

### Configure an Output Plugin
Both the [InfluxDB v1](/telegraf/v1.14/plugins/plugin-list/#influxdb) and 
[InfluxDB v2](/telegraf/v1.14/plugins/plugin-list/#influxdb_v2) Output plugins are contained within the default
`telegraf.conf` file. The InfluxDB v1 plugin is configured and the InfluxDB v2 plugin is commented out using the `#` symbol.  

Before you start the Telegraf agent, you'll need to complete the configuration one of these plugins to send data to InfluxDB.
Choose the appropriate plugin to configure based on the version of InfluxDB you'll be using.  

If you are not using InfluxDB v1, you need to comment it out by placing a `#` in front of the `[[outputs.influxdb]]` within
the file. You can use a simple text editor like Notepad to edit these files.

## Upgrade
If you have already previously installed and configured Telegraf, you will want to preserve your existing `telegraf.conf` 
file. 

### Make a copy of the `telegraf.conf` file
**Before downloading and extracting the latest Telegraf ZIP archive file for Windows**, use the following PowerShell command to make a copy of your existing `telegraf.conf` file.
```
copy telegraf.conf my_telegraf.conf
```
### Download the latest Telegraf ZIP archive file 
Go to the [InfluxData download page](https://portal.influxdata.com/downloads) and use the `wget` command provided there to
download the latest Telegraf ZIP archive file.

### Expand the Telegraf ZIP archive file
Use the following command in PowerShell to expand the Telegraf ZIP archive file replacing `<XXX>` with the specific version details for the version you've downloaded.
```
Expand-Archive .\telegraf-<XXX>_windows_amd64.zip -DestinationPath 'C:\InfluxData' -Force
```

The -Force option will overwrite the existing files with the latest version.

### Swap the `telegraf.conf` files
Within the `C:\InfluxData\telegraf` directory, the new telegraf executable (`telegraf.exe`) and a new telegraf configuration
file (`telegraf.conf` should appear alongside your original telegraf configuration (`my_telegraf.conf`).

You can now move these files around and restart the telegraf agent with your original configuration file.  The following
PowerShell commands outline what to do.
```
move telegraf.conf telegraf.new_conf
move my_telegraf.conf telegraf.conf
```

You can now restart your Telegraf agent.

## Configuration

While the Telegraf ZIP archive file for Windows contains a recommended configuration file for capturing system metrics for 
Windows hosts, Telegraf can be used to capture metrics and log information from a wide variety of sources.  

You can easily create a configuration file which contains ALL of the default values for ALL of the plugins that this 
version of Telegraf supports.

### Create a configuration file with default plugins configurations.

Every plugin (input, output, processor, and aggregator) will be in the file, but most will be commented out.

```
.\telegraf.exe config > telegraf_latest.conf
```

### Create a configuration file with specific inputs and outputs

You can also be more selective about which plugins you wish to have in the generated configuration file
```
telegraf.exe --input-filter <pluginname>[:<pluginname>] --output-filter <outputname>[:<outputname>] config > telegraf_select.conf
```

For more advanced configuration details, see the
[configuration documentation](/telegraf/v1.14/administration/configuration/).  
{{% /tab-content %}}
{{< /tab-content-container >}}
{{< /tab-labels >}}




