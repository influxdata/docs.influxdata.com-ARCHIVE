---
title: Configuring Chronograf
menu:
  chronograf_1_4:
    name: Configuring
    weight: 20
    parent: Administration
---

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

`[OPTIONS]` are any of the available Chronograf command line options), separated by spaces. See the [Chronograf configuration options](/chronograf/latest/administration/config-options) documetnation for details about configuration options, including command line options and corresponding environment variables.

## Enabling security, multi-organization, and multi-user support

See [Managing security](/chronograf/latest/administration/managing-security) for details on configuring authentication options for Chronograf using the JWT and OAuth 2.0 authentication protocols.

After you configure OAuth 2.0 authentication in Chronograf, you can use the multi-organization and multi-user support described in detail here:

* [Managing organizations](/chronograf/latest/administration/managing-organizations)
* [Managing Chronograf users](/chronograf/latest/administration/managing-chronograf-users)

## Configuring Chronograf for InfluxDB Enterprise clusters
