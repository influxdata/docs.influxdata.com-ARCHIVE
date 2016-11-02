---
title: Upgrading from Previous Versions
menu:
  enterprise_1_0:
    weight: 0
    parent: Administration
---

The following sections include instructions for upgrading from InfluxEnterprise
Clustering version 0.7.4 and InfluxEnterprise Web Console version 0.7.1
to InfluxEnterprise 1.0.

Please note that the upgrade process requires you to delete existing users
from the web console due to [significant changes](/enterprise/v1.0/about-the-project/release-notes-changelog/#user-updates)
to how users function in InfluxEnterprise.
Once you've completed the upgrade process, any users created prior to version 1.0 will be
[cluster accounts](/enterprise/v1.0/features/users/#cluster-user-information).
Please see [InfluxEnterprise Users](/enterprise/v1.0/features/users/) for
more information on how InfluxEnterprise organizes users in version 1.0.

> **Note:** Before you start, please review the section at the
[bottom of this page](#configuration-settings) to ensure that you have the most
up-to-date configuration settings.

## Upgrading to InfluxEnterprise 1.0

### 1. Download and install the new versions of InfluxEnterprise

#### Meta nodes

##### Ubuntu & Debian (64-bit)
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_1.0.2-c1.0.4_amd64.deb
sudo dpkg -i influxdb-meta_1.0.2-c1.0.4_amd64.deb
```

> **Note:** If you're running Ubuntu 16.04.1, you may need to enter
`sudo systemctl disable influxdb-meta` before executing the `dpkg` step.

##### RedHat & CentOS (64-bit)
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-1.0.2_c1.0.4.x86_64.rpm
sudo yum localinstall influxdb-meta-1.0.2_c1.0.4.x86_64.rpm
```

#### Data nodes

##### Ubuntu & Debian (64-bit)
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_1.0.2-c1.0.4_amd64.deb
sudo dpkg -i influxdb-data_1.0.2-c1.0.4_amd64.deb
```
##### RedHat & CentOS (64-bit)
```
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-1.0.2_c1.0.4.x86_64.rpm
sudo yum localinstall influxdb-data-1.0.2_c1.0.4.x86_64.rpm
```
#### Web console

##### Ubuntu & Debian (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influx-enterprise_1.0.3_amd64.deb
sudo dpkg -i influx-enterprise_1.0.3_amd64.deb
```
##### RedHat & CentOS (64-bit)
```
wget https://s3.amazonaws.com/influx-enterprise/releases/influx-enterprise-1.0.3.x86_64.rpm
sudo yum localinstall influx-enterprise-1.0.3.x86_64.rpm
```

> **Note:**
If you're running Ubuntu 16.04.1, you may need to enter
`sudo systemctl disable influx-enterprise` before executing the `dpkg` step.

### 2. Delete existing Web Console users
The new user organization in InfluxEnterprise requires those looking to
upgrade to version 1.0 to remove all existing users from the Web Console.
On the server that's running InfluxEnterprise, enter:
```
rm -rf /var/lib/influx-enterprise/enterprise.db
```

### 3. Migrate the Web Console configuration file
Run the following command:
```
sudo -u influx-enterprise influx-enterprise migrate --config /etc/influx-enterprise/influx-enterprise.conf
```

### 4. Restart all services
#### Meta nodes:
On sysvinit systems, enter:
```
service influxdb-meta start
```

On systemd systems, enter:
```
sudo systemctl start influxdb-meta
```
#### Data nodes:
On sysvinit systems, enter:
```
service influxdb start
```

On systemd systems, enter:
```
sudo systemctl start influxdb
```
#### Web console:
On sysvinit systems, enter:
```
service influx-enterprise start
```

On systemd systems, enter:
```
sudo systemctl start influx-enterprise
```

### 5. Complete the signup flow
Now that you've upgraded to version 1.0, visit `http://<your_web_console_server's_IP_address>:3000`
to complete the new signup flow.

The [Getting Started](/enterprise/v1.0/introduction/getting_started/) guide offers
detailed instructions for how to complete the signup process.
Don't worry about any existing cluster users for now - we'll take care of
them in the next step.

### 6. Link existing cluster accounts to web console users
In version 1.0 web console users are given cluster-specific permissions by being associated with a separate cluster account.
The upgrade process turned all existing users into cluster accounts with no
associated web console user.
The following steps document how to link those existing cluster accounts
to web console users.

First, view existing cluster accounts to identify the users you'll need
to invite to the web console.
To view your existing cluster accounts, visit the `Cluster Accounts` page located
in the `CLUSTER` section in the sidebar.

The example below shows three cluster accounts.
The first account (`ClusterAdmin`) is the account we created in the new signup flow.
The last two (`paul` and `todd`) are users that existed prior to the
upgrade.

![Cluster Accounts](/img/enterprise/cluster_accounts_1.png)

Next, invite the cluster account users that existed prior to the upgrade to be web console users.
Visit the `Users` page located in the `WEB ADMIN` section in the sidebar, and
click on the `Invite User` button in the top right corner.
Once you've filled out the `Invite User` form with the relevant information, link the new
web console user with the existing cluster account by selecting the relevant
cluster account from the `Account` dropdown.

The example below shows a web console invite for the user `Paul`.
The last input links the new web console user `Paul` with the existing cluster
account `paul`.

![Invite web console user](/img/enterprise/invite_user_1.png)

Repeat this process for each cluster account user that existed prior to the upgrade.
Once you've completed this step, all pre-existing cluster accounts will be linked
to web console users and those users will have access to both the cluster and the
web console.

> **Note:** Web console users can be admin users or non-admin users.
In addition to having access to the web console, admin users are able to invite users, manage web console users,
manage cluster accounts, and edit cluster names.
>
By default, new web console users are non-admin users.
To make a web console user an admin user, visit the `Users` page located in the `WEB ADMIN` section in the sidebar
and click on the name of the relevant user.
In the `Account Details` section, click the checkbox next to `Admin` and click
`Update User`.
>
![Web Console Admin User](/img/enterprise/admin_user_1.png)


You've completed the upgrade process for version 1.0.
Next, check out the [release notes](/enterprise/v1.0/about-the-project/release-notes-changelog/) to
see what's new!

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
hostname = "enterprise-meta-01"

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
