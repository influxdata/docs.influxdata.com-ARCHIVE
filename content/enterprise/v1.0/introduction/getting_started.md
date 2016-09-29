---
title: Getting Started
alias:
  /enterprise/v1.0/introduction/getting-started/
menu:
  enterprise_1_0:
    weight: 40
    parent: Introduction
---

Now that you successfully [installed and set up](/enterprise/v1.0/introduction/meta_node_installation/) InfluxEnterprise, visit
`http://<your_web_console_server's_IP_address>:3000` to get started with the
web console!

When you first visit the web console, it prompts you to:

#### 1. Name your cluster

The first step is to name the cluster that you setup in the
[previous documents](/enterprise/v1.0/introduction/meta_node_installation/).
Here, we call our cluster `MyCluster`.

![Name your cluster](/img/enterprise/name_cluster_1.png)

> **Note:** If instead you see a message that your cluster does not appear to be set up,
double-check the `registration-enabled` and `registration-server-url` settings in the
configuration files for each meta node.
The `registration-server-url` setting must be a full URL with protocol and port.

#### 2. Create a Cluster Admin account

Next, create a Cluster Admin account.
The Cluster Admin account has all [cluster-specific permissions](/enterprise/v1.0/features/users/#permissions).

We recommend calling this account `ClusterAdmin`.
Note that you will need to authenticate with the `ClusterAdmin` username and
password if you're interacting with your InfluxEnterprise cluster [outside](https://docs.influxdata.com/influxdb/v1.0/tools/) of the
web console.

![Create Cluster Admin](/img/enterprise/create_cluster_admin_1.png)

#### 3. Create a Web Admin user

The Web Admin user has all [web-console-specific permissions](/enterprise/v1.0/features/users/#admin-users).

Fill out the form with the Web Admin user's first and last name, associated email address, and password.

> **Important**:  Associate the Web Admin user with the Cluster Admin (we used `ClusterAdmin` and `MyCluster` in the examples above).
To associate the Cluster Admin with Web Admin, choose `ClusterAdmin` in the menu adjacent to `MyCluster`.
>
Associating the two accounts with one another ensures both admin accounts have all web console permissions AND all cluster-specific
permissions.

![Create Web Admin](/img/enterprise/create_web_admin_1.png)

### Where to from here?

Check out the [Features](/enterprise/v1.0/features/) section to see all that
InfluxEnterprise can do.

Note that the web console requires a functioning SMTP server to email invites
to new web console users.
If you're working on Ubuntu 14.04 and are looking for an SMTP server to use for
development purposes, see the
[SMTP Server Setup](/enterprise/v1.0/guides/smtp-server/) guide for how to get up
and running with [MailCatcher](https://mailcatcher.me/).
