---
title: Security Best Practices
menu:
  enterprise_influxdb_1_3:
    weight: 90
    parent: Administration
---

Some customers may choose to install InfluxEnterprise with public internet access, however 
doing so can inadvertently expose your data and invite unwelcome attacks on your database. 
Check out the sections below for how protect the data in your InfluxEnterprise instance.

## Enable Authentication

Password protect your InfluxEnterprise instance to keep any unauthorized individuals
from accessing your data.

Resources:
[Set up Authentication](/influxdb/v1.3/query_language/authentication_and_authorization/#set-up-authentication)

## Manage Users and their Permissions

Restrict access by creating individual users and assigning them relevant 
read and/or write permissions.

Resources:
[User Types and Privileges](/influxdb/v1.3/query_language/authentication_and_authorization/#user-types-and-privileges),
[User Management Commands](/influxdb/v1.3/query_language/authentication_and_authorization/#user-management-commands)

## Set up HTTPS

Using HTTPS secures the communication between clients and the InfluxDB server, and, in
some cases, HTTPS verifies the authenticity of the InfluxDB server to clients (bi-directional authentication).

Resources:
[HTTPS Setup](/influxdb/v1.3/administration/https_setup/)

## Secure your Host

### Ports
If you're only running InfluxDB, close all ports on the host except for port `8086`.
You can also use a proxy to port `8086`.

InfluxDB uses port `8088` for remote [backups and restores](/influxdb/v1.3/administration/backup_and_restore/).
We highly recommend closing that port and, if performing a remote backup,
giving specific permission only to the remote machine.

### AWS Recommendations

We recommend implementing on-disk encryption; InfluxDB does not offer built-in support to encrypt the data.
