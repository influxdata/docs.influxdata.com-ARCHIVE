---
title: Release Notes/Changelog
menu:
  telegraf_1_3:
    weight: 0
    parent: about_the_project
---

## v1.3.1 [2017-02-01]

### Bugfixes

- Fix segfault on nil metrics with InfluxDB output.
- Fix negative number handling.

### Features

- GoLang version update 1.7.4 -> 1.7.5

## v1.3 [2017-01-24]

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
