---
title: Installation
menu:
  enterprise_1b:
    weight: 0
    parent: introduction
---

The Enterprise web application is TODO: cool description here.
This document gets you up and running with the Enterprise web application.

### Requirements

* Your InfluxEnterprise [license key](TODO: LINK HERE)
* A functioning InfluxDB cluster
* A server (the server can be part of the cluster or separate from the cluster)

### Steps

#### 1. Install PostgreSQL

```
sudo apt-get update
sudo apt-get -y install postgresql postgresql-contrib
```

#### 2. Install the InfluxEnterprise package

TODO: Put the right information here.
```
wget https://bagels/smelly-toads/itsabird_amd64.deb
sudo dpkg -i itsabird_amd64.deb
```

#### 3. Edit the configuration file

Open the configuration file in `/etc/influx-enterprise/influx-enterprise.conf`
and update:             

* The first `url` setting with your server's IP address
* The `license_key` setting with your [license key](TODO: link here)
* The `url` setting in the `[database]` section with the password for the
system's local `postgres` user AND your database name

```
url = "http://<your_server's_IP_address>:3000" #✨
hostname = "enterprise-web"
port = "3000"
license_key = "<your_license_key>" #✨

[influxdb]
shared-secret = "long pass phrase used for signing tokens"

[[meta]]
urls = ["enterprise-server1:8091"]
use-tls = false

[smtp]
host = "localhost"
port = "25"
from_email = "postmaster@mailgun.influxdata.com"

[database]
url = "postgres://postgres:<your_password>@localhost:5432/<your_database_name>" #✨
```

#### 4. Set the password for the system's local `postgres` user

Login to the PostgreSQL:
```
root@enterprise-web:~# sudo -u postgres psql
-> psql (9.3.12)
-> Type "help" for help.
```

Set the password:
```
postgres=# ALTER USER postgres PASSWORD '<your_password>';
-> ALTER ROLE
```

> **Note:** The password must match the password in
`/etc/influx-enterprise/influx-enterprise.conf`.

Exit PostgreSQL:
```
postgres=# \q
```

#### 5. Create the database

Execute the following command and enter your password when prompted.
```
psql -U postgres -h "localhost" -c "CREATE DATABASE <your_database_name>;"
```

Output:
```
-> Password for user postgres: <your_password>
-> CREATE DATABASE
```

> **Note:** The database name must match the database name in
`/etc/influx-enterprise/influx-enterprise.conf`.

#### 6. Migrate the configuration file

```
/usr/bin/influx-enterprise migrate --config /etc/influx-enterprise/influx-enterprise.conf
```

Output:
```
2016/06/15 17:16:15 Loading config at /etc/influx-enterprise/influx-enterprise.conf
> 0001_create_users.up.sql
> 0002_create_products.up.sql
> 0003_create_authentications.up.sql
> 0004_create_clusters_view.up.sql
> 0005_add_password.up.sql
> 0006_add_invite_nonce.up.sql
> 0007_drop_token_from_products.up.sql
> 0008_rename_product_id_to_node_id.up.sql
```

#### 7. Start the Enterprise web application

```
service influx-enterprise start
```

Output:
```
[OK] Service successfully started.
```

You're all set!
Visit `http://<your_server's_IP_address>:3000` to get started with the
Enterprise web application.
