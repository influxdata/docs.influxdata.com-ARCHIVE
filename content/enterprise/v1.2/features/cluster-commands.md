---
title: Cluster Commands
menu:
  enterprise_1_2:
    weight: 10
    parent: Features
---

Use the command line tools [`influxd-ctl`](#influxd-ctl) and [`influx`](#influx) to interact with your cluster and data.

## influxd-ctl

The `influxd-ctl` tool is available on all [meta nodes](/enterprise/v1.2/concepts/glossary/#meta-node).
Use `influxd-ctl` to manage your cluster nodes, backup data, restore data, and rebalance your cluster.

### Syntax

```
influxd-ctl [options] <command> [arguments]
```

### Description of Syntax

#### influxd-ctl options

`-auth-type [none | basic | jwt]`  
&emsp;&emsp;&emsp;Specify the type of authentication to use. The default authentication type is `none`.

`-bind <hostname>:<port>`  
&emsp;&emsp;&emsp;Specify the bind HTTP address of a meta node to connect to. The default is `localhost:8091`.

`-bind-tls`  
&emsp;&emsp;&emsp;Use TLS.

`-config '<path-to-configuration-file>'`  
&emsp;&emsp;&emsp;Specify the path to the configuration file.

`-k`  
&emsp;&emsp;&emsp;Skip certificate verification; use this option a self-signed certificate. `-k` is ignored if `-bind-tls` isn't specified.

`-pwd <password>`  
&emsp;&emsp;&emsp;Specify the user's password. This option is ignored if `-auth-type basic` isn't specified.

`-secret <JWT-shared-secret>`  
&emsp;&emsp;&emsp;Specify the JWT shared secret. This option is ignored if `-auth-type jwt` isn't specified.

`-user <username>`  
&emsp;&emsp;&emsp;Specify the user's username. This option is ignored if `-auth-type basic` isn't specified.


#### influxd-ctl commands and arguments

##### add-data
<br>
Adds a data node to the cluster.
See the [Production Installation](/enterprise/v1.2/production_installation/data_node_installation/) guide for more information.
```
add-data <TCP-bind-address>
```

##### add-meta         
<br>
Adds a meta node to the cluster.
See the [Production Installation](/enterprise/v1.2/production_installation/meta_node_installation/) guide for more information.
```
add-meta <TCP-bind-address>
```

##### backup           
<br>
Creates a backup of a cluster.
Please see the [Backup and Restore](/enterprise/v1.2/guides/backup-and-restore/) guide for more information.
```
backup [ -db <database> | -from <TCP-bind-address> | -full | -rp <retention-policy> | -shard <shard-id> ] <backup-directory>
```

##### copy-shard       
<br>
Copies a shard from a source data node to a destination data node.
Please see the [Cluster Rebalance](/enterprise/v1.2/guides/rebalance/) guide for more information.
```
copy-shard <source-TCP-address> <destination-TCP-address> <shard-id>
```

##### copy-shard-status
<br>
Shows all in-progress copy shard operations, including the relevant shard's source node, destination node, database, retention policy, shard id, total size, current size, and the operation's start time.
```
copy-shard-status
```

##### join             
<br>
Joins a meta node or data node to the cluster.
Use this `join` option instead of the `add-meta` or `add-data` commands when performing a [QuickStart Installation](/enterprise/v1.2/quickstart_installation/cluster_installation/) of an InfluxEnterprise cluster.
```
join [-v] <TCP-bind-address>
```
`-v` prints verbose information when joining.

##### kill-copy-shard  
<br>
Aborts an in-progress `copy-shard` command.
```
kill-copy-shard <source-TCP-address> <destination-TCP-address> <shard-id>
```

##### leave            
<br>
Removes a meta node from the cluster.
```
leave [-y]
```
`-y` assumes `Yes` to all prompts.

##### remove-data      
<br>
Removes a data node from the cluster.
```
remove-data [-force] <TCP-bind-address>
```
`-force` forces the removal of the data node.
Use `-force` if the data node is down.

##### remove-meta      
<br>
Removes a meta node from the cluster.
```
remove-meta <TCP-bind-address> [-force | -tcpAddr <TCP-bind_address> | -y]
```
* `-force` forces the removal of the meta node. Use `-force` if the meta node is down.
* `-y` assumes `Yes` to all prompts.

##### remove-shard     
<br>
Removes a shard from a data node.
Please see the [Cluster Rebalance](/enterprise/v1.2/guides/rebalance/) guide for more information.
```
remove-shard <source-TCP-address> <shard-id>
```

##### restore          
<br>
Restores an existing backup of a cluster.
Please see the [Backup and Restore](/enterprise/v1.2/guides/backup-and-restore/) guide for more information.
```
restore [ -db <database> | -full | -list | -newdb <new-database> | -newrf <int> | -newrp <retention-policy> | -rp <retention policy | shard <shard-id> ] ( <path-to-backup-manifest-file> | <path-to-backup-directory> )
```

##### show             
<br>
Shows all meta nodes and data nodes that are part of the cluster.
```
show
```

##### show-shards      
<br>
Shows the cluster's existing shards, including the shard id, database, retention policy, shard group, start time, end time, expiry time, and data node owners.
```
show-shards
```

##### update-data      
<br>
Updates a data node's address in the [meta store](/enterprise/v1.2/concepts/glossary/#meta-service).
```
update-data <old-TCP-bind-address> <new-TCP-bind-address>
```

##### token            
<br>
Generates a signed JWT token.
```
token [-exp <duration>]
```
`-exp` determines the time after which the token expires.
By default, the token expires after one minute.

##### truncate-shards  
<br>
Truncates hot shards.
Please see the [Cluster Rebalance](/enterprise/v1.2/guides/rebalance/) guide for more information.
```
truncate-shards [-delay <duration>]
```
`-delay` determines when to truncate shards after [`now()`](/influxdb/v1.2/concepts/glossary/#now).
By default, the delay is set to one minute.

## influx

The `influx` tool, also known as the Command Line Interface (CLI), is available on all [data nodes](/enterprise/v1.2/concepts/glossary/#data-node).
Use `influx` to write data to your cluster, query data interactively, and view query output in different formats.

The complete description of the `influx` tool is available in the [InfluxDB documentation](/influxdb/v1.2/tools/shell/).
