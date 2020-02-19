---
title: Create a Chronograf HA configuration
description: Create a Chronograf high-availability (HA) cluster using etcd.
menu:
  chronograf_1_8:
    weight: 10
    parent: Administration
---

To create a Chronograf high-availability (HA) configuration using an etcd cluster as a shared data store, do the following:

1. [Install and start etcd](#install-and-start-etcd)
2. Set up a load balancer for Chronograf
3. [Start Chronograf](#start-chronograf)

Have an existing Chronograf configuration store that you want to use with a Chronograf HA configuration? Learn how to [migrate your Chrongraf configuration](/chronograf/v1.8/administration/migrate-to-high-availability/) to a shared data store.

## Architecture

<img src="/img/svgs/chronograf-ha-architecture.svg" alt="Chronograf high-availability architecture" style="width:100%;max-width:500px"/>

## Install and start etcd

1. Download the latest etcd release [from GitHub](https://github.com/etcd-io/etcd/releases/).
   (For detailed installation instructions specific to your operating system, see [Install and deploy etcd](http://play.etcd.io/install).)
2. Extract the `etcd` binary and place it in your system PATH.
3. Start etcd.

## Start Chronograf

Run the following command to start Chronograf using etcd as the storage layer:

```sh
# Sytnax
chronograf --etcd-endpoints=<etcd-host>

# Example
chronograf --etcd-endpoints=localhost:2379
```

For more information, see [Chronograf etcd configuration options](/chronograf/v1.8/administration/config-options#etcd-options).
