---
title: Cluster Commands
menu:
  enterprise_1_2:
    weight: 10
    parent: Features
---

Use the command line tools [`influxd-ctl`](#influxd-ctl) and [`influx`](#influx) to interact with your cluster and data.

#### Content

* [influxd-ctl](#influxd-ctl)
    * [Syntax](#syntax)
    * [Global options](#global-options)
    * [Arguments](#arguments)
        * [add-data](#add-data)
        * [add-meta](#add-meta)
        * [backup](#backup)
        * [copy-shard](#copy-shard)
        * [copy-shard-status](#copy-shard-status)
        * [join](#join)
        * [kill-copy-shard](#kill-copy-shard)
        * [leave](#leave)
        * [remove-data](#remove-data)
        * [remove-meta](#remove-meta)
        * [remove-shard](#remove-shard)
        * [restore](#restore)
        * [show](#show)
        * [show-shards](#show-shards)
        * [update-data](#update-data)
        * [token](#token)
        * [truncate-shards](#truncate-shards)
* [influx](#influx)
    

## influxd-ctl

The `influxd-ctl` tool is available on all [meta nodes](/enterprise/v1.2/concepts/glossary/#meta-node).
Use `influxd-ctl` to manage your cluster nodes, backup data, restore data, and rebalance your cluster.

### Syntax

```
influxd-ctl [global-options] <command> [arguments]
```

### Global Options

`-auth-type [ none | basic | jwt ]`  
&emsp;&emsp;&emsp;Specify the type of authentication to use. The default authentication type is `none`.

`-bind <hostname>:<port>`  
&emsp;&emsp;&emsp;Specify the bind HTTP address of a meta node to connect to. The default is `localhost:8091`.

`-bind-tls`  
&emsp;&emsp;&emsp;Use TLS.

`-config '<path-to-configuration-file>'`  
&emsp;&emsp;&emsp;Specify the path to the configuration file.

`-pwd <password>`  
&emsp;&emsp;&emsp;Specify the user’s password. This option is ignored if `-auth-type basic` isn’t specified.

`-k`  
&emsp;&emsp;&emsp;Skip certificate verification; use this option with a self-signed certificate. `-k` is ignored if `-bind-tls` isn't specified.

`-secret <JWT-shared-secret>`  
&emsp;&emsp;&emsp;Specify the JSON Web Token (JWT) shared secret. This option is ignored if `-auth-type jwt` isn't specified.

`-user <username>`  
&emsp;&emsp;&emsp;Specify the user’s username. This option is ignored if `-auth-type basic` isn’t specified.

### Examples of Global Options

The following examples use the tool's [`show` argument](#show).
See the [section below](#arguments) for more information about `influxd-ctl`'s arguments. 

#### Example 1: Bind to a remote meta node

```
$ influxd-ctl -bind meta-node-02:8091 show
```
The tool binds to the meta node with the hostname `meta-node-02` at port `8091`.
By default, the tool binds to the meta node with the hostname `localhost` at port `8091`.

#### Example 2: Authenticate with JWT

```
$ influxd-ctl -auth-type jwt -secret oatclusters show
```
The tool uses JWT authentication with the shared secret `oatclusters`.

If authentication is enabled in the cluster's [meta node configuration files](/enterprise/v1.2/administration/configuration/#auth-enabled-false) and [data node configuration files](/enterprise/v1.2/administration/configuration/#meta-auth-enabled-false) and the `influxd-ctl` command does not include authentication details, the system returns:
```
Error: unable to parse authentication credentials.
```

If authentication is enabled and the `influxd-ctl` command provides the incorrect shared secret, the system returns:
```
Error: signature is invalid.
```

#### Example 3: Authenticate with basic authentication

```
$ influxd-ctl -auth-type basic -user admini -pwd mouse show
```
The tool uses basic authentication for the cluster user `admini` with the password `mouse`.

If authentication is enabled in the cluster's [meta node configuration files](/enterprise/v1.2/administration/configuration/#auth-enabled-false) and [data node configuration files](/enterprise/v1.2/administration/configuration/#meta-auth-enabled-false) and the `influxd-ctl` command does not include authentication details, the system returns:
```
Error: unable to parse authentication credentials.
```

If authentication is enabled and the `influxd-ctl` command provides the incorrect username or password, the system returns:
```
Error: authorization failed.
```

### Arguments

#### add-data

Adds a data node to a cluster.
By default, `influxd-ctl` adds the specified data node to the local meta node's cluster.
Use `add-data` instead of the [`join` argument](#join) when performing a [Production Installation](/enterprise/v1.2/production_installation/data_node_installation/) of an InfluxEnterprise cluster.

```
add-data <data-node-TCP-bind-address>
```

Resources: [Production Installation](/enterprise/v1.2/production_installation/data_node_installation/)   

###### Examples
<br>
Example 1: Add a data node to a cluster using the local meta node

```
$ influxd-ctl add-data cluster-data-node:8088

Added data node 3 at cluster-data-node:8088
```

The command contacts the local meta node running at `localhost:8091` and adds a data node to that meta node's cluster.
The data node has the hostname `cluster-data-node` and runs on port `8088`.

Example 2: Add a data node to a cluster using a remote meta node

```
$ influxd-ctl -bind cluster-meta-node-01:8091 add-data cluster-data-node:8088

Added data node 3 at cluster-data-node:8088
```

The command contacts the meta node running at `cluster-meta-node-01:8091` and adds a data node to that meta node's cluster.
The data node has the hostname `cluster-data-node` and runs on port `8088`.

#### add-meta         

Adds a meta node to a cluster.
By default, `influxd-ctl` adds the specified meta node to the local meta node's cluster.
Use `add-meta` instead of the [`join` argument](#join) when performing a [Production Installation](/enterprise/v1.2/production_installation/meta_node_installation/) of an InfluxEnterprise cluster.
```
add-meta <meta-node-HTTP-bind-address>
```

Resources: [Production Installation](/enterprise/v1.2/production_installation/data_node_installation/)   

##### Examples
<br>
Example 1: Add a meta node to a cluster using the local meta node

```
$ influxd-ctl add-meta cluster-meta-node-03:8091

Added meta node 3 at cluster-meta-node:8091
```

The command contacts the local meta node running at `localhost:8091` and adds a meta node to that local meta node's cluster.
The added meta node has the hostname `cluster-meta-node-03` and runs on port `8091`.

Example 2: Add a meta node to a cluster using a remote meta node

```
$ influxd-ctl -bind cluster-meta-node-01:8091 add-meta cluster-meta-node-03:8091

Added meta node 3 at cluster-meta-node-03:8091
```

The command contacts the meta node running at `cluster-meta-node-01:8091` and adds a meta node to that meta node's cluster.
The added meta node has the hostname `cluster-meta-node-03` and runs on port `8091`.

#### backup           
  
Creates a backup of a cluster's [metastore](/influxdb/v1.2/concepts/glossary/#metastore) and [shard](/influxdb/v1.2/concepts/glossary/#shard) data at that point in time and stores the copy in the specified directory.
Backups are incremental by default; they create a copy of the metastore and shard data that have changed since the previous incremental backup.
If there are no existing incremental backups, the system automatically performs a complete backup.
```
backup [ -db <database> | -from <data-node-TCP-bind-address> | -full | -rp <retention-policy> | -shard <shard-id> ] <backup-directory>
```
Options:

`-db <database>`:  
&emsp;&emsp;&emsp;The name of the single database to back up.

`-from <data-node-TCP-address>`:  
&emsp;&emsp;&emsp;The TCP address of the target data node.

`-full`:  
&emsp;&emsp;&emsp;Perform a [full](/enterprise/v1.2/guides/backup-and-restore/#backup) backup. 

`-rp <retention-policy>`:  
&emsp;&emsp;&emsp;The name of the single [retention policy](/influxdb/v1.2/concepts/glossary/#retention-policy-rp) to back up (requires the `-db` flag).

`-shard <shard-id>`:   
&emsp;&emsp;&emsp;The ID of the single shard to back up.

> Restoring a `-full` backup and restoring an incremental backup require different syntax.
To prevent issues with [`restore`](#restore), keep `-full` backups and incremental backups in separate directories.

<dt> In versions 1.2.0 and 1.2.1, there is a known issue with restores from a backup directory
that stores several **different** incremental backups.
For a [restore](#restore) to function properly, incremental backups that specify different
options (for example: they specify a different database with `-db` or a
different retention policy with `-rp`) must be stored in different directories.
If a single backup directory stores several different incremental backups, a
restore only restores the most recent incremental backup.
This issue is fixed in version 1.2.2.
</dt>

Resources: [Backup and Restore](/enterprise/v1.2/guides/backup-and-restore/)

##### Examples
<br>
Example 1: Perform an incremental backup

```
$ influxd-ctl backup .
```

Output:
```
Backing up meta data... Done. 421 bytes transferred
Backing up node cluster-data-node:8088, db telegraf, rp autogen, shard 4... Done. Backed up in 903.539567ms, 307712 bytes transferred
Backing up node cluster-data-node:8088, db _internal, rp monitor, shard 1... Done. Backed up in 138.694402ms, 53760 bytes transferred
Backing up node cluster-data-node:8088, db _internal, rp monitor, shard 2... Done. Backed up in 101.791148ms, 40448 bytes transferred
Backing up node cluster-data-node:8088, db _internal, rp monitor, shard 3... Done. Backed up in 144.477159ms, 39424 bytes transferred
Backed up to . in 1.293710883s, transferred 441765 bytes

$ ls
20160803T222310Z.manifest  20160803T222310Z.s1.tar.gz  20160803T222310Z.s3.tar.gz
20160803T222310Z.meta      20160803T222310Z.s2.tar.gz  20160803T222310Z.s4.tar.gz
```

The command performs an incremental backup and stores it in the current directory.
If there are any existing backups the current directory, the system performs an incremental backup.
If there aren’t any existing backups in the current directory, the system performs a complete backup of the cluster.

Example 2: Perform a full backup

```
$ influxd-ctl backup -full backup_dir
```

Output:
```
Backing up meta data... Done. 481 bytes transferred
Backing up node cluster-data-node:8088, db _internal, rp monitor, shard 1... Done. Backed up in 33.207375ms, 238080 bytes transferred
Backing up node cluster-data-node:8088, db telegraf, rp autogen, shard 2... Done. Backed up in 15.184391ms, 95232 bytes transferred
Backed up to backup_dir in 51.388233ms, transferred 333793 bytes

~# ls backup_dir
20170130T184058Z.manifest
20170130T184058Z.meta
20170130T184058Z.s1.tar.gz
20170130T184058Z.s2.tar.gz
```

The command performs a full backup of the cluster and stores the backup in the existing directory `backup_dir`.

#### copy-shard       

Copies a [shard](/influxdb/v1.2/concepts/glossary/#shard) from a source data node to a destination data node.
```
copy-shard <data-node-source-TCP-address> <data-node-destination-TCP-address> <shard-id>
```

Resources: [Cluster Rebalance](/enterprise/v1.2/guides/rebalance/) 

##### Examples
<br>
Example 1: Copy a shard from one data node to another data node

```
$ influxd-ctl copy-shard cluster-data-node-01:8088 cluster-data-node-02:8088 22'

Copied shard 22 from cluster-data-node-01:8088 to cluster-data-node-02:8088
```

The command copies the shard with the id `22` from the data node running at `cluster-data-node-01:8088` to the data node running at `cluster-data-node-02:8088`.

#### copy-shard-status

Shows all in-progress [copy shard](#copy-shard) operations, including the shard's source node, destination node, database, [retention policy](/influxdb/v1.2/concepts/glossary/#retention-policy-rp), shard id, total size, current size, and the operation's start time.
```
copy-shard-status
```

##### Examples
<br>
Example 1: Show all in-progress copy-shard operations

```
$ influxd-ctl copy-shard-status

Source                     Dest                       Database  Policy   ShardID  TotalSize  CurrentSize  StartedAt
cluster-data-node-02:8088  cluster-data-node-03:8088  telegraf  autogen  34       119624324  119624324    {63624516464 596207779 12108032}
```

The command returns one in-progress copy-shard operation.
The system is copying shard `34` from `cluster-data-node-02:8088` to `cluster-data-node-03:8088`.
Shard `34` is associated with the `telegraf` database and the `autogen` retention policy.
The `TotalSize` and `CurrentSize` columns are reported in bytes.

#### join             

Joins a meta node and/or data node to a cluster.
By default, `influxd-ctl` joins the local meta node and/or data node into a new cluster.
Use `join` instead of the [`add-meta`](#add-meta) or [`add-data`](#add-data) arguments when performing a [QuickStart Installation](/enterprise/v1.2/quickstart_installation/cluster_installation/) of an InfluxEnterprise cluster.
```
join [-v] [<meta-node-HTTP-bind-address>]
```

Options:

`-v`  
&emsp;&emsp;&emsp;Prints verbose information about the join.

`meta-node-HTTP-bind-address`  
&emsp;&emsp;&emsp;The address of a meta node in an existing cluster.
Use this option to add the un-joined meta node and/or data node to an existing cluster.

Resources: [QuickStart Installation](/enterprise/v1.2/quickstart_installation/cluster_installation/)

##### Examples
<br>
Example 1: Join a meta and data node into a cluster

```
$ influxd-ctl join

Joining meta node at localhost:8091
Searching for meta node on cluster-node-03:8091...
Searching for data node on cluster-node-03:8088...

Successfully created cluster

  * Added meta node 1 at cluster-node-03:8091
  * Added data node 2 at cluster-node-03:8088

  To join additional nodes to this cluster, run the following command:

  influxd-ctl join cluster-node-03:8091
```

The command joins the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` into a new cluster.

Example 2: Join a meta and data node to an existing cluster

```
$ influxd-ctl join cluster-meta-node-02:8091

Joining meta node at cluster-meta-node-02:8091
Searching for meta node on cluster-node-03:8091...
Searching for data node on cluster-node-03:8088...

Successfully joined cluster

  * Added meta node 3 at cluster-node-03:8091
  * Added data node 4 at cluster-node-03:8088
```

The command joins the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` to an existing cluster.
The existing cluster includes the meta node running at `cluster-meta-node-02:8091`.
 
Example 3: Join a meta node to an existing cluster

```
$ influxd-ctl join cluster-meta-node-02:8091

Joining meta node at cluster-meta-node-02:8091
Searching for meta node on cluster-meta-node-03:8091...
Searching for data node on cluster-meta-node-03:8088...

Successfully joined cluster

  * Added meta node 18 at cluster-meta-node-03:8091
  * No data node added.  Run with -v to see more information
```

The command joins the meta node running at `cluster-meta-node-03:8091` to an existing cluster.
The existing cluster includes the meta node running at `cluster-meta-node-02:8091`.
The system doesn't join a data node to the cluster because it doesn't find a data node at `cluster-meta-node-03:8088`.

Example 4: Join a meta node to an existing cluster and show detailed information about the join

```
$ influxd-ctl join -v meta-node-02:8091

Joining meta node at meta-node-02:8091
Searching for meta node on meta-node-03:8091...
Searching for data node on data-node-03:8088...

No data node found on data-node-03:8091!

  If a data node is running on this host,
  you may need to add it manually using the following command:

  influxd-ctl -bind meta-node-02:8091 add-data <dataAddr:port>

  Common problems:

    * The influxd process is using a non-standard port (default 8088)
    * The influxd process it not running.  Check the logs for startup errors

Successfully joined cluster

  * Added meta node 18 at meta-node-03:8091
  * No data node added.  Run with -v to see more information
```

The command joins the meta node running at `cluster-meta-node-03:8091` to an existing cluster.
The existing cluster includes the meta node running at `cluster-meta-node-02:8091`.
The `-v` option prints detailed information about the join.

#### kill-copy-shard  

Aborts an in-progress [`copy-shard`](#copy-shard) command.
```
kill-copy-shard <data-node-source-TCP-address> <data-node-destination-TCP-address> <shard-id>
```

##### Examples
<br>
Example 1: Stop an in-progress copy-shard command

```
$ influxd-ctl kill-copy-shard cluster-data-node-02:8088 cluster-data-node-03:8088 39

Killed shard copy 39 from cluster-data-node-02:8088 to cluster-data-node-03:8088
```

The command aborts the `copy-shard` command that was copying shard `39` from `cluster-data-node-02:8088` to `cluster-data-node-03:8088`.

#### leave            

Removes a meta node and/or data node from the cluster.
Use `leave` instead of the [`remove-meta`](#remove-meta) and [`remove-data`](#remove-data) arguments if you set up your InfluxEnterprise cluster with the [QuickStart Installation](/enterprise/v1.2/quickstart_installation/cluster_installation/) process.

<dt>The `leave` argument is destructive; it erases all metastore information from meta nodes and all data from data nodes.
Use `leave` only if you want to *permanently* remove a node from a cluster.</dt>

```
leave [-y]
```

Options:

`-y`  
&emsp;&emsp;&emsp;Assume yes (`y`) to all prompts.

##### Examples
<br>
Example 1: Remove a meta and data node from a cluster

```
$ influxd-ctl leave

Searching for data node on cluster-node-03:8088...
Remove data node cluster-node-03:8088 from the cluster [y/N]: y
Removed cluster-node-03:8088 from the cluster
Searching for meta node on cluster-node-03:8091...
Remove meta node cluster-node-03:8091 from the cluster [y/N]: y

Successfully left cluster

  * Removed data node cluster-node-03:8088 from cluster
  * Removed meta node cluster-node-03:8091 from cluster
```

The command removes the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` from an existing cluster.
Here, we respond yes (`y`) to the two prompts that ask if we'd like to remove the data node and if we'd like to remove the meta node from the cluster.

Example 2: Remove a meta and data node from a cluster and assume yes to all prompts

```
$ influxd-ctl leave -y

Searching for data node on cluster-node-03:8088...
Removed cluster-node-03:8088 from the cluster
Searching for meta node on cluster-node-03:8091...

Successfully left cluster

  * Removed data node cluster-node-03:8088 from cluster
  * Removed meta node cluster-node-03:8091 from cluster
```

The command removes the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` from an existing cluster.
Because we specify the `-y` option, the system assumes that we'd like to remove both the data node and meta node from the cluster and does not prompt us for responses.

Example 3: Remove a meta node from a cluster

```
$ influxd-ctl leave

Searching for data node on cluster-meta-node-03:8088...
  * No data node found.
Searching for meta node on cluster-meta-node-03:8091...
Remove meta node cluster-meta-node-03:8091 from the cluster [y/N]: y

Successfully left cluster

  * No data node removed from cluster
  * Removed meta node cluster-meta-node-03:8091 from cluster
```

The command removes the meta node running at `cluster-meta-node-03:8091` from an existing cluster.
The system doesn't remove a data node from the cluster because it doesn't find a data node running at `cluster-meta-node-03:8088`.

#### remove-data      

Removes a data node from a cluster.
Use `remove-data` instead of the [`leave`](#leave) argument if you set up your InfluxEnterprise cluster with the [Production Installation](/enterprise/v1.2/production_installation/) process.

<dt>The `remove-data` argument is destructive; it erases all data from the specified data node.
Use `remove-data` only if you want to *permanently* remove a data node from a cluster.</dt>

```
remove-data [-force] <data-node-TCP-bind-address>
```

Options:

`-force`  
&emsp;&emsp;&emsp;Forces the removal of the data node.
Use `-force` if the data node process is not running.

##### Examples
<br>
Example 1: Remove a data node from a cluster

```
~# influxd-ctl remove-data cluster-data-node-03:8088
Removed data node at cluster-data-node-03:8088
```
The command removes a data node running at `cluster-data-node-03:8088` from an existing cluster.

#### remove-meta      

Removes a meta node from the cluster.
Use `remove-meta` instead of the [`leave`](#leave) argument if you set up your InfluxEnterprise cluster with the [Production Installation](/enterprise/v1.2/production_installation/) process.

<dt>The `remove-meta` argument is destructive; it erases all metastore information from the specified meta node.
Use `remove-meta` only if you want to *permanently* remove a meta node from a cluster.</dt>

```
remove-meta [-force | -tcpAddr <meta-node-TCP-bind_address> | -y] <meta-node-HTTP-bind-address>
```

Options:

`-force`  
&emsp;&emsp;&emsp;Forces the removal of the meta node.
Use `-force` if the meta node process if not running, and the node is not reachable and unrecoverable.
If a meta node restarts after being `-force` removed, it may interfere with the cluster.
This options requires the `-tcpAddr` option.

`-tcpAddr <meta-node-TCP-bind_address>`  
&emsp;&emsp;&emsp;The TCP address of the meta node to remove from the cluster.
Use this option with the `-force` option.

`-y`  
&emsp;&emsp;&emsp;Assumes `Yes` to all prompts.

##### Examples
<br>

Example 1: Remove a meta node from a cluster
```
$ influxd-ctl remove-meta cluster-meta-node-02:8091

Remove cluster-meta-node-02:8091 from the cluster [y/N]: y
y

Removed meta node at cluster-meta-node-02:8091 
```

The command removes the meta node at `cluster-meta-node-02:8091` from an existing cluster.
In the example, we respond yes (`y`) to the prompt that asks if we'd like to remove the meta node from the cluster.

Example 2: Force remove an unresponsive meta node from a cluster
```
$ influxd-ctl remove-meta -force -tcpAddr cluster-meta-node-02:8089 cluster-meta-node-02:8091

Force remove cluster-meta-node-02:8091 from the cluster [y/N]:y
y

Removed meta node at cluster-meta-node-02:8091
```

The command force removes the meta node running at the TCP address `cluster-meta-node-02:8089` and HTTP address `cluster-meta-node-02:8091` from the cluster.
In the example, we respond yes (`y`) to the prompt that asks if we'd like to force remove the meta node from the cluster.
Note that if the meta node at `cluster-meta-node-02:8091` restarts, it may interfere with the cluster.
Only perform a force removal of a meta node if the node is not reachable and unrecoverable.

#### remove-shard     

Removes a shard from a data node.
Removing a shard is an irrecoverable, destructive action; please be cautious with this command.
```
remove-shard <data-node-source-TCP-address> <shard-id>
```

Resources: [Cluster Rebalance](/enterprise/v1.2/guides/rebalance/)

##### Examples
<br>
Example 1:
```
~# influxd-ctl remove-shard cluster-data-node-02:8088 31

Removed shard 31 from cluster-data-node-02:8088
```

The command removes shard `31` from the data node running at `cluster-data-node-02:8088`.

#### restore          

Restore a [backup](#backup) to an existing cluster or a new cluster.
Note that he existing cluster must contain no data in the databases affected by the restore.
Restore supports both full backups and incremental backups; the syntax for a restore differs depending on the backup type.

```
restore [ -db <database> | -full | -list | -newdb <new-database> | -newrf <int> | -newrp <retention-policy> | -rp <retention policy | shard <shard-id> ] ( <path-to-backup-manifest-file> | <path-to-backup-directory> )
```

The restore command must specify either the `path-to-backup-manifest-file` or the `path-to-backup-directory`.
If the restore uses the `-full` option, specify the `path-to-backup-manifest-file`.
If the restore doesn't use the `-full` option, specify the `path-to-backup-directory`.

Options:

`-db <string>`  
&emsp;&emsp;&emsp;The name of the single database to restore.

`-full`  
&emsp;&emsp;&emsp;Restore a backup that was created with the `-full` flag.
A restore command with the `-full` flag requires the `path-to-backup-manifest-file`.

`-list`  
&emsp;&emsp;&emsp;Show the contents of the backup.

`-newdb <string>`  
&emsp;&emsp;&emsp;The name of the new database to restore to (must specify with `-db`).

`-newrf <int>`  
&emsp;&emsp;&emsp;The new [replication factor](/influxdb/v1.2/concepts/glossary/#replication-factor) to restore to (this is capped to the number of data nodes in the cluster).

`-newrp <string>`  
&emsp;&emsp;&emsp;The name of the new [retention policy](/influxdb/v1.2/concepts/glossary/#retention-policy-rp) to restore to (must specify with `-rp`).

`-rp <string>`  
&emsp;&emsp;&emsp;The name of the single retention policy to restore.

`-shard <unit>`  
&emsp;&emsp;&emsp;The [shard](/influxdb/v1.2/concepts/glossary/#shard) ID to restore.

Resources: [Backup and Restore](/enterprise/v1.2/guides/backup-and-restore/#restore)

<dt>
In versions 1.2.0 and 1.2.1, a restore without the `-full` option requires users to `cd` into the backup directory and run `influxd-ctl restore [options] .` from that directory. This issue is fixed in version 1.2.2.
</dt>

##### Examples
<br>
Example 1: Restore from an incremental backup

```
$ influxd-ctl restore my-incremental-backup/

Using backup directory: my-incremental-backup/
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 21.373019ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 61.046571ms, 588800 bytes transferred
Restored from my-incremental-backup/ in 83.892591ms, transferred 588800 bytes
```

The command restores an incremental backup stored in the `my-incremental-backup/` directory.

Example 2: Restore from a full backup

```
$ influxd-ctl restore -full my-full-backup/20170131T020341Z.manifest

Using manifest: my-full-backup/20170131T020341Z.manifest
Restoring meta data... Done. Restored in 9.585639ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 48.095082ms, 569344 bytes transferred
Restored from my-full-backup in 58.58301ms, transferred 569344 bytes
```

The command restores a full backup that includes the manifest file at `my-full-backup/20170131T020341Z.manifest`.

#### show             

Shows all [meta nodes](/enterprise/v1.2/concepts/glossary/#meta-node) and [data nodes](/enterprise/v1.2/concepts/glossary/#data-node) that are part of the cluster.
The output includes the InfluxEnterprise version number.
```
show
```

##### Examples
<br>

Example 1: Show all meta and data nodes in a cluster

```
$ influxd-ctl show

Data Nodes
==========
ID	 TCP Address		        Version
2   cluster-node-01:8088	1.2.4-c1.2.5
4   cluster-node-02:8088	1.2.4-c1.2.5

Meta Nodes
==========
TCP Address		        Version
cluster-node-01:8091	1.2.4-c1.2.5
cluster-node-02:8091	1.2.4-c1.2.5
cluster-node-03:8091	1.2.4-c1.2.5
```

The output shows that the cluster includes three meta nodes and two data nodes.
Every node is using InfluxEnterprise version `1.2.4-c1.2.5`.

#### show-shards      

Shows the cluster's existing [shards](/influxdb/v1.2/concepts/glossary/#shard), including the shard's id, database, [retention policy](/influxdb/v1.2/concepts/glossary/#retention-policy-rp), desired number of copies, [shard group](/influxdb/v1.2/concepts/glossary/#shard-group), start time, end time, expiry time and [data node](/enterprise/v1.2/concepts/glossary/#data-node) owners.
```
show-shards
```

##### Examples
<br>

Example 1: Show the existing shards in a cluster

```
$ influxd-ctl show-shards

Shards
==========
ID  Database             Retention Policy  Desired Replicas  Shard Group  Start                 End                              Expires               Owners
51  telegraf             autogen           2                 37           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
52  telegraf             autogen           2                 37           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{5 cluster-data-node-02:8088} {26 cluster-data-node-01:8088}]
```

The output shows that there are two shards in the cluster.
The first shard has an id of `51` and it's in the `telegraf` database and the `autogen` retention policy.
The desired number of copies for shard `51` is `2` and it belongs to shard group `37`.
The data in shard `51` cover the time range between `2017-03-13T00:00:00Z` and `2017-03-20T00:00:00Z`, and the shard has no expiry time; `telegraf`'s `autogen` retention policy has an infinite duration so the system never removes shard `51`.
Finally, shard `51` appears on two data nodes: `cluster-data-node-01:8088` and `cluster-data-node-03:8088`.

#### update-data      

Updates a data node's address in the [meta store](/enterprise/v1.2/concepts/glossary/#meta-service).
```
update-data <data-node-old-TCP-bind-address> <data-node-new-TCP-bind-address>
```

##### Examples
<br>

Example 1: Update a data node's hostname

```
$ influxd-ctl update-data cluster-node-01:8088 cluster-data-node-01:8088

updated data node 26 to cluster-data-node-01:8088
```

The command updates the address for data node `26` from `cluster-node-01:8088` to `cluster-data-node-01:8088`.

#### token            

Generates a signed JSON Web Token (JWT) token.
The token argument only works when using JWT authentication in the cluster and when using the [`-auth-type jwt`](#global-options) and [`-secret <shared-secret>`](#global-options) flags.

```
token [-exp <duration>]
```

Options:

`-exp`  
&emsp;&emsp;&emsp;Determines the time after which the token expires.
By default, the token expires after one minute.

##### Examples
<br>

Example 1: Create a signed JWT token

```
$ influxd-ctl -auth-type jwt -secret oatclusters token

hereistokenisitgoodandsoareyoufriend.timingisaficklefriendbutwherewouldwebewithoutit.timingthentimeseriesgood-wevemadetheleap-nowletsgetdownanddataandqueryallourheartsout
```

The command returns a signed JWT token.

Example 2: Attempt to create a signed JWT token with basic authentication

```
$ influxd-ctl -auth-type basic -user admini -pwd mouse token

token: tokens can only be created when using bearer authentication
```

The command returns an error because the command doesn't use JWT authentication.

#### truncate-shards  

Truncates hot [shards](/influxdb/v1.2/concepts/glossary/#shard), that is, shards that cover the time range that includes the current time ([`now()`](/influxdb/v1.2/concepts/glossary/#now)).
`truncate-shards` creates a new shard and the system writes all new points to that shard.

```
truncate-shards [-delay <duration>]
```

Options:

`-delay <duration>`  
&emsp;&emsp;&emsp;Determines when to truncate shards after [`now()`](/influxdb/v1.2/concepts/glossary/#now).
By default, the tool sets the delay to one minute.
The `duration` is an integer followed by a [duration unit](/influxdb/v1.2/query_language/spec/#durations).

Resources: [Cluster Rebalance](/enterprise/v1.2/guides/rebalance/)

##### Examples
<br>
Example 1: Truncate shards with the default delay time

```
$ influxd-ctl truncate-shards

Truncated shards.

$ influxd-ctl show-shards

Shards
==========
ID  Database             Retention Policy  Desired Replicas  Shard Group  Start                 End                              Expires               Owners
51  telegraf             autogen           2                 37           2017-03-13T00:00:00Z  2017-03-13T20:40:15.753443255Z*                        [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
54  telegraf             autogen           2                 38           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
```

After running `influxd-ctl truncate-shards` and waiting one minute, the output of the [`influxd-ctl show-shards` command](#show-shards) shows that the system truncated shard `51` (truncated shards have an asterix (`*`) on the timestamp in the `End` column) and created the new shard with the id `54`.

Example 2: Truncate shards with a user-provided delay timestamp


```
$ influxd-ctl truncate-shards -delay 3m

Truncated shards.

$ influxd-ctl show-shards

Shards
==========
ID  Database             Retention Policy  Desired Replicas  Shard Group  Start                 End                              Expires               Owners
54  telegraf             autogen           2                 38           2017-03-13T00:00:00Z  2017-03-13T20:59:14.665827038Z*                        [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
58  telegraf             autogen           2                 40           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
```

After running `influxd-ctl truncate-shards` and waiting three minutes, the output of the [`influxd-ctl show-shards` command](#show-shards) shows that the system truncated shard `54` (truncated shards have an asterix (`*`) on the timestamp in the `End` column) and created the new shard with the id `58`.

## influx

The `influx` tool, also known as the Command Line Interface (CLI), is available on all [data nodes](/enterprise/v1.2/concepts/glossary/#data-node).
Use `influx` to write data to your cluster, query data interactively, and view query output in different formats.

The complete description of the `influx` tool is available in the [OSS InfluxDB documentation](/influxdb/v1.2/tools/shell/).
