---
title: chronograf placeholder 2
description:
menu:
  chronograf_1_8:
    name: chronograf placeholder 2
    parent: chronograf CLI
    weight: 30

---

The `list-users` command lists all users in the Chronograf BoltDB instance.

## Usage
```
chronoctl list-users [flags]
```

## Flags
| Flag                       | Description                                                                                           | Input type |
| :---------------------     | :---------------------------------------------------------------------------------------------------- | :--------: |
| `--b`, `--bolt-path`            | Full path to boltDB file (e.g. './chronograf-v1.db')" env:"BOLT_PATH" (default:chronograf-v1.db)                         | string     |
