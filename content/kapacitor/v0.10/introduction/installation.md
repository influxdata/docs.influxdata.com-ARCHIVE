---
title: Installation

menu:
  kapacitor_010:
    weight: 10
    parent: introduction
---

This page provides directions for installing, starting, and configuring Kapacitor.

## Requirements

Installation of the Kapacitor package may require `root` or administrator privileges in order to complete successfully.


### Networking

By default, Kapacitor uses the following network ports:

- TCP port `9292` is used for Kapacitor's HTTP API Server, it serves both as a write endpoint  and as the API endpoint for all other Kapacitor calls.

Kapacitor may also used the following port, if enabled
- TCP port `25826` is used for collectd input method
- TCP ports `4242` is  used for opentsdb input method

> Note: In addition to the ports above, 
Kapacitor also offers multiple plugins that may require custom ports.
All port mappings can be modified through the configuration file,
which is located at `/etc/kapacitor/kapacitor.conf` for default installations.


## Installation

Kapacitor has two binaries:

* kapacitor -- a CLI program for calling the Kapacitor API.
* kapacitord -- the Kapacitor server daemon.

You can either download the package, the binaries or directly `go get` them.

### Go get


```bash
go get github.com/influxdb/kapacitor/cmd/kapacitor
go get github.com/influxdb/kapacitor/cmd/kapacitord
```

### Ubuntu & Debian
Debian and Ubuntu users can install the latest nightly version of Kapacitor by downloading the 64-bit package:

```bash
wget https://s3-us-west-1.amazonaws.com/kapacitor-nightly/kapacitor_nightly_amd64.deb
echo "18b153c1c66185fb147517b0346eeb5f  kapacitor_nightly_amd64.deb" |md5sum -c -
sudo dpkg -i kapacitor_nightly_amd64.deb
```

### RedHat & CentOS
RedHat and CentOS users can install the latest stable version of Kapacitor by downloading the 64-bit package

```bash
wget https://s3-us-west-1.amazonaws.com/kapacitor-nightly/kapacitor-nightly.x86_64.rpm
echo "4087fa7d348fd8859753e19259139f79  kapacitor-nightly.x86_64.rpm" |md5sum -c -
sudo yum localinstall kapacitor-nightly.x86_64.rpm
```

### Standalone Binaries
64-bit linux users  can install the latest stable version of Kapacitor by downloading the 64-bit archive
```bash
wget https://s3-us-west-1.amazonaws.com/kapacitor-nightly/kapacitor-nightly_linux_amd64.tar.gz
echo "102231e3d7be9c9d13001a746effd93e  kapacitor-nightly_linux_amd64.tar.gz" |md5sum -c -
tar xvfz kapacitor-nightly_linux_amd64.tar.gz
```
### Mac OS X

Users of OS X 64 bits can install Kapacitor by downloading the 64-bit archive

```bash
wget https://s3-us-west-1.amazonaws.com/kapacitor-nightly/kapacitor-nightly_darwin_amd64.tar.gz
echo "59111a345c151045a7c3fbe8b890bb75  kapacitor-nightly_darwin_amd64.tar.gz" |md5sum -c -
tar xvf kapacitor-nightly_darwin_amd64.tar.gz
```


## Configuration
### Generating a Configuration File
For non-packaged installations, it is a best practice to generate a new configuration
for each upgrade to ensure you have the latest features and settings.
Any changes made in the old file will need to be manually ported to the newly generated file.
Packaged installations will come with a configuration pre-installed,
so this step may not be needed if you installed kapacitor using a
package manager (though it is handy to know either way).

> Note: Newly generated configuration files have no knowledge of any local customizations or settings.
Please make sure to double-check any configuration changes prior to deploying them.

To generate a new configuration file, run:

```bash
kapacitor config > kapacitor.generated.conf
```

### Example

An example configuration file can be found [here](https://github.com/influxdb/kapacitor/blob/master/etc/kapacitor/kapacitor.conf)

If no `-config` option is supplied, Kapacitor will use an internal default
configuration (equivalent to the output of `kapacitor config`).
