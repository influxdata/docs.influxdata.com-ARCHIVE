---
title: Upgrading from Previous Versions
menu:
  enterprise_1_0:
    weight: 0
    parent: Administration
---

The following sections include instructions for upgrading InfluxEnterprise to
Clustering version 0.7.1 and Web Console version 0.7.0.

## Download and install the new versions of InfluxEnterprise

### Meta nodes

#### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-meta_1.0.0-beta2-c0.7.1_amd64.deb
sudo dpkg -i influxdb-meta_1.0.0-beta2-c0.7.1_amd64.deb
```
#### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-meta-1.0.0_beta2_c0.7.1.x86_64.rpm
sudo yum localinstall influxdb-meta-1.0.0_beta2_c0.7.1.x86_64.rpm
```

### Data nodes

#### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-data_1.0.0-beta2-c0.7.1_amd64.deb
sudo dpkg -i influxdb-data_1.0.0-beta2-c0.7.1_amd64.deb
```
#### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-data-1.0.0_beta2_c0.7.1.x86_64.rpm
sudo yum localinstall influxdb-data-1.0.0_beta2_c0.7.1.x86_64.rpm
```
### Web console

#### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influx-enterprise_0.7.0_amd64.deb
sudo dpkg -i influx-enterprise_0.7.0_amd64.deb
```
#### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influx-enterprise-0.7.0.x86_64.rpm
sudo yum localinstall influx-enterprise-0.7.0.x86_64.rpm
```

## Update the relevant configuration files

Upgrading to InfluxEnterprise Clustering 0.7.1 and Web Console 0.7.0 requires users to update their configuration settings. The new settings ensure that the cluster registers with the web console.

In each meta node’s configuration file (`/etc/influxdb/influxdb-meta.conf`), set:

* `registration-enabled` to `true`
* `registration-server-url` to the hostname of the InfluxEnterprise Web Console

```
reporting-disabled = false
bind-address = ""
hostname = "rk-enterprise-beta-meta-01"

[enterprise]
  registration-enabled = true #✨
  registration-server-url = "http://<web_console_hostname>:3000" #✨

[...]
```
Next, remove the entire `[[meta]]` section from the Web Console configuration file (`/etc/influx-enterprise/influx-enterprise.conf`):
```
url = "http://<your_server's_IP_address>:3000"

hostname = "localhost"
port = "3000"

[...]

❌[[meta]]❌
❌urls = ["<meta_server_IP_address_1>:8091","<meta_server_IP_address_2>:8091","<meta_server_IP_address_3>:8091"]❌

[...]
```

## Restart all services
Meta nodes:
```
$ service influxdb-meta restart
```
Data nodes:
```
$ service influxdb restart
```
Web console:
```
$ service influx-enterprise restart
```
