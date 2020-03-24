---
title: chronoctl add-superadmin
description: The `add-superadmin` command creates a new user with superadmin status.
menu:
  chronograf_1_8:
    name: chronoctl add-superadmin
    parent: chronoctl
    weight: 20
---

The `add-superadmin` command creates a new user with superadmin status.

## Usage
```
chronoctl add-superadmin [flags]
```

## Flags
| Flag                       | Description                                                                                           | Input type |
| :---------------------     | :---------------------------------------------------------------------------------------------------- | :--------: |
| `-b`, `--bolt-path`      | Full path to boltDB file (e.g. './chronograf-v1.db')" env:"BOLT_PATH" default:"chronograf-v1.db"                      | string     |
| `-i`, `--id`              | User ID for an existing user                                     | uint64     |
| `-n`, `--name`             | User's name. Must be Oauth-able email address or username.                |            |
| `-p`, `--provider`            | Name of the Auth provider (e.g. Google, GitHub, auth0, or generic)                                      | string     |
| `-s`, `--scheme`      | Authentication scheme that matches auth provider (default:oauth2)                                                  | string     |
| `-o`, `--orgs`              | A comma-separated list of organizations that the user should be added to (default:"default")                                      | string     |
