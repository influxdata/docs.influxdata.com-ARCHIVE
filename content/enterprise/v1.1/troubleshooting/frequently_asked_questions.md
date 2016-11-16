---
title: Frequently Asked Questions
menu:
  enterprise_1_1:
    weight: 0
    parent: Troubleshooting
---

This page addresses frequently asked questions that are specific to the
InfluxEnterprise product.
For frequently asked questions about InfluxDB in general, including questions
about the query language and write syntax, please see the
[FAQ](/influxdb/v1.1/troubleshooting/frequently-asked-questions/) for the open
source InfluxDB product.

## How do I make a web console user an admin web console user?

Web console users can be admin users or non-admin users.
In addition to having access to the web console, admin users are able to invite
users, manage web console users, manage cluster accounts, and edit cluster names.

By default, new web console users are non-admin users.
To make a web console user an admin user, visit the `Users` page located in the
`WEB ADMIN` section in the sidebar and click on the name of the relevant user.
In the `Account Details` section, select the checkbox next to `Admin` and click
`Update User`.

![Web Console Admin User](/img/enterprise/admin_user_1.png)

## Why am I getting a Basic Authentication pop-up window from my InfluxEnterprise Web Console?

The InfluxEnterprise Web Console will create a popup requesting Authentication credentials when the `shared-secret` configured under the `[influxdb]` section in the `influx-enterprise.conf` Web Console configuration file does not match with the `shared-secret` configured under the `[http]` section in all data node `influxdb.conf` configuration files. All data nodes and the InfluxEnteprise Web Console must share the same passphrase.
