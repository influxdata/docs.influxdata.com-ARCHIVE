---
title: Installation
---

## Ports
By default InfluxDB will use ports `8083`, `8086`, `8090`, and `8099`. Once you install you can change those ports and other options in the configuration file, which is located at either `/opt/influxdb/shared/config.toml` or `/usr/local/etc/influxdb.conf`

## Reporting

As of version 0.7.1, InfluxDB will report anonymous data once every 24 hours to m.influxdb.com. This includes the raft id (randomly generated 8 bytes), the InfluxDB version, the OS, and the architecture (amd64, ARM, etc). We don't log or track the IP Addresses that the reports are made from. This information is very helpful for our project. It lets us know how many servers are running out there in the world and, more importantly, which versions.

This is enabled by default. You can opt-out of this by editing the config file and setting `reporting-disabled = true`. However, we'd be very grateful if you keep it enabled.

## File Limits

InfluxDB can potentially have many open files. You will need to up the open file limits on your box. Pretend like we made it past 1999 and computers can actually handle more than 256 open files, and set the open file limit to `unlimited`. Basho has a nice [writeup on setting the open file limits](http://docs.basho.com/riak/latest/ops/tuning/open-files-limit/).

Replace the `riak` user with `influxdb` and you should be good to go.

## InfluxDB 0.8.9 Installion

> **Note:** The only addition in InfluxDB version 0.8.9 is an export tool to facilitate migrations to InfluxDB version 0.9. Migration instructions can be found on the [InfluxDB 0.9 Importer README page](https://github.com/influxdb/influxdb/blob/master/importer/README.md).

## Ubuntu & Debian
Debian users can install version 0.8.9 by downloading the package and installing it like this:

```bash
# for 64-bit systems
wget http://get.influxdb.org.s3.amazonaws.com/influxdb_0.8.9_amd64.deb
sudo dpkg -i influxdb_0.8.9_amd64.deb
```

Then start the daemon by running:

```
sudo /etc/init.d/influxdb start
```

## RedHat & CentOS
RedHat and CentOS users can install version 0.8.9 by downloading and installing the rpm like this:

```bash
# for 64-bit systems
wget http://get.influxdb.org.s3.amazonaws.com/influxdb-0.8.9-1.x86_64.rpm
sudo yum localinstall influxdb-0.8.9-1.x86_64.rpm
```

Then start the daemon by running:

```
sudo /etc/init.d/influxdb start
```

## InfluxDB 0.8.8 Installion

## OS X

Installation of version 0.8.8 on OS X 10.8 and higher is available through [Homebrew](http://brew.sh/) [Tap](https://github.com/Homebrew/homebrew/blob/master/share/doc/homebrew/brew-tap.md). 

Installing the package on OS X:

```bash
brew install homebrew/versions/influxdb08
```

## Ubuntu & Debian
Debian users can install 0.8.9 by downloading the package and installing it like this:

```bash
# for 64-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb_0.8.8_amd64.deb
sudo dpkg -i influxdb_0.8.8_amd64.deb

# for 32-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb_0.8.8_i686.deb
sudo dpkg -i influxdb_0.8.8_i686.deb
```

Then start the daemon by running:

```
sudo /etc/init.d/influxdb start
```

## RedHat & CentOS
RedHat and CentOS users can install by downloading and installing the rpm like this:

```bash
# for 64-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb-0.8.8-1.x86_64.rpm
sudo yum localinstall influxdb-0.8.8-1.x86_64.rpm

# for 32-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb-0.8.8-1.i686.rpm
sudo yum localinstall influxdb-0.8.8-1.i686.rpm
```

Then start the daemon by running:

```
sudo /etc/init.d/influxdb start
```

<a href="getting_started.html"><font size="6"><b>Now get started!</b></font></a>
