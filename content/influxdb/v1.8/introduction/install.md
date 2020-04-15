---
title: Install InfluxDB OSS
menu:
  influxdb_1_8:
    name: Install InfluxDB
    weight: 20
    parent: Introduction
aliases:
  - /influxdb/v1.8/introduction/installation/
---

This page provides directions for installing, starting, and configuring InfluxDB open source (OSS).

## InfluxDB OSS installation requirements

Installation of the InfluxDB package may require `root` or administrator privileges in order to complete successfully.

### InfluxDB OSS networking ports

By default, InfluxDB uses the following network ports:

- TCP port `8086` is available for client-server communication using the InfluxDB API.
- TCP port `8088` is available for the RPC service to perform back up and restore operations.

In addition to the ports above, InfluxDB also offers multiple plugins that may
require [custom ports](/influxdb/v1.8/administration/ports/).
All port mappings can be modified through the [configuration file](/influxdb/v1.8/administration/config),
which is located at `/etc/influxdb/influxdb.conf` for default installations.

### Network Time Protocol (NTP)

InfluxDB uses a host's local time in UTC to assign timestamps to data and for
coordination purposes.
Use the Network Time Protocol (NTP) to synchronize time between hosts; if hosts'
clocks aren't synchronized with NTP, the timestamps on the data written to InfluxDB
can be inaccurate.

## Installing InfluxDB OSS

For users who don't want to install any software and are ready to use InfluxDB,
you may want to check out our
[managed hosted InfluxDB offering](https://cloud.influxdata.com).

{{< tab-labels >}}
{{% tabs %}}
[Ubuntu & Debian](#)
[Red Hat & CentOS](#)
[SLES & openSUSE](#)
[FreeBSD/PC-BSD](#)
[macOS](#)
{{% /tabs %}}
{{< tab-content-container >}}

{{% tab-content %}}
For instructions on how to install the Debian package from a file,
please see the
[downloads page](https://influxdata.com/downloads/).

Debian and Ubuntu users can install the latest stable version of InfluxDB using the
`apt-get` package manager.

For Ubuntu users, add the InfluxData repository with the following commands:

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

For Debian users, add the InfluxData repository:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[wget](#)
[curl](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/os-release
echo "deb https://repos.influxdata.com/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/os-release
echo "deb https://repos.influxdata.com/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}


Then, install and start the InfluxDB service:

```bash
sudo apt-get update && sudo apt-get install influxdb
sudo service influxdb start
```

Or if your operating system is using systemd (Ubuntu 15.04+, Debian 8+):

```bash
sudo apt-get update && sudo apt-get install influxdb
sudo systemctl unmask influxdb.service
sudo systemctl start influxdb
```

{{% /tab-content %}}

{{% tab-content %}}

For instructions on how to install the RPM package from a file, please see the [downloads page](https://influxdata.com/downloads/).

Red Hat and CentOS users can install the latest stable version of InfluxDB using the `yum` package manager:

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

Once repository is added to the `yum` configuration, install and start the InfluxDB service by running:

```bash
sudo yum install influxdb
sudo service influxdb start
```

Or if your operating system is using systemd (CentOS 7+, RHEL 7+):

```bash
sudo yum install influxdb
sudo systemctl start influxdb
```

{{% /tab-content %}}

{{% tab-content %}}

There are RPM packages provided by openSUSE Build Service for SUSE Linux users:

```bash
# add go repository
zypper ar -f obs://devel:languages:go/ go
# install latest influxdb
zypper in influxdb
```

{{% /tab-content %}}

{{% tab-content %}}

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

{{% /tab-content %}}

{{% tab-content %}}

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

{{% /tab-content %}}

{{< /tab-content-container >}}
{{< /tab-labels >}}

### Verify the authenticity of downloaded binary (optional)

For added security, follow these steps to verify the signature of your InfluxDB download with `gpg`.

(Most operating systems include the `gpg` command by default.
If `gpg` is not available, see the [GnuPG homepage](https://gnupg.org/download/) for installation instructions.)

1. Download and import InfluxData's public key:

    ```
    curl -sL https://repos.influxdata.com/influxdb.key | gpg --import
    ```

2. Download the signature file for the release by adding `.asc` to the download URL.
   For example:

    ```
    wget https://dl.influxdata.com/influxdb/releases/influxdb-1.8.0_linux_amd64.tar.gz.asc
    ```

3. Verify the signature with `gpg --verify`:

    ```
    gpg --verify influxdb-1.8.0_linux_amd64.tar.gz.asc influxdb-1.8.0_linux_amd64.tar.gz
    ```

    The output from this command should include the following:

    ```
    gpg: Good signature from "InfluxDB Packaging Service <support@influxdb.com>" [unknown]
    ```


## Configuring InfluxDB OSS

The system has internal defaults for every configuration file setting.
View the default configuration settings with the `influxd config` command.

> **Note:** If InfluxDB is being deployed on a publicly accessible endpoint, we strongly recommend authentication be enabled.
Otherwise the data will be publicly available to any unauthenticated user. The default settings do **NOT** enable 
authentication and authorization. Further, authentication and authorization should not be solely relied upon to prevent access
and protect data from malicious actors. If additional security or compliance features are desired, InfluxDB should be run 
behind a third-party service. Review the [authentication and authorization](/administration/authentication_and_authorization/) 
settings.

Most of the settings in the local configuration file
(`/etc/influxdb/influxdb.conf`) are commented out; all
commented-out settings will be determined by the internal defaults.
Any uncommented settings in the local configuration file override the
internal defaults.
Note that the local configuration file does not need to include every
configuration setting.

There are two ways to launch InfluxDB with your configuration file:

* Point the process to the correct configuration file by using the `-config`
option:

    ```bash
    influxd -config /etc/influxdb/influxdb.conf
    ```
* Set the environment variable `INFLUXDB_CONFIG_PATH` to the path of your
configuration file and start the process.
For example:

    ```
    echo $INFLUXDB_CONFIG_PATH
    /etc/influxdb/influxdb.conf

    influxd
    ```

InfluxDB first checks for the `-config` option and then for the environment
variable.

See the [Configuration](/influxdb/v1.8/administration/config/) documentation for more information.

### Data and WAL directory permissions

Make sure the directories in which data and the [write ahead log](/influxdb/v1.8/concepts/glossary#wal-write-ahead-log) (WAL) are stored are writable for the user running the `influxd` service.

> **Note:** If the data and WAL directories are not writable, the `influxd` service will not start.

Information about `data` and `wal` directory paths is available in the [Data settings](/influxdb/v1.8/administration/config/#data-settings) section of the [Configuring InfluxDB](/influxdb/v1.8/administration/config/) documentation.

## Hosting InfluxDB OSS on AWS

### Hardware requirements for InfluxDB

We recommend using two SSD volumes, using one for the `influxdb/wal` and the other for the `influxdb/data`.
Depending on your load, each volume should have around 1k-3k provisioned IOPS.
The `influxdb/data` volume should have more disk space with lower IOPS and the `influxdb/wal` volume should have less disk space with higher IOPS.

Each machine should have a minimum of 8GB RAM.

We’ve seen the best performance with the R4 class of machines, as they provide more memory than either of the C3/C4 class and the M4 class.

### Configuring InfluxDB OSS instances

This example assumes that you are using two SSD volumes and that you have mounted them appropriately.
This example also assumes that each of those volumes is mounted at `/mnt/influx` and `/mnt/db`.
For more information on how to do that see the Amazon documentation on how to [Add a Volume to Your Instance](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-attaching-volume.html).

### Configuration file
You'll have to update the configuration file appropriately for each InfluxDB instance you have.

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

### Authentication and Authorization
For all AWS deployments, we strongly recommend authentication be enabled. Without this, it is possible that your InfluxDB
instance may be publicly available to any unauthenticated user. The default settings do **NOT** enable 
authentication and authorization. Further, authentication and authorization should not be solely relied upon to prevent access
and protect data from malicious actors. If additional security or compliance features are desired, InfluxDB should be run 
behind additional services offered by AWS. 
Review the [authentication and authorization](/influxdb/v1.8/administration/authentication_and_authorization/) settings.

### InfluxDB OSS permissions

When using non-standard directories for InfluxDB data and configurations, also be sure to set filesystem permissions correctly:

```bash
chown influxdb:influxdb /mnt/influx
chown influxdb:influxdb /mnt/db
```

For InfluxDB 1.7.6 or later, you must give owner permissions to the `init.sh` file. To do this, run the following script in your `influxdb` directory:

```sh
if [ ! -f "$STDOUT" ]; then
    mkdir -p $(dirname $STDOUT)
    chown $USER:$GROUP $(dirname $STDOUT)
 fi

 if [ ! -f "$STDERR" ]; then
    mkdir -p $(dirname $STDERR)
    chown $USER:$GROUP $(dirname $STDERR)
 fi

 # Override init script variables with DEFAULT values
 ```
