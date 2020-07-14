---
title: Manage InfluxDB security
menu:
  influxdb_1_8:
    name: Manage security
    weight: 70
    parent: Administration
---

Some customers may choose to install InfluxDB with public internet access, however
doing so can inadvertently expose your data and invite unwelcome attacks on your database.
Check out the sections below for how protect the data in your InfluxDB instance.

## Enabling authentication

Password protect your InfluxDB instance to keep any unauthorized individuals
from accessing your data.

Resources:
[Set up Authentication](/influxdb/v1.8/administration/authentication_and_authorization/#set-up-authentication)

## Managing users and permissions

Restrict access by creating individual users and assigning them relevant
read and/or write permissions.

Resources:
[User Types and Privileges](/influxdb/v1.8/administration/authentication_and_authorization/#user-types-and-privileges),
[User Management Commands](/influxdb/v1.8/administration/authentication_and_authorization/#user-management-commands)

## Enabling HTTPS

Enabling HTTPS encrypts the communication between clients and the InfluxDB server.
HTTPS can also verify the authenticity of the InfluxDB server to connecting clients.

Resources:
[Enabling HTTPS](/influxdb/v1.8/administration/https_setup/)

## Configure security headers

HTTP headers allow servers and clients to pass additional information along with requests.
Certain headers help [enforce security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#Security) properties.

Resources:
[Configure HTTP headers](/influxdb/v1.8/administration/config/#http-headers)

## Securing your host

### Ports
If you're only running InfluxDB, close all ports on the host except for port `8086`.
You can also use a proxy to port `8086`.

InfluxDB uses port `8088` for remote [backups and restores](/influxdb/v1.8/administration/backup_and_restore/).
We highly recommend closing that port and, if performing a remote backup,
giving specific permission only to the remote machine.

### AWS recommendations

We recommend implementing on-disk encryption; InfluxDB does not offer built-in support to encrypt the data.
