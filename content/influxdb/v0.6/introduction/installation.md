---
title: Installation
---

## Ports
By default InfluxDB will use ports `8083`, `8086`, `8090`, and `8099`. Once you install you can change those ports and other options in the configuration file, which is located at either `/opt/influxdb/shared/config.toml` or `/usr/local/etc/influxdb.conf`

## Ubuntu & Debian
Debian users can install by downloading the package and installing it like this:

```bash
# for 64-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb_0.6.5_amd64.deb
sudo dpkg -i influxdb_latest_amd64.deb

# for 32-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb_0.6.5_i386.deb
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
wget https://s3.amazonaws.com/influxdb/influxdb-0.6.5-1.x86_64.rpm
sudo yum localinstall influxdb-latest-1.x86_64.rpm

# for 32-bit systems
wget https://s3.amazonaws.com/influxdb/influxdb-0.6.5-1.i686.rpm
sudo yum localinstall influxdb-latest-1.i686.rpm
```

Then start the daemon by running:

```
sudo /etc/init.d/influxdb start
```

<a href="getting_started.html"><font size="6"><b>Now get started!</b></font></a>