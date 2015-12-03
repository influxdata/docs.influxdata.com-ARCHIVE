---
title: Installation
---

This page provides directions on downloading and starting InfluxDB Version 0.9.4.2.

## Requirements
Installation of the pre-built InfluxDB package requires root privileges on the host machine.

### Networking
By default InfluxDB will use TCP ports `8083` and `8086` so these ports should be available on your system. Once installation is complete you can change those ports and other options in the configuration file, which is located by default in `/etc/opt/influxdb`.

## Ubuntu & Debian
Debian users can install 0.9.4.2 by downloading the package and installing it like this:

```shell
# 64-bit system install instructions
wget http://influxdb.s3.amazonaws.com/influxdb_0.9.4.2_amd64.deb
sudo dpkg -i influxdb_0.9.4.2_amd64.deb
```

Then start the daemon by running:

```shell
sudo service influxdb start
```

## RedHat & CentOS
RedHat and CentOS users can install by downloading and installing the rpm like this:

```shell
# 64-bit system install instructions
wget http://influxdb.s3.amazonaws.com/influxdb-0.9.4.2-1.x86_64.rpm
sudo yum localinstall influxdb-0.9.4.2-1.x86_64.rpm
```

Then start the daemon by running:

```shell
sudo service influxdb start
```

## SLES & openSUSE
There are RPM packages provided by openSUSE Build Service for SUSE Linux users.

```shell
# add go repository
zypper ar -f obs://devel:languages:go/ go
# install latest influxdb
zypper in influxdb
```

## OS X

Users of OS X 10.8 and higher can install using the [Homebrew](http://brew.sh/) package manager.

```shell
brew update
brew install influxdb
```

To have launchd start influxdb at login:
```shell
ln -sfv /usr/local/opt/influxdb/*.plist ~/Library/LaunchAgents
```

Then to load influxdb now:
```shell
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.influxdb.plist
```

Or, if you don't want/need launchctl, in a separate terminal window you can just run:
```shell
influxd -config /usr/local/etc/influxdb.conf
```

<a href="getting_started.html"><font size="6"><b>⇒ Now get started!</b></font></a>


## Hosted

For users who don't want to install any software and are ready to use InfluxDB, you may want to check out our [managed hosted InfluxDB offering](http://customers.influxdb.com).

## Generate a configuration file

Configuration files from prior versions of InfluxDB 0.9 should work with future releases, but the old files may lack configuration options for new features. It is a best practice to generate a new config file for each upgrade. Any changes made in the old file will need to be manually ported to the newly generated file. The newly generated configuration file has no knowledge of any local customization to the settings.

To generate a new config file, run `influxd config` and redirect the output to a file. For example:

```shell
/opt/influxdb/influxd config > /etc/influxdb/influxdb.generated.conf
```

Edit the `influxdb.generated.conf` file to have the desired configuration settings. When launching InfluxDB, point the process to the correct configuration file using the `-config` option.

```shell
/opt/influxdb/influxd -config /etc/influxdb/influxdb.generated.conf
```

In addition, a valid configuration file can be displayed at any time using the command `influxd config`. Redirect the output to a file to save a clean generated configuration file.

If no `-config` option is supplied, InfluxDB will use an internal default configuration equivalent to the output of `influxd config`

> Note: The `influxd` command has two similarly named flags. The `config` flag prints a generated default configuration file to STDOUT but does not launch the `influxd` process. The `-config` flag takes a single argument, which is the path to the InfluxDB configuration file to use when launching the process.

The `config` and `-config` flags can be combined to output the union of the internal default configuration and the configuration file passed to `-config`. The options specificed in the configuration file will overwrite any internally generated configration.

```shell
/opt/influxdb/influxd config -config /etc/influxdb/influxdb.partial.conf
```

The output will show every option configured in the `influxdb.partial.conf` file and will substitute internal defaults for any configuration options not specified in that file.

The example configuration file shipped with the installer is for information only. It is an identical file to the internally generated configuration except that the example file has comments.

## Hosting on AWS

### Hardware

We recommend using two SSD volumes. One for the `influxdb/wal` and one for the `influxdb/data`. Depending on your load each volume should have around 1k-3k provisioned IOPS. The `influxdb/data` volume should have more disk space with lower IOPS and the `influxdb/wal` volume should have less disk space with higher IOPS.

Each machine should have a minimum of 8G RAM.

We’ve seen the best performance with the C3 class of machines.

## Configuring the Instance

This example assumes that you are using two SSD volumes and that you have mounted them appropriately. This example also assumes that each of those volumes is mounted at `/mnt/influx` and `/mnt/db`. For more infomation on how to do that see the Amazon documentation on how to [Add a Volume to Your Instance](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-add-volume-to-instance.html).

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

```shell
chown influxdb:influxdb /mnt/influx
chown influxdb:influxdb /mnt/db
```

### Other Considerations

If you're planning on using a cluster, you may also want to set `hostname` and `join` flags for the `INFLUXD_OPTS` variable in `/etc/default/influxdb`. For example:

```
INFLUXD_OPTS='-hostname host[:port] [-join hostname_1:port_1[,hostname_2:port_2]]'
```

For more detailed instructions on how to set up a cluster, see the documenation on [clustering](/docs/v0.9/guides/clustering.html)

## Development Versions

Nightly packages are available and can be found on the [downloads page](/download/index.html)
