---
title: Configuring Chronograf
description: Configuration of Chronograf, including custom default settings, security, multiple users, and multiple organizations.
menu:
  chronograf_1_8:
    name: Configuring
    weight: 20
    parent: Administration
---

Configure Chronograf by passing command line options when starting the Chronograf service. Or set custom default configuration options in the filesystem so they don’t have to be passed in when starting Chronograf.

- [Start the Chronograf service](#start-the-chronograf-service)
- [Set custom default Chronograf configuration options](#set-custom-default-chronograf-configuration-options)
- [Set up security, organizations, and users](#set-up-security-organizations-and-users)

## Start the Chronograf service

Use one of the following commands to start Chronograf:

- **If you installed Chronograf using an official Debian or RPM package and are running a distro with `systemd`. For example, Ubuntu 15 or later.**

  ```sh 
  systemctl start chronograf
  ```

- **If you installed Chronograf using an official Debian or RPM package:**

  ```sh
  service chronograf start
  ```

- **If you built Chronograf from source:**

  ```bash
  $GOPATH/bin/chronograf
  ```

## Set custom default Chronograf configuration options

Custom default Chronograf configuration settings can be defined in `/etc/default/chronograf`.
This file consists of key-value pairs. See keys (environment variables) for [Chronograf configuration options](https://docs.influxdata.com/chronograf/v1.8/administration/config-options), and set values for the keys you want to configure.

```conf
HOST=0.0.0.0
PORT=8888
TLS_CERTIFICATE=/path/to/cert.pem
TOKEN_SECRET=MySup3rS3cretT0k3n
LOG_LEVEL=info
```

> **Note:** `/etc/default/chronograf` is only created when installing the `.deb or `.rpm` package.

## Set up security, organizations, and users

To set up security for Chronograf, configure:

* [OAuth 2.0 authentication](/chronograf/v1.8/administration/managing-security/#configure-oauth-2-0)
* [TLS (Transport Layer Security) for HTTPS](/chronograf/v1.8/administration/managing-security/#configure-tls-transport-layer-security-and-https)

After you configure OAuth 2.0 authentication, you can set up multiple organizations, roles, and users. For details, check out the following topics:

* [Managing organizations](/chronograf/v1.8/administration/managing-organizations/)
* [Managing Chronograf users](/chronograf/v1.8/administration/managing-chronograf-users/)


<!-- TODO ## Configuring Chronograf for InfluxDB Enterprise clusters) -->
