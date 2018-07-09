---
title: Configuring Chronograf
description: Configuration of Chronograf, including custom default settings, security, multiple users, and multiple organizations.
menu:
  chronograf_1_6:
    name: Configuring
    weight: 20
    parent: Administration
---

Chronograf is configured by passing command line options when starting the Chronograf service.
However, it is also possible to set custom default configuration options in the filesystem so they don't have to be passed in when starting Chronograf.

## Starting the Chronograf service

Chronograf can be started using the default configuration options, but environment variables and command line options let you configure OAuth 2.0 authentication and other options based on your requirements.

**Linux:**

```bash
sudo systemctl start chronograf [OPTIONS]
```

**macOS:**

```bash
chronograf [OPTIONS]
```

`[OPTIONS]` are any of the available Chronograf command line options, separated by spaces. See the [Chronograf configuration options](/chronograf/v1.6/administration/config-options) documentation for details about configuration options, including command line options and corresponding environment variables.

## Setting custom default Chronograf config options

Custom default Chronograf configuration settings can be defined in `/etc/default/chronograf`.
This file consists of key-value pairs – the key being the environment variable for each configuration option outlined in the [Chronograf configuration options](/chronograf/v1.6/administration/config-options) documentation and the value being the desired setting for that option.

```conf
HOST=0.0.0.0
PORT=8888
TLS_CERTIFICATE=/path/to/cert.pem
TOKEN_SECRET=MySup3rS3cretT0k3n
LOG_LEVEL=info
```

> **Note:** `/etc/default/chronograf` is only created in Linux-based operating systems.
It is neither created nor used in macOS.

## Enabling security, multi-organization, and multi-user support

See [Managing security](/chronograf/latest/administration/managing-security) for details on configuring authentication options for Chronograf using the JWT and OAuth 2.0 authentication protocols.

After you configure OAuth 2.0 authentication in Chronograf, you can use the multi-organization and multi-user support described in detail here:

* [Managing organizations](/chronograf/latest/administration/managing-organizations)
* [Managing Chronograf users](/chronograf/latest/administration/managing-chronograf-users)


<!-- TODO ## Configuring Chronograf for InfluxDB Enterprise clusters) -->
