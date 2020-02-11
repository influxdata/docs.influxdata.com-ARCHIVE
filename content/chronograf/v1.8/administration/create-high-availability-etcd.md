---
title: Creating a Chronograf HA configuration
description: Create a Chronograf high-availability (HA) cluster using etcd.
menu:
  chronograf_1_8:
    weight: 10
    parent: Administration
---

To create a Chronograf high-availability (HA) cluster using etcd as a shared data store, do the following:

- [Install and start etcd](#install-and-start-etcd)
- [Start Chronograf](#start-chronograf)

Have an existing Chronograf configuration store that you want to use with a Chronograf HA configuration? After you [install and start etcd](#install-and-start-etcd), learn how to [migrate your Chrongraf configuration](/chronograf/v1.8/administration/migrate-to-high-availability-etcd/) to a shared data store.

## Install and start etcd

1. Download the latest etcd release [from GitHub](https://github.com/etcd-io/etcd/releases/).
   (For detailed installation instructions specific to your operating system, see [Install and deploy etcd](http://play.etcd.io/install).)
2. Extract the `etcd` binary and place it in your system PATH.
3. Start etcd.

## Start Chronograf

To start Chronograf using etcd as the storage layer, use the following command:

```sh
chronograf --etcd-endpoints=localhost:2379
```

For more information, see [Chronograf etcd configuration options](/chronograf/v1.8/administration/config-options#etcd-options).
