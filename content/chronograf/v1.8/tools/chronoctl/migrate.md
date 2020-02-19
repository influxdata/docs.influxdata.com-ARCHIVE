---
title: chronoctl migrate
description: The `migrate` command allows you to migrate your Chronograf configuration store.
menu:
  chronograf_1_8:
    name: chronoctl migrate
    parent: chronoctl
    weight: 40
---

The `migrate` command lets you migrate your Chronograf configuration store.

By default, Chronograf is delivered with BoltDB as a data store. For information on migrating from BoltDB to an etc cluster as a data store, see [Migrating to a Chronograf HA configuration](/chronograf/v1.8
/administration/migrate-to-high-availability-etcd/).

## Usage
```
chronoctl migrate [flags]
```

## Flags
| Flag           | Description                         | Input type  |
|:----           |:-----------                         |:----------: |
| `-f`, `--from` | Full path to BoltDB file or etcd (e.g. 'bolt:///path/to/chronograf-v1.db' or 'etcd://user:pass@localhost:2379 (default: chronograf-v1.db)    |  string       |
| `-t`, `--to`   | Full path to BoltDB file or etcd (e.g. 'bolt:///path/to/chronograf-v1.db' or 'etcd://user:pass@localhost:2379 (default: etcd://localhost:2379) | string      |