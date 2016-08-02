---
title: Upgrading from Previous Versions
menu:
  enterprise_1_0:
    weight: 0
    parent: Administration
---

The following sections include instructions for upgrading to InfluxEnterprise
Clustering version 0.7.3 and InfluxEnterprise Web Console version 0.7.1.

Before you start, please review the section at the
[bottom of this page](#configuration-settings) to ensure that you have the most
up-to-date configuration settings.

## Upgrading to Clustering version 0.7.3 and Web Console 0.7.1

### 1. Download and install the new versions of InfluxEnterprise

#### Meta nodes

##### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-meta_1.0.0-beta2-c0.7.3_amd64.deb
sudo dpkg -i influxdb-meta_1.0.0-beta2-c0.7.3_amd64.deb
```

> **Note:** If you're running Ubuntu 16.04.1, you may need to enter
`sudo systemctl disable influxdb-meta` before executing the `dpkg` step.

##### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-meta-1.0.0_beta2_c0.7.3.x86_64.rpm
sudo yum localinstall influxdb-meta-1.0.0_beta2_c0.7.3.x86_64.rpm
```

#### Data nodes

##### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-data_1.0.0-beta2-c0.7.3_amd64.deb
sudo dpkg -i influxdb-data_1.0.0-beta2-c0.7.3_amd64.deb
```
##### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influxdb-data-1.0.0_beta2_c0.7.3.x86_64.rpm
sudo yum localinstall influxdb-data-1.0.0_beta2_c0.7.3.x86_64.rpm
```
#### Web console

##### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influx-enterprise_0.7.1_amd64.deb
sudo dpkg -i influx-enterprise_0.7.1_amd64.deb
```
##### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influx-enterprise-0.7.1.x86_64.rpm
sudo yum localinstall influx-enterprise-0.7.1.x86_64.rpm
```

> **Notes:**
>
* The Web Console Version 0.7.1 features a new configuration file.
Please opt to overwrite the old configuration file with the new configuration
file.
* If you're running Ubuntu 16.04.1, you may need to enter
`sudo systemctl disable influxdb-enterprise` before executing the `dpkg` step.

### 2. Edit the Web Console's configuration file
The Web Console version 0.7.1 features a new configuration file.
In `/etc/influx-enterprise/influx-enterprise.conf`, set:

* the first `url` setting to your server’s IP address
* `license_key` to the license key you received on [InfluxPortal](https://portal.influxdata.com/)
* `shared-secret` in the `[influxdb]` section to the same pass phrase that you used in your data servers’ configuration files

In addition to updating those settings:

* uncomment the first `url` setting in the `[database]` section
* update the password in that first `url` setting to the password for the system's local postgres user
* comment out the second `url` setting in the `[database]` section

```

url = "http://<your_server's_IP_address>:3000" #✨

hostname = "localhost"
port = "3000"

license-key = "<your_license_key>" #✨
license-file = "/path/to/license"

[influxdb]
shared-secret = "long pass phrase used for signing tokens" #✨

[smtp]
host = "localhost"
port = "25"
username = ""
password = ""
from_email = "donotreply@example.com"

[database]
# Where is your database?
# NOTE: This version of Enterprise Web currently only supports Postgres >= 9.3 or SQLite3
url = "postgres://postgres:password@localhost:5432/enterprise" # ENV: DATABASE_URL ✨
# url = "sqlite3:///var/lib/influx-enterprise/enterprise.db" #✨
```

>**Note:** The Web Console version 0.7.1 no longer uses PostgreSQL as its
default database.
The steps above allow you to continue using PostgreSQL if you initially
installed the Web Console prior to version 0.7.1.
If you'd prefer to use SQLite, the new default database, see [Installation](/enterprise/v1.0/introduction/installation/#web-console-setup).

### 3. Restart all services
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

## Configuration settings

In older versions of InfluxEnterprise, configuration settings ensured that
the Web Console registered with the Cluster.
Those settings are no longer supported.
If you're working with InfluxEnterprise versions 0.7.2 and up, please be sure
to update your configuration settings as outlined below.
The updated settings ensure that the Cluster registers with the Web Console.

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
