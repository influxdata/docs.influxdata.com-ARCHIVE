---
title: chronoctl list-users
description: The `list-users` command lists all users in the Chronograf data store.

menu:
  chronograf_1_8:
    name: chronoctl list-users
    parent: chronoctl
    weight: 30
---

The `list-users` command lists all users in the Chronograf data store.

## Usage
```
chronoctl list-users [flags]
```

## Flags
| Flag                       | Description                                                                                           | Input type |
| :---------------------     | :---------------------------------------------------------------------------------------------------- | :--------: |
| `--b`, `--bolt-path`            | Full path to boltDB file (e.g. './chronograf-v1.db')" env:"BOLT_PATH" (default:chronograf-v1.db)                         | string     |
