---
title: Migrate from boltdb to etcd
description: Migrate an existing Chronograf installation to HA with etcd
menu:
  chronograf_1_8:
    weight: 100
    parent: Guides
---

{{% note %}}
This guide is for migrating an existing Chronograf installation to a high-availability setup using etcd.
To setup a new Chronograf cluster using etcd, see [Creating a Chronograf cluster](/chronograf/v1.8/guides/high-availability-etcd/).
{{% /note %}}

Migrate a Chronograf database from BoltDB to etcd.
(Also performs migration from etcd to BoltDB.)

<!-- There is no promise that the options/functionality will not change, hence the 'beta' note. -->

## Migrate

The `migrate` command allows you to migrate your Chronograf configuration from BoltDB to etcd.

{{% warn %}}
Backup all databases involved before running a migration as there is no guarantee that there will be no data loss.
{{% /warn %}}

When specifying an etcd endpoint, the URI must begin with `etcd://`.
It is preferred that you prefix `bolt://` to an absolute path when specifying a local bolt db file,
but a lone relative path is also accepted without the prefix.
If there is authentication on etcd, use the standard URI format to define a username/password: `[scheme:][//[userinfo@]host][/]path`.

There is currently no cleanup for a failed migration, so keep that in mind before migrating to a db that contains other important data.

## Usage

```
Usage
chronoctl migrate [OPTIONS]
OPTIONS
    -f, --from= Full path to boltDB file or etcd (e.g. 'bolt:///path/to/chronograf-v1.db' or 'etcd://user:pass@localhost:2379 (default: chronograf-v1.db)
    -t, --to=   Full path to boltDB file or etcd (e.g. 'bolt:///path/to/chronograf-v1.db' or 'etcd://user:pass@localhost:2379 (default: etcd://localhost:2379)
```

## Examples

```sh
$ chronoctl migrate -f ./chronograf-v1.db -t etcd://localhost:2379
# Performing non-idempotent db migration from "./chronograf-v1.db" to "etcd://localhost:2379"...
#   Saved 1 organizations.
#   Saved 1 organization configs.
#   Saved 1 dashboards.
#   Saved 3 mappings.
#   Saved 0 servers.
#   Saved 1 sources.
# Migration successful!
```

```sh
$ chronoctl migrate -f etcd://localhost:2379 -t bolt:///tmp/chronograf.db
# Performing non-idempotent db migration from "etcd://localhost:2379" to "bolt:///tmp/chronograf.db"...
#   Saved 1 organizations.
#   Saved 1 organization configs.
#   Saved 1 dashboards.
#   Saved 3 mappings.
#   Saved 0 servers.
#   Saved 1 sources.
# Migration successful!
```

<!-- Something important to highlight is that migrating from bolt to etcd will change your source ids which change your urls. -->
<!-- so urls that were: http://localhost:8888/sources/1/status -->
<!-- would change to http://localhost:8888/sources/373921399246786560/status -->
<!-- If you are deep linking into chronograf from external sources, those links will need to be updated. -->
