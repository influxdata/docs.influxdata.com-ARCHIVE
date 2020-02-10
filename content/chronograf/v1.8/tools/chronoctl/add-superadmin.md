---
title: chronoctl add-superadmin
description: The `add-superadmin` command creates a new user with superadmin status.
menu:
  chronograf_1_8:
    parent: chronoctl CLI
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
| `--b-`, `--bolt-path`      | Full path to boltDB file (e.g. './chronograf-v1.db')" env:"BOLT_PATH" default:"chronograf-v1.db"                      | string     |
| `--i`, `--id`              | User ID for an existing user                                     | uint64     |
| `--n`, `--name`             | User's name. Must be Oauth-able email address or username.                |            | string
| `--p`, `--provider`            | Name of the Auth provider (e.g. google, github, auth0, or generic)                                      | string     |
| `-s`, `--scheme`      | Authentication scheme that matches auth provider (default:oauth2)                                                  | string     |
| `-o`, `--orgs`              | A comma-separated list of organizations that the user should be added to (default:"default")                                      | string     |
