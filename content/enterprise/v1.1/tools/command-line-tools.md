---
title: Command Line Tools
aliases:
    - /enterprise/v1.1/tools/cluster-commands/
menu:
  enterprise_1_1:
    weight: 0
    parent: Tools
---

Use command line tools like `influxd-ctl` and `influx` to interact with your
cluster and your data, respectively.

The `influxd-ctl` tool is specific to the InfluxEnterprise product.
The sections below document the `influxd-ctl` tool.
For information about the `influx` tool, please see the
[CLI/Shell](/influxdb/v1.1/tools/shell/) documentation for the open source
InfluxDB product.

### influxd-ctl

```
Usage: influxd-ctl [options] <command> [options] [<args>]
```

The available commands are:
```
add-data            Add a data node
add-meta            Add a meta node
backup              Backup a cluster
copy-shard          Copy a shard between data nodes
copy-shard-status   Show all active copy shard tasks
join                Join a meta or data node
kill-copy-shard     Abort an in-progress shard copy
leave               Remove a meta node
remove-data         Remove a data node
remove-meta         Remove a meta node
remove-shard        Remove a shard from a data node
restore             Restore a backup of a cluster
show                Show cluster members
show-shards         Shows the shards in a cluster
update-data         Update a data node
token               Generates a signed JWT token
truncate-shards     Truncate current shards
```

Options:
```
-auth-type string
    Type of authentication to use (none, basic, jwt) (default "none")
-bind string
    Bind HTTP address of a meta node (default "localhost:8091")
-bind-tls
    Use TLS
-config string
    Config file path
-k	Skip certficate verification (ignored without -bind-tls)
-pwd string
    Password (ignored without -auth-type jwt)
-secret string
    JWT shared secret (ignored without -auth-type jwt)
-user string
    User name (ignored without -auth-type basic | jwt)
```
