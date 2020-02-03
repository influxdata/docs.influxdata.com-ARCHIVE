---
title: Running Chronograf for High-Availablitiy with etcd
description: Create a high-availability (HA) Chronograf cluster using etcd.
menu:
  chronograf_1_8:
    weight: 100
    parent: Guides
---

Create a high-availability (HA) Chronograf cluster using etcd as a shared Chronograf data store.

<!-- Run multiple instances of Chronograf to provide high availability. -->
<!-- To do this, you need to use a shared data store. -->
<!-- This can be accomplished using [etcd](https://github.com/etcd-io/etcd). -->

## Install etcd

Download the latest etcd release [from GitHub](https://github.com/etcd-io/etcd/releases/).
Extract the `etcd` binary and place it in your system PATH.
(For detailed installation instructions specific to your operating system, see [Install and deploy etcd](http://play.etcd.io/install).)

Start etcd (before starting Chronograf).

## Start Chronograf with etcd

To start Chronograf using etcd as the storage layer, use the following command:

```sh
chronograf --etcd-endpoints=localhost:2379
```

The flags listed below provide more configuration options.

```
-e, --etcd-endpoints=                       List of etcd endpoints [$ETCD_HOSTS]
    --etcd-username=                        Username to log into etcd. [$ETCD_USERNAME]
    --etcd-password=                        Password to log into etcd. [$ETCD_PASSWORD]
    --etcd-dial-timeout=                    Total time to wait before timing out while connecting to etcd endpoints. 0 means no timeout.
                                            (default: -1s) [$ETCD_DIAL_TIMEOUT]
    --etcd-request-timeout=                 Total time to wait before timing out the etcd view or update. 0 means no timeout. (default:
                                              -1s) [$ETCD_REQUEST_TIMEOUT]
```
