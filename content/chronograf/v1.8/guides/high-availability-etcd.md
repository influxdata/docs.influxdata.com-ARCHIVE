---
title: Creating a Chronograf cluster
description: Create a high-availability (HA) Chronograf cluster using etcd.
menu:
  chronograf_1_8:
    weight: 100
    parent: Guides
---

To create a high-availability (HA) Chronograf cluster using etcd as a shared data store, do the following:

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
