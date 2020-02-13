---
title: chronoctl migrate
description: The `migrate` command allows you to migrate your Chronograf configuration store.
menu:
  chronograf_1_8:
    name: chronoctl migrate
    parent: chronoctl
    weight: 40
---

The `migrate` command allows you to migrate your Chronograf configuration store.

For more information on using this command, see [Migrating to a Chronograf HA configuration](/chronograf/v1.8
/administration/migrate-to-high-availability-etcd/).

## Usage
```
chronoctl migrate [flags]
```

## Flags
| Flag           | Description                         | Input type  |
|:----           |:-----------                         |:----------: |
| `-f`, `--from` | Full path to BoltDB file or etcd (e.g. 'bolt:///path/to/chronograf-v1.db' or 'etcd://user:pass@localhost:2379 (default: chronograf-v1.db)    |  string           |
| `-t`, `--to`   | Full path to BoltDB file or etcd (e.g. 'bolt:///path/to/chronograf-v1.db' or 'etcd://user:pass@localhost:2379 (default: etcd://localhost:2379) | string      |
