---
title: Configuring Chronograf
menu:
  chronograf_1_4:
    name: Configuring Chronograf
    weight: 20
    parent: Administration
---

## Requirements

Chronograf is the user interface and data visualization component of the InfluxData [TICK stack](https://www.influxdata.com/products/) and is designed to be used together with InfluxDB, Telegraf, and Kapacitor, but the minimum requirements are:

* InfluxDB
  - available and running
  - authentication is enabled (`auth-enabled` option)
  - admin user has been created and is available
* Kapacitor
  - optional, but needed to create and use alerts in Chronograf

> ***Note:*** Run through the [Getting Started](/chronograf/latest/introduction/getting-started) tutorial for a quick start on configuring InfluxDB, Kapacitor, and Telegraf for use with Chronograf.


## Starting the Chronograf service

Chronograf can be started using the default configuration options, but the environment variables and command line options let you configure OAuth 2.0 authentication and other options based on your requirements.

**To start the Chronograf service:**

Linux

* `sudo systemctl start chronograf`
* `sudo systemctl start chronograf [OPTIONS]` (where [OPTIONS] are any command line options, separated by spaces

Mac OS X

* `chronograf`
* `chronograf [OPTIONS]` (where [OPTIONS] are any command line options, separated by spaces

See [Chronograf configuration options](/chronograf/latest/administration/config-options) for details about configuration options, including command line options and corresponding environment variables.


## Enabling security, multi-organization, and multi-user support

See [Managing security](/chronograf/latest/administration/managing-security) for details on configuring authentication options for Chronograf using the JWT and OAuth 2.0 authentication protocols.

After you configure OAuth 2.0 authentication in Chronograf, you can use the multi-organization and multi-user support described in detail here:

* [Managing organizations](/chronograf/latest/administration/managing-organization)
* [Managing Chronograf users](/chronograf/latest/administration/managing-chronograf-users)
