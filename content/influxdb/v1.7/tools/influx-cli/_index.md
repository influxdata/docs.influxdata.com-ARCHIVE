---
title: influx - InfluxDB command line interface
menu:
  influxdb_1_7:
    name: influx
    weight: 10
    parent: Tools
---

The `influx` command line interface (CLI) includes commands to manage many aspects of InfluxDB, including databases, organizations, users, and tasks.


## Usage

```
influx [flags]

```


## Flags

| Flag                        | Description                                                                                           |
|-----------------------------|-------------------------------------------------------------------------------------------------------|
| `-version`                  | Display the version and exit                                                                          |
| `-host`                     | HTTP address of InfluxDB (default: `http://localhost:8086`)                                           |
| `-port`                     | Port to connect to                                                                                    |
| `-socket`                   | Unix socket to connect to                                                                             |
| `-database `database name`` | Database to connect to the server                                                                     |
| `-password `password``      | Password to connect to the server. Leaving blank will prompt for password (--password '').            |
| `-username `username`       | Username to connect to the server                                                                     |
| `-ssl`                      | Use https for requests                                                                                |
| `-unsafessl`                | Set this when connecting to the cluster using https                      |
| `-execute`                  | Execute command and quit                                                                              |
| `-type`                     | Specify the query language for executing commands or when invoking the REPL.                        |
| `-format`                   | Specify the format of the server responses: json, csv, or column                                    |
| `-precision`               | Specify the format of the timestamp: rfc3339, h, m, s, ms, u or ns                                  |
| `-consistency`             | Set write consistency level: any, one, quorum, or all                                                 |
| `-pretty`                  | Turns on pretty print for JSON format                                                             |
| `-import`                  | Import a previous database export from file                                                           |
| `-pps`                     | Points per second the import will allow. The default is `0` and will not throttle importing. |
| `-path`                    | Path to file to import                                                                                |
| `-compressed`              | Set to true if the import file is compressed                                                          |
