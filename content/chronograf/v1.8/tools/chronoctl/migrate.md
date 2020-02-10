---
title: chronoctl migrate
description:
menu:
  chronograf_1_8:
    parent: chronoctl CLI
    weight: 40

---
The `migrate` command allows you to migrate your Chronograf configuration store.

## Usage
```
chronoctl migrate [flags]
```

## Flags
| Flag           | Description                         | Input type  |
|:----           |:-----------                         |:----------: |
| `-f`, `--from` | Full path to BoltDB file or etcd (e.g. 'bolt:///path/to/chronograf-v1.db' or 'etcd://user:pass@localhost:2379 (default: chronograf-v1.db)    |  string           |
| `-t`, `--to`   | Full path to BoltDB file or etcd (e.g. 'bolt:///path/to/chronograf-v1.db' or 'etcd://user:pass@localhost:2379 (default: etcd://localhost:2379) | string      |
