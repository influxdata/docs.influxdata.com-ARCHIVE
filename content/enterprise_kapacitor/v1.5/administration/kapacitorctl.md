---
title: Kapacitor cluster CLI
description: placeholder
menu:
  enterprise_kapacitor_1_5:
    weight: 100
    parent: Administration
---

The `kapacictorctl` utility provides management tools for Kapacitor clusters.

## Commands
The `kapacitorctl` utility includes the following commands:

- [`member`](#member)
- [`cluster`](#cluster)
- [`help`](#help)

### `member`
The `kapacitorctl member` command is used to add, remove, and list information
about members of a Kapacitor cluster.
In includes three subcommands:

- [`member list`](#member-list)
- [`member add`](#member-add)
- [`member remove`](#member-remove)

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

```bash
# Pattern
kapacitorctl member add <rpc-address>

# Example
kapacitorctl member add <rpc-address>
```

#### `member remove`
The `kapacitorctl member remove` subcommand remove a node from a Kapacitor cluster.

```bash
# Pattern
kapacitorctl member remove <node-id>

# Example
kapacitorctl member remove 13eeefdd-41b5-453f-928e-cb9c55fd2a5d
```
_Node IDs are included in the `kapacitorctl member list` output._

### `cluster`
The `kapacitorctl cluster` command displays information about the connected Kapacitor cluster.

### `help`
The `kapacitorctl help` command outputs help information for a given command.

```bash
# Pattern
kapacitorctl help <command>

# Example
kapacitor help member
```
