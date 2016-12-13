---
title: Step 2 - Web Console Installation
menu:
  enterprise_1_1:
    weight: 20
    parent: quickstart_installation
    identifier: web_quickstart
---

The next steps will get you up and running with the InfluxEnterprise's
management UI for working with clusters.
Please visit
[Cluster Installation](/enterprise/v1.1/quickstart_installation/cluster_installation/)
if you have yet to set up your InfluxEnterprise Cluster.

# Web Console Setup

Please set up the web console **after** you've set up your cluster.
Installing the web console before your cluster can cause unexpected behaviors.

## Install the InfluxEnterprise Web Console

Install the InfluxEnterprise web console on one of your cluster's servers or on
a separate server.

#### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influx-enterprise_1.1.1_amd64.deb
sudo dpkg -i influx-enterprise_1.1.1_amd64.deb
```
#### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influx-enterprise-1.1.1.x86_64.rpm
sudo yum localinstall influx-enterprise-1.1.1.x86_64.rpm
```
> **Notes:**
>
* For other distributions, visit
[InfluxPortal](https://portal.influxdata.com/licenses) and click `View License`.
* By default, the InfluxEnterprise Web Console uses SQLite for
installations.
If you'd prefer to use PostgreSQL, please see
[Install the InfluxEnterprise Web Console with PostgreSQL](#install-the-influxenterprise-web-console-with-postgresql).
Note that using PostgreSQL requires additional steps.

## Setup Steps

### 1. Edit the Configuration File

In `/etc/influx-enterprise/influx-enterprise.conf`, set:

* the `url` setting at the top of the file to the node's full URL, including protocol (`http://`) and port (`:3000`)
* `license-key` to the license key you received on InfluxPortal, OR
* `license-file` to the local path to the JSON license file you received from InfluxData

> **Note:** `license-key` and `license-file` are mutually exclusive and one must remain set to the empty string.

* `shared-secret` in the `[influxdb]` section to the same pass phrase that you used in your data node configuration files

```
url = "http://<your_server's_IP_address>:3000" #✨

hostname = "localhost"
port = "3000"

license-key = "<your_license_key>" #✨ mutually exclusive with license-file
license-file = "/path/to/readable/JSON.license.file" #✨ mutually exclusive with license-key

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
# url = "postgres://postgres:password@localhost:5432/enterprise" # ENV: DATABASE_URL
url = "sqlite3:///var/lib/influx-enterprise/enterprise.db"
```

> **Note:** The web console requires a functioning SMTP server to email invites
to new web console users.
If you're working on Ubuntu 14.04 and are looking for an SMTP server to use for
development purposes, see the
[SMTP Server Setup](/enterprise/v1.1/guides/smtp-server/) guide for how to get up
and running with [MailCatcher](https://mailcatcher.me/).

### 2. Migrate the Configuration File
Run the following command:
```
sudo -u influx-enterprise influx-enterprise migrate --config /etc/influx-enterprise/influx-enterprise.conf
```

The expected output is:
```
2016/07/29 15:43:24 Loading config at /etc/influx-enterprise/influx-enterprise.conf
[POP] Create /var/lib/influx-enterprise/enterprise.db (/var/lib/influx-enterprise/enterprise.db?cache=shared&mode=rwc)
> 0001_create_users.up.sql
> 0002_create_products.up.sql
> 0003_create_authentications.up.sql
> 0004_create_clusters_view.up.sql
> 0005_add_password.up.sql
> 0006_add_invite_nonce.up.sql
> 0007_drop_token_from_products.up.sql
> 0008_rename_product_id_to_node_id.up.sql
> 0009_create_explorers.up.sql
> 0010_add_name_to_explorers.up.sql
> 0011_add_name_to_products.up.sql     

0.0340 seconds
```

### 3. Start the InfluxEnterprise Web Console

On sysvinit systems, enter:
```
service influx-enterprise start
```

On systemd systems, enter:
```
sudo systemctl start influx-enterprise
```

> **Verification steps:**
>
Check to see that the process is running by entering:
>
    ps aux | grep -v grep | grep influx-enterprise
>
You should see output similar to:
>
    influx-+  4557  1.2  7.4 421600 37108 ?        Ssl  17:34   0:00 /usr/bin/influx-enterprise run -c /etc/influx-enterprise/influx-enterprise.conf


### 4. Access the Web Console
You're all set!
Visit `http://<your_web_console_server's_IP_address>:3000` to access your
InfluxEnterprise web console, and check out the
[Getting Started](/enterprise/v1.1/introduction/getting_started/) document.

> ## Install the InfluxEnterprise Web Console with PostgreSQL
>
By default, the InfluxEnterprise Web Console uses SQLite for installations.
The following steps document how to install the Web Console if you'd prefer to
use PostgreSQL.
>
### Install PostgreSQL
>
    sudo apt-get update
    sudo apt-get -y install postgresql postgresql-contrib
>
### Set the password for the system's local postgres user
>
#### Login to PostgreSQL:
>
    sudo -u postgres psql
>
The expected output is:
>
    -> psql (9.3.12)
    -> Type "help" for help.
>
#### Set the password, replacing `<your_password>` with your password:
>
    ALTER USER postgres PASSWORD '<your_password>';
>
The expected output is:
>
    -> ALTER ROLE
>
#### Exit PostgreSQL:
>
    \q
>
## Setup Steps
>
### 1. Edit the web console configuration file
In addition to updating the first `url` setting, `license-key`, and
`shared-secret` (see [above](#1-edit-the-configuration-file)), in
`/etc/influx-enterprise/influx-enterprise.conf`:
>
\* Uncomment the first `url` setting in the `[database]` section  
\* Update the password in that first `url` setting to the password for the system's local postgres user  
\* Comment out the second `url` setting in the `[database]` section
>
    [...]
    [database]
    # Where is your database?
    # NOTE: This version of Enterprise Web currently only supports Postgres >= 9.3 or SQLite3
    url = "postgres://postgres:password@localhost:5432/enterprise" # ENV: DATABASE_URL ✨
    # url = "sqlite3:///var/lib/influx-enterprise/enterprise.db" ✨
>
If you’re using a non-SSL version of Postgres, add the `?sslmode=disable`
option to the first `url` setting in the `[database]` section:
>
    url = "postgres://postgres:<your_password>@localhost:5432/enterprise?sslmode=disable"
>
### 2. Migrate the configuration file
Run the following command and enter your postgres Admin User's password when
prompted:
>
    influx-enterprise migrate --config /etc/influx-enterprise/influx-enterprise.conf
>
The expected output is:
>
    2016/06/15 17:16:15 Loading config at /etc/influx-enterprise/influx-enterprise.conf
    CREATE DATABASE enterprise;
    > 0001_create_users.up.sql
    > 0002_create_products.up.sql
    > 0003_create_authentications.up.sql
    > 0004_create_clusters_view.up.sql
    > 0005_add_password.up.sql
    > 0006_add_invite_nonce.up.sql
    > 0007_drop_token_from_products.up.sql
    > 0008_rename_product_id_to_node_id.up.sql
    > 0009_create_explorers.up.sql
    > 0010_add_name_to_explorers.up.sql
    > 0011_add_name_to_products.up.sql
>
Now, follow the [third step](#3-start-the-influxenterprise-web-console) in the
previous section to complete the installation.
