---
title: Clustering
menu:
  enterprise_1:
    weight: 0
    parent: Features
---

## Entitlements

A valid license key is not required in order to start `influxd-meta` or `influxd`.
License keys restrict the number of data nodes that can be added to a cluster as well as the number of CPU cores a data node can use.
Without a valid license, the process will abort startup.

## Query Management

Query management works cluster wide. Specifically, `SHOW QUERIES` and `KILL QUERY <ID>` on `"<host>"` can be run on any data node. `SHOW QUERIES` will report all queries running across the cluster and the node which is running the query.
`KILL QUERY` can abort queries running on the local node or any other remote data node.

## Subscriptions

Subscriptions used by Kapacitor work in a cluster. Writes to any node will be forwarded to subscribers across all supported subscription protocols.

## PProf Endpoints

The meta nodes now expose the /debug/pprof endpoints for profiling and troubleshooting.

## Shard Movement

* Copy Shard support - copy a shard from one node to another
* Copy Shard Status - query the status of a copy shard request
* Kill Copy Shard - kill a running shard copy
* Remove Shard - remove a shard from a node (this deletes data)
* Truncate Shards - truncate all active shard groups and start new shards immediately (This is useful when adding nodes or changing replication factors.)

This functionality is exposed via an API on the meta service and through `influxd-ctl` sub-commands.
The `control.Client` provides a Go client to access this functionality as well.

## OSS Conversion

Importing a OSS single server as the first data node is supported.
To import data and metadata from an existing OSS InfluxDB 0.13+ server, you need to first install the enterprise InfluxDB package on top of the OSS installation and then restart the server.
Add the modified server as the first data node in the cluster.
The cluster will import the meta store and data shards from the new node.
(Subsequent nodes will not import their existing meta store or data, only the first node added to a cluster will import existing meta store or data.)
Importing an OSS meta store will overwrite the existing cluster meta store so any existing databases, users, etc. will be overwritten.

## Query Routing

The query engine skips failed nodes that hold a shard needed for queries.
If there is a replica on another node, it will retry on that node.

## Features Under Development

HTTP API for performing all cluster and user management functions

## InfluxEnterprise Cluster commands

Use command line tools like `influxd-ctl` and `influx` to interact with your
cluster and your data, respectively.

```
$ influxd-ctl
Usage: influxd-ctl [options] <command> [options] [<args>]

Available commands are:
     add-data          Add a data node
     copy-shard        Copy a shard between data nodes
     copy-shard-status Show all active copy shard tasks
     join              Join a meta node
     kill-copy-shard   Abort an in-progress shard copy
     leave             Remove a meta node
     force-leave       Forcefully remove a meta node
     remove-data       Remove a data node
     remove-shard      Remove a shard from a data node
     show              Show cluster members
     show-shards       Shows the shards in a cluster
     update-data       Update a data node
     truncate-shards   Truncate current shards

Options:

    -bind string
          Bind HTTP address of a meta node (default "localhost:8091")
    -bind-tls
          Use TLS
    -config string
          Config file path

$ influx -help
Usage of influx:
  -version
       Display the version and exit.
  -host 'host name'
       Host to connect to.
  -port 'port #'
       Port to connect to.
  -database 'database name'
       Database to connect to the server.
  -password 'password'
       Password to connect to the server. Leaving blank will prompt for password (--password '').
  -username 'username'
       Username to connect to the server.
  -ssl
       Use https for requests.
  -unsafeSsl
       Set this when connecting to the cluster using https and not use SSL verification.
  -execute 'command'
       Execute command and quit.
  -format 'json|csv|column'
       Format specifies the format of the server responses: json, csv, or column.
  -precision 'rfc3339|h|m|s|ms|u|ns'
       Precision specifies the format of the timestamp: rfc3339, h, m, s, ms, u or ns.
  -consistency 'any|one|quorum|all'
       Set write consistency level: any, one, quorum, or all
  -pretty
       Turns on pretty print for the json format.
  -import
       Import a previous database export from file
  -pps
       How many points per second the import will allow. By default it is zero and will not throttle importing.
  -path
       Path to file to import
  -compressed
       Set to true if the import file is compressed

Examples:

    # Use influx in a non-interactive mode to query the database "metrics" and pretty print json:
    $ influx -database 'metrics' -execute 'select * from cpu' -format 'json' -pretty

    # Connect to a specific database on startup and set database context:
    $ influx -database 'metrics' -host 'localhost' -port '8086'
```
