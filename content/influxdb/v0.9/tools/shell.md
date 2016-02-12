---
title: InfluxDB CLI/Shell

menu:
  influxdb_09:
    weight: 0
    parent: tools
---

The InfluxDB's command line interface (`influx`) is an interactive shell for the database, and is part of all InfluxDB distributions starting with version 0.9.0.
Use `influx` to write data (manually or from a file), query data interactively, and view query output in different formats.

* [Launch `influx`](/influxdb/v0.9/tools/shell/#launch-influx)
* [`influx` Arguments](/influxdb/v0.9/tools/shell/#influx-arguments)
* [`influx` Commands](/influxdb/v0.9/tools/shell/#influx-commands)

## Launch `influx`
If you [install](https://influxdata.com/downloads/) InfluxDB via a package manager, the CLI is installed at `/usr/bin/influx` (`/usr/local/bin/influx` on OS X).

Access the CLI by starting the `influxd` process and entering `influx` in your terminal.
Once you've entered the shell and successfully connected to an InfluxDB node, you'll see the following output:
<br>
<br>
```bash
$ influx
Connected to http://localhost:8086 version 0.9.x
InfluxDB shell 0.9.x
```

## `influx` Arguments
There are several arguments you can pass into `influx` when starting.
List them with `$ influx --help`.
The list below offers a brief discussion of each option.
We provide detailed information on `-execute`, `-format`, and `-import` at the end of this section.

`-compressed`  
Set to true if the import file is compressed.
Use with `-import`.

`-consistency 'any|one|quorum|all'`  
Set the write consistency level.

`-database 'database name'`  
The database to which `influx` connects.

`-execute 'command'`  
Execute an [InfluxQL](/influxdb/v0.9/query_language/data_exploration/) command and quit.
See [-execute](/influxdb/v0.9/tools/shell/#execute-an-influxql-command-and-quit-with-execute).

`-format 'json|csv|column'`  
Specifies the format of the server responses.
See [-format](/influxdb/v0.9/tools/shell/#specify-the-format-of-the-server-responses-with-format).

`-host 'host name'`  
The host to which `influx` connects.
By default, InfluxDB runs on localhost.

`-import`  
Import new data from a file or import a previously [exported](https://github.com/influxdb/influxdb/blob/master/importer/README.md) database from a file.
See [-import](/influxdb/v0.9/tools/shell/#import-data-from-a-file-with-import).

`-password 'password'`  
The password `influx` uses to connect to the server.
`influx` will prompt for a password if you leave it blank (`-password ''`).

`-path`  
The path to the file to import.
Use with `-import`.

`-port 'port #'`  
The port to which `influx` connects.
By default, InfluxDB runs on port `8086`.

`-pps`  
How many points per second the import will allow.
By default, pps is zero and influx will not throttle importing.
Use with `-import`.

`-precision 'rfc3339|h|m|s|ms|u|ns'`  
Specifies the format/precision of the timestamp: `rfc3339` (`YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`), `h` (hours), `m` (minutes), `s` (seconds), `ms` (milliseconds), `u` (microseconds), `ns` (nanoseconds).
Precision defaults to nanoseconds.

> **Note:** Setting the precision to `rfc3339` (`-precision rfc3339`) only works with the `-execute` option.
It does not work with the `-import` option.
It also doesn't change the format of the timestamps displayed in the `influx` shell.
To change the format of the `influx` shell's timestamps to `rfc3339`, see [influx Commands](/influxdb/v0.9/tools/shell/#influx-commands).
All other precision formats (e.g.
`h`,`m`,`s`,`ms`,`u`, and `ns`) work with the `-execute` and `-import` options, and they'll change the format of the timestamps displayed in the `influx` shell.

`-pretty`  
Turns on pretty print for the `json` format.

`-ssl`  
Use https for requests.

`-username 'username'`  
The username `influx` uses to connect to the server.

`-version`  
Display the InfluxDB version and exit.

### Execute an InfluxQL command and quit with `-execute`
Execute queries that don't require a database specification:
```bash
$ influx -execute 'SHOW DATABASES'
name: databases
---------------
name
NOAA_water_database
_internal
telegraf
pirates
```

Execute queries that do require a database specification, and change the timestamp precision:
```bash
$ influx -execute 'SELECT * FROM h2o_feet LIMIT 3' -database=NOAA_water_database -precision=rfc3339
name: h2o_feet
--------------
time			               level description	    location	     water_level
2015-08-18T00:00:00Z	 below 3 feet		        santa_monica	 2.064
2015-08-18T00:00:00Z	 between 6 and 9 feet  coyote_creek  8.12
2015-08-18T00:06:00Z	 between 6 and 9 feet  coyote_creek  8.005
```

### Specify the format of the server responses with `-format`
The default format is `column`:
```bash
$ influx -format=column
[...]
> SHOW DATABASES
name: databases
---------------
name
NOAA_water_database
_internal
telegraf
pirates
```

Change the format to `csv`:
```bash
$ influx -format=csv
[...]
> SHOW DATABASES
name,name
databases,NOAA_water_database
databases,_internal
databases,telegraf
databases,pirates
```

Change the format to `json`:
```bash
$ influx -format=json
[...]
> SHOW DATABASES
{"results":[{"series":[{"name":"databases","columns":["name"],"values":[["NOAA_water_database"],["_internal"],["telegraf"],["pirates"]]}]}]}
```

Change the format to `json` and turn on pretty print:
```bash
$ influx -format=json -pretty
[...]
> SHOW DATABASES
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
                            "NOAA_water_database"
                        ],
                        [
                            "_internal"
                        ],
                        [
                            "telegraf"
                        ],
                        [
                            "pirates"
                        ]
                    ]
                }
            ]
        }
    ]
}
```

### Import data from a file with `-import`
The import file has two sections:

* **DDL (Data Definition Language)**: Contains the [InfluxQL commands](/influxdb/v0.9/query_language/database_management/) for creating the relevant [database](/influxdb/v0.9/concepts/glossary/) and managing the [retention policy](/influxdb/v0.9/concepts/glossary/#retention-policy-rp).
If your database and retention policy already exist, your file can skip this section.
* **DML (Data Manipulation Language)**: Lists the relevant database and (if desired) retention policy and contains the data in [line protocol](/influxdb/v0.9/write_protocols/line/).

Example:

File (`datarrr.txt`):
```
# DDL
CREATE DATABASE IF NOT EXISTS pirates
CREATE RETENTION POLICY oneday ON pirates DURATION 1d REPLICATION 1

# DML
# CONTEXT-DATABASE: pirates
# CONTEXT-RETENTION-POLICY: oneday

treasures,captain_id=dread_pirate_roberts value=801 1439856000
treasures,captain_id=flint value=29 1439856000
treasures,captain_id=sparrow value=38 1439856000
treasures,captain_id=tetra value=47 1439856000
treasures,captain_id=crunch value=109 1439858880
```

Command:
```
$influx -import -path=datarrr.txt -precision=s
```

Results:
```
2015/12/22 12:25:06 Processed 2 commands
2015/12/22 12:25:06 Processed 5 inserts
2015/12/22 12:25:06 Failed 0 inserts
```

> **Note:** For large datasets, `influx` writes out a status message every 100,000 points.
For example:
<br>
<br>
> ```
2015/08/21 14:48:01 Processed 3100000 lines.
Time elapsed: 56.740578415s.
Points per second (PPS): 54634
```

Things to note about `-import`:

* Allow the database to ingest points by using `-pps` to set the number of points per second allowed by the import.
By default, pps is zero and `influx` does not throttle importing.
* Imports work with `.gz` files, just include `-compressed` in the command.
* If your data file has more than 5,000 points, it may be necessary to split that file into several files in order to write your data in batches to InfluxDB.
By default, the HTTP request times out after five seconds.
InfluxDB will still attempt to write the points after that time out but there will be no confirmation that they were successfully written.

> **Note:** For how to export data from InfluxDB version 0.8.9, see [Exporting from 0.8.9](https://github.com/influxdb/influxdb/blob/master/importer/README.md).
The exported data can be imported into InfluxDB versions 0.9.3+ as discussed above.

## `influx` Commands
Enter `help` in the CLI for a partial list of the available commands.

### Commands
The list below offers a brief discussion of each command.
We provide detailed information on `insert` at the end of this section.

`auth`  
Prompts you for your username and password.
`influx` uses those credentials when querying a database.

`connect <host:port>`  
Connect to a different server without exiting the shell.
By default, `influx` connects to `localhost:8086`.
If you do not specify either the host or the port, `influx` assumes the default setting for the missing attribute.

`consistency <level>`  
Sets the write consistency level: `any`, `one`, `quorum`, or `all`.

`exit`                
Quits the `influx` shell.

`format <format>`  
Specifies the format of the server responses: `json`, `csv`, or `column`.
See the description of [-format](/influxdb/v0.9/tools/shell/#specify-the-format-of-the-server-responses-with-format) for examples of each format.

`history`  
Displays your command history.
To use the history while in the shell, simply use the "up" arrow.
`influx` stores your last 1,000 commands in your home directory in `.influx_history`.

`insert`  
Write data using line protocol.
See [insert](/influxdb/v0.9/tools/shell/#write-data-to-influxdb-with-insert).

`precision <format>`  
Specifies the format/precision of the timestamp: `rfc3339` (`YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`), `h` (hours), `m` (minutes), `s` (seconds), `ms` (milliseconds), `u` (microseconds), `ns` (nanoseconds).
Precision defaults to nanoseconds.

`pretty`  
Turns on pretty print for the `json` format.

`settings`  
Outputs the current settings for the shell including the `Host`, `Username`, `Database`, `Pretty` status, `Format`, and `Write Consistency`.

`use <db_name>`  
Sets the current database.
Once `influx` sets the current database, there is no need to specify that database in queries.
`influx` automatically queries the current database and its `DEFAULT` retention policy.

#### Write data to InfluxDB with `insert`
Enter `insert` followed by the data in [line protocol](/influxdb/v0.9/write_protocols/line/) to write data to InfluxDB.
Use `insert into <retention policy> <line protocol>` to write data to a specific [retention policy](/influxdb/v0.9/concepts/glossary/#retention-policy-rp).

Write data to a single field in the measurement `treasures` with the tag `captain_id = pirate_king`.
`influx` automatically writes the point to the database's `DEFAULT` retention policy.
```
> INSERT treasures,captain_id=pirate_king value=2
>
```

Write the same point to the already-existing retention policy `oneday`:
```
> INSERT INTO oneday treasures,captain_id=pirate_king value=2
Using retention policy oneday
>
```

Note that once you specify a retention policy with `INSERT INTO`, `influx` automatically writes data to that retention policy.
This occurs even for later `INSERT` entries that do not include an `INTO` clause.

### Queries
Execute all InfluxQL queries in `influx`.
See [Data Exploration](/influxdb/v0.9/query_language/data_exploration/), [Schema Exploration](/influxdb/v0.9/query_language/schema_exploration/), [Database Management](/influxdb/v0.9/query_language/database_management/), [Authentication and Authorization](/influxdb/v0.9/administration/authentication_and_authorization/) for InfluxQL documentation.
