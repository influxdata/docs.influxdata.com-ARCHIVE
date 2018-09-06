---
title: Kapacitor cluster CLI
description: The 'kapacitorctl' utility is used to manage Kapacitor Enterprise clusters. This article outlines 'kapacitorctl' commands and options.
menu:
  enterprise_kapacitor_1_5:
    weight: 100
    parent: Cluster Management
---

The `kapacictorctl` utility provides management tools for Kapacitor clusters.

## Options

#### `-skipVerify`
Skips TLS verification. This should be used if interacting with Kapacitor servers
in your cluster that are secured using self-signed TLS certificates.

_This can also be enables using the `KAPACITOR_UNSAFE_SSL` environment variable._

```bash
# Pattern
kapacitorctl [command] [subcommand] -skipVerify

# Example
kapacitorctl member add example.com:9091 -skipVerify
```

#### `-url`
This option is used to run `kapacitorctl` commands on a remote host.
It specifies the resolvable host at which a `kapacitord` process is running.

_This can also be specified using the `KAPACITOR_URL` environment variable._

```bash
# Pattern
kapacitorctl [command] [subcommand] -url http://example.com:9092

# Example
kapacitorctl member list -url http://example.com:9092
```

## Commands
The `kapacitorctl` utility includes the following commands:

- [member](#member)
- [help](#help)

### `member`
The `kapacitorctl member` command is used to add, remove, and list information
about members of a Kapacitor cluster.
It includes three subcommands:

- [member list](#member-list)
- [member add](#member-add)
- [member remove](#member-remove)

#### `member list`
The `kapacitorctl member list` subcommand lists cluster members, related information, and statuses.

```bash
kapacitorctl member list
```

The output contains the following information:

```
State: initialized
Cluster ID: 876ddfb4-1879-4f40-87e2-4080c04d3096
Local Member ID: f74f3547-efaf-4e6e-8b05-fb12b19f8287
Member ID                               Gossip Address RPC Address    API Address    Roles  Status
f74f3547-efaf-4e6e-8b05-fb12b19f8287    serverA:9090   serverA:9091   serverA:9092   worker alive
13eeefdd-41b5-453f-928e-cb9c55fd2a5d    serverB:9090   serverB:9091   serverB:9092   worker alive
```

#### `member add`
The `kapacitorctl member add` subcommand adds members to a Kapacitor cluster.
It requires the RPC address of the member you intend to add.
The RPC address is the resolvable DNS or IP (using port 9091) of the Kapacitor host you intend to add as a member.

> RPC addresses can also be found by running [`kapacitorctl memeber list`](#member-list) on the Kapacitor node you intend to add.
> The Kapacitor host will appear as the only member in the cluster since it has not yet been added to a cluster.

```bash
# Pattern
kapacitorctl member add <member-rpc-address>

# Example
kapacitorctl member add example.com:9091
```

#### `member remove`
The `kapacitorctl member remove` subcommand removes a member from a Kapacitor cluster.
It requires the member ID of the member you intend to remove.
Member IDs are included in the [`kapacitorctl member list`](#member-list) output.

```bash
# Pattern
kapacitorctl member remove <member-id>

# Example
kapacitorctl member remove 13eeefdd-41b5-453f-928e-cb9c55fd2a5d
```

### `help`
The `help` command prints help information for a given command.

```bash
# Pattern
kapacitorctl help [command]

# Example
kapacitorctl help member
```

## Running kapacitorctl commands remotely
To run `kapacitorctl` commands remotely, use the [`-url` option](#url) to specify
the URL at which the remote Kapacitor server is accessed.

For example, if you have a Kapacitor cluster with a member accessible at `https://node-1.my-kapacitor.com:9092`,
you can run `kapacitorctl` commands on that server by passing the resolvable URL as the `-url`.

```bash
kapacitorctl member add node-2.my-kapacitor.com:9091 -url https://node-1.my-kapacitor.com:9092
```

The `member add` subcommand above will run on the `node-1.my-kapacitor.com` server.

> If Kapacitor members in your cluster are secured using self-signed TLS certificates,
> include the `-skipVerify` option to avoid SSL/TLS verification issues.
