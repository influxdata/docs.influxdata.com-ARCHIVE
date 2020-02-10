---
title: chronograf cli
description:
menu:
  chronograf_1_8:
    name: chronograf CLI
    parent: Tools
    weight: 10

---

The `chronograf` command line interface (CLI) includes ???.

## Usage
```
chronograf [flags]
```

## Flags

| Flag                       | Description                                                                                           | Input type |
| :---------------------     | :---------------------------------------------------------------------------------------------------- | :--------: |
| `--host`            | Override default assets by serving from a specific directory (developer mode)                         | string     |
| `--bolt-path`              | Path to boltdb database (default `~/.influxdbv2/influxd.bolt`)                                        | string     |
| `--e2e-testing`            | Add /debug/flush endpoint to clear stores; used for end-to-end tests (default `false`)                |            |
| `--engine-path`            | Path to persistent engine files (default `~/.influxdbv2/engine`)                                      | string     |
| `-h`, `--help`             | Help for `influxd`                                                                                    |            |
| `--http-bind-address`      | Bind address for the REST HTTP API (default `:9999`)                                                  | string     |
| `--log-level`              | Supported log levels are debug, info, and error (default `info`)                                      | string     |
| `--reporting-disabled`     | Disable sending telemetry data to **https:<nolink>//telemetry.influxdata.com**                        |            |
| `--secret-store`           | Data store for secrets (bolt or vault) (default `bolt`)                                               | string     |
| `--session-length`         | TTL in minutes for newly created sessions (default `60`)                                              | integer    |
| `--session-renew-disabled` | Disables automatically extending session TTL on request                                               |            |
| `--store`                  | Data store for REST resources (bolt or memory) (default `bolt`)                                       | string     |
| `--tls-cert`               | Path to TLS certificate file                                                                          | string     |
| `--tls-key`                | Path to TLS private key file                                                                          | string     |
| `--tracing-type`           | Supported tracing types (log or jaeger)                                                               | string     |
| `--vault-addr `            | Address of the Vault server (example: `https://127.0.0.1:8200/`)                                      | string     |
| `--vault-cacert`           | Path to a PEM-encoded CA certificate file                                                             | string     |
| `--vault-capath`           | Path to a directory of PEM-encoded CA certificate files                                               | string     |
| `--vault-client-cert`      | Path to a PEM-encoded client certificate                                                              | string     |
| `--vault-client-key`       | Path to an unencrypted, PEM-encoded private key which corresponds to the matching client certificate  | string     |
| `--vault-max-retries`      | Maximum number of retries when encountering a 5xx error code (default `2`)                            | integer    |
| `--vault-client-timeout`   | Vault client timeout (default `60s`)                                                                  | duration   |
| `--vault-skip-verify`      | Skip certificate verification when communicating with Vault                                           |            |
| `--vault-tls-server-name`  | Name to use as the SNI host when connecting to Vault via TLS                                          | string     |
