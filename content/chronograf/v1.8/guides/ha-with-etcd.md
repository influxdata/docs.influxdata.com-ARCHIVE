---
title: Running Chronograf for High-Availablitiy with etcd
description: Run multiple instances of Chronograf with etcd
menu:
  chronograf_1_8:
    weight: 100
    parent: Guides
---

In order to run multiple instances of chronograf, you need a shared data store.
By default, chronograf uses BoltDB. 

End goal to allow higher http throughput.

### etcd

Get latest etcd release [from GitHub](https://github.com/etcd-io/etcd/releases/tag/v3.3.18):

For Linux:

```sh
# fetch the binary
curl -L https://github.com/etcd-io/etcd/releases/download/v3.3.18/etcd-v3.3.18-linux-amd64.tar.gz | tar -zxf -

# run the binary
./etcd-v3.3.18*/etcd
```

### Start chronograf with etcd

Start chronograf and use etcd as the storage layer:

```sh
chronograf --etcd-endpoints=localhost:2379
```

Other usage:

```
-e, --etcd-endpoints=                       List of etcd endpoints [$ETCD_HOSTS]
    --etcd-username=                        Username to log into etcd. [$ETCD_USERNAME]
    --etcd-password=                        Password to log into etcd. [$ETCD_PASSWORD]
    --etcd-dial-timeout=                    Total time to wait before timing out while connecting to etcd endpoints. 0 means no timeout.
                                            (default: -1s) [$ETCD_DIAL_TIMEOUT]
    --etcd-request-timeout=                 Total time to wait before timing out the etcd view or update. 0 means no timeout. (default:
                                              -1s) [$ETCD_REQUEST_TIMEOUT]
```
