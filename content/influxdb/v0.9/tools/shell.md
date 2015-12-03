---
title: Using the Influx Shell
aliases:
  - /docs/v0.9/clients/shell.html
---

The Influx shell is an interactive shell for InfluxDB, and is part of all InfluxDB distributions starting with the InfluxDB 0.9.0. The shell is not compatible with InfluxDB 0.8 and earlier. If you install InfluxDB via a package manager, the shell is installed at `/opt/influxdb/influx` (`/usr/local/bin/influx` on OS X).

## Shell Arguments

There are several arguments you can pass into the shell when starting.  You can list them by passing in `--help` to get the following results:

```sh
$ influx --help
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
      Password to connect to the server.  Leaving blank will prompt for password (--password '')
  -username 'username'
       Username to connect to the server.
  -execute 'command'
       Execute command and quit.
  -format 'json|csv|column'
       Format specifies the format of the server responses:  json, csv, or column.
  -pretty
       Turns on pretty print for the json format.

Examples:

    # Use influx in a non-interactive mode to query the database "metrics" and pretty print json
    $ influx -database 'metrics' -execute 'select * from cpu' -format 'json' -pretty

    # Dumping out your data
    $ influx  -database 'metrics' -dump

    # Connect to a specific database on startup and set database context
    $ influx -database 'metrics' -host 'localhost' -port '8086'
```

## Shell Commands

Once you have entered the shell, and successfully connecting to an InfluxDB node, you will see the following output:

```sh
$ influx
Connected to http://localhost:8086 version 0.9
InfluxDB shell 0.9
```

### Getting Help

To see a partial list of commands, you can type `help` and see the following:

```sh
> help
Usage:
        connect <host:port>   connect to another node
        auth                  prompt for username and password
        pretty                toggle pretty print
        use <db_name>         set current databases
        format <format>       set the output format: json, csv, or column
        settings              output the current settings for the shell
        exit                  quit the influx shell

        show databases        show database names
        show series           show series information
        show measurements     show measurement information
        show tag keys         show tag key information
        show tag values       show tag value information

        a full list of influxql commands can be found at:
        http://influxdb.com/docs
```

### connect

Connect allows you to connect to a different server without exiting the shell.

```sh
> connect localhost:8087
Connected to http://localhost:8087 version 0.9
```

You do not need specify both parts of the server.  For example,
if your current host is `localhost:8086`, the following command:

```sh
> connect :8087
```

will try to connect to `localhost:8087`.

If you specify only the `host` and not the `port`, port `8086` (the default port)
is always assumed.

### auth

The `auth` command will prompt you for a username and password,
and use those credentials when querying the database.

### settings

Settings will output the current state of the shell.

```sh
> settings
Host            localhost:8086
Username
Database        foo
Pretty          false
Format          csv
```

### Issuing Queries

For a complete reference to the query language, please read the [online documentation](/docs/v0.9/query_language/querying_data.html).

#### show databases

```sh
> show databases
name: databases
---------------
name
foo
```

#### Setting a default database to query from

You can set the `context` of all your queries in the CLI to a specific database with the `use` command.
This will allow you to not have to specify the database for each query.  They query engine will then default
to using the default retention policy for that database.

```sh
> use foo
Using database foo
> show tag keys
name: cpu
---------
tagKey


name: names
-----------
tagKey


name: sensor
------------
tagKey
```

### format

Format changes the format in which results are displayed in the shell.  Options
are `column`, `csv`, and `json`.  The default is `column`.

```sh
> format csv
> show databases
name,name
databases,foo
```

### pretty

Pretty will toggle formatting on the JSON results. This only applies when format
is set to `json`.

```sh
> format json
> pretty
Pretty print enabled
> show databases
{
    "results": [
        {
            "series": [
                {
                    "name": "databases",
                    "columns": [
                        "name"
                    ],
                    "values": [
                        [
                            "foo"
                        ]
                    ]
                }
            ]
        }
    ]
}
```

### exit

Exit will exit the shell

```sh
exit
```

### Executing with arguments

The CLI allows you to execute a query via arguments so you can run commands without having to be in interactive mode.

```sh
influx -execute="select * from cpu" -database=foo
name: cpu
---------
time                    value
2015-05-01T00:00:00Z    1.1
2015-05-01T08:00:00Z    1.2
2015-05-01T16:00:00Z    1.3
```

You can combine this with other arguments such as `-format` as well to get different outputs:

```sh
$ influx -execute="select * from cpu" -database=foo -format=csv
name,time,value
cpu,2015-05-01T00:00:00Z,1.1
cpu,2015-05-01T08:00:00Z,1.2
cpu,2015-05-01T16:00:00Z,1.3
```

```sh
$ influx -execute="select * from cpu" -database=foo -format=json
{"results":[{"series":[{"name":"cpu","columns":["time","value"],"values":[["2015-05-01T00:00:00Z",1.1],["2015-05-01T08:00:00Z",1.2],["2015-05-01T16:00:00Z",1.3],["2015-05-02T00:00:00Z",2.1],["2015-05-02T08:00:00Z",2.2],["2015-05-02T16:00:00Z",2.3],["2015-05-03T00:00:00Z",3.1],["2015-05-03T08:00:00Z",3.2],["2015-05-03T16:00:00Z",3.3],["2015-05-04T00:00:00Z",4.1],["2015-05-04T08:00:00Z",4.2],["2015-05-04T16:00:00Z",4.3]]}]}]}
```

```sh
$ influx -execute="select * from cpu" -database=foo -format=json -pretty=true
{
    "results": [
        {
            "series": [
                {
                    "name": "cpu",
                    "columns": [
                        "time",
                        "value"
                    ],
                    "values": [
                        [
                            "2015-05-01T00:00:00Z",
                            1.1
                        ],
                        [
                            "2015-05-01T08:00:00Z",
                            1.2
                        ],
                        [
                            "2015-05-01T16:00:00Z",
                            1.3
                        ]
                    ]
                }
            ]
        }
    ]
}
```

### Command History

The Influx shell stores that last 1,000 commands in you home directory in a file called `.influx_history`.  To use the history while in the shell, simply use the "up" arrow.
