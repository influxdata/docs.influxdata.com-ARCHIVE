---
title: Installation
---

## Ports

By default InfluxDB will use ports `8083`, `8086`, `8090`, and `8099`. Once you install you can change those ports and other options in the configuration file, which is located at either `/opt/influxdb/shared/config.toml` or `/usr/local/etc/influxdb.conf`

## Reporting

As of version 0.7.1, InfluxDB will report anonymous data once every 24 hours to m.influxdb.com. This includes the raft id (randomly generated 8 bytes), the InfluxDB version, the OS, and the architecture (amd64, ARM, etc). We don't log or track the IP Addresses that the reports are made from. This information is very helpful for our project. It lets us know how many servers are running out there in the world and, more importantly, which versions.

This is enabled by default. You can opt-out of this by editing the config file and setting `reporting-disabled = true`. However, we'd be very grateful if you keep it enabled.

## Ubuntu & Debian
Debian users can install by downloading the package and installing it like this:

```bash
# for 64-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb_0.7.3_amd64.deb
sudo dpkg -i influxdb_latest_amd64.deb

# for 32-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb_0.7.3_armel.deb
sudo dpkg -i influxdb_latest_i386.deb
```

Then start the daemon by running:

```
sudo /etc/init.d/influxdb start
```

## RedHat & CentOS
RedHat and CentOS users can install by downloading and installing the rpm like this:

```bash
# for 64-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb-0.7.3-1.x86_64.rpm
sudo yum localinstall influxdb-latest-1.x86_64.rpm

# for 32-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb-0.7.3-1.i686.rpm
sudo yum localinstall influxdb-latest-1.i686.rpm
```

Then start the daemon by running:

```
sudo /etc/init.d/influxdb start
```

<a href="getting_started.html"><font size="6"><b>Now get started!</b></font></a>
