---
title: Telegraf 1.7 release notes
description: See the new features, bug fixes, breaking changes, and enhancements in the latest and earlier Telegraf releases.
menu:
  telegraf_1_7:
    name: Release notes
    weight: 10
    parent: About the project
---

## v1.7.1 [2018-07-03]

### Bug fixes

* Treat `sigterm` as a clean shutdown signal.
* Fix selection of tags under nested objects in the JSON parser.
* Fix Postfix (`postfix`) input plugin handling of multilevel queues.
* Fix Syslog (`syslog` input plugin timestamp parsing with single digit day of month.
* Handle MySQL (`mysql`) input plugin variations in the `user_statistics` collecting.
* Fix Minmax (`minmax`) and Basicstats (`basicstats`) aggregator plugins to use `uint64`.
* Document Swap (`swap`) input plugin.
* Fix incorrect precision being applied to metric in HTTP Listener (`http_listener`) input plugin.

## v1.7 [2018-06-12]

### Release notes

- The Cassandra (`cassandra`) input plugin has been deprecated in favor of the Jolokia2 (`jolokia2`)
  input plugin which is much more configurable and more performant.  There is
  an [example configuration](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/jolokia2/examples) to help you
  get started.

- For plugins supporting TLS, you can now specify the certificate and keys
  using `tls_ca`, `tls_cert`, `tls_key`.  These options behave the same as
  the, now deprecated, `ssl` forms.

### New input plugins

- [Aurora (`aurora`)](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/aurora/README.md) - Contributed by @influxdata
- [Burrow (`burrow`) input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/burrow/README.md) - Contributed by @arkady-emelyanov
- [`fibaro`](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/fibaro/README.md) - Contributed by @dynek
- [`jti_openconfig_telemetry`](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/jti_openconfig_telemetry/README.md) - Contributed by @ajhai
- [`mcrouter`](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mcrouter/README.md) - Contributed by @cthayer
- [NVIDIA SMI (`nvidia_smi`)](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/nvidia_smi/README.md) - Contributed by @jackzampolin
- [Syslog (`syslog`)](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/syslog/README.md) - Contributed by @influxdata

### New processor plugins

- [converter](https://github.com/influxdata/telegraf/tree/master/plugins/processors/converter/README.md) - Contributed by @influxdata
- [regex](https://github.com/influxdata/telegraf/tree/master/plugins/processors/regex/README.md) - Contributed by @44px
- [topk](https://github.com/influxdata/telegraf/tree/master/plugins/processors/topk/README.md) - Contributed by @mirath

### New output plugins

- [HTTP (`http`)](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/http/README.md) - Contributed by @Dark0096
- [Application Insights (`application_insights`) output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/application_insights/README.md): Contribute by @karolz-ms

### Features

- Add `repl_oplog_window_sec` metric to MongoDB (`mongodb`) input plugin.
- Add per-host shard metrics in MongoDB (`mongodb`) input plugin.
- Skip files with leading `..` in config directory.
- Add TLS support to `socket_writer` and `socket_listener` plugins.
- Add `snmp` input option to strip non-fixed length index suffixes.
- Add server version tag to the Docker (`docker`) input plugin.
- Add support for LeoFS 1.4 to `leofs` input.
- Add parameter to force the interval of gather for Sysstat (`sysstat`).
- Support BusyBox ping in the Ping (`ping`) input plugin.
- Add Mcrouter (`mcrouter`) input plugin.
- Add TopK (`topk`) processor plugin.
- Add cursor metrics to MongoDB (`mongodb`) input plugin.
- Add tag/integer pair for result to Network Response (`net_response`) input plugin.
- Add Application Insights (`application_insights`) output plugin.
- Added several important Elasticsearch cluster health metrics.
- Add batch mode to `mqtt` output.
- Add Aurora (`aurora`) input plugin.
- Add Regex (`regex`) processor plugin.
- Add support for Graphite 1.1 tags.
- Add timeout option to Sensors (`sensors)` input plugin.
- Add Burrow (`burrow`) input plugin.
- Add option to Unbound (`unbound`) input plugin to use threads as tags.
- Add support for TLS and username/password auth to Aerospike (`aerospike`) input plugin.
- Add special syslog timestamp parser to grok parser that uses current year.
- Add Syslog (`syslog`) input plugin.
- Print the enabled aggregator and processor plugins on startup.
- Add static `routing_key` option to `amqp` output.
- Add passive mode exchange declaration option to AMQP Consumer (`amqp_consumer`) input plugin.
- Add counter fields to PF (`pf`) input plugin.

### Bug fixes

- Write to working file outputs if any files are not writeable.
- Add all win_perf_counters fields for a series in a single metric.
- Report results of `dns_query` instead of `0ms` on timeout.
- Add consul service tags to metric.
- Fix wildcards and multi instance processes in win_perf_counters.
- Fix crash on 32-bit Windows in `win_perf_counters`.
- Fix `win_perf_counters` not collecting at every interval.
- Use same flags for all BSD family ping variants.


## v1.6.4 [2018-06-05]

### Bugfixes

* Fix SNMP overriding of auto-configured table fields.
* Fix uint support in CloudWatch output.
* Fix documentation of `instance_name` option in Varnish input.
* Revert to previous Aerospike library version due to memory leak.

## v1.6.3 [2018-05-21]

### Bug fixes

* Fix intermittent panic in Aerospike input plugin.
* Fix connection leak in the Jolokia agent (`Jolokia2_agent`) input plugin.
* Fix Jolokia agent (`Jolokia2_agent`) input plugin timeout parsing.
* Fix error parsing Dropwizard metrics.
* Fix Librato (`librato`) output plugin support for unsigned integer (`uint`) and Boolean (`bool`).
* Fix WaitGroup deadlock, if URL is incorrect, in Apache input plugin.

## v1.6.2 [2018-05-08]

### Bug fixes

* Use same timestamp for fields in system input.
* Fix handling of uint64 in Datadog (`datadog`) output.
* Ignore UTF8 BOM in JSON parser.
* Fix case for slave metrics in MySQL (`mysql`) input.
* Fix uint support in CrateDB (`cratedb`) output.


## v1.6.1 [2018-04-23]

### Bug fixes

* Report mem input fields as gauges instead of counters.
* Fix Graphite outputs unsigned integers in wrong format.
* Report available fields if `utmp` is unreadable.
* Fix potential `no fields` error writing to outputs.
* Fix uptime reporting in system input when ran inside docker.
* Fix mem input `cannot allocate memory` error on FreeBSD-based systems.
* Fix duplicate tags when overriding an existing tag.
* Add server argument as first argument in the Unbound (`unbound`) input plugin.
* Fix handling of floats with multiple leading zeroes.
* Return errors in SSL/TLS configuration of MongoDB (`mongodb`) input plugin.


## v1.6 [2018-04-16]

### Release notes

- The MySQL (`mysql`) input plugin has been updated fix a number of type conversion
  issues.  This may cause a `field type error` when inserting into InfluxDB due
  the change of types.

  To address this, we have introduced a new `metric_version` option to control
  enabling the new format.  
  For in depth recommendations on upgrading, see [Metric version](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mysql#metric-version) in the MySQL input plugin documentation.

  You are encouraged to migrate to the new model when possible as the old version
  is deprecated and will be removed in a future version.

- The PostgreSQL (`postgresql`) input plugin now defaults to using a persistent connection to the database.
  In environments where TCP connections are terminated, the `max_lifetime`
  setting should be set less than the collection `interval` to prevent errors.

- The SQL Server (`sqlserver`) input plugin has a new query and data model that can be enabled
  by setting `query_version = 2`.  
  Migrate to the new model, if possible, since the old version is deprecated and will be removed in a future version.

- The OpenLDAP (`openldap`) input plugin has a new option, `reverse_metric_names = true`, that reverses metric
  names to improve grouping.  
  Enable this option, when possible, as the old ordering is deprecated.

- The new HTTP (`http`) input plugin, when configured with `data_format = "json"`, can perform the
  same task as the, now deprecated, HTTP JSON (`httpjson`) input plugin.


### New input plugins

- [HTTP (`http`) input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/http/README.md) - Thanks to @grange74
- [Ipset (`ipset`) input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ipset/README.md) - Thanks to @sajoupa
- [NATS Server Monitoring (`nats`) input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/nats/README.md) - Thanks to @mjs and @levex

### New processor plugins

- [Override (`override`) processor plugin](https://github.com/influxdata/telegraf/tree/master/plugins/processors/override/README.md) - Thanks to @KarstenSchnitter

### New parsers

- [Dropwizard input data format](https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md#dropwizard) - Thanks to @atzoum

### Features

* Add health status mapping from `string` to `int` in Elasticsearch (`elasticsearch`) input plugin.
* Add control over which stats to gather in BasicStats (`basicstats`) aggregator plugin.
* Add `messages_delivered_get` to RabbitMQ (`rabbitmq`) input plugin.
* Add `wired` field to mem input plugin.
* Add support for gathering exchange metrics to the RabbitMQ (`rabbitmq`) input plugin.
* Add support for additional metrics on Linux in Zfs (`zfs`) input plugin.
* Add `available_entropy` field to Kernel (`kernel`) input plugin.
* Add user privilege level setting to IPMI sensors.
* Use persistent connection to PostgreSQL database.
* Add support for dropwizard input data format.
* Add container health metrics to Docker (`docker`) input plugin.
* Add support for using globs in devices list of DiskIO (`diskio`) input plugin.
* Allow running as console application on Windows.
* Add listener counts and node running status to RabbitMQ (`rabbitmq`) input plugin.
* Add NATS Server Monitoring (`nats`) input plugin.
* Add ability to select which queues will be gathered in RabbitMQ (`rabbitmq`) input plugin.
* Add support for setting BSD source address to the ping (`ping`) input plugin.
* Add Ipset (`ipset`) input plugin.
* Add TLS and HTTP basic auth to Prometheus Client (`prometheus_client`) output plugin.
* Add new sqlserver output data model.
* Add native Go method for finding `pid` to the Procstat (`procstat`) input plugin.
* Add additional metrics and reverse metric names option to OpenLDAP (`openldap`) input plugin.
* Add TLS support to the Mesos (`mesos`) input plugin.
* Add HTTP (`http`) input plugin.
* Add keep alive support to the TCP mode of StatsD (`statsd`) input plugin .
* Support deadline in Ping (`ping`) input plugin.
* Add option to disable labels in the Prometheus Client (`prometheus`) output plugin for string fields.
* Add shard server stats to the MongoDB (`mongodb`) input plugin.
* Add server option to Unbound (`unbound`) input plugin.
* Convert boolean metric values to float in Datadog (`datadog`) output plugin.
* Add Solr 3 compatibility.
* Add sum stat to BasicStats (`basicstats`) aggregator plugin.
* Add ability to override proxy from environment in HTTP Response (`http_response`) input plugin.
* Add host to ping timeout log message.
* Add override processor plugin.
* Add `status_code` and result tags and `result_type` field to HTTP Response (`http_response`) input plugin.
* Added config flag to skip collection of network protocol metrics.
* Add TLS support to Kapacitor (`kapacitor`) input plugin.
* Add HTTP basic auth support to the HTTP Listener (`http_listener`) input plugin.
* Tags in output InfluxDB Line Protocol are now sorted.
* InfluxDB Line Protocol parser now accepts DOS line endings.
* An option has been added to skip database creation in the InfluxDB (`influxdb`) output plugin.
* Add support for connecting to InfluxDB over a UNIX domain socket.
* Add optional unsigned integer support to the influx data format.
* Add TLS support to Zookeeper (`zookeeper`) input plugin.
* Add filters for container state to Docker (`docker`) input plugin.

### Bug fixes

* Fix various MySQL data type conversions.
* Fix metric buffer limit in internal plugin after reload.
* Fix panic in HTTP Response (`http_response`) input plugin on invalid regex.
* Fix socket_listener setting ReadBufferSize on TCP sockets.
* Add tag for target URL to `phpfpm` input plugin.
* Fix cannot unmarshal object error in Mesosphere DC/OS (`dcos`) input plugin.
* Fix InfluxDB output not able to reconnect when server address changes.
* Fix parsing of DOS line endings in the SMART (`smart`) input plugin.
* Fix precision truncation when no timestamp included.
* Fix SNMPv3 connection with Cisco ASA 5515 in SNMP (`snmp`) input plugin.


## v1.5.3 [2018-03-14]

### Bug fixes

* Set path to `/` if `HOST_MOUNT_PREFIX` matches full path.
* Remove `userinfo` from `url` tag in Prometheus input plugin.
* Fix Ping input plugin not reporting zero durations.
* Disable `keepalive` in MQTT output plugin to prevent deadlock.
* Fix collation difference in SQL Server (`sqlserver`) input plugin.
* Fix uptime metric in Passenger (`passenger`) input plugin.
* Add output of stderr in case of error to exec log message.

## v1.5.2 [2018-01-30]

### Bug fixes

- Ignore empty lines in Graphite plaintext.
- Fix `index out of bounds` error in Solr input plugin.
- Reconnect before sending Graphite metrics if disconnected.
- Align aggregator period with internal ticker to avoid skipping metrics.
- Fix a potential deadlock when using aggregators.
- Limit wait time for writes in MQTT (`mqtt`) output plugin.
- Revert change in Graphite (`graphite`) output plugin where dot(`.`) in field key was replaced by underscore (`_`).
- Add `timeout` to Wavefront output write.
- Exclude `master_replid` fields from Redis input.

## v1.5.1 [2017-01-10]

### Bug fixes

- Fix name error in jolokia2_agent sample config.
- Fix DC/OS input - login expiration time.
- Set Content-Type charset parameter in InfluxDB (`influxdb`) output plugin and allow it to be overridden.
- Document permissions setup for Postfix (`postfix`) input plugin.
- Fix `deliver_get` field in RabbitMQ (`rabbitmq`) input plugin.
- Escape environment variables during config TOML parsing.

## v1.5 [2017-12-14]

### New plugins

#### Input plugins
- [Bond (bond)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/bond/README.md) - Thanks to @ildarsv
- [DC/OS (dcos)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dcos/README.md) - Thanks to @influxdata
- [Jolokia2 (jolokia2)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/jolokia2/README.md) - Thanks to @dylanmei
- [NGINX Plus (nginx_plus)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nginx_plus/README.md) - Thanks to @mplonka & @poblahblahblah
- [OpenSMTPD (opensmtpd)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/opensmtpd/README.md) - Thanks to @aromeyer
- [Particle.io Webhooks (particle)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/webhooks/particle/README.md) - Thanks to @davidgs
- [PF (pf)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/pf/README.md) - Thanks to @nferch
- [Postfix (postfix)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postfix/README.md) - Thanks to @phemmer
- [SMART (smart)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/smart/README.md) - Thanks to @rickard-von-essen
- [Solr (solr)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/solr/README.md) - Thanks to @ljagiello
- [Teamspeak (teamspeak)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/teamspeak/README.md) - Thanks to @p4ddy1
- [Unbound (unbound)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/unbound/README.md) - Thanks to @aromeyer

#### Aggregator plugins
- [BasicStats (basicstats)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/aggregators/basicstats/README.md) - Thanks to @toni-moreno

#### Output plugins
- [CrateDB (cratedb)](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/cratedb) - Thanks to @felixge
- [Wavefront (wavefront)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/wavefront/README.md) - Thanks to @puckpuck


### Release notes

- In the Kinesis (`kinesis`) output plugin, use of the `partition_key` and
  `use_random_partitionkey` options has been deprecated in favor of the
  `partition` subtable.  This allows for more flexible methods to set the
  partition key such as by metric name or by tag.

- With the release of the new improved Jolokia2 (`jolokia2`) input plugin, the legacy `jolokia`
  plugin is deprecated and will be removed in a future release.  Users of this
  plugin are encouraged to update to the new `jolokia2` plugin.

### Features

- Add support for sharding based on metric name.
- Add Kafka output plugin `topic_suffix` option.
- Include mount mode option in disk metrics.
- TLS and MTLS enhancements to HTTP Listener input plugin.
- Add polling method to logparser and tail inputs.
- Add timeout option for Kubernetes (`kubernetes`) input plugin.
- Add support for timing sums in statsd input plugin.
- Add resource limit monitoring to Procstat (`procstat`) input plugin.
- Add support for k8s service DNS discovery to Prometheus Client (`prometheus`) input plugin.
- Add configurable metrics endpoint to (`prometheus`) output plugin.
- Add support for NSQLookupd to `nsq_consumer`.
- Add configurable separator for metrics and fields in OpenTSDB (`opentsdb`) output plugin.
- Add support for the rollbar occurrence webhook event.
- Add extra wired tiger cache metrics to `mongodb` input.
- Collect Docker Swarm service metrics in Docker (`docker`) input plugin.
- Add cluster health level configuration to Elasticsearch (`elasticsearch`) input plugin.
- Add ability to limit node stats in Elasticsearch (`elasticsearch`) input plugin.
- Add UDP IPv6 support to StatsD (`statsd`) input plugin.
- Use labels in Prometheus Client (`prometheus`) output plugin for string fields.
- Add support for decimal timestamps to ts-epoch modifier.
- Add histogram and summary types and use in Prometheus (`prometheus`) plugins.
- Gather concurrently from snmp agents.
- Perform DNS lookup before ping and report result.
- Add instance name option to Varnish (`varnish`) plugin.
- Add support for SSL settings to ElasticSearch (`elasticsearch`) output plugin.
- Add modification_time field to Filestat (`filestat`) input plugin.
- Add systemd unit pid and cgroup matching to Procstat (`procstat`) .
- Use MAX() instead of SUM() for latency measurements in SQL Server (`sqlserver`) input plugin.
- Add index by week number to Elasticsearch (`elasticsearch`) output plugin.
- Add support for tags in the index name in Elasticsearch (`elasticsearch`) output plugin.
- Add slab to mem plugin.
- Add support for glob patterns in net input plugin.
- Add option to AMQP (`amqp`) output plugin to publish persistent messages.
- Support I (idle) process state on procfs+Linux.

### Bug fixes

- Fix webhooks input address in use during reload.
- Unlock Statsd when stopping to prevent deadlock.
- Fix cloudwatch output requires unneeded permissions.
- Fix prometheus passthrough for existing value types.
- Always ignore autofs filesystems in disk input.
- Fail metrics parsing on unescaped quotes.
- Whitelist allowed char classes for graphite output.
- Use hexadecimal ids and lowercase names in zipkin input.
- Fix snmp-tools output parsing with Windows EOLs.
- Add shadow-utils dependency to rpm package.
- Use deb-systemd-invoke to restart service.
- Fix kafka_consumer outside range of offsets error.
- Fix separation of multiple prometheus_client outputs.
- Don't add system input uptime_format as a counter.

## v1.4.5 [2017-12-01]

### Bug fixes

- Fix global variable collection when using interval_slow option in MySQL input.
- Fix error getting net connections info in netstat input.
- Fix HOST_MOUNT_PREFIX in Docker with disk input.

## v1.4.4 [2017-11-08]

### Bug fixes
- Use schema specified in mqtt_consumer input.
- Redact Datadog API key in log output.
- Fix error getting PIDs in netstat input.
- Support HOST_VAR envvar to locate /var in system input.
- Use current time if Docker container read time is zero value.

## v1.4.3 [2017-10-25]

### Bug fixes

- Fix container name filters in Docker input.
- Fix snmpwalk address format in leofs input.
- Fix case sensitivity issue in SQL Server query.
- Fix CPU input plugin stuck after suspend on Linux.
- Fix MongoDB input panic when restarting MongoDB.
- Preserve URL path prefix in InfluxDB output.
- Fix TELEGRAF_OPTS expansion in systemd service unit.
- Remove warning when JSON contains null value.
- Fix ACL token usage in consul input plugin.
- Fix unquoting error with Tomcat 6.
- Fix syscall panic in diskio on some Linux systems.

## v1.4.2 [2017-10-10]

### Bug fixes

- Fix error if int larger than 32-bit in `/proc/vmstat`.
- Fix parsing of JSON with a UTF8 BOM in `httpjson`.
- Allow JSON data format to contain zero metrics.
- Fix format of connection_timeout in `mqtt_consumer`.
- Fix case sensitivity error in SQL Server input.
- Add support for proxy environment variables to `http_response`.
- Add support for standard proxy env vars in outputs.
- Fix panic in CPU input if number of CPUs changes.
- Use chunked transfer encoding in InfluxDB output.

## v1.4.1 [2017-09-26]

### Bug fixes

- Fix MQTT input exits if Broker is not available on startup.
- Fix optional field value conversions in fluentd input.
- Whitelist allowed char classes for opentsdb output.
- Fix counter and gauge metric types.
- Fix skipped line with empty target in iptables.
- Fix duplicate keys in perf counters sqlserver query.
- Fix panic in statsd p100 calculation.
- Fix arm64 packages contain 32-bit executable.

## v1.4.0 [2017-09-05]

### Release Notes

- The `kafka_consumer` input has been updated to support Kafka 0.9 and
  above style consumer offset handling.  The previous version of this plugin
  supporting Kafka 0.8 and below is available as the `kafka_consumer_legacy`
  plugin.
- In the `aerospike` input the `node_name` field has been changed to be a tag
  for both the `aerospike_node` and `aerospike_namespace` measurements.
- The default prometheus_client port has been changed to 9273.

### New plugins

- fail2ban
- fluentd
- histogram
- minecraft
- openldap
- salesforce
- tomcat
- win_services
- zipkin

### Features

- Add Kafka 0.9+ consumer support.
- Add support for self-signed certs to InfluxDB input plugin.
- Add TCP listener for statsd input.
- Add Docker container environment variables as tags. Only whitelisted.
- Add timeout option to IPMI sensor plugin.
- Add support for an optional SSL/TLS configuration to Nginx input plugin.
- Add timezone support for logparser timestamps.
- Add result_type field for http_response input.
- Add include/exclude filters for docker containers.
- Add secure connection support to graphite output.
- Add min/max response time on linux/darwin to ping.
- Add HTTP Proxy support to influxdb output.
- Add standard SSL options to mysql input.
- Add input plugin for fail2ban.
- Support HOST_PROC in processes and linux_sysctl_fs inputs.
- Add Minecraft input plugin.
- Add support for RethinkDB 1.0 handshake protocol.
- Add optional usage_active and time_active CPU metrics.
- Change default prometheus_client port.
- Add fluentd input plugin.
- Add result_type field to net_response input plugin.
- Add read timeout to socket_listener.
- Add input plugin for OpenLDAP.
- Add network option to dns_query.
- Add redis_version field to redis input.
- Add tls options to docker input.
- Add histogram aggregator plugin.
- Add Zipkin input plugin.
- Add Windows Services input plugin.
- Add path tag to logparser containing path of logfile.
- Add Salesforce input plugin.
- Add option to run varnish under sudo.
- Add weighted_io_time to diskio input.
- Add gzip content-encoding support to influxdb output.
- Allow using system plugin in Windows.
- Add Tomcat input plugin.
- HTTP headers can be added to InfluxDB output.

### Bug fixes

- Improve logging of errors in Cassandra input.
- [enh] set db_version at 0 if query version fails.
- Fixed SQL Server input to work with case sensitive server collation.
- Systemd does not see all shutdowns as failures.
- Reuse transports in input plugins.
- Inputs processes fails with "no such process".
- Fix multiple plugin loading in win_perf_counters.
- MySQL input: log and continue on field parse error.
- Fix timeout option in Windows ping input sample configuration.
- Fix Kinesis output plugin in govcloud.
- Fix Aerospike input adds all nodes to a single series.
- Improve Prometheus Client output documentation.
- Display error message if prometheus output fails to listen.
- Fix elasticsearch output content type detection warning.
- Prevent possible deadlock when using aggregators.
- Fix combined tagdrop/tagpass filtering.
- Fix filtering when both pass and drop match an item.
- Only report cpu usage for online cpus in docker input.
- Start first aggregator period at startup time.
- Fix panic in logparser if file cannot be opened.
- Default to localhost if zookeeper has no servers set.
- Fix docker memory and cpu reporting in Windows.
- Allow iptable entries with trailing text.
- Sanitize password from couchbase metric.
- Converge to typed value in prometheus output.
- Skip compilcation of logparser and tail on solaris.
- Discard logging from tail library.
- Remove log message on ping timeout.
- Don't retry points beyond retention policy.
- Don't start Telegraf on install in Amazon Linux.
- Enable hddtemp input on all platforms.
- Escape backslash within string fields.
- Fix parsing of SHM remotes in ntpq input
- Don't fail parsing zpool stats if pool health is UNAVAIL on FreeBSD.
- Fix NSQ input plugin when used with version 1.0.0-compat.
- Added CloudWatch metric constraint validation.
- Skip non-numerical values in graphite format.
- Fix panic when handling string fields with escapes.

## v1.3.5 [2017-07-26]

### Bug fixes

- Fix prometheus output cannot be reloaded.
- Fix filestat reporting exists when cannot list directory.
- Fix ntpq parse issue when using dns_lookup.
- Fix panic when agent.interval = "0s".

## v1.3.4 [2017-07-12]

### Bug fixes

- Fix handling of escape characters within fields.
- Fix chrony plugin does not track system time offset.
- Do not allow metrics with trailing slashes.
- Prevent Write from being called concurrently.

## v1.3.3 [2017-06-28]

### Bug fixes

- Allow dos line endings in tail and logparser.
- Remove label value sanitization in prometheus output.
- Fix bug parsing default timestamps with modified precision.
- Fix panic in elasticsearch input if cannot determine master.

## v1.3.2 [2017-06-14]

### Bug fixes

- Fix InfluxDB UDP metric splitting.
- Fix mongodb/leofs urls without scheme.
- Fix inconsistent label dimensions in prometheus output.

## v1.3.1 [2017-05-31]

### Bug fixes

- Fixed sqlserver input to work with case-sensitive server collation.
- Reuse transports in input plugins.
- Process input fails with `no such process`.
- Fix InfluxDB output database quoting.
- Fix net input on older Linux kernels.
- Fix panic in mongo input.
- Fix length calculation of split metric buffer.

## v1.3.0 [2017-05-09]

#### Changes to the Windows ping plugin

Users of the windows [ping plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ping) will need to drop or migrate their measurements to continue using the plugin.
The reason for this is that the windows plugin was outputting a different type than the linux plugin.
This made it impossible to use the `ping` plugin for both windows and linux machines.

#### Changes to the Ceph plugin

For the [Ceph plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ceph), the `ceph_pgmap_state` metric content has been modified to use a unique field `count`, with each state expressed as a `state` tag.

Telegraf < 1.3:

```
# field_name             value
active+clean             123
active+clean+scrubbing   3
```

Telegraf >= 1.3:

```
# field_name    value       tag
count           123         state=active+clean
count           3           state=active+clean+scrubbing
```

#### Rewritten Riemann plugin

The [Riemann output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/riemann) has been rewritten
and the [previous riemann plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/riemann_legacy) is _incompatible_ with the new one.
The reasons for this are outlined in issue [#1878](https://github.com/influxdata/telegraf/issues/1878).
The previous Riemann output will still be available using `outputs.riemann_legacy` if needed, but that will eventually be deprecated.
It is highly recommended that all users migrate to the new Riemann output plugin.

#### New Socket Listener and Socket Writer plugins

Generic [Socket Listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/socket_listener) and [Socket Writer](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/socket_writer) plugins have been implemented for receiving and sending UDP, TCP, unix, & unix-datagram data.
These plugins will replace [udp_listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/udp_listener) and [tcp_listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/tcp_listener), which are still available but will be deprecated eventually.

### Features

- Add SASL options for the [Kafka output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/kafka).
- Add SSL configuration for [HAproxy input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/haproxy).
- Add the [Interrupts input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/interrupts).
- Add generic [Socket Listener input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/socket_listener) and [socket writer output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/socket_writer).
- Extend the [HTTP Response input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/http_response) to support searching for a substring in response. Return 1 if found, else 0.
- Add userstats to the [MySQL input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mysql).
- Add more InnoDB metric to the [MySQL input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mysql).
- For the [Ceph input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ceph), `ceph_pgmap_state` metric now uses a single field `count`, with PG state published as `state` tag.
- Use own client for improved through-put and less allocations in the [InfluxDB output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/influxdb).
- Keep -config-directory when running as Windows service.
- Rewrite the [Riemann output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/riemann).
- Add support for name templates and udev tags to the [DiskIO input plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/DISK_README.md#diskio-input-plugin).
- Add integer metrics for [Consul](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/consul) check health state.
- Add lock option to the [IPtables input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/iptables).
- Support [ipmi_sensor input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ipmi_sensor) querying local ipmi sensors.
- Increment gather_errors for all errors emitted by inputs.
- Use the official docker SDK.
- Add [AMQP consumer input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/amqp_consumer).
- Add pprof tool.
- Support DEAD(X) state in the [system input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/system).
- Add support for [MongoDB](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mongodb) client certificates.
- Support adding [SNMP](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/snmp) table indexes as tags.
- Add [Elasticsearch 5.x output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/elasticsearch).
- Add json timestamp units configurability.
- Add support for Linux sysctl-fs metrics.
- Support to include/exclude docker container labels as tags.
- Add [DMCache input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/dmcache).
- Add support for precision in [HTTP Listener input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/http_listener).
- Add `message_len_max` option to the [Kafka consumer input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/kafka_consumer).
- Add [collectd parser](/telegraf/v1.3/concepts/data_formats_input/#collectd).
- Simplify plugin testing without outputs.
- Check signature in the [GitHub webhook input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/webhooks/github).
- Add [papertrail](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/webhooks/papertrail) support to webhooks.
- Change [jolokia input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/jolokia) to use bulk requests.
- Add [DiskIO input plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/system/DISK_README.md#diskio-input-plugin) for Darwin.
- Add use_random_partitionkey option to the [Kinesis output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/kinesis).
- Add tcp keep-alive to [Socket Listener input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/socket_listener) and [Socket Writer output plugin](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/socket_writer).
- Add [Kapacitor input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/kapacitor).
- Use Go (golang) 1.8.1.
- Add documentation for the [RabbitMQ input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/rabbitmq).
- Make the [Logparser input plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/logparser) check for newly-created files.

### Bugfixes

- Allow `@` symbol in password for the ipmi_sensor plugin.
- Fix arithmetic overflow error converting numeric to data type int in SQL Server input.
- Flush jitter can inhibit metric collection.
- Add missing fields for HAproxy input.
- Handle null startTime for stopped pods for the Kubernetes input.
- Fix cpu input panic when /proc/stat is empty.
- Fix telegraf swallowing panics in --test mode.
- Create pidfile with 644 permissions & defer file deletion.
- Fix install/remove of telegraf on non-systemd Debian/Ubuntu systems.
- Fix for reloading telegraf freezes prometheus output.
- Fix when empty tag value causes error on InfluxDB output.
- buffer_size field value is negative number from "internal" plugin.
- Missing error handling in the MySQL plugin leads to segmentation violation.
- Fix type conflict in windows ping plugin.
- logparser: regexp with lookahead.
- Telegraf can crash in LoadDirectory on 0600 files.
- Iptables input: document better that rules without a comment are ignored.
- Fix win_perf_counters capping values at 100.
- Exporting Ipmi.Path to be set by config.
- Remove warning if parse empty content.
- Update default value for Cloudwatch rate limit.
- create /etc/telegraf/telegraf.d directory in tarball.
- Return error on unsupported serializer data format.
- Fix Windows Performance Counters multi instance identifier.
- Add write timeout to Riemann output.
- fix timestamp parsing on prometheus plugin.
- Fix deadlock when output cannot write.
- Fix connection leak in postgresql.
- Set default measurement name for snmp input.
- Improve performance of diskio with many disks.
- The internal input plugin uses the wrong units for `heap_objects`.
- Fix ipmi_sensor config is shared between all plugin instances.
- Network statistics not collected when system has alias interfaces.
- Sysstat plugin needs LANG=C or similar locale.
- File output closes standard streams on reload.
- AMQP output disconnect blocks all outputs.
- Improve documentation for redis input plugin.

## v1.2.1 [2017-02-01]

### Bugfixes

- Fix segfault on nil metrics with InfluxDB output.
- Fix negative number handling.

### Features

- Go (golang) version update 1.7.4 -> 1.7.5

## v1.2 [2017-01-24]

### Release Notes

- The StatsD plugin will now default all "delete_" config options to "true". This
will change te default behavior for users who were not specifying these parameters
in their config file.

- The StatsD plugin will also no longer save it's state on a service reload.
Essentially we have reverted PR [#887](https://github.com/influxdata/telegraf/pull/887).
The reason for this is that saving the state in a global variable is not
thread-safe (see [#1975](https://github.com/influxdata/telegraf/issues/1975) & [#2102](https://github.com/influxdata/telegraf/issues/2102)),
and this creates issues if users want to define multiple instances
of the statsd plugin. Saving state on reload may be considered in the future,
but this would need to be implemented at a higher level and applied to all
plugins, not just statsd.

### Features

- Fix improper calculation of CPU percentages
- Use RFC3339 timestamps in log output.
- Non-default HTTP timeouts for RabbitMQ plugin.
- "Discard" output plugin added, primarily for testing purposes.
- The JSON parser can now parse an array of objects using the same configuration.
- Option to use device name rather than path for reporting disk stats.
- Telegraf "internal" plugin for collecting stats on itself.
- Update GoLang version to 1.7.4.
- Support a metric.Split function.
- Elasticsearch "shield" (basic auth) support doc.
- Fix over-querying of cloudwatch metrics
- OpenTSDB basic auth support.
- RabbitMQ Connection metrics.
- HAProxy session limit metric.
- Accept strings for StatsD sets.
- Change StatsD default "reset" behavior.
- Enable setting ClientID in MQTT output.
- MongoDB input plugin: Improve state data.
- Ping input: add standard deviation field.
- Add GC pause metric to InfluxDB input plugin.
- Added response_timeout property to prometheus input plugin.
- Pulling github.com/lxn/win's pdh wrapper into Telegraf.
- Support negative statsd counters.
- Elasticsearch cluster stats support.
- Change Amazon Kinesis output plugin to use the built-in serializer plugins.
- Hide username/password from elasticsearch error log messages.
- Configurable HTTP timeouts in Jolokia plugin.
- Allow changing jolokia attribute delimiter.

### Bugfixes

- Fix the Value data format not trimming null characters from input.
- Fix windows `.net` plugin.
- Cache & expire metrics for delivery to prometheus
- Fix potential panic in aggregator plugin metric maker.
- Add optional ability to define PID as a tag.
- Fix win_perf_counters not gathering non-English counters.
- Fix panic when file stat info cannot be collected due to permissions or other issue(s).
- Graylog output should set short_message field.
- Hddtemp always put the value in the field temperature.
- Properly collect nested jolokia struct data.
- Fix puppetagent inputs plugin to support string for config variable.
- Fix docker input plugin tags when registry has port.
- Fix tail input when reading from a pipe.
- MongoDB plugin always shows 0 replication lag.
- Consul plugin: add check_id as a tag in metrics to avoid overwrites.
- Partial fix: logparser CLF pattern with IPv6 addresses.
- Fix thread-safety when using multiple instances of the statsd input plugin.
- Docker input: interface conversion panic fix.
- SNMP: ensure proper context is present on error messages.
- OpenTSDB: add tcp:// prefix if no scheme provided.
- Influx parser: parse line-protocol without newlines.
- InfluxDB output: fix field type conflict blocking output buffer.

## v1.1.2 [2016-12-12]

### Bugfixes

- Make snmptranslate not required when using numeric OID.
- Add a global snmp translation cache.

## v1.1.1 [2016-11-14]

### Bugfixes

- Fix issue parsing toml durations with single quotes.

## v1.1.0 [2016-11-07]

### Release Notes

- Telegraf now supports two new types of plugins: processors & aggregators.

- On systemd Telegraf will no longer redirect it's stdout to /var/log/telegraf/telegraf.log.
On most systems, the logs will be directed to the systemd journal and can be
accessed by `journalctl -u telegraf.service`. Consult the systemd journal
documentation for configuring journald. There is also a [`logfile` config option](https://github.com/influxdata/telegraf/blob/master/etc/telegraf.conf#L70)
available in 1.1, which will allow users to easily configure telegraf to
continue sending logs to /var/log/telegraf/telegraf.log.

### Features

- Processor & Aggregator plugin support.
- Adding the tags in the graylog output plugin.
- Telegraf systemd service, log to journal.
- Allow numeric and non-string values for tag_keys.
- Adding Gauge and Counter metric types.
- Remove carraige returns from exec plugin output on Windows
- Elasticsearch input: configurable timeout.
- Massage metric names in Instrumental output plugin
- Apache Mesos improvements.
- Add Ceph Cluster Performance Statistics
- Ability to configure response_timeout in httpjson input.
- Add additional redis metrics.
- Added capability to send metrics through HTTP API for OpenTSDB.
- iptables input plugin.
- Add filestack webhook plugin.
- Add server hostname for each Docker measurements.
- Add NATS output plugin.
- HTTP service listener input plugin.
- Add database blacklist option for Postgresql
- Add Docker container state metrics to Docker input plugin output
- Add support to SNMP for IP & MAC address conversion.
- Add support to SNMP for OID index suffixes.
- Change default arguments for SNMP plugin.
- Apach Mesos input plugin: very high-cardinality mesos-task metrics removed.
- Logging overhaul to centralize the logger & log levels, & provide a logfile config option.
- HAProxy plugin socket glob matching.
- Add Kubernetes plugin for retrieving pod metrics.

### Bugfixes

- Fix NATS plug-ins reconnection logic.
- Set required default values in udp_listener & tcp_listener.
- Fix toml unmarshal panic in Duration objects.
- Fix handling of non-string values for JSON keys listed in tag_keys.
- Fix mongodb input panic on version 2.2.
- Fix statsd scientific notation parsing.
- Sensors plugin strconv.ParseFloat: parsing "": invalid syntax.
- Fix prometheus_client reload panic.
- Fix Apache Kafka consumer panic when nil error is returned down errs channel.
- Speed up statsd parsing.
- Fix powerdns integer parse error handling.
- Fix varnish plugin defaults not being used.
- Fix Windows glob paths.
- Fix issue loading config directory on Windows.
- Windows remote management interactive service fix.
- SQLServer, fix issue when case sensitive collation is activated.
- Fix huge allocations in http_listener when dealing with huge payloads.
- Fix translating SNMP fields not in MIB.
- Fix SNMP emitting empty fields.
- SQL Server waitstats truncation bug.
- Fix logparser common log format: numbers in ident.
- Fix JSON Serialization in OpenTSDB output.
- Fix Graphite template ordering, use most specific.
- Fix snmp table field initialization for non-automatic table.
- cgroups path being parsed as metric.
- Fix phpfpm fcgi client panic when URL does not exist.
- Fix config file parse error logging.
- Delete nil fields in the metric maker.
- Fix MySQL special characters in DSN parsing.
- Ping input odd timeout behavior.
- Switch to github.com/kballard/go-shellquote.

## v1.0.1 [2016-09-26]

### Bugfixes

- Prometheus output: Fix bug with multi-batch writes.
- Fix unmarshal of influxdb metrics with null tags.
- Add configurable timeout to influxdb input plugin.
- Fix statsd no default value panic.

## v1.0 [2016-09-08]

### Release Notes

**Breaking Change** The SNMP plugin is being deprecated in it's current form.
There is a [new SNMP plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/snmp)
which fixes many of the issues and confusions
of its predecessor. For users wanting to continue to use the deprecated SNMP
plugin, you will need to change your config file from `[[inputs.snmp]]` to
`[[inputs.snmp_legacy]]`. The configuration of the new SNMP plugin is _not_
backwards-compatible.

**Breaking Change**: Aerospike main server node measurements have been renamed
aerospike_node. Aerospike namespace measurements have been renamed to
aerospike_namespace. They will also now be tagged with the node_name
that they correspond to. This has been done to differentiate measurements
that pertain to node vs. namespace statistics.

**Breaking Change**: users of github_webhooks must change to the new
`[[inputs.webhooks]]` plugin.

This means that the default github_webhooks config:

```
# A Github Webhook Event collector
[[inputs.github_webhooks]]
  ## Address and port to host Webhook listener on
  service_address = ":1618"
```

should now look like:

```
# A Webhooks Event collector
[[inputs.webhooks]]
  ## Address and port to host Webhook listener on
  service_address = ":1618"

  [inputs.webhooks.github]
    path = "/"
```

- Telegraf now supports being installed as an official windows service,
which can be installed via
`> C:\Program Files\Telegraf\telegraf.exe --service install`

- `flush_jitter` behavior has been changed. The random jitter will now be
evaluated at every flush interval, rather than once at startup. This makes it
consistent with the behavior of `collection_jitter`.

- PostgresSQL plugins now handle oid and name typed columns seamlessly, previously they were ignored/skipped.

### Features

- postgresql_extensible now handles name and oid types correctly.
- Separate container_version from container_image tag.
- Support setting per-device and total metrics for Docker network and blockio.
- MongoDB input plugin: adding per DB stats from db.stats()
- Add tls support for certs to RabbitMQ input plugin.
- Webhooks input plugin.
- Rollbar webhook plugin.
- Mandrill webhook plugin.
- docker-machine/boot2docker no longer required for unit tests.
- cgroup input plugin.
- Add input plugin for consuming metrics from NSQD.
- Add ability to read Redis from a socket.
- **Breaking Change** - Redis `role` tag renamed to `replication_role` to avoid global_tags override.
- Fetching Galera status metrics in MySQL
- Aerospike plugin refactored to use official client library.
- Add measurement name arg to logparser plugin.
- logparser: change resp_code from a field to a tag.
- Implement support for fetching hddtemp data
- statsd: do not log every dropped metric.
- Add precision rounding to all metrics on collection.
- Add support for Tengine.
- Logparser input plugin for parsing grok-style log patterns.
- ElasticSearch: now supports connecting to ElasticSearch via SSL.
- Add graylog input pluging.
- Consul input plugin.
- conntrack input plugin.
- vmstat input plugin.
- Standardized AWS credentials evaluation & wildcard CloudWatch dimensions.
- Add SSL config options to http_response plugin.
- Graphite parser: add ability to specify multiple tag keys, for consistency with influxdb parser.
- Make DNS lookups for chrony configurable.
- Allow wildcard filtering of varnish stats.
- Support for glob patterns in exec plugin commands configuration.
- RabbitMQ input: made url parameter optional by using DefaultURL (http://localhost:15672) if not specified.
- Limit AWS GetMetricStatistics requests to 10 per second.
- RabbitMQ/Apache/InfluxDB inputs: made url(s) parameter optional by using reasonable input defaults if not specified.
- Refactor of flush_jitter argument.
- Add inactive & active memory to mem plugin.
- Official Windows service.
- Forking sensors command to remove C package dependency.
- Add a new SNMP plugin.

### Bugfixes

- Fix `make windows` build target.
- Fix error race conditions and partial failures.
- nstat: fix inaccurate config panic.
- jolokia: fix handling multiple multi-dimensional attributes.
- Fix prometheus character sanitizing. Sanitize more win_perf_counters characters.
- Add diskio io_time to FreeBSD & report timing metrics as ms (as linux does).
- Fix covering Amazon Linux for post remove flow.
- procstat missing fields: read/write bytes & count.
- diskio input plugin: set 'skip_serial_number = true' by default to avoid high cardinality.
- nil metrics panic fix.
- Fix datarace in apache input plugin.
- Add `read_repairs` statistics to riak plugin.
- Fix memory/connection leak in Prometheus input plugin.
- Trim BOM from config file for Windows support.
- Prometheus client output panic on service reload.
- Prometheus parser, protobuf format header fix.
- Prometheus output, metric refresh and caching fixes.
- Panic fix for multiple graphite outputs under very high load.
- Instrumental output has better reconnect behavior.
- Remove PID from procstat plugin to fix cardinality issues.
- Cassandra input: version 2.x "column family" fix.
- Shared WaitGroup in Exec plugin.
- logparser: honor modifiers in "pattern" config.
- logparser: error and exit on file permissions/missing errors.
- Make the user able to specify full path for HAproxy stats.
- Fix Redis url, an extra "tcp://" was added.
- Fix exec plugin panic when using single binary.
- Fixed incorrect prometheus metrics source selection.
- Set default Zookeeper chroot to empty string.
- Fix overall ping timeout to be calculated based on per-ping timeout.
- Change "default" retention policy to "".
- Graphite output mangling '%' character.
- Prometheus input plugin now supports x509 certs authentication.
- Fix systemd service.
- Fix influxdb n_shards counter.
- Fix potential kernel plugin integer parse error.
- Fix potential influxdb input type assertion panic.
- Still send processes metrics if a process exited during metric collection.
- disk plugin panic when usage grab fails.
- Removed leaked "database" tag on redis metrics.
- Processes plugin: fix potential error with /proc/net/stat directory.
- Fix rare RHEL 5.2 panic in gopsutil diskio gathering function.
- Remove IF NOT EXISTS from influxdb output database creation.
- Fix quoting with text values in postgresql_extensible plugin.
- Fix win_perf_counter "index out of range" panic.
- Fix ntpq panic when field is missing.
- Sanitize graphite output field names.
- Fix MySQL plugin not sending 0 value fields.
