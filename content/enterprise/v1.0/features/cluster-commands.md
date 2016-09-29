---
title: Cluster Commands
menu:
  enterprise_1_0:
    weight: 10
    parent: Features
---

Use command line tools like `influxd-ctl` and `influx` to interact with your
cluster and your data, respectively.

### influxd-ctl

```
Usage: influxd-ctl [options] <command> [options] [<args>]
```

The available commands are:
```
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
```

Options:
```
-bind string
      Bind HTTP address of a meta node (default "localhost:8091")
-bind-tls
      Use TLS
-config string
      Config file path
```

###  influx

Usage of influx:
```
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
```

Examples:

Use `influx` in a non-interactive mode to query the database `metrics` and pretty print json:
```
$ influx -database 'metrics' -execute 'select * from cpu' -format 'json' -pretty
```

Connect to a specific database on startup and set database context:
```
$ influx -database 'metrics' -host 'localhost' -port '8086'
```
