---
title: Configuration

menu:
  kapacitor_1_4:
    weight: 10
    parent: administration
---

# Configuring the Kapacitor Service

### Contents
 * [The Kapacitor Configuration File](the-kapacitor-configuration-file)
 * [Kapacitor Environment Variables](kapacitor-environment-variables)
 * [Configuration with REST](configuration-with-rest)

The Kapacitor service is configured using key value pairs organized into groups,
so that any key can be reached by following a tree-like path. The main means for
declaring values for configuration keys is in the configuration file.
On a POSIX system this file is by default located on the file system at the
following location: `/etc/kapacitor/kapacitor.conf`.  The values declared in this
file can be overridden by environment variables beginning with the token
`KAPACITOR_`.  Some values can also be dynamically altered using the REST API.  

#### Startup

The Kapacitor daemon includes command line options that affect how it loads and
runs.  These include

   * `-config` - the path to the configuration file.
   * `-hostname` - override the hostname found in the configuration file.
   * `-pidfile` - file into which the process ID will be written.
   * `-logfile` - write logs to the file supplied by this flag.
   * `-log-level` - set the log level. Acceptable values: debug, info, warn, error.

#### Systemd

On POSIX systems, when the Kapacitor daemon starts as part of Systemd, environment
variables can be set in the file `/etc/default/kapacitor`.

For example to define where the PID file and log file will be written add a line
like the following into the `/etc/default/kapacitor` file and restart the
Systemd service.

```
KAPACITOR_OPTS="-pidfile=/home/kapacitor/kapacitor.pid -log-file=/home/kapacitor/logs/kapacitor.log"
```

## The Kapacitor Configuration File

The current configuration can be extracted using the `config` command of the
kapacitor daemon application.

`$ kapacitord config`

A sample configuration file is also available in the Kapacitor code base. Its
most current version can be accessed on [github](https://github.com/influxdata/kapacitor/blob/master/etc/kapacitor/kapacitor.conf).

The configuration file is based on [TOML](https://github.com/toml-lang/toml).
As such important configuration properties are identified by case sensitive keys
to which values are assigned. Key value pairs are grouped into tables, whose
identifiers are delineated by brackets.  Tables can also be grouped into table
arrays.

The most common value types found in the Kapacitor configuration file  include
the following:

   * String - declared in double quotes.  Examples: `host = "localhost"`, `id = "myconsul"`, `refresh-interval = "30s"`.
   * Integer - Examples: `port = 80`, `timeout = 0`, `udp-buffer = 1000`.
   * Float - Example: `threshold = 0.0`.
   * Boolean - Examples: `enabled = true`, `global = false`, `no-verify = false`.
   * Array - Examples: `my_database = [ "default", "longterm" ]`, ` urls = ["http://localhost:8086"]`

### Organization



## Kapacitor Environment Variables

## Configuration with REST
