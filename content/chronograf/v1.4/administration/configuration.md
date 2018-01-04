---
title: Configuring Chronograf
menu:
  chronograf_1_4:
    name: Configuring Chronograf
    weight: 25
    parent: Administration
---

## Requirements

Chronograf is the user interface and data visualization component of the InfluxData [TICK stack](https://www.influxdata.com/products/) and is is designed to be used together with InfluxDB, Telegraf, and Kapacitor, but the minimum requirements are:

* InfluxDB
  - available and running
  - authentication is enabled (`auth-enabled` option)
  - admin user has been created and is available
* Kapacitor
  - optional, but needed to create and use alerts in Chronograf

> ***Note:*** Use the [Getting Started](/chronograf/v1.4/introduction/getting-started) guide to run through a quick start tutorial on configuring InfluxDB, Kapacitor, and Telegraf for use with Chronograf.


## Starting the Chronograf service

Chronograf can be started using the default configuration options, but you can use the environment variables and command line options to meet your requirements. To use authentication, you need to include any required options for supported OAuth 2.0 authentication providers.

**To start the Chronograf service:**

Linux

* `sudo systemctl start chronograf`
* `sudo systemctl start chronograf [OPTIONS]` (where [OPTIONS] are any command line options, separated by spaces

Mac OS X

* `chronograf`
* `chronograf [OPTIONS]` (where [OPTIONS] are any command line options, separated by spaces

See [Chronograf configuration options](/chronograf/v1.4/administration/config-options) for details about configuration options, including command line options and corresponding environment variables.


## Enabling security and multi-organization support

See [Managing security](/chronograf/v1.4/administration/managing-security) for details on configuring authentication options for Chronograf using the JWT and OAuth 2.0 authentication protocols.

After you configure OAuth 2.0 authentication in Chronograf, you can use the multi-organization/multi-user support described in detail here:

* [Managing organizations](/chronograf/v1.4/administration/managing-organization)
* [Managing Chronograf users](/chronograf/v1.4/administration/managing-chronograf-users)
* [Managing roles](/chronograf/v1.4/administration/managing-roles)
