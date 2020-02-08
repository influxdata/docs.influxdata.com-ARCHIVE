---
title: Migrate to a Chronograf cluster
description: Migrate to a Chronograf high-availability (HA) cluster.
menu:
  chronograf_1_8:
    weight: 10
    parent: Administration
---

Use [`chronoctl`](add link to tool) to migrate your Chronograf configuration store from BoltDB to a shared `etcd` data store used for Chronograf high-availability (HA) clusters.

1. To prevent data loss, we **strongly recommend** that you back up your Chronograf data stores before migrating to a Chronograf cluster.

2. [Install and start `etcd`](/chronograf/v1.8/guides/high-availability-etcd#install-and-start-etcd).

3. Run the following command, specifying the local BoltDB file and the `etc` endpoint beginning with `etcd//`. (We recommend adding the prefix `bolt://` to an absolute path, but a relative path without the prefix is also accepted.)

```sh
$ chronoctl migrate -f bolt:///path/to/chronograf-v1.db -t etcd://localhost:2379
```

    > **Note:** 
      If you have authentication on `etcd`, use the standard URI format to define a username and password. For example, `etcd://user:pass@localhost:2379 (by default, chronograf-v1.db)`

4. Update links to Chronograf (for example, from external sources) to reflect your new URLs:
    - **from BoltDB:**
    http://localhost:8888/sources/1/status
    - **to etcd:**
    http://localhost:8888/sources/373921399246786560/status
