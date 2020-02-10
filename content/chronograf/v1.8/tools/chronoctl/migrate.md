---
title: chronoctl migrate
description: placeholder
menu:
  chronograf_1_8:
    name: chronoctl migrate
    parent: chronoctl
    weight: 40
---

The `migrate` command allows you to migrate your chronograf configuration store.

## Usage
```
chronoctl migrate [flags]
```

## Flags
| Flag           | Description                         | Input type  |
|:----           |:-----------                         |:----------: |
| `-f`, `--from` | Full path to BoltDB file or etcd (e.g. 'bolt:///path/to/chronograf-v1.db' or 'etcd://user:pass@localhost:2379 (default: chronograf-v1.db)    |  string           |
| `-t`, `--to`   | Full path to BoltDB file or etcd (e.g. 'bolt:///path/to/chronograf-v1.db' or 'etcd://user:pass@localhost:2379 (default: etcd://localhost:2379) | string      |
