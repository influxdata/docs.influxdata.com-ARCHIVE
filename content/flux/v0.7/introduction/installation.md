---
title: Enable Flux
description: Instructions for enabling Flux in your InfluxDB configuration.
menu:
  flux_0_7:
    name: Enable Flux
    parent: Introduction
    weight: 1
---

Flux is packaged with InfluxDB v1.7+ and does not require any additional installation,
however it is **disabled by default and needs to be enabled**.

## Enable Flux
Enable Flux by setting the `flux-enabled` option to `true` under the `[http]` section of your `influxdb.conf`:

###### influxdb.conf
```toml
# ...

[http]

  # ...

  flux-enabled = true

  # ...
```

> The default location of your `influxdb.conf` depends on your operating system.
> More information is available in the [Configuring InfluxDB](/influxdb/latest/administration/config/#using-the-configuration-file) guide.

When InfluxDB starts, the Flux deamon starts as well and data can be queried using Flux.

<div class="page-nav-btns">
  <a class="btn next" href="/flux/v0.7/introduction/getting-started/">Get started with Flux</a>
</div>
