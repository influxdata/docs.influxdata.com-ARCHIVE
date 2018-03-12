---
title: Configuring Kapacitor

menu:
  kapacitor_1_4:
    weight: 10
    parent: administration
---

### Contents
 * [Startup](#startup)
 * [The Kapacitor configuration file](#the-kapacitor-configuration-file)
 * [Kapacitor environment variables](#kapacitor-environment-variables)
 * [Configuring with The HTTP API](#configuration-with-the-http-api)

Basic installation and startup of the Kapacitor service is covered in
[Getting started with Kapacitor](/kapacitor/v1.4/introduction/getting_started/).
The basic principles of working with Kapacitor described there should be understood before continuing here.
This document presents Kapacitor configuration in greater detail.

Kapacitor service properties are configured using key-value pairs organized
into groups.
Any property key can be located by following its path in the configuration file (for example, `[http].https-enabled` or `[slack].channel`).
Values for configuration keys are declared in the configuration file.
On POSIX systems this file is located by default at the following location: `/etc/kapacitor/kapacitor.conf`.  On Windows systems a sample configuration file can be found in the same directory as the `kapacitord.exe`.
The location of this file can be defined at startup with the `-config` argument.
The path to the configuration file can also be declared using the environment variable `KAPACITOR_CONFIG_PATH`.
Values declared in this file can be overridden by environment variables beginning with the token `KAPACITOR_`.
Some values can also be dynamically altered using the HTTP API when the key  `[config-override].enabled` is set to `true`.

Four primary mechanisms for configuring different aspects of the Kapacitor service are available and listed here in the descending order by which they may be overridden:

* The configuration file.
* Environment variables.
* The HTTP API (for optional services and the InfluxDB connection).
* Command line arguments (for changing hostname and logging).

> ***Note:*** Setting the property `skip-config-overrides` in the configuration file to `true` will disable configuration overrides at startup.

## Startup

The Kapacitor daemon includes command line options that affect how it loads and
runs.
These include:

* `-config`: Path to the configuration file.
* `-hostname`: Hostname that will override the hostname specified in the configuration file.
* `-pidfile`: File where the process ID will be written.
* `-logfile`: File where logs will be written.
* `-log-level`: Threshold for writing messages to the log file. Valid values include `debug, info, warn, error`.

### Systemd

On POSIX systems, when the Kapacitor daemon starts as part of `systemd`, environment variables can be set in the file `/etc/default/kapacitor`.

For example, to define where the PID file and log file will be written, add a line
like the following into the `/etc/default/kapacitor` file and restart the
`systemd` service:

```
KAPACITOR_OPTS="-pidfile=/home/kapacitor/kapacitor.pid -log-file=/home/kapacitor/logs/kapacitor.log"
```

The environment variable `KAPACITOR_OPTS` is one of a few special variables used
by Kapacitor at startup.
For more information on working with environment variables,
see [Kapacitor environment variables](#kapacitor-environment-variables)
below.

## The Kapacitor configuration file

The default configuration can be displayed using the `config` command of the Kapacitor daemon.

`$ kapacitord config`

A sample configuration file is also available in the Kapacitor code base.
The most current version can be accessed on [github](https://github.com/influxdata/kapacitor/blob/master/etc/kapacitor/kapacitor.conf).

To get current configuration settings, you can use the Kapacitor HTTP API to get configuration values for settings that can be changed while the Kapacitor service is running. See [Retrieving the current configuration](/kapacitor/v1.4/working/api/#retrieving-the-current-configuration).

### TOML

The configuration file is based on [TOML](https://github.com/toml-lang/toml).
Important configuration properties are identified by case-sensitive keys
to which values are assigned.
Key-value pairs are grouped into tables whose identifiers are delineated by brackets.
Tables can also be grouped into table arrays.

The most common value types found in the Kapacitor configuration file include
the following:

   * **String** (declared in double quotes)
     - Examples: `host = "localhost"`, `id = "myconsul"`, `refresh-interval = "30s"`.
   * **Integer**
     - Examples: `port = 80`, `timeout = 0`, `udp-buffer = 1000`.
   * **Float**
     - Example: `threshold = 0.0`.
   * **Boolean**
     - Examples: `enabled = true`, `global = false`, `no-verify = false`.
   * **Array** &ndash;
     - Examples: `my_database = [ "default", "longterm" ]`, ` urls = ["http://localhost:8086"]`
   * **Inline Table**
       - Example: `basic-auth = { username = "my-user", password = "my-pass" }`

Table grouping identifiers are declared within brackets.
For example, `[http]`, `[deadman]`,`[kubernetes]`.

An array of tables is declared within double brackets.
For example, `[[influxdb]]`. `[[mqtt]]`, `[[dns]]`.

### Organization

Most keys are declared in the context of a table grouping, but the basic properties of the Kapacitor system are defined in the root context of the configuration file.
The four basic properties of the Kapacitor service include:

   * `hostname`: String declaring the DNS hostname where the Kapacitor daemon runs.
   * `data_dir`: String declaring the file system directory where core Kapacitor data is stored.
   * `skip-config-overrides`: Boolean indicating whether or not to skip configuration overrides.
   * `default-retention-policy`: String declaring the default retention policy to be used on the InfluxDB database.

Table groupings and arrays of tables follow the basic properties and include essential and optional features,
including specific alert handlers and mechanisms for service discovery and data scraping.

#### Essential tables

##### HTTP

The Kapacitor service requires an HTTP connection and important
HTTP properties,
such as a bind address and the path to an HTTPS certificate,
are defined in the `[http]` table.

**Example 1 &ndash; The HTTP grouping**

```toml
...
[http]
  # HTTP API Server for Kapacitor
  # This server is always on,
  # it serves both as a write endpoint
  # and as the API endpoint for all other
  # Kapacitor calls.
  bind-address = ":9092"
  log-enabled = true
  write-tracing = false
  pprof-enabled = false
  https-enabled = false
  https-certificate = "/etc/ssl/influxdb-selfsigned.pem"
  ### Use a separate private key location.
  # https-private-key = ""
...
```

##### Config override

The `[config-override]` table contains only one key which enables or disables the ability to
override certain values through the HTTP API. It is enabled by default.

**Example 2 &ndash; The Config Override grouping**

```toml
...
[config-override]
  # Enable/Disable the service for overridding configuration via the HTTP API.
  enabled = true
...
```
##### Logging

The Kapacitor service uses logging to monitor and inspect its behavior.
The path to the log and the log threshold is defined in `[logging]` table.

**Example 3 &ndash; The Logging grouping**

```toml
...
[logging]
    # Destination for logs
    # Can be a path to a file or 'STDOUT', 'STDERR'.
    file = "/var/log/kapacitor/kapacitor.log"
    # Logging level can be one of:
    # DEBUG, INFO, WARN, ERROR, or OFF
    level = "INFO"
...
```
##### Load

Starting with Kapacitor 1.4, the Kapacitor service includes a feature
that enables the loading of TICKscript tasks when the service loads.
The path to these scripts is defined in this table.

**Example 4 &ndash; The Load grouping**

```toml
...
[load]
  # Enable/Disable the service for loading tasks/templates/handlers
  # from a directory
  enabled = true
  # Directory where task/template/handler files are set
  dir = "/etc/kapacitor/load"
...
```
##### Replay

The Kapacitor client application can record data streams and batches for testing
tasks before they are enabled.
This table contains one key which declares the path to the directory where the replay files are to be stored.

**Example 5 &ndash; The Replay grouping**

```toml
...
[replay]
  # Where to store replay files, aka recordings.
  dir = "/var/lib/kapacitor/replay"
...
```

##### Task

Prior to Kapacitor 1.4, tasks were written to a special task database.
This table and its associated keys are _deprecated_ and should only be used for
migration purposes.

##### Storage

The Kapacitor service stores its configuration and other information in the key-value [Bolt](https://github.com/boltdb/bolt) database.
The location of this database on the file system is defined in the storage table
grouping.

**Example 6 &ndash; The Storage grouping**

```toml
...
[storage]
  # Where to store the Kapacitor boltdb database
  boltdb = "/var/lib/kapacitor/kapacitor.db"
...
```

##### Deadman

Kapacitor provides a deadman's switch alert which can be configured globally
in this table grouping.
See the [Deadman](/kapacitor/v1.4/nodes/alert_node/#deadman) helper function topic in the AlertNode documentation.

For a Deadman's switch to work it needs a threshold below which the switch will
be triggered.  It also needs a polling interval as well as an id and message
which will be passed to the alert handler.

**Example 7 &ndash; The Deadman grouping**

```toml
...
[deadman]
  # Configure a deadman's switch
  # Globally configure deadman's switches on all tasks.
  # NOTE: for this to be of use you must also globally configure at least one alerting method.
  global = false
  # Threshold, if globally configured the alert will be triggered if the throughput in points/interval is <= threshold.
  threshold = 0.0
  # Interval, if globally configured the frequency at which to check the throughput.
  interval = "10s"
  # Id -- the alert Id, NODE_NAME will be replaced with the name of the node being monitored.
  id = "node 'NODE_NAME' in task '{{ .TaskName }}'"
  # The message of the alert. INTERVAL will be replaced by the interval.
  message = "{{ .ID }} is {{ if eq .Level \"OK\" }}alive{{ else }}dead{{ end }}: {{ index .Fields \"collected\" | printf \"%0.3f\" }} points/INTERVAL."
...
```

#### InfluxDB

Kapacitor's main purpose processing between nodes within an InfluxDB Enterprise cluster or between multiple clusters.
You must define at least one `[[influxdb]]` table array configuration for an InfluxDB connection.
Multiple InfluxDB table array configurations can be specified,
but one InfluxDB table array configuration must be flagged as the `default`.

**Example 8 &ndash; An InfluxDB Connection grouping**

```toml
...
[[influxdb]]
  # Connect to an InfluxDB cluster
  # Kapacitor can subscribe, query and write to this cluster.
  # Using InfluxDB is not required and can be disabled.
  enabled = true
  default = true
  name = "localhost"
  urls = ["http://localhost:8086"]
  username = ""
  password = ""
  timeout = 0
  # Absolute path to pem encoded CA file.
  # A CA can be provided without a key/cert pair
  #   ssl-ca = "/etc/kapacitor/ca.pem"
  # Absolutes paths to pem encoded key and cert files.
  #   ssl-cert = "/etc/kapacitor/cert.pem"
  #   ssl-key = "/etc/kapacitor/key.pem"

  # Do not verify the TLS/SSL certificate.
  # This is insecure.
  insecure-skip-verify = false

  # Maximum time to try and connect to InfluxDB during startup
  startup-timeout = "5m"

  # Turn off all subscriptions
  disable-subscriptions = false

  # Subscription mode is either "cluster" or "server"
  subscription-mode = "server"

  # Which protocol to use for subscriptions
  # one of 'udp', 'http', or 'https'.
  subscription-protocol = "http"

  # Subscriptions resync time interval
  # Useful if you want to subscribe to new created databases
  # without restart Kapacitord
  subscriptions-sync-interval = "1m0s"

  # Override the global hostname option for this InfluxDB cluster.
  # Useful if the InfluxDB cluster is in a separate network and
  # needs special config to connect back to this Kapacitor instance.
  # Defaults to `hostname` if empty.
  kapacitor-hostname = ""

  # Override the global http port option for this InfluxDB cluster.
  # Useful if the InfluxDB cluster is in a separate network and
  # needs special config to connect back to this Kapacitor instance.
  # Defaults to the port from `[http] bind-address` if 0.
  http-port = 0

  # Host part of a bind address for UDP listeners.
  # For example if a UDP listener is using port 1234
  # and `udp-bind = "hostname_or_ip"`,
  # then the UDP port will be bound to `hostname_or_ip:1234`
  # The default empty value will bind to all addresses.
  udp-bind = ""
  # Subscriptions use the UDP network protocl.
  # The following options of for the created UDP listeners for each subscription.
  # Number of packets to buffer when reading packets off the socket.
  udp-buffer = 1000
  # The size in bytes of the OS read buffer for the UDP socket.
  # A value of 0 indicates use the OS default.
  udp-read-buffer = 0

  [influxdb.subscriptions]
    # Set of databases and retention policies to subscribe to.
    # If empty will subscribe to all, minus the list in
    # influxdb.excluded-subscriptions
    #
    # Format
    # db_name = <list of retention policies>
    #
    # Example:
    # my_database = [ "default", "longterm" ]
  [influxdb.excluded-subscriptions]
    # Set of databases and retention policies to exclude from the subscriptions.
    # If influxdb.subscriptions is empty it will subscribe to all
    # except databases listed here.
    #
    # Format
    # db_name = <list of retention policies>
    #
    # Example:
    # my_database = [ "default", "longterm" ]
...
```

#### Internals

Kapacitor includes internal services that can be enabled or disabled and
that have properties that need to be defined.

##### HTTP Post

The HTTP Post service configuration is commented out by default. It is used for
POSTing alerts to an HTTP endpoint.

##### Reporting

Kapacitor will send usage statistics back to InfluxData.
This feature can be disabled or enabled in the `[reporting]` table grouping.

**Example 9 &ndash; Reporting configuration**
```toml
...
[reporting]
  # Send usage statistics
  # every 12 hours to Enterprise.
  enabled = true
  url = "https://usage.influxdata.com"
...
```

##### Stats

Internal statistics about Kapacitor can also be emitted to an InfluxDB database.
The collection frequency and the database to which the statistics are emitted
can be configured in the `[stats]` table grouping.

**Example 10 &ndash; Stats configuration**

```toml
...
[stats]
  # Emit internal statistics about Kapacitor.
  # To consume these stats create a stream task
  # that selects data from the configured database
  # and retention policy.
  #
  # Example:
  #  stream|from().database('_kapacitor').retentionPolicy('autogen')...
  #
  enabled = true
  stats-interval = "10s"
  database = "_kapacitor"
  retention-policy= "autogen"
...
```

#### Optional table groupings

Optional table groupings are disabled by default and relate to specific features that can be leveraged by TICKscript nodes or used to discover and scrape information from remote locations.
In the default configuration, these optional table groupings may be commented out or include a key `enabled` set to `false` (i.e., `enabled = false`).
A feature defined by an optional table should be enabled whenever a relevant node or a handler for a relevant node is required by a task, or when an input source is needed.

For example, if alerts are to be sent via email, then the SMTP service should
be enabled and configured in the `[smtp]` properties table.

**Example 11 &ndash; Enabling SMTP**

```toml
...
[smtp]
  # Configure an SMTP email server
  # Will use TLS and authentication if possible
  # Only necessary for sending emails from alerts.
  enabled = true
  host = "192.168.1.24"
  port = 25
  username = "schwartz.pudel"
  password = "f4usT!1808"
  # From address for outgoing mail
  from = "kapacitor@test.org"
  # List of default To addresses.
  to = ["heinrich@urfaust.versuch.de","valentin@urfaust.versuch.de","wagner@urfaust.versuch.de"]

  # Skip TLS certificate verify when connecting to SMTP server
  no-verify = false
  # Close idle connections after timeout
  idle-timeout = "30s"

  # If true the all alerts will be sent via Email
  # without explicitly marking them in the TICKscript.
  global = false
  # Only applies if global is true.
  # Sets all alerts in state-changes-only mode,
  # meaning alerts will only be sent if the alert state changes.
  state-changes-only = false
...
```

Optional features include supported alert handlers, Docker services, user defined functions, input services, and discovery services.

##### Supported alert handlers

Alert handlers manage communications from Kapacitor to third party services or
across Internet standard messaging protocols.
They are activated through chaining methods on the [Alert](/kapacitor/v1.4/nodes/alert_node/) node.

Most of the handler configurations include common properties.
Every handler has the property `enabled`.  They also need an endpoint to which
messages can be sent.
Endpoints may include single properties (e.g, `url` and `addr`) or property pairs (e.g., `host` and `port`).
Most also include an authentication mechanism such as a `token` or a pair of properties like `username` and `password`.
A sample SMTP configuration is shown in Example 11 above.

Specific properties are included directly in the configuration file and
discussed along with the specific handler information in the [Alert](/kapacitor/v1.4/nodes/alert_node/)
document.

The following handlers are currently supported:

* [SMTP](/kapacitor/v1.4/nodes/alert_node/#email): To send alerts by email.
* [SNMP Trap](/kapacitor/v1.4/nodes/alert_node/#snmptrap): Posting to SNMP traps.
* [OpsGenie](/kapacitor/v1.4/nodes/alert_node/#opsgenie): Sending alerts to the OpsGenie service.
* [VictorOps](/kapacitor/v1.4/nodes/alert_node/#victorops): Sending alerts to the VictorOps service.
* [PagerDuty](/kapacitor/v1.4/nodes/alert_node/#pagerduty): Sending alerts to the PagerDuty service.
* [Pushover](/kapacitor/v1.4/nodes/alert_node/#pushover): Sending alerts to the Pushover service.
* [Slack](/kapacitor/v1.4/nodes/alert_node/#slack): Sending alerts to Slack.
* [Telegram](/kapacitor/v1.4/nodes/alert_node/#telegram): Sending alerts to Telegram.
* [HipChat](/kapacitor/v1.4/nodes/alert_node/#hipchat): sending alerts to the HipChat service.
* [Alerta](/kapacitor/v1.4/nodes/alert_node/#alerta): Sending alerts to Alerta.
* [Sensu](/kapacitor/v1.4/nodes/alert_node/#sensu): Sending alerts to Sensu.
* [Talk](/kapacitor/v1.4/nodes/alert_node/#talk): Sending alerts to the Talk service.
* [MQTT](/kapacitor/v1.4/nodes/alert_node/#mqtt): Publishing alerts to an MQTT broker.

##### Docker services

Kapacitor can be used to trigger changes in Docker clusters.  This
is activated by the [SwarmAutoScale](/kapacitor/v1.4/nodes/swarm_autoscale_node/)
and the [K8sAutoScale](/kapacitor/v1.4/nodes/k8s_autoscale_node/) nodes.

The following service configurations corresponding to these chaining methods can
be found in the configuration file:

   * [Swarm](/kapacitor/v1.4/nodes/swarm_autoscale_node/)

   **Example 12 &ndash; The Docker Swarm configuration**

   ```toml
   ...
   [[swarm]]
  # Enable/Disable the Docker Swarm service.
  # Needed by the swarmAutoscale TICKscript node.
  enabled = false
  # Unique ID for this Swarm cluster
  # NOTE: This is not the ID generated by Swarm rather a user defined
  # ID for this cluster since Kapacitor can communicate with multiple clusters.
  id = ""
  # List of URLs for Docker Swarm servers.
  servers = ["http://localhost:2376"]
  # TLS/SSL Configuration for connecting to secured Docker daemons
  ssl-ca = ""
  ssl-cert = ""
  ssl-key = ""
  insecure-skip-verify = false
  ...
   ```
   * [Kubernetes](/kapacitor/v1.4/nodes/k8s_autoscale_node/)

   **Example 13 &ndash; The Kubernetes configuration**

   ```toml
   ...
   [kubernetes]
  # Enable/Disable the kubernetes service.
  # Needed by the k8sAutoscale TICKscript node.
  enabled = false
  # There are several ways to connect to the kubernetes API servers:
  #
  # Via the proxy, start the proxy via the `kubectl proxy` command:
  #   api-servers = ["http://localhost:8001"]
  #
  # From within the cluster itself, in which case
  # kubernetes secrets and DNS services are used
  # to determine the needed configuration.
  #   in-cluster = true
  #
  # Direct connection, in which case you need to know
  # the URL of the API servers,  the authentication token and
  # the path to the ca cert bundle.
  # These value can be found using the `kubectl config view` command.
  #   api-servers = ["http://192.168.99.100:8443"]
  #   token = "..."
  #   ca-path = "/path/to/kubernetes/ca.crt"
  #
  # Kubernetes can also serve as a discoverer for scrape targets.
  # In that case the type of resources to discoverer must be specified.
  # Valid values are: "node", "pod", "service", and "endpoint".
  #   resource = "pod"
   ...
   ```

##### User defined functions (UDFs)

Kapacitor can be used to plug in a user defined function
([UDF](/kapacitor/v1.4/nodes/u_d_f_node/)), which can then be leveraged as
chaining methods in a TICKscript.
A user defined function is indicated by the declaration of a new grouping table with the following identifier: `[udf.functions.<UDF_NAME>]`.
A UDF configuration requires a path to an executable, identified by the following properties:

* `prog`: A string indicating the path to the executable.
* `args`: An array of string arguments to be passed to the executable.
* `timeout`: A timeout monitored when waiting for communications from the executable.

The UDF can also include a group of environment variables declared in a table
identified by the string `udf.functions.<UDF_NAME>.env`.

   **Example 14 &ndash; Configuring a User Defined Function**

   ```toml
   ...
   [udf]
# Configuration for UDFs (User Defined Functions)
[udf.functions]
    ...
    # Example python UDF.
    # Use in TICKscript like:
    #   stream.pyavg()
    #           .field('value')
    #           .size(10)
    #           .as('m_average')
    #
    [udf.functions.pyavg]
       prog = "/usr/bin/python2"
       args = ["-u", "./udf/agent/examples/moving_avg.py"]
       timeout = "10s"
       [udf.functions.pyavg.env]
           PYTHONPATH = "./udf/agent/py"
   ...
   ```

Additional examples can be found directly in the default configuration file.

##### Input methods

Kapacitor can receive and process data from sources other than InfluxDB, and the results of this processing can then be written to an InfluxDB database.

Currently, the following two sources external to InfluxDB are supported:

* **Collectd**: The POSIX daemon `collectd` for collecting system, network and service performance data.
* **Opentsdb**: The Open Time Series Database (Opentsdb) and its daemon tsd.

Configuration of connections to third party input sources requires properties such as:

* `bind-address`: Address at which Kapacitor will receive data.
* `database`: Database to which Kapacitor will write data.
* `retention-policy`: Retention policy for that database.
* `batch-size`: Number of datapoints to buffer before writing.
* `batch-pending`: Number of batches that may be pending in memory.
* `batch-timeout`: Length of time to wait before writing the batch.  If
the batch size has not been reached, then a short batch will be written.

Each input source has additional properties specific to its configuration.  They
follow the same configurations for these services used in
[Influxdb](https://github.com/influxdata/influxdb/blob/master/etc/config.sample.toml).

**Example 15 &ndash; Collectd configuration**

```toml
...
[collectd]
  enabled = false
  bind-address = ":25826"
  database = "collectd"
  retention-policy = ""
  batch-size = 1000
  batch-pending = 5
  batch-timeout = "10s"
  typesdb = "/usr/share/collectd/types.db"
...
```

**Example 16 &ndash; Opentsdb configuration**

```toml
...
[opentsdb]
  enabled = false
  bind-address = ":4242"
  database = "opentsdb"
  retention-policy = ""
  consistency-level = "one"
  tls-enabled = false
  certificate = "/etc/ssl/influxdb.pem"
  batch-size = 1000
  batch-pending = 5
  batch-timeout = "1s"
...
```

**User Datagram Protocol (UDP)**

As demonstrated in the [Live Leaderboard](/kapacitor/v1.4/guides/live_leaderboard/)
guide and the [Scores](https://github.com/influxdb/kapacitor/tree/master/examples/scores)
example, Kapacitor can be configured to accept raw data from a UDP connection.

This is configured much like other input services.

**Example 17 &ndash; UDP configuration**

```toml
...
[[udp]]
  enabled = true
  bind-address = ":9100"
  database = "game"
  retention-policy = "autogen"
...
```

#### Service discovery and metric scraping

When the number and addresses of the hosts and services for which Kapacitor
should collect information are not known at the time of configuring or booting
the Kapacitor service, they can be determined, and the data collected, at runtime
with the help of discovery services.
This process is known as metric _scraping and discovery_.
For more information, see [Scraping and Discovery](/kapacitor/v1.4/pull_metrics/scraping-and-discovery/).

For scraping and discovery to work one or more scrapers must be configured. One
scraper can be bound to one discovery service.

**Example 18 &ndash; Scraper configuration**

```toml
...
[[scraper]]
  enabled = false
  name = "myscraper"
  # Specify the id of a discoverer service specified below
  discoverer-id = "goethe-ec2"
  # Specify the type of discoverer service being used.
  discoverer-service = "ec2"
  db = "prometheus_raw"
  rp = "autogen"
  type = "prometheus"
  scheme = "http"
  metrics-path = "/metrics"
  scrape-interval = "1m0s"
  scrape-timeout = "10s"
  username = "schwartz.pudel"
  password = "f4usT!1808"
  bearer-token = ""
  ssl-ca = ""
  ssl-cert = ""
  ssl-key = ""
  ssl-server-name = ""
  insecure-skip-verify = false
...
```
The above example is illustrative only.

###### Discovery services

Kapacitor currently supports 12 discovery services.
Each of these has an `id` property by which it will be bound to a scraper.

Configuration entries are prepared by default for the following discovery
services:

* Azure
* Consul
* DNS
* EC2
* File Discovery
* GCE
* Marathon
* Nerve
* ServerSet
* Static Discovery
* Triton
* UDP

**Example 19 &ndash; EC2 Discovery Service configuration**

```toml
...
[[ec2]]
  enabled = false
  id = "goethe-ec2"
  region = "us-east-1"
  access-key = "ABCD1234EFGH5678IJKL"
  secret-key = "1nP00dl3N01rM4Su1v1Ju5qU3ch3ZM01"
  profile = "mph"
  refresh-interval = "1m0s"
  port = 80
...
```

The above example is illustrative.

## Kapacitor environment variables

Kapacitor can use environment variables for high-level properties or to
override properties in the configuration file.

### Environment variables not in configuration file

These variables are not found in the configuration file.

* `KAPACITOR_OPTS`: Found in the `systemd` startup script and used to pass
command line options to `kapacitord` started by `systemd`.
* `KAPACITOR_CONFIG_PATH`: Sets the path to the configuration file.
* `KAPACITOR_URL`: Used by the client application `kapacitor` to locate
the `kapacitord` service.
* `KAPACITOR_UNSAFE_SSL`: A Boolean used by the client application `kapacitor`
to skip verification of the `kapacitord` certificate when connecting over SSL.

### Mapping properties to environment variables

Kapacitor-specific environment variables begin with the token `KAPACITOR`
followed by an underscore (`_`).
Properties then follow their path through the configuration file tree with each node in the tree separated by an underscore.
Dashes in configuration file identifiers are replaced with underscores.
Table groupings in table arrays are identified by integer tokens.

Examples:

* `KAPACITOR_SKIP_CONFIG_OVERRIDES`: Could be used to set the value for
`skip-config-overrides`.
* `KAPACITOR_INFLUXDB_0_URLS_0`: Could be used to set the value of the
first URL item in the URLS array in the first Influxdb property grouping table,
i.e. `[infludxb][0].[urls][0]`.
* `KAPACITOR_STORAGE_BOLTDB`: Could be used to set the path to the boltdb
directory used for storage, i.e. `[storage].botldb`.
* `KAPACITOR_HTTPPOST_0_HEADERS_Authorization`: Could be used to set the
value of the `authorization` header for the first HTTPPost configuration (`[httppost][0].headers.{authorization:"some_value"}`).
* `KAPACITOR_KUBERNETES_ENABLED`: Could be used to enable the Kubernetes
configuration service (`[kubernetes].enabled`).


## Configuring with the HTTP API

The Kapacitor [HTTP API](kapacitor/v1.4/working/api/) can also be used to override
certain parts of the configuration.
This can be useful when a property may contain security sensitive information that should not be left in plain view in the file system, or when you need to reconfigure a service without restarting Kapacitor.
To view which parts of the configuration are available,
pull the JSON file at the `/kapacitor/v1/config` endpoint.
(e.g., http<span>:</span><span>//</span>localhost:9092<span>/</span>kapacitor<span>/</span>v1<span>/</span>config).

Working with the HTTP API to override configuration properties is presented in
detail in the [Configuration](/kapacitor/v1.4/working/api/#configuration) section
of the HTTP API document.
In order for overrides over the HTTP API to work,
the `[config-override].enabled` property must be set to `true`.

Generally, specific sections of the configuration can be viewed as JSON files by
GETting them from the context path built by their identifier from the `config`
endpoint.
For example, to get the table groupings of InfluxDB properties,
use the context `/kapacitor/v1/config/influxdb`.
Security-sensitive fields such as passwords, keys, and security tokens are redacted when using GET.

Properties can be altered by POSTing a JSON document to the endpoint.
The JSON document must contain a `set` field with a map of the properties to override and
their new values.

**Example 19 &ndash; JSON file for enabling the SMTP configuration**
```json
{
    "set":{
        "enabled": true
    }
}
```

By POSTing this document to the `/kapacitor/v1/config/smtp/` endpoint, the SMTP
service can be enabled.

Property overrides can be removed with the `delete` field in the JSON document.

**Example 20 &ndash; JSON file for removing an SMTP override**
```json
{
    "delete":[
        "enabled"
    ]
}
```
By POSTing this document to the `/kapacitor/v1/config/smtp/` endpoint the SMTP
override is removed and Kapacitor reverts to the behavior defined in the
configuration file.
