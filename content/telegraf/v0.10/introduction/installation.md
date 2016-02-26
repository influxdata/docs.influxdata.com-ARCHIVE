---
title: Installation

menu:
  telegraf_010:
    name: Installation
    weight: 0
    parent: introduction
---

This page provides directions for installing, starting, and configuring 

## Requirements

Installation of the Telegraf package may require `root` or administrator privileges in order to complete successfully.

### Networking

Telegraf offers multiple plugins that may require custom ports.  
All port mappings can be identified through the [coinfiguration file](/telegraf/v0.10/administration/config).

## Installation
### Ubuntu & Debian
Debian and Ubuntu users can install the latest stable version of Telegraf by downloading the 64-bit package:

```bash
wget http://get.influxdb.org/telegraf/telegraf_0.10.4.1-1_amd64.deb
echo "46da6a3f35e15de9c68091fdb87b0282  telegraf_0.10.4.1-1_amd64.deb" |md5sum -c -
sudo dpkg -i telegraf_0.10.4.1-1_amd64.deb
```

### RedHat & CentOS
RedHat and CentOS users can install the latest stable version of Telegraf by downloading the 64-bit package

```bash
wget http://get.influxdb.org/telegraf/telegraf-0.10.4.1-1.x86_64.rpm
echo "7aef4869f03ed916544acee872c6d141  telegraf-0.10.4.1-1.x86_64.rpm" |md5sum -c -
sudo yum localinstall telegraf-0.10.4.1-1.x86_64.rpm
```

### Standalone Binaries
64-bit linux users  can install the latest stable version of Telegraf by downloading the 64-bit archive
```bash
wget http://get.influxdb.org/telegraf/telegraf-0.10.4.1-1_linux_amd64.tar.gz
echo "73a94ee0a41adf99e0c0697384e40f12  telegraf-0.10.4.1-1_linux_amd64.tar.gz" |md5sum -c -
tar xvfz telegraf_linux_amd64_0.10.4.1-1_linux_amd64.tar.gz
```

32-bit linux users can install the latest stable version of Telegraf by downloading the 32-bit archive
```bash
wget http://get.influxdb.org/telegraf/telegraf-0.10.4.1-1_linux_i386.tar.gz
echo "e5342a433eadda218740679ce28985d6  telegraf-0.10.4.1-1_linux_i386.tar.gz" |md5sum -c -
tar xvfz telegraf-0.10.4.1-1_linux_i386.tar.gz
```
ARM linux users can install the latest stable version of Telegraf by downloading the 32-bit archive
```bash
wget http://get.influxdb.org/telegraf/telegraf-0.10.4.1-1_linux_arm.tar.gz
echo "d4af371dfcefe53607455cc2289a332c  telegraf-0.10.4.1-1_linux_arm.tar.gz" |md5sum -c -
tar xvfz telegraf-0.10.4.1-1_linux_arm.tar.gz
```

### Mac OS X

Users of OS X 10.8 and higher can install Telegraf using the [Homebrew](http://brew.sh/) package manager.
Once `brew` is installed, you can install InfluxDB by running:

```bash
brew update
brew install telegraf
```


## Configuration
### Configuration File Location

* OS X [Homebrew](http://brew.sh/): `/usr/local/etc/telegraf.conf`
* Linux debian and RPM packages: `/etc/telegraf/telegraf.conf`
* Standalone Binary: see the next section for how to create a configuration file

### Generating a Configuration File
For non-packaged installations, it is a best practice to generate a new configuration
for each upgrade to ensure you have the latest features and settings.
Any changes made in the old file will need to be manually ported to the newly generated file.
Packaged installations will come with a configuration pre-installed,
so this step may not be needed if you installed telegraf using a
package manager (though it is handy to know either way).

> Note: Newly generated configuration files have no knowledge of any local customizations or settings.
Please make sure to double-check any configuration changes prior to deploying them.

To generate a new configuration file, run:

```bash
telegraf config > telegraf.generated.conf
```

Here, we'll generate a configuration file and simultaneously specify the desired
inputs with the `-input-filter` flag and the desired output with the `-output-filter`
flag.

#### Example
In the example below, we create a configuration file called `telegraf.conf` with
 two inputs:
one that reads metrics about the system's cpu usage (`cpu`) and one that reads
metrics about the system's memory usage (`mem`). `telegraf.conf` specifies InfluxDB as the desired output.

```bash
telegraf -sample-config -input-filter cpu:mem -output-filter influxdb > telegraf.conf
```

If no `-config` option is supplied, Telegraf will use an internal default
configuration (equivalent to the output of `telegraph config`).

### Editing the Configuration File
Before starting the Telegraf server you need to edit the configuration to specifies
your desired [inputs](/telegraf/v0.10/inputs/) (where the metrics come from)
and [outputs](/telegraf/v0.10/outputs/) (where the metrics go).
There are [several ways](/telegraf/v0.10/introduction/configuration/) to generate and edit the configuration file.


## Start the Telegraf Server
Start the Telegraf server and direct it to the relevant configuration file:
### OS X [Homebrew](http://brew.sh/)
```bash
telegraf -config telegraf.conf
```

### Linux debian and RPM packages
```bash
sudo service telegraf start
```

### Ubuntu 15+
```bash
systemctl start telegraf
```

## Results
Once Telegraf is up and running it'll start collecting data and writing them to the desired output.
From our [sample configuration](/telegraf/v0.10/introduction/configuration/#example) above, we send the `cpu` and `mem` data to InfluxDB.

> **Note:** Telegraf 0.10.x is not backwards compatible with previous versions of Telegraf.
See the [release blog post](https://influxdata.com/blog/announcing-telegraf-0-10-0/) for more on the differences between Telegraf 0.2.x and 0.10.x.


That's it! You now have the foundation for using Telegraf to collect metrics and write them to your output of choice.  
