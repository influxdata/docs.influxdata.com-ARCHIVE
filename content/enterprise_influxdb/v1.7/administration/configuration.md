---
title: Configure InfluxDB Enterprise clusters
description: Covers the InfluxDB Enterprise configuration settings, including global options, meta node options, and data node options
aliases:
    - /enterprise/v1.7/administration/configuration/
menu:
  enterprise_influxdb_1_7:
    name: Configure clusters
    weight: 10
    parent: Administration
---

This page contains general information about configuring InfluxDB Enterprise clusters.
For complete listings and descriptions of the configuration settings, see:

* [Configure data nodes](/enterprise_influxdb/v1.7/administration/config-data-nodes)
* [Configure meta nodes](/enterprise_influxdb/v1.7/administration/config-meta-nodes)

## Use configuration files

### Display the default configurations

The following commands print out a TOML-formatted configuration with all
available options set to their default values.

#### Meta node configuration

```bash
influxd-meta config
```

#### Data node configuration

```bash
influxd config
```

#### Create a configuration file

On POSIX systems, generate a new configuration file by redirecting the output
of the command to a file.

New meta node configuration file:
```
influxd-meta config > /etc/influxdb/influxdb-meta-generated.conf
```

New data node configuration file:
```
influxd config > /etc/influxdb/influxdb-generated.conf
```

Preserve custom settings from older configuration files when generating a new
configuration file with the `-config` option.
For example, this overwrites any default configuration settings in the output
file (`/etc/influxdb/influxdb.conf.new`) with the configuration settings from
the file (`/etc/influxdb/influxdb.conf.old`) passed to `-config`:

```
influxd config -config /etc/influxdb/influxdb.conf.old > /etc/influxdb/influxdb.conf.new
```

#### Launch the process with a configuration file

There are two ways to launch the meta or data processes using your customized
configuration file.

* Point the process to the desired configuration file with the `-config` option.

    To start the meta node process with `/etc/influxdb/influxdb-meta-generate.conf`:

        influxd-meta -config /etc/influxdb/influxdb-meta-generate.conf

    To start the data node process with `/etc/influxdb/influxdb-generated.conf`:

        influxd -config /etc/influxdb/influxdb-generated.conf


* Set the environment variable `INFLUXDB_CONFIG_PATH` to the path of your
configuration file and start the process.

    To set the `INFLUXDB_CONFIG_PATH` environment variable and launch the data
    process using `INFLUXDB_CONFIG_PATH` for the configuration file path:

        export INFLUXDB_CONFIG_PATH=/root/influxdb.generated.conf
        echo $INFLUXDB_CONFIG_PATH
        /root/influxdb.generated.conf
        influxd

If set, the command line `-config` path overrides any environment variable path.
If you do not supply a configuration file, InfluxDB uses an internal default
configuration (equivalent to the output of `influxd config` and `influxd-meta
config`).

{{% warn %}} Note for 1.3, the influxd-meta binary, if no configuration is specified, will check the INFLUXDB_META_CONFIG_PATH.
If that environment variable is set, the path will be used as the configuration file.
If unset, the binary will check the ~/.influxdb and /etc/influxdb folder for an influxdb-meta.conf file.
If it finds that file at either of the two locations, the first will be loaded as the configuration file automatically.
<br>
This matches a similar behavior that the open source and data node versions of InfluxDB already follow.
{{% /warn %}}

### Environment variables

All configuration options can be specified in the configuration file or in
environment variables.
Environment variables override the equivalent options in the configuration
file.
If a configuration option is not specified in either the configuration file
or in an environment variable, InfluxDB uses its internal default
configuration.

In the sections below we name the relevant environment variable in the
description for the configuration setting.
Environment variables can be set in `/etc/default/influxdb-meta` and
`/etc/default/influxdb`.

> **Note:**
To set or override settings in a config section that allows multiple
configurations (any section with double_brackets (`[[...]]`) in the header supports
multiple configurations), the desired configuration must be specified by ordinal
number.
For example, for the first set of `[[graphite]]` environment variables,
prefix the configuration setting name in the environment variable with the
relevant position number (in this case: `0`):
>
    INFLUXDB_GRAPHITE_0_BATCH_PENDING
    INFLUXDB_GRAPHITE_0_BATCH_SIZE
    INFLUXDB_GRAPHITE_0_BATCH_TIMEOUT
    INFLUXDB_GRAPHITE_0_BIND_ADDRESS
    INFLUXDB_GRAPHITE_0_CONSISTENCY_LEVEL
    INFLUXDB_GRAPHITE_0_DATABASE
    INFLUXDB_GRAPHITE_0_ENABLED
    INFLUXDB_GRAPHITE_0_PROTOCOL
    INFLUXDB_GRAPHITE_0_RETENTION_POLICY
    INFLUXDB_GRAPHITE_0_SEPARATOR
    INFLUXDB_GRAPHITE_0_TAGS
    INFLUXDB_GRAPHITE_0_TEMPLATES
    INFLUXDB_GRAPHITE_0_UDP_READ_BUFFER
>
For the Nth Graphite configuration in the configuration file, the relevant
environment variables would be of the form `INFLUXDB_GRAPHITE_(N-1)_BATCH_PENDING`.
For each section of the configuration file the numbering restarts at zero.
