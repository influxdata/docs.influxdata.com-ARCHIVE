---
title: Installing Kapacitor Enterprise
description: placeholder
menu:
  enterprise_kapacitor_1_5:
    name: Installing
    weight: 20
    parent: Introduction
---

# Overview

Kapacitor Enterprise installations are very similar to [open source Kapacitor](/kapacitor/latest/)
but require a an Enterprise license key and include extra configuration options.

The basic installation steps are:

1. Download Kapacitor Enterprise
2. Configure Kapacitor Enterprise
3. Start Kapacitor Enterprise

Kapacitor Enterprise has only a single type of member, meaning every member of a cluster is the same and performs the same functions.

## Step 1: Download Kapacitor Enterprise
Sign in to the [InfluxPortal](https://portal.influxdata.com/dashboard) to view your
Enterprise license key and access the download links.

Click on the **download icon** in your dashboard and agree to the **Software Software
License Subscription Agreement** to view package download links.

<img src="/img/enterprise/kapacitor/kapacitor-enterprise-download.png" style="width:100%; max-width:948px;">
<img src="/img/enterprise/kapacitor/kapacitor-enterprise-accept-sofware-license.png" style="width:100%; max-width:946px;">

Download the package appropriate for your operating system and un-package the contents.
Add the binaries included in `<package_dir>/usr/bin/` to your system's `$PATH`.

## Step 2: Configure Kapacitor Enterprise
Configuring Kapacitor Enterprise is similar to the open source Kapacitor, with a few additional sections in the `kapacitor.conf`.
View the [Kapacitor Enterprise Configuration](/enterprise_kapacitor/v1.5/administration/configuration) documentation for more details.

To print out an example Kapacitor Enterprise configuration, run:

```bash
kapacitord config
```

Use the example configuration to create your own custom `kapacitor.conf`.
Update the [essential information](/kapacitor/v1.5/administration/configuration/#organization)
to suit your specific installation.

### Provide your enterprise license key
In your `kapacitor.conf` provide either your full enterprise license key in the
`license-key` configuration or the path to a file containing your license key using
the `license-path` configuration.
_These configurations are mutually exclusive and should not be used together._

```toml
[enterprise]
  # ...
  license-key = "xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx"

# OR

[enterprise]
  # ...
  license-path = "/path/to/kapacitor-enterpise-license.txt"
```

> If you don't want to store your license key in your `kapacitor.conf`, you can also
> provide your license key using the `KAPACITOR_LICENSE_KEY` or `KAPACITOR_LICENSE_PATH`
> environment variables.

### Other enterprise-specific configuration options
Kapacitor enterprise includes additional configuration options that are covered in the
[Kapacitor Enterprise Configuration](/enterprise_kapacitor/v1.5/administration/configuration) documentation.
There are also options related to clustering and alerts that are covered in detail
in the [Kapacitor clustering](/enterprise_kapacitor/v1.5/cluster-management/create-a-cluster) documentation.

### Save your kapacitor.conf
Save your customized `kapacitor.conf` in the filesystem of the server on which it will be used.
The location of your `kapacitor.conf` is important when [starting Kapacitor](#specify-the-location-of-your-kapacitor-conf).


## Step 3: Start the Kapacitor deamon
With Kapacitor Enterprise configured, start the Kapacitor daemon using the `kapacitord` binary.

```bash
kapacitord
```

### Specify the location of your kapacitor.conf
You have a few options for telling Kapacitor where your `kapacitor.conf` is located:

1. When staring Kapacitor, pass the path to the configuration file with `kapacitord`'s `-config` option.

    ```bash
    kapacitord -config /path/to/kapacitor.conf
    ```

2. Define the path to the `kapacitor.conf` using the `KAPACITOR_CONFIG_PATH` environment variable.

3. Place your `kapacitor.conf` at one of the expected locations:
    - `~/.kapacitor/`
    - `/etc/kapacitor/`
