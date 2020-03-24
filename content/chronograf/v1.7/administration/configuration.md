---
title: Configuring Chronograf
description: Configuration of Chronograf, including custom default settings, security, multiple users, and multiple organizations.
menu:
  chronograf_1_7:
    name: Configuring
    weight: 20
    parent: Administration
---

Chronograf is configured by passing command line options when starting the Chronograf service.
However, it is also possible to set custom default configuration options in the filesystem so they don't have to be passed in when starting Chronograf.

## Starting the Chronograf service

Start Chronograf using the default configuration options, or [customize your configuration](https://docs.influxdata.com/chronograf/v1.7/administration/configuration/) with environment variables and command line options (for example, to configure OAuth 2.0 authentication) based on your requirements.

**Linux:**

```bash
sudo systemctl start chronograf [OPTIONS]
```

**macOS:**

```bash
chronograf [OPTIONS]
```

`[OPTIONS]` are available Chronograf command line options, separated by spaces. See the [Chronograf configuration options](https://docs.influxdata.com/chronograf/v1.7/administration/config-options) documentation for details about configuration options, including command line options and corresponding environment variables.

## Setting custom default Chronograf config options

Custom default Chronograf configuration settings can be defined in `/etc/default/chronograf`.
This file consists of key-value pairs. See keys (environment variables) for [Chronograf configuration options](https://docs.influxdata.com/chronograf/v1.7/administration/config-options), and set values for the keys you want to configure.

```conf
HOST=0.0.0.0
PORT=8888
TLS_CERTIFICATE=/path/to/cert.pem
TOKEN_SECRET=MySup3rS3cretT0k3n
LOG_LEVEL=info
```

> **Note:** `/etc/default/chronograf` is only created in Linux-based operating systems.
It is neither created nor used in macOS.

## Setting up security, organizations, and users

To set up security for Chronograf, configure:

* [OAuth 2.0 authentication](/chronograf/v1.7/administration/managing-security/#configure-oauth-2-0)
* [TLS (Transport Layer Security) for HTTPS](/chronograf/v1.7/administration/managing-security/#configure-tls-transport-layer-security-and-https)

After you configure OAuth 2.0 authentication, you can set up multiple organizations, roles, and users. For details, check out the following topics:

* [Managing organizations](chronograf/v1.7/administration/managing-organizations/)
* [Managing Chronograf users](https://docs.influxdata.com/chronograf/v1.7/administration/managing-chronograf-users/)


<!-- TODO ## Configuring Chronograf for InfluxDB Enterprise clusters) -->
