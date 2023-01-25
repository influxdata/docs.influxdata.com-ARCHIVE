---
title: Installation
menu:
  influxdb_013:
    weight: 10
    parent: introduction
---

This page provides directions for installing, starting, and configuring InfluxDB.

## Requirements

Installation of the InfluxDB package may require `root` or administrator privileges in order to complete successfully.

### Networking

By default, InfluxDB uses the following network ports:

- TCP port `8083` is used for InfluxDB's [Admin panel](/influxdb/v0.13/tools/web_admin/)
- TCP port `8086` is used for client-server communication over InfluxDB's HTTP API

In addition to the ports above, InfluxDB also offers multiple plugins that may
require custom ports.
All port mappings can be modified through the [configuration file](/influxdb/v0.13/administration/config),
which is located at `/etc/influxdb/influxdb.conf` for default installations.

## Installation

For users who don't want to install any software and are ready to use InfluxDB,
you may want to check out our
[managed hosted InfluxDB offering](https://cloud.influxdata.com).

### Ubuntu & Debian

For instructions on how to install the Debian package from a file,
please see the
[downloads page](https://influxdata.com/downloads/). Debian and Ubuntu
users can install the latest stable version of InfluxDB using the
`apt-get` package manager.

For Ubuntu users, you can add the InfluxData repository by using the following commands:

```bash
curl -sL https://repos.influxdata.com/influxdata-archive_compat.key | sudo apt-key add -
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```

For Debian users, you can add the InfluxData repository by using the following commands:

```bash
curl -sL https://repos.influxdata.com/influxdata-archive_compat.key | sudo apt-key add -
source /etc/os-release
test $VERSION_ID = "7" && echo "deb https://repos.influxdata.com/debian wheezy stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
test $VERSION_ID = "8" && echo "deb https://repos.influxdata.com/debian jessie stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```

And then to install and start the InfluxDB service:

```bash
sudo apt-get update && sudo apt-get install influxdb
sudo service influxdb start
```

Or if your operating system is using systemd (Ubuntu 15.04+, Debian 8+):

```bash
sudo apt-get update && sudo apt-get install influxdb
sudo systemctl start influxdb
```

### RedHat & CentOS

For instructions on how to install the RPM package from a file, please see the [downloads page](https://influxdata.com/downloads/).

RedHat and CentOS users can install the latest stable version of InfluxDB using the `yum` package manager:

```bash
cat <<EOF | sudo tee /etc/yum.repos.d/influxdb.repo
[influxdb]
name = InfluxDB Repository - RHEL \$releasever
baseurl = https://repos.influxdata.com/rhel/\$releasever/\$basearch/stable
enabled = 1
gpgcheck = 1
gpgkey = https://repos.influxdata.com/influxdata-archive_compat.key
EOF
```

Once repository is added to the `yum` configuration,
you can install and start the InfluxDB service by running:

```bash
sudo yum install influxdb
sudo service influxdb start
```

Or if your operating system is using systemd (CentOS 7+, RHEL 7+):

```bash
sudo yum install influxdb
sudo systemctl start influxdb
```

### SLES & openSUSE
There are RPM packages provided by openSUSE Build Service for SUSE Linux users:

```bash
# add go repository
zypper ar -f obs://devel:languages:go/ go
# install latest influxdb
zypper in influxdb
```

### FreeBSD/PC-BSD

InfluxDB is part of the FreeBSD package system.
It can be installed by running:

```bash
sudo pkg install influxdb
```

The configuration file is located at `/usr/local/etc/influxd.conf` with examples in `/usr/local/etc/influxd.conf.sample`.

Start the backend by executing:

```bash
sudo service influxd onestart
```

To have InfluxDB start at system boot, add `influxd_enable="YES"` to `/etc/rc.conf`.

### macOS

Users of macOS 10.8 and higher can install InfluxDB using the [Homebrew](http://brew.sh/) package manager.
Once `brew` is installed, you can install InfluxDB by running:

```bash
brew update
brew install influxdb
```

To have `launchd` start InfluxDB at login, run:

```bash
ln -sfv /usr/local/opt/influxdb/*.plist ~/Library/LaunchAgents
```

And then to start InfluxDB now, run:

```bash
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.influxdb.plist
```

Or, if you don't want/need launchctl, in a separate terminal window you can just run:

```bash
influxd -config /usr/local/etc/influxdb.conf
```

## Configuration

For non-packaged installations, it is a best practice to generate a new configuration
for each upgrade to ensure you have the latest features and settings.
Any changes made in the old file will need to be manually ported to the newly generated file.
Packaged installations will come with a configuration pre-installed,
so this step may not be needed if you installed InfluxDB using a
package manager (though it is handy to know either way).

> Note: Newly generated configuration files have no knowledge of any local customizations or settings.
Please make sure to double-check any configuration changes prior to deploying them.

To generate a new configuration file run the following command and edit the
`influxdb.generated.conf` file to have the desired configuration settings:

```bash
influxd config > influxdb.generated.conf
```

There are two ways to launch InfluxDB with your configuration file:

* Point the process to the correct configuration file by using the `-config`
option:

    ```bash
    influxd -config influxdb.generated.conf
    ```
* Set the environment variable `INFLUXDB_CONFIG_PATH` to the path of your
configuration file and start the process.
For example:

    ```
    echo $INFLUXDB_CONFIG_PATH
    /root/influxdb.generated.conf

    influxd
    ```

InfluxDB first checks for the `-config` option and then for the environment
variable.
If you do not supply a configuration file, InfluxDB uses an internal default
configuration (equivalent to the output of `influxd config`).

> Note: The `influxd` command has two similarly named flags.
The `config` flag prints a generated default configuration file to STDOUT but does not launch the `influxd` process.
The `-config` flag takes a single argument, which is the path to the InfluxDB configuration file to use when launching the process.

The `config` and `-config` flags can be combined to output the union of the internal default configuration and the configuration file passed to `-config`.
The options specified in the configuration file will overwrite any internally generated configuration.

```bash
influxd config -config /etc/influxdb/influxdb.partial.conf
```

The output will show every option configured in the `influxdb.partial.conf` file and will substitute internal defaults for any configuration options not specified in that file.

The example configuration file shipped with the installer is for information only.
It is an identical file to the internally generated configuration except that the example file has comments.

## Hosting on AWS

### Hardware

We recommend using two SSD volumes.
One for the `influxdb/wal` and one for the `influxdb/data`.
Depending on your load each volume should have around 1k-3k provisioned IOPS.
The `influxdb/data` volume should have more disk space with lower IOPS and the `influxdb/wal` volume should have less disk space with higher IOPS.

Each machine should have a minimum of 8G RAM.

We’ve seen the best performance with the C3 class of machines.

### Configuring the Instance

This example assumes that you are using two SSD volumes and that you have mounted them appropriately.
This example also assumes that each of those volumes is mounted at `/mnt/influx` and `/mnt/db`.
For more information on how to do that see the Amazon documentation on how to [Add a Volume to Your Instance](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-add-volume-to-instance.html).

### Config File
You'll have to update the config file appropriately for each InfluxDB instance you have.

```
...

[meta]
  dir = "/mnt/db/meta"
  ...

...

[data]
  dir = "/mnt/db/data"
  ...
wal-dir = "/mnt/influx/wal"
  ...

...

[hinted-handoff]
    ...
dir = "/mnt/db/hh"
    ...
```

### Permissions

When using non-standard directories for InfluxDB data and configurations, also be sure to set filesystem permissions correctly:

```bash
chown influxdb:influxdb /mnt/influx
chown influxdb:influxdb /mnt/db
```

## Nightly and Development Versions

Nightly packages are available for Linux through the InfluxData package repository by using the `nightly` channel.
Other package options can be found on the [downloads page](https://influxdata.com/downloads/)
