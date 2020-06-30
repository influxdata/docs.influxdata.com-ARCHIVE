---
title: Telegraf 1.14 release notes
description: See the new features, bug fixes, breaking changes, and enhancements in the latest and earlier Telegraf releases.
menu:
  telegraf_1_14:
    name: Release notes
    weight: 10
    parent: About the project
---

## v1.14.5 [2020-06-30]

### Bug fixes

- Improve the performance of the `procstat` input.
- Fix ping exit code handling on non-Linux operating systems.
- Fix errors in output of the `sensors` command.
- Prevent startup when tags have incorrect type in configuration file.
- Fix panic with GJSON multiselect query in JSON parser.
- Allow any key usage type on x509 certificate.
- Allow histograms and summary types without buckets or quantiles in `prometheus_client` output.

## v1.14.4 [2020-06-09]

### Bug fixes

- Fix the `cannot insert the value NULL` error with the `PerformanceCounters` query in the `sqlServer` input plugin.
- Fix a typo in the naming of `the gc_cpu_fraction` field in the `influxdb` input plugin.
- Fix a numeric to bool conversion in the `converter` processor.
- Fix an issue with the `influx` stream parser blocking when the data is in buffer.

## v1.14.3 [2020-05-19]

### Bug fixes

- Use same timestamp for all objects in arrays in the `json` parser.
- Handle multiple metrics with the same timestamp in `dedup` processor.
- Fix reconnection of timed out HTTP2 connections `influxdb` outputs.
- Fix negative value parsing in `impi_sensor` input.

## v1.14.2 [2020-04-28]

### Bug fixes

- Trim white space from instance tag in `sqlserver` input .
- Use increased AWS Cloudwatch GetMetricData limit of 500 metrics per call.
- Fix limit on dimensions in `azure_monitor` output.
- Fix 64-bit integer to string conversion in `snmp` input.
- Fix shard indices reporting in `elasticsearch` input plugin.
- Ignore fields with Not a Number or Infinity floats in the JSON serializer.
- Fix typo in name of `gc_cpu_fraction` field of the `kapacitor` input.
- Don't retry create database when using database_tag if forbidden by the server in `influxdb` output.
- Allow CR and FF inside of string fields in InfluxDB line protocol parser.

## v1.14.1 [2020-04-14]

### Bug fixes

- Fix `PerformanceCounter` query performance degradation in `sqlserver` input.
- Fix error when using the `Name` field in template processor.
- Fix export timestamp not working for Prometheus on v2.
- Fix exclude database and retention policy tags.
- Fix status path when using globs in `phpfpm`.

## v1.14 [2020-03-26]

### Breaking changes

Breaking changes are updates that may cause Telegraf plugins to fail or function incorrectly. If you have one of the following plugins installed, make sure to update your plugin as needed:

- **Microsoft SQL Server** (`sqlserver`) input plugin: Renamed the `sqlserver_azurestats` measurement to `sqlserver_azure_db_resource_stats` to resolve an issue where numeric metrics were previously being reported incorrectly as strings.
- **Date** (`date`) processor plugin: Now uses the UTC timezone when creating its tag. Previously, the local time was used.

{{% note %}}
Support for SSL v3.0 is deprecated in this release.
Telegraf now uses the [Go TLS library](https://golang.org/pkg/crypto/tls/).
{{% /note %}}

### New plugins

#### Inputs

- [Arista LANZ Consumer](`lanz`) - Contributed by [@timhughes](https://github.com/timhughes)
- [ClickHouse](https://github.com/influxdata/telegraf/blob/release-1.14/plugins/inputs/clickhouse/README.md)(`clickhouse`) - Contributed by [@kshvakov](https://github.com/kshvakov)
- [Execd](https://github.com/influxdata/telegraf/blob/release-1.14/plugins/inputs/execd/README.md)(`execd`) - Contributed by [@jgraichen](https://github.com/jgraichen)
- [Event Hub Consumer](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/eventhub_consumer/README.md)(`eventhub_consumer`) - Contributed by [@R290](https://github.com/R290)
- [InfiniBand](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/infiniband/README.md)(`infiniband`) - Contributed by [@willfurnell](https://github.com/willfurnell)
- [Modbus](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/modbus/README.md)(`modbus`) - Contributed by [@garciaolais](https://github.com/garciaolais)
- [Monit](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/monit/README.md)(`monit`) - Contributed by [@SirishaGopigiri](https://github.com/SirishaGopigiri)
- [SFlow](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/sflow/README.md)(`sflow`) - Contributed by [@influxdata](https://github.com/influxdata)
- [Wireguard](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/wireguard/README.md)(`wireguard`) - Contributed by [@LINKIWI](https://github.com/LINKIWI)

#### Processors

- [Dedup](`dedup`) - Contributed by [@igomura](https://github.com/igomura)
- [S2 Geo](`s2geo`) - Contributed by [@alespour](https://github.com/alespour)
- [Template](`template`) - Contributed by [@RobMalvern](https://github.com/RobMalvern)

#### Outputs

- [Warp10](`warp10`) - Contributed by [@aurrelhebert](https://github.com/aurrelhebert)

### Features

#### Input plugin updates

- **Apache Kafka Consumer** (`kafka_consumer`): Add SASL version control to support Microsoft Azure Event Hub.
- **Apcupsd** (`apcupsd`): Add new tag `model` and new metrics: `battery_date`, `nominal_input_voltage`, `nominal_battery_voltage`, `nominal_power`, `firmware`.
- **Cisco Model-driven Telemetry (MDT)** (`cisco_telemetry_gnmi`) input plugin:
  - Add support for GNMI DecimalVal type.
  - Replace dash (`-`) with underscore (`_`) when handling embedded tags.
- **DiskIO** (`diskio`): Add counters for merged reads and writes.
- **IPMI Sensor** (`ipmi_sensor`): Add `use_sudo` option.
- **Jenkins** (`jenkins`):
  - Add `source` and `port` tags to `jenkins_job` metrics.
  - Add new fields `total_executors` and `busy_executors`.
- **Kubernetes** (`kubernetes`): Add ability to collect pod labels.
- **Microsoft SQL Server** (`sqlserver`):
  - Add RBPEX IO statistics to DatabaseIO query.
  - Add space on disk for each file to DatabaseIO query.
  - Calculate DB Name instead of GUID in `physical_db_name`.
  - Add `DatabaseIO` TempDB per Azure DB.
  - Add `query_include` option for explicitly including queries.
  - Add `volume_mount_point` to DatabaseIO query.
- **MongoDB** (`mongodb`):
  - Add `page_faults` for WiredTiger storage engine.
  - Add latency statistics.
  - Add replica set tag (`rs_name`).
- **NATS Consumer** (`nats_consumer`): Add support for credentials file.
- **NGINX Plus API** (`nginx_plus_api`): Add support for new endpoints.
- **OpenLDAP** (`openldap`): Add support for MDB database information.
- **PHP-FPM** (`phpfpm`): Allow globs in FPM unix socket paths (`unixsocket`).
- **Procstat** (`procstat`): Add process `created_at` time.
- **Prometheus** (`prometheus`) input plugin: Add `label` and `field` selectors for Kubernetes service discovery.
- **RabbitMQ** (`rabbitmq`): Add `slave_nodes` and `synchronized_slave_nodes` metrics.
- **StatsD** (`statsd`): Add UDP internal metrics.
- **Unbound** (`unbound`): Expose [`-c cfgfile` option of `unbound-control`](https://linux.die.net/man/8/unbound-control) and set the default unbound configuration (`config_file= "/etc/unbound/unbound.conf`) in the Telegraf configuration file.
- **VMware vSphere** (`vsphere`): Add option to exclude resources by inventory path, including `vm_exclude`, `host_exclude`, `cluster_exclude` (for both clusters and datastores), and `datacenter_exclude`.
- **X.509 Certificate** (`x509_cert`): Add `server_name` override.

#### Output plugin updates

- **Apache Kafka** (`kafka`): Add `topic_tag` and `exclude_topic_tag` options.
- **Graylog** (`graylog`): Allow a user defined field (`short_message_field`) to be used as the `GELF short_message`.
- **InfluxDB v1.x** (`influxdb`): Add support for setting the retention policy using a tag (`retention_policy_tag`).
- **NATS Output** (`nats`): Add support for credentials file.

#### Aggregator plugin updates

- **Histogram** (`histogram`): Add non-cumulative histogram.

#### Processor plugin updates

- **Converter** (`converter`): Add support for converting `tag` or `field` to `measurement`.
- **Date** (`date`): Add date offset and timezone options.
- **Strings** (`strings`): Add support for titlecase transformation.

### Bug fixes

- Fix Telegraf log rotation to use actual file size instead of bytes written.
- Fix internal Telegraf metrics to prevent output split into multiple lines.
- **Chrony** (`chrony`) input plugin: When plugin is enabled, search for `chronyc` only.
- **Microsoft SQL Server** (`sqlserver`) input plugin:
  - Fix conversion to floats in AzureDBResourceStats query.
  - Fix case sensitive collation.
  - Fix several issues with DatabaseIO query.
  - Fix schedulers query compatibility with pre SQL-2016.
- **InfluxDB Listener** (`influxdb_listener`):
  - Fix request failing with EOF.
  - Continue parsing after error.
  - Set headers on ping URL.

## v1.13.4 [2020-02-25]

### Release Notes
Official packages now built with Go 1.13.8.

### Bug fixes
- Parse NaN values from summary types in Prometheus (`prometheus`) input plugin.
- Fix PgBouncer (`pgbouncer`) input plugin when used with newer PgBouncer versions.
- Support up to 8192 stats in the Ethtool (`ethtool`) input plugin.
- Fix performance counters collection on named instances in Microsoft SQL Server (`sqlserver`) input plugin.
- Use add time for Prometheus expiration calculation.
- Fix inconsistency with input error counting in Telegraf v1.x (`internal`) input plugin.
- Use the same timestamp per call if no time is provided in Prometheus (`prometheus`) input plugin.

## v1.13.3 [2020-02-04]

### Bug fixes

- Update Kibana (`kibana`) input plugin to support Kibana 6.4 and later.
- Prevent duplicate `TrackingIDs` from being returned in the following queue consumer input plugins:
    - Amazon Kineses Consumer (`kinesis_consumer`)
    - AMQP Consumer (`amqp_consumer`)
    - Apache Consumer (`apache_consumer`)
    - MQTT Consumer (`mqtt_consumer`)
    - NATS Consumer (`nats_consumer`)
    - NSQ Consumer (`nsq_consumer`)
- Increase support for up to 4096 statistics in the Ethtool (`ethtool`) input plugin.
- Remove expired metrics from the Prometheus Client (`prometheus_client`) output plugin. Previously, expired metrics were only removed when new metrics were added.

## v1.13.2 [2020-01-21]

### Bug fixes

- Warn without error when Processes (`processes`) input is started on Windows.
- Only parse certificate blocks in X.509 Certificate (`x509_cert`) input plugin.
- Add custom attributes for all resource types in VMware vSphere (`vsphere`) input plugin.
- Support URL agent address form with UDP in SNMP (`snmp`) input plugin.
- Record device fields in the SMART (`smart`) input plugin when attributes is `false`.
- Remove invalid timestamps from Kafka messages.
- Update `json` parser to fix `json_strict` option and set `default` to `true`.

## v1.13.1 [2020-01-08]

### Bug fixes
- Fix ServerProperty query stops working on Azure after failover.
- Add leading period to OID in SNMP v1 generic traps.
- Fix missing config fields in prometheus serializer.
- Fix panic on connection loss with undelivered messages in MQTT Consumer
  (`mqtt_consumer`) input plugin.
- Encode query hash fields as hex strings in SQL Server (`sqlserver`) input plugin.
- Invalidate diskio cache if the metadata mtime has changed.
- Show platform not supported warning only on plugin creation.
- Fix rabbitmq cannot complete gather after request error.
- Fix `/sbin/init --version` executed on Telegraf startup.
- Use last path element as field key if path fully specified in Cisco GNMI Telemetry
  (`cisco_telemetry_gnmi`) input plugin.

## v1.13 [2019-12-12]

### Release Notes
Official packages built with Go 1.13.5.
The Prometheus Format (`prometheus`) input plugin and Prometheus Client (`prometheus_client`)
output have a new mapping to and from Telegraf metrics, which can be enabled by setting `metric_version = 2`.
The original mapping is deprecated. When both plugins have the same setting,
passthrough metrics are unchanged.
Refer to the [Prometheus input plugin](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/prometheus/README.md)
for details about the mapping.

### New Inputs
- [Azure Storage Queue](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/azure_storage_queue/README.md)
  (`azure_storage_queue`) - Contributed by [@mjiderhamn](https://github.com/mjiderhamn)
- [Ethtool](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/ethtool/README.md)
  (`ethtool`) - Contributed by [@philippreston](https://github.com/philippreston)
- [SNMP Trap](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/snmp_trap/README.md)
  (`snmp_trap`) - Contributed by [@influxdata](https://github.com/influxdata)
- [Suricata](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/suricata/README.md)
  (`suricata`) - Contributed by [@satta](https://github.com/satta)
- [Synproxy](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/synproxy/README.md)
  (`synproxy`) - Contributed by [@rfrenayworldstream](https://github.com/rfrenayworldstream)
- [Systemd Units](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/systemd_units/README.md)
  (`systemd_units`) - Contributed by [@benschweizer](https://github.com/benschweizer)

### New Processors
- [Clone](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/processors/clone/README.md)
  (`clone`) - Contributed by [@adrianlzt](https://github.com/adrianlzt)

### New Aggregators
- [Merge](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/aggregators/merge/README.md)
  (`merge`) - Contributed by [@influxdata](https://github.com/influxdata)

### Features
- Add per node memory stats to RabbitMQ (`rabbitmq`) input plugin.
- Add ability to read query from file to PostgreSQL (`postgresql_extensible`) input plugin.
- Add replication metrics to the Redis (`redis`) input plugin.
- Support NX-OS telemetry extensions in Cisco Model-driven Telemetry (`cisco_telemetry_mdt`)
  input plugin.
- Allow `graphite` parser to create `Inf` and `NaN` values.
- Use prefix base detection for ints in `grok` parser.
- Add more performance counter metrics to Microsoft SQL Server (`sqlserver`) input plugin.
- Add millisecond unix time support to `grok` parser.
- Add container ID as optional source tag to Docker (`docker`) and Docker Log
  (`docker_log`) input plugins.
- Add `lang` parameter to OpenWeatherMap (`openweathermap`) input plugin.
- Log file open errors at debug level in Tail (`tail`) input plugin.
- Add timeout option to Amazon CloudWatch (`cloudwatch`) input plugin.
- Support custom success codes in HTTP (`http`) input plugin.
- Improve IPVS (`ipvs`) input plugin error strings and logging.
- Add strict mode to JSON parser that can be disabled to ignore invalid items.
- Add support for Kubernetes 1.16 and remove deprecated API usage.
- Add gathering of RabbitMQ federation link metrics.
- Add bearer token defaults for Kubernetes plugins.
- Add support for SNMP over TCP.
- Add support for per output flush jitter.
- Add a nameable file tag to File (`file`) input plugin.
- Add Splunk MultiMetric support.
- Add support for sending HTTP Basic Auth in InfluxDB (`influxdb`) input plugin.
- Add ability to configure the url tag in the Prometheus Format (`prometheus`) input plugin.
- Add Prometheus `metric_version=2` mapping to internal metrics/line protocol.
- Add Prometheus `metric_version=2` support to Prometheus Client (`prometheus_client`) output plugin.
- Add content_encoding compression support to Socket Listener (`socket_listener`) input plugin.
- Add high resolution metrics support to Amazon CloudWatch (`cloudwatch`) output plugin.
- Add `SReclaimable` and `SUnreclaim ` to Memory (`mem`) input plugin.
- Allow multiple certificates per file in X.509 Certificate (`x509_cert`) input plugin.
- Add additional tags to the X.509 Certificate (`x509_cert`) input plugin.
- Add batch data format support to File (`file`) output plugin.
- Support partition assignment strategy configuration in Apache Kafka Consumer
  (`kafka_consumer`) input plugin.
- Add node type tag to MongoDB (`mongodb`) input plugin.
- Add `uptime_ns` field to MongoDB (`mongodb`) input plugin.
- Support resolution of symlinks in Filecount (`filecount`) input plugin.
- Set message timestamp to the metric time in Apache Kafka (`kafka`) output plugin.
- Add base64decode operation to String (`string`) processor.
- Add option to control collecting global variables to MySQL (`mysql`) input plugin.

### Bug fixes
- Show correct default settings in MySQL (`mysql`) sample configuration.
- Use `1h` or `3h` rain values as appropriate in OpenWeatherMap (`openweathermap`) input plugin.
- Fix `not a valid field` error in Windows with Nvidia SMI (`nvidia_smi`) input plugin.
- Fix InfluxDB (`influxdb`) output serialization on connection closed.
- Fix ping skips remaining hosts after DNS lookup error.
- Log MongoDB oplog auth errors at debug level.
- Remove trailing underscore trimming from json flattener.
- Revert change causing CPU usage to be capped at 100 percent.
- Accept any media type in the Prometheus Format (`prometheus`) input plugin.
- Fix unix socket dial arguments in uWSGI (`uwsgi`) input plugin.
- Replace colon characters in Prometheus (`prometheus_client`) output labels with `metric_version=1`.
- Set TrimLeadingSpace when TrimSpace is on in CSV (`csv`) parser.

## v1.12.6 [2019-11-19]

### Bug fixes
- Fix many plugin errors logged at debug logging level.
- Use nanosecond precision in Docker Log (`docker_log`) input plugin.
- Fix interface option with `method = native` in Ping (`ping`) input plugin.
- Fix panic in MongoDB (`mongodb`) input plugin if shard connection pool stats are unreadable.

## v1.12.5 [2019-11-12]

### Bug fixes
- Fix incorrect results in Ping (`ping`) input plugin.
- Add missing character replacement to `sql_instance` tag.
- Change `no metric` error message to `debug` level in CloudWatch (`cloudwatch`) input plugin.
- Add missing `ServerProperties` query to SQLServer (`sqlserver`) input plugin documentation.
- Fix MongoDB `connections_total_created` field loading.
- Fix metric creation when node is offline in Jenkins (`jenkins`) input plugin.
- Fix Docker `uptime_ns` calculation when container has been restarted.
- Fix MySQL field type conflict in conversion of `gtid_mode` to an integer.
- Fix MySQL field type conflict with `ssl_verify_depth` and `ssl_ctx_verify_depth`.

## v1.12.4 [2019-10-23]

- Build official packages with Go 1.12.12.

### Bug fixes
- Fix metric generation with Ping (`ping`) input plugin `native` method.
- Exclude alias tag if unset from plugin internal stats.
- Fix `socket_mode` option in PowerDNS Recursor (`powerdns_recursor`) input plugin.

## v1.12.3 [2019-10-07]

- Build official packages with Go 1.12.10.

### Bug fixes
- Use batch serialization format in Exec (`exec`) output plugin.
- Use case-insensitive serial number match in S.M.A.R.T. (`smart`) input plugin.
- Add authorization header only when environment variable is set.
- Fix issue when running multiple MySQL and SQL Server plugin instances.
- Fix database routing on retry with `exclude_database_tag`.
- Fix logging panic in Exec (`exec`) input plugin with Nagios data format.

## v1.12.2 [2019-09-24]

### Bug fixes
- Fix timestamp format detection in `csv` and `json` parsers.
- Apcupsd input (`apcupsd`)
  - Fix parsing of `BATTDATE`.
- Keep boolean values listed in `json_string_fields`.
- Disable Go plugin support in official builds.
- Cisco GNMI Telemetry input (`cisco_telemetry_gnmi`)
  - Fix path handling issues.

## v1.12.1 [2019-09-10]

### Bug fixes
- Fix dependenciess on GLIBC_2.14 symbol version.
- Filecount input (`filecount`)
  - Fix filecount for paths with trailing slash.
- Icinga2 input (`icinga2`)
  - Convert check state to an integer.
- Apache Kafka Consumer input (`kafka_consumer`)
  - Fix could not mark message delivered error.
- MongoDB input (`mongodb`)
  - Skip collection stats when disabled.
- HTTP Response input (`http_response`)
  - Fix error reading closed response body.
- Apcupsd input (`apcupsd`)
  - Fix documentation to reflect plugin.
- InfluxDB v2 output (`influxdb_v2`)
  - Display retry log message only when retry after is received.


## v1.12 [2019-09-03]

### Release Notes
- The cluster health related fields in the Elasticsearch input have been split out
  from the `elasticsearch_indices` measurement into the new `elasticsearch_cluster_health_indices`
  measurement as they were originally combined by error.

### New Inputs
- [Apcupsd](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/apcupsd/README.md) (`apcupsd`) - Contributed by @jonaz
- [Docker Log](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/docker_log/README.md) (`docker_log`) - Contributed by @prashanthjbabu
- [Fireboard](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/fireboard/README.md) (`fireboard`) - Contributed by @ronnocol
- [Logstash](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/logstash/README.md) (`logstash`) - Contributed by @lkmcs @dmitryilyin @arkady-emelyanov
- [MarkLogic](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/marklogic/README.md) (`marklogic`) - Contributed by @influxdata
- [OpenNTPD](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/openntpd/README.md) (`openntpd`) - Contributed by @aromeyer
- [uWSGI](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/uwsgi) (`uwsgi`) - Contributed by @blaggacao

### New Parsers
- [From Urlencoded](https://github.com/influxdata/telegraf/blob/master/plugins/parsers/form_urlencoded) (`form_urlencoded`) - Contributed by @byonchev

### New Processors
- [Date](https://github.com/influxdata/telegraf/blob/master/plugins/processors/date/README.md) (`date`) - Contributed by @influxdata
- [Pivot](https://github.com/influxdata/telegraf/blob/master/plugins/processors/pivot/README.md) (`pivot`) - Contributed by @influxdata
- [Tag Limit](https://github.com/influxdata/telegraf/blob/master/plugins/processors/tag_limit/README.md) (`tag_limit`) - Contributed by @memory
- [Unpivot](https://github.com/influxdata/telegraf/blob/master/plugins/processors/unpivot/README.md) (`unpivot`) - Contributed by @influxdata

### New Outputs
- [Exec](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/exec/README.md) (`exec`) - Contributed by @Jaeyo

### Features
- Improve performance of `wavefront` serializer.
- Allow `regex` processor to append tag values.
- Add `starttime` field to `phpfpm` input.
- Add cluster name tag to elasticsearch indices.
- Add support for interface field in `http_response` input plugin.
- Add container uptime_ns in `docker` input plugin.
- Add better user-facing errors for API timeouts in docker input.
- Add TLS mutual auth support to `jti_openconfig_telemetry` input.
- Add support for ES 7.x to `elasticsearch` output.
- Add basic auth to `prometheus` input plugin.
- Add node roles tag to `elasticsearch` input.
- Support floats in `statsd` percentiles.
- Add native Go ping method to `ping` input plugin.
- Resume from last known offset in `tail` input when reloading Telegraf.
- Add improved support for Azure SQL Database to `sqlserver` input.
- Add extra attributes for NVMe devices to `smart` input.
- Add `docker_devicemapper` measurement to `docker` input plugin.
- Add basic auth support to `elasticsearch` input.
- Support string field glob matching in `json` parser.
- Update gjson to allow multipath syntax in `json` parser.
- Add support for collecting SQL Requests to identify waits and blocking to `sqlserver` input.
- Collect k8s endpoints, ingress, and services in `kube_inventory` plugin.
- Add support for field/tag keys to `strings` processor.
- Add certificate verification status to `x509_cert` input.
- Support percentage value parsing in `redis` input.
- Load external Go plugins from `--plugin-directory`.
- Add ability to exclude db/bucket tag from `influxdb` outputs.
- Gather per collections stats in `mongodb` input plugin.
- Add TLS & credentials configuration for `nats_consumer` input plugin.
- Add support for enterprise repos to `github` plugin.
- Add Indices stats to `elasticsearch` input.
- Add left function to `string` processor.
- Add grace period for metrics late for aggregation.
- Add `diff` and `non_negative_diff` to `basicstats` aggregator.
- Add device tags to `smart_attributes`.
- Collect `framework_offers` and `allocator` metrics in `mesos` input.
- Add Telegraf and Go version to the `internal` input plugin.
- Update the number of logical CPUs dynamically in `system` plugin.
- Add darwin (macOS) builds to the release.
- Add configurable timeout setting to `smart` input.
- Add `memory_usage` field to `procstat` input plugin.
- Add support for custom attributes to `vsphere` input.
- Add `cmdstat` metrics to `redis` input.
- Add `content_length` metric to `http_response` input plugin.
- Add `database_tag` option to `influxdb_listener` to add database from query string.
- Add capability to limit TLS versions and cipher suites.
- Add `topic_tag` option to `mqtt_consumer`.
- Add ability to label inputs for logging.
- Add TLS support to `nginx_plus`, `nginx_plus_api` and `nginx_vts`.

### Bug fixes
- Fix sensor read error stops reporting of all sensors in `temp` input.
- Fix double pct replacement in `sysstat` input.
- Fix race in master node detection in `elasticsearch` input.
- Fix SSPI authentication not working in `sqlserver` input.
- Fix memory error panic in `mqtt` input.
- Support Kafka 2.3.0 consumer groups.
- Fix persistent session in `mqtt_consumer`.
- Fix finder inconsistencies in `vsphere` input.
- Fix parsing multiple metrics on the first line of tailed file.
- Send TERM to `exec` processes before sending KILL signal.
- Query oplog only when connected to a replica set.
- Use environment variables to locate Program Files on Windows.

## v1.11.5 [2019-08-27]

### Bug fixes
- Update `go-sql-driver/mysql` driver to 1.4.1 to address auth issues.
- Return error status from `--test` if input plugins produce an error.
- Fix with multiple instances only last configuration is used in smart input.
- Build official packages with Go 1.12.9.
- Split out `-w` argument in `iptables` input plugin.
- Add support for parked process state on Linux.
- Remove leading slash from rcon command.
- Allow jobs with dashes in the name in `lustre2` input plugin.

## v1.11.4 [2019-08-06]

### Bug fixes

#### Plugins
- Kubernetes input (`kubernetes`)
  - Correct typo in `logsfs_available_bytes` field.
- Datadog output (`datadog`)
  - Skip floats that are `NaN` or `Inf`.
- Socket Listener input (`socket_listener`)
  - Fix reload panic.

## v1.11.3 [2019-07-23]

### Bug fixes

#### Agent

- Treat empty array as successful parse in JSON parser.
- Fix template pattern partial wildcard matching.

#### Plugins

- Bind input (`bind`)
  - Add missing `rcode` and `zonestat`.
- GitHub input
  - - Fix panic.
- Lustre2 input (`lustre2`)
  - Fix config parse regression.
- NVIDIA-SMI output (`nvidia-smi`)
  - Handle unknown error.
- StatD input (`statd`)
  - Fix panic when processing Datadog events.
- VMware vSphere input (`vsphere`)
  - Fix unable to reconnect after vCenter reboot.

## v1.11.2 [2019-07-09]

### Bug fixes

#### Plugins

- Bind input (`bind`)
  - Fix `value out of range` error on 32-bit systems.
- Burrow input (`burrow`)
  - Apply topic filter to partition metrics.
- Filecount input (`filecount`)
  - Fix path separator handling in Windows.
- Logparser input (`logparser`)
  - Fix stop working after reload.
- Ping input (`ping`)
  - Fix source address ping flag on BSD.
- StatsD input (`statsd`)
  - Fix panic with empty Datadog tag string.
- Tail input (`tail`)
  - Fix stop working after reload.

## v1.11.1 [2019-06-25]

### Bug fixes

#### Agent

- Fix panic if `pool_mode` column does not exist.
- Add missing `container_id` field to `docker_container_status` metrics.
- Add `device`, `serial_no`, and `wwn` tags to synthetic attributes.

#### Plugins

- Cisco GNMI Telemetry input (`cisco_telemetry_gnmi`)
  - Omit keys when creating measurement names for GNMI telemetry.
- Disk input (`disk`)
  - Cannot set `mount_points` option.
- NGINX Plus API input (`nginx_plus_api`)
  - Skip 404 error reporting.
- Procstat input (`procstat`)
  - Don't consider `pid` of `0` when using systemd lookup.
- StatsD input (`statsd`)
  - Fix parsing of remote TCP address.
- System input (`system`)
  - Ignore error when `utmp` is missing.

## v1.11.0 [2019-06-11]

- System (`system`) input plugin
  - The `uptime_format` field has been deprecated — use the `uptime` field instead.
- Amazon Cloudwatch Statistics (`cloudwatch`) input plugin
  - Updated to use a more efficient API and now requires `GetMetricData` permissions
   instead of `GetMetricStatistics`.  The `units` tag is not
   available from this API and is no longer collected.

### New input plugins

- [BIND 9 Nameserver Statistics (`bind`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/bind/README.md) - Contributed by @dswarbrick & @danielllek
- [Cisco GNMI Telemetry (`cisco_telemetry_gnmi`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/cisco_telemetry_gnmi/README.md) - Contributed by @sbyx
- [Cisco Model-driven Telemetry (`cisco_telemetry_mdt`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/cisco_telemetry_mdt/README.md) - Contributed by @sbyx
- [ECS (`ecs`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/ecs/README.md) - Contributed by @rbtr
- [GitHub (`github`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/github/README.md) - Contributed by @influxdata
- [OpenWeatherMap (`openweathermap`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/openweathermap/README.md) - Contributed by @regel
- [PowerDNS Recursor (`powerdns_recursor`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/powerdns_recursor/README.md) - Contributed by @dupondje

### New aggregator plugins

- [Final (`final`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/aggregators/final/README.md) - Contributed by @oplehto

### New output plugins

- [Syslog (`syslog`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/outputs/syslog/README.md) - Contributed by @javicrespo
- [Health (`health`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/outputs/health/README.md) - Contributed by @influxdata

### New output data formats (serializers)

- [wavefront](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/serializers/wavefront/README.md) - Contributed by @puckpuck

### Features

#### Agent

- Add CLI support for outputting sections of the configuration.
- Add `service-display-name` option for use with Windows service.
- Add support for log rotation.
- Allow env vars `${}` expansion syntax in configuration file.
- Allow devices option to match against devlinks.

### Input data formats

- Nagios
  - Add support for multiple line text and perfdata.

#### Input plugins

- AMQP Consumer (`amqp_consumer`)
  - Support passive queue declaration.
  - Add support for gzip compression.
- Amazon Cloudwatch Statistics (`cloudwatch`)
  - Use more efficient GetMetricData API to collect Cloudwatch metrics.
  - Allow selection of collected statistic types in cloudwatch input.
- Apache Solr (`solr`)
  - Add support for HTTP basic auth.
- Hddtemp (`hddtemp`)
  - Add source tag.
- InfluxDB Listener (`influxdb_listener`)
  - Support verbose query parameter in ping endpoint.
- NVIDIA SMI (`nvidia-smi`)
  - Extend metrics collected from Nvidia GPUs.
- Net (`net`)
  - Speed up interface stat collection.
- PHP FM (`phpfm`)
  - Enhance HTTP connection options.
- Ping (`ping`)
  - Add TTL field.
- Procstat (`procstat`)
  - Add `cmdline` tag.
  - Add pagefault data.
- Prometheus (`prometheus`)
  - Add namespace restriction.
- SMART (`smart`)
  - Support more drive types.
- Socket Listener (`socket_listener`)
  - Add option to set permissions for UNIX domain sockets.
- StatsD (`statsd`)
  - Add support for Datadog events.

### Output plugins

- AMQP (`amqp`)
  - Add support for gzip compression.
- File (`file`)
  - Add file rotation support.
- Stackdriver (`stackdriver`)
  - Set user agent.
-- VMware Wavefront (`wavefront`)
  - Add option to use strict sanitization rules.

### Aggregator plugins

- Histogram aggregator
  - Add option to reset buckets on flush.

#### Processor plugins

- Converter (`converter`)
  - Add hexadecimal string to integer conversion.
- Enum (`enum`)
  - Support tags.

### Bug fixes

#### Agent

- Create Windows service only when specified or in service manager.
- Don't start Telegraf when stale pid file found.
- Fix inline table support in configuration file.
- Fix multi-line basic strings support in configuration file.
- Fix multiple SIGHUP causes Telegraf to shutdown.
- Fix batch fails when single metric is unserializable.
- Log a warning on write if the metric buffer has overflowed.

#### Plugins

- AMQP (`amqp`) output
  - Fix direct exchange routing key.
- Apex Neptune (`apex_neptune`) inpur
  - Skip invalid power times.
- Docker (`docker`) input
  - Fix docker input does not parse image name correctly.
- Fibaro (`fibaro`) input
  - Set default timeout of `5s`.
- InfluxDB v1.x (`influxdb`) output
  - Fix connection leak on reload.
- InfluxDB v2 output
  - Fix connection leak on reload.
- Lustre 2 (`lustre2`) input
  - Fix only one job per storage target reported.
- Microsoft Azure Monitor (`azure_monitor`) output
  - Fix scale set resource id.
- Microsoft SQL Server (`sqlserver`) input
   Fix connection closing on error.  
- Minecraft (`minecraft`) input
  - Support Minecraft server 1.13 and newer.
- NGINX Upstream Check (`nginx_upstream_check`) input
  - Fix TOML option name.
- PgBounder (`pgbouncer`) input
  - Fix unsupported pkt type error.
- Procstat (`procstat`) input
  - Verify a process passed by `pid_file` exists.
- VMware vSphere (`vsphere`) input
  - Fixed datastore name mapping.

## v1.10.4 [2019-05-14]

### Bug fixes

#### Agent

- Create telegraf user in pre-install RPM scriptlet.
- Fix parse of unix timestamp with more than ns precision.
- Fix race condition in the Wavefront parser.

#### Plugins

- HTTP output plugin (`http`)
  - Fix http output cannot set Host header.
- IPMI Sensor input (`ipmi_sensor`)
  - Add support for hex values.
- InfluxDB v2 output (`influxdb_v2`)
  - Don't discard metrics on forbidden error.
- Interrupts input (`interrupts`)
  - Restore field name case.
- NTPQ input (`ntpq`)
  - Skip lines with missing `refid`.
- VMware vSphere input (`vsphere`)
  - Fix interval estimation.

## v1.10.3 [2019-04-16]

### Bug fixes

#### Agent

- Set log directory attributes in RPM specification.

#### Plugins

- Prometheus Client (`prometheus_client`) output plugin.
  - Allow colons in metric names.

## v1.10.2 [2019-04-02]

### Breaking changes

 Grok input data format (parser): string fields no longer have leading and trailing quotation marks removed.  
 If you are capturing quoted strings, the patterns might need to be updated.

### Bug fixes

#### Agent

- Fix deadlock when Telegraf is aligning aggregators.
- Add owned directories to RPM package specification.
- Fix drop tracking of metrics removed with aggregator `drop_original`.
- Fix aggregator window alignment.
- Fix panic during shutdown of multiple aggregators.
- Fix tags applied to wrong metric on parse error.

#### Plugins

- Ceph (`ceph`) input
  - Fix missing cluster stats.
- DiskIO (`diskio`) input
  - Fix reading major and minor block devices identifiers.
- File (`file`) output
  - Fix open file error handling.
- Filecount (`filecount`) input
  - Fix basedir check and parent dir extraction.
- Grok (`grok`) parser
  - Fix last character removed from string field.
- InfluxDB v2 (`influxdb_v2`) output
  - Fix plugin name in output logging.
- Prometheus (`prometheus`) input
  - Fix parsing of kube config `certificate-authority-data`.
- Prometheus (`prometheus`) output
  - Remove tags that would create invalid label names.
- StatsD (`statsd`) input
  - Listen before leaving start.

## v1.10.1 [2019-03-19]

#### Bug fixes

- Show error when TLS configuration cannot be loaded.
- Add base64-encoding/decoding for Google Cloud PubSub (`pubsub`) plugins.
- Fix type compatibility in VMware vSphere (`vsphere`) input plugin with `use_int_samples` option.
- Fix VMware vSphere (`vsphere`) input plugin shows failed task in vCenter.
- Fix invalid measurement name and skip column in the CSV input data format parser.
- Fix System (`system`) input plugin causing high CPU usage on Raspbian.

## v1.10 [2019-03-05]

#### New input plugins

- [Google Cloud PubSub (`cloud_pubsub`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/cloud_pubsub/README.md) - Contributed by @emilymye
- [Kubernetes Inventory (`kube_inventory`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/cloud_pubsub_push/README.md) - Contributed by @influxdata
- [Neptune Apex (`neptune_apex`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/neptune_apex/README.md) - Contributed by @MaxRenaud
- [NGINX Upstream Check (`nginx_upstream_check`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nginx_upstream_check/README.md) - Contributed by @dmitryilyin
- [Multifile (`multifile`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/multifile/README.md) - Contributed by @martin2250

#### New output plugins

- [Google Cloud PubSub (`cloud_pubsub`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/cloud_pubsub/README.md) - Contributed by @emilymye

#### New output data formats (serializers)

- [ServiceNow Metrics](/telegraf/v1.12/data_formats/output/nowmetric) - Contributed by @JefMuller
- [Carbon2](/telegraf/v1.12/data_formats/output/carbon2) - Contributed by @frankreno

#### Features

- **General**
  - Allow for force gathering ES cluster stats.
  - Add Linux `mipsle` packages.
- **Input plugins**
  - Ceph (`ceph`)
    - Add read and write op per second fields.
  - CouchDB (`couchdb`)
    - Add support for basic auth.
  - DNS Query (`dns_query`)
    - Add `rcode` tag and field.
  - DiskIO (`diskio`)
    - Include `DEVLINKS` in available `udev` properties.
  - HTTP (`http`)
    - Add support for sending a request body to `http` input.
  - InfluxDB Listener (`influxdb_listener`)
    - Add internal metric for line too long.
  - Interrupts (`interrupts`)
    - Add option to store `cpu` as a tag.
  - Kafka Consumer (`kafka_consumer`)
    - Add ability to tag metrics with topic.
  - Kubernetes (`k8s`)
  - Support passing bearer token directly.
  - Microsoft SQL Server (`sqlserver`)
    - Add log send and redo queue fields.
  - MongoDB (`mongodb`)
    - Add `flush_total_time_ns` and additional wired tiger fields.
  - Procstat (`procstat_lookup`)
    - Add running field.
  - Prometheus (`prometheus`)
    - Support passing bearer token directly.
    - Add option to report input timestamp.
  - VMware vSphere (`vsphere`)
    - Improve scalability.
    - Add resource path-based filtering.
  - Varnish (`varnish`)
    - Add configurable timeout.
- **Output plugins**
  - MQTT (`mqtt`)
    - Add option to set retain flag on messages.
  - Stackdriver (`stackdriver`)
    - Add resource type and resource label support
  - VMware Wavefront (`wavefront`)
    - Add support for the Wavefront Direct Ingestion API.
- **Aggregator plugins**
  - Value Counter (`valuecounter`)
    - Allow counting float values.
- **Data formats**
  - **Input data formats**
  - CSV
    - Support `unix_us` and `unix_ns` timestamp format.
    - Add support for `unix` and `unix_ms` timestamps.
  - Grok (`grok`)
    - Allow parser to produce metrics with no fields.
  - JSON
    - Add micro and nanosecond unix timestamp support.
  - **Output data formats**
    - ServiceNow Metrics

#### Bug fixes

- **General**
  - Use `systemd` in Amazon Linux 2 rpm.
  - Fix `initscript` removes `pidfile` of restarted Telegraf process.
- **Input plugins**
  - Consul (`consul`)
    - Use datacenter option spelling.
  - InfluxDB Listener (`influxdb_listener`)
    - Remove auth from `/ping` route.
  - Microsoft SQL Server (`sqlserver`)
    - Set deadlock priority.
  - Nstat (`nstat`)
    - Remove error log when `snmp6` directory does not exist.
  - Ping (`ping`)
    - Host not added when using custom arguments.
  - X.509 Certificate
    - Fix input stops checking certificates after first error.
- **Output plugins**
  - Prometheus (`prometheus`)
    - Sort metrics by timestamp.
  - Stackdriver (`stackdriver`)
    - Skip string fields when writing.
    - Send metrics in ascending time order.

## v1.9.5 [2019-02-26]

### Bug fixes

* General
  * Use `systemd` in Amazon Linux 2 rpm.
* Ceph Storage (`ceph`) input plugin
  * Add backwards compatibility fields in usage and pool statistics.
* InfluxDB (`influxdb`) output plugin
  * Fix UDP line splitting.  
* Microsoft SQL Server (`sqlserver`) input plugin
  * Set deadlock priority to low.
  * Disable results by row in AzureDB query.
* Nstat (`nstat`) input plugin
  * Remove error log when `snmp6` directory does not exist.
* Ping (`ping`) input plugin
  * Host not added when using custom arguments.
* Stackdriver (`stackdriver`) output plugin
  * Skip string fields when writing to stackdriver output.
  * Send metrics in ascending time order.

## v1.9.4 [2019-02-05]

### Bug fixes

* General
  * Fix `skip_rows` and `skip_columns` options in csv parser.
  * Build official packages with Go 1.11.5.
* Jenkins input plugin
  * Always send basic auth in jenkins input.
* Syslog (`syslog`) input plugin
    * Fix definition of multiple syslog plugins.

## v1.9.3 [2019-01-22]

#### Bug fixes

* General
  * Fix latest metrics not sent first when output fails.
  * Fix `internal_write buffer_size` not reset on timed writes.
* AMQP Consumer (`amqp_consumer`) input plugin
  - Fix `amqp_consumer` input stops consuming when it receives
    unparsable messages.
* Couchbase (`couchbase`) input plugin
  * Remove `userinfo` from cluster tag in `couchbase` input.
* Microsoft SQL Server (`sqlserver`) input plugin
  * Fix arithmetic overflow in `sqlserver`) input.
* Prometheus (`prometheus`) input plugin
  * Fix `prometheus` input not detecting added and removed pods.

## v1.9.2 [2019-01-08]

### Bug fixes

- Increase `varnishstat` timeout.
- Remove storage calculation for non-Azure-managed instances and add server version.
- Fix error sending empty tag value in `azure_monitor` output.
- Fix panic with Prometheus input plugin on shutdown.
- Support non-transparent framing of syslog messages.
- Apply global- and plugin-level metric modifications before filtering.
- Fix `num_remapped_pgs` field in `ceph` plugin.
- Add `PDH_NO_DATA` to known counter error codes in `win_perf_counters`.
- Fix `amqp_consumer` stops consuming on empty message.
- Fix multiple replace tables not working in strings processor.
- Allow non-local UDP connections in `net_response`.
- Fix TOML option names in parser processor.
- Fix panic in Docker input with bad endpoint.
- Fix original metric modified by aggregator filters.

## v1.9.1 [2018-12-11]

### Bug fixes

- Fix boolean handling in splunkmetric serializer.
- Set default config values in Jenkins input.
- Fix server connection and document stats in MongoDB input.
- Add X-Requested-By header to Graylog input.
- Fix metric memory not freed from the metric buffer on write.
- Add support for client TLS certificates in PostgreSQL inputs.
- Prevent panic when marking the offset in `kafka_consumer`.
- Add early metrics to aggregator and honor `drop_original` setting.
- Use `-W` flag on BSD variants in ping input.
- Allow delta metrics in Wavefront parser.

## v1.9.0 [2018-11-20]

#### Release Notes

- The HTTP Listener (`http_listener`) input plugin has been renamed to
  InfluxDB Listener (`influxdb_listener`) input plugin and
  use of the original name is deprecated.  The new name better describes the
  intended use of the plugin as an InfluxDB relay.  For general purpose
  transfer of metrics in any format using HTTP, InfluxData recommends using
  HTTP Listener v2 (`http_listener_v2`) input plugin.

- Input plugins are no longer limited from adding metrics when the output is
  writing and new metrics will move into the metric buffer as needed.  This
  will provide more robust degradation and recovery when writing to a slow
  output at high throughput.

  To avoid overconsumption when reading from queue consumers, the following
  input plugins use the new option `max_undelivered_messages` to limit the number
  of outstanding unwritten metrics:

  * Apache Kafka Consumer (`kafka_consumer`)
  * AMQP Consumer (`amqp_consumer`)
  * MQTT Consumer (`mqtt_consumer`)
  * NATS Consumer (`nats_consumer`)
  * NSQ Consumer (`nsq_consumer`)

#### New input plugins

- [HTTP Listener v2 (`http_listener_v2`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/http_listener_v2/README.md) - Contributed by @jul1u5
- [IPVS (`ipvs`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/ipvs/README.md) - Contributed by @amoghe
- [Jenkins (`jenkins`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/jenkins/README.md) - Contributed by @influxdata & @lpic10
- [NGINX Plus API (`nginx_plus_api`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/nginx_plus_api/README.md) - Contributed by @Bugagazavr
- [NGINX VTS (`nginx_vts`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/nginx_vts/README.md) - Contributed by @monder
- [Wireless (`wireless`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/wireless/README.md) - Contributed by @jamesmaidment

#### New output plugins

- [Stackdriver (stackdriver)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/outputs/stackdriver/README.md) - Contributed by @jamesmaidment

#### Features

- General
  - Add ability to define a custom service name when installing as a Windows service.
  - Add new configuration for CSV column explicit type conversion.
  - Add Telegraf version to `User-Agent` header.
  - Add ability to specify bytes options as strings with units.
  - Add per output `flush_interval`, `metric_buffer_limit`, and `metric_batch_size`.
- Amazon Kinesis (`kinesis`) output plugin
  - Use `DescribeStreamSummary` in place of `ListStreams`.
- DNS Query (`dns_query`) input plugin
  - Query servers in parallel.
- Datadog (`datadog`) output plugin
  - Add an option to specify a custom URL.
  - Use non-allocating field and tag accessors.
- Filecount (`filecount`) input plugin
  - Add per-directory file count.
- HTTP Output (`http output`) plugin
  - Add entity-body compression.
- Memcached (`memcached`) input plugin
  - Collect additional statistics.
- NSQ (`nsq`) input plugin
  - Add TLS configuration support.
- Ping (`ping`) input plugin
  - Add support for IPv6.
- Procstat (`procstat`) input plugin
  - Add Windows service name lookup.
- Prometheus (`prometheus`) input plugin
  - Add scraping for Prometheus annotation in Kubernetes.
  - Allow connecting to Prometheus using UNIX socket.
- Strings (`strings`) processor plugin
  - Add `replace` function.
- VMware vSphere (`vsphere`) input plugin
  - Add LUN to data source translation.

#### Bug fixes

- Remove `time_key` from the field values in JSON parser.
- Fix input time rounding when using a custom interval.
- Fix potential deadlock or leaked resources on restart or reload.
- Fix outputs block inputs when batch size is reached.
- Fix potential missing datastore metrics in VMware vSphere (`vsphere`) input plugin.

## v1.8.3 [2018-10-30]

### Bug fixes

- Add DN attributes as tags in X.509 Certificate (`x509_cert`) input plugin to avoid series overwrite.
- Prevent connection leak by closing unused connections in AMQP (`amqp`) output plugin.
- Use default partition key when tag does not exist in Amazon Kinesis (`kinesis`) output plugin.
- Log the correct error in JTI OpenConfig Telemetry (`jti_openconfig_telemetry`) input plugin.
- Handle panic when IMPI Sensor (`ipmi_sensor`) input plugin gets bad input.
- Don't add unserializable fields to Jolokia2 (`jolokia2`) input plugin.
- Fix version check in PostgreSQL Exstensible (`postgresql_extensible`) plugin.

## v1.8.2 [2018-10-17]

### Bug fixes

* Aerospike (`aerospike`) input plugin
  * Support uint fields.
* Docker (`docker`) input plugin
  * Use container name from list if no name in container stats.
* Filecount (`filecount`) input plugin
  * Prevent panic on error in file stat.
* InfluxDB v2 (`influxdb_v2`) input plugin
  * Update write path to match updated v2 API.
* Logparser (`logparser`) input plugin
  * Fix panic.
* MongoDB (`mongodb`) input plugin
  * Lower authorization errors to debug level.
* MQTT Consumer (`mqtt_consumer`) input plugin
  * Fix connect and reconnect.
* Ping (`ping`) input plugin
  * Return correct response code.
* VMware vSphere (`vsphere`) input plugin
  * Fix missing timeouts.
* X.509 Certificate (`x509_cert`) input plugin
  * Fix segfault.

## v1.8.1 [2018-10-03]

### Bug fixes

- Fix `hardware_type` may be truncated in Microsoft SQL Server (`sqlserver`) input plugin.
- Improve performance in Basicstats (`basicstats`) aggregator plugin.
- Add `hostname` to TLS config for SNI support in X.509 Certicate (`x509_cert`) input plugin.
- Don't add tags with empty values to OpenTSDB (`opentsdb`) output plugin.
- Fix panic during network error in VMware vSphere (`vsphere`) input plugin.
- Unify error response in HTTP Listener (`http_listener`) input plugin with InfluxDB (`influxdb`) output plugin.
- Add `UUID` to VMs in VMware vSphere (`vsphere`) input plugin.
- Skip tags with empty values in Amazon Cloudwatch (`cloudwatch`) output plugin.
- Fix missing non-realtime samples in VMware vSphere (`vsphere`) input plugin.
- Fix case of `timezone`/`grok_timezone` options in grok parser and logparser input plugin.

## v1.8 [2018-09-21]

### New input plugins

- [ActiveMQ (`activemq`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/activemq/README.md) - Contributed by @mlabouardy
- [Beanstalkd (`beanstalkd`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/beanstalkd/README.md) - Contributed by @44px
- [File (`file`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/file/README.md) - Contributed by @maxunt
- [Filecount (`filecount`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/filecount/README.md) - Contributed by @sometimesfood
- [Icinga2 (`icinga2`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/icinga2/README.md) - Contributed by @mlabouardy
- [Kibana (`kibana`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/kibana/README.md) - Contributed by @lpic10
- [PgBouncer (`pgbouncer`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/pgbouncer/README.md) - Contributed by @nerzhul
- [Temp (`temp`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/temp/README.md) - Contributed by @pytimer
- [Tengine (`tengine`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/tengine/README.md) - Contributed by @ertaoxu
- [VMware vSphere (`vsphere`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/vsphere/README.md) - Contributed by @prydin
- [X.509 Certificate (`x509_cert`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/x509_cert/README.md) - Contributed by @jtyr

### New processor plugins

- [Enum (`enum`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/processors/enum/README.md) - Contributed by @KarstenSchnitter
- [Parser (`parser`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/processors/parser/README.md) - Contributed by @Ayrdrie & @maxunt
- [Rename (`rename`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/processors/rename/README.md) - Contributed by @goldibex
- [Strings (`strings`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/processors/strings/README.md) - Contributed by @bsmaldon

### New aggregator plugins

- [ValueCounter (`valuecounter`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/aggregators/valuecounter/README.md) - Contributed by @piotr1212

### New output plugins

- [Azure Monitor (`azure_monitor`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/azure_monitor/README.md) - Contributed by @influxdata
- [InfluxDB v2 (`influxdb_v2`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/influxdb_v2/README.md) - Contributed by @influxdata

### New input data formats (parsers)

- [csv](/telegraf/v1.8/data_formats/input/csv) - Contributed by @maxunt
- [grok](/telegraf/v1.8/data_formats/input/grok/) - Contributed by @maxunt
- [logfmt](/telegraf/v1.8/data_formats/input/logfmt/) - Contributed by @Ayrdrie & @maxunt
- [wavefront](/telegraf/v1.8/data_formats/input/wavefront/) - Contributed by @puckpuck

### New output data formats (serializers)

- [splunkmetric](/telegraf/v1.8/data_formats/output/splunkmetric/) - Contributed by @ronnocol

### Features

- Add SSL/TLS support to Redis (`redis`) input plugin.
- Add tengine input plugin.
- Add power draw field to the NVIDIA SMI (`nvidia_smi`) input plugin.
- Add support for Solr 7 to the Solr (`solr`) input plugin.
- Add owner tag on partitions in Burrow (`burrow`) input plugin.
- Add container status tag to Docker (`docker`) input plugin.
- Add ValueCounter (`valuecounter`) aggregator plugin.
- Add new measurement with results of `pgrep` lookup to Procstat (`procstat`) input plugin.
- Add support for comma in logparser timestamp format.
- Add path tag to Tail (`tail`) input plugin.
- Add log message when tail is added or removed from a file.
- Add option to use of counter time in win perf counters.
- Add energy and power field and device id tag to Fibaro (`fibaro`) input plugin.
- Add HTTP path configuration for OpenTSDB output.
- Gather IPMI metrics concurrently.
- Add mongo document and connection metrics.
- Add enum processor plugin.
- Add user tag to procstat input.
- Add support for multivalue metrics to collectd parser.
- Add support for setting kafka client id.
- Add file input plugin and grok parser.
- Improve cloudwatch output performance.
- Add x509_cert input plugin.
- Add IPSIpAddress syntax to ipaddr conversion in snmp plugin.
- Add Filecount filecount input plugin.
- Add support for configuring an AWS `endpoint_url`.
- Send all messages before waiting for results in Kafka output plugin.
- Add support for lz4 compression to Kafka output plugin.
- Split multiple sensor keys in ipmi input.
- Support StatisticValues in cloudwatch output plugin.
- Add ip restriction for the prometheus_client output.
- Add PgBouncer (`pgbouncer`) input plugin.
- Add ActiveMQ input plugin.
- Add wavefront parser plugin.
- Add rename processor plugin.
- Add message 'max_bytes' configuration to kafka input.
- Add gopsutil meminfo fields to Mem (`mem`) input plugin.
- Document how to parse Telegraf logs.
- Use dep v0.5.0.
- Add ability to set measurement from matched text in grok parser.
- Drop message batches in Kafka (`kafka`) output plugin if too large.
- Add support for static and random routing keys in Kafka (`kafka`) output plugin.
- Add logfmt parser plugin.
- Add parser processor plugin.
- Add Icinga2 input plugin.
- Add name, time, path and string field options to JSON parser.
- Add forwarded records to sqlserver input.
- Add Kibana input plugin.
- Add csv parser plugin.
- Add read_buffer_size option to statsd input.
- Add azure_monitor output plugin.
- Add queue_durability parameter to amqp_consumer input.
- Add strings processor.
- Add OAuth 2.0 support to HTTP output plugin.
- Add Unix epoch timestamp support for JSON parser.
- Add options for basic auth to haproxy input.
- Add temp input plugin.
- Add Beanstalkd input plugin.
- Add means to specify server password for redis input.
- Add Splunk Metrics serializer.
- Add input plugin for VMware vSphere.
- Align metrics window to interval in cloudwatch input.
- Improve Azure Managed Instance support + more in sqlserver input.
- Allow alternate binaries for iptables input plugin.
- Add influxdb_v2 output plugin.

### Bug fixes

- Fix divide by zero in logparser input.
- Fix instance and object name in performance counters with backslashes.
- Reset/flush saved contents from bad metric.
- Document all supported cli arguments.
- Log access denied opening a service at debug level in win_services.
- Add support for Kafka 2.0.
- Fix nagios parser does not support ranges in performance data.
- Fix nagios parser does not strip quotes from performance data.
- Fix null value crash in postgresql_extensible input.
- Remove the startup authentication check from the cloudwatch output.
- Support tailing files created after startup in tail input.
- Fix CSV format configuration loading.


## v1.7.4 [2018-08-29]

### Bug fixes

* Continue sending write batch in UDP if a metric is unserializable in InfluxDB (`influxdb`) output plugin.
* Fix PowerDNS (`powerdns`) input plugin tests.
* Fix `burrow_group` offset calculation for Burrow (`burrow`) input plugin.
* Add `result_code` value for errors running ping command.
* Remove timeout deadline for UDP in Syslog (`syslog`) input plugin.
* Ensure channel is closed if an error occurs in CGroup (`cgroup`) input plugin.
* Fix sending of basic authentication credentials in HTTP `(output)` output plugin.
* Use the correct `GOARM` value in the Linux armel package.

## v1.7.3 [2018-08-07]

### Bug fixes

* Reduce required Docker API version.
* Keep leading whitespace for messages in syslog input.
* Skip bad entries on interrupt input.
* Preserve metric type when using filters in output plugins.
* Fix error message if URL is unparseable in InfluxDB output.
* Use explicit `zpool` properties to fix parse error on FreeBSD 11.2.
* Lock buffer when adding metrics.

## v1.7.2 [2018-07-18]

### Bug fixes

* Use localhost as default server tag in Zookeeper (`zookeeper`) input plugin.
* Don't set values when pattern doesn't match in Regex (`regex`) processor plugin.
* Fix output format of Printer (`printer`) processor plugin.
* Fix metric can have duplicate field.
* Return error if NewRequest fails in HTTP (`http`) output plugin.
* Reset read deadline for Syslog (`syslog`) input plugin.
* Exclude cached memory on Docker (`docker`) input plugin.

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
  an [example configuration](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/jolokia2/examples) to help you
  get started.

- For plugins supporting TLS, you can now specify the certificate and keys
  using `tls_ca`, `tls_cert`, `tls_key`.  These options behave the same as
  the, now deprecated, `ssl` forms.

### New input plugins

- [Aurora (`aurora`)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/aurora/README.md) - Contributed by @influxdata
- [Burrow (`burrow`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/burrow/README.md) - Contributed by @arkady-emelyanov
- [`fibaro`](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/fibaro/README.md) - Contributed by @dynek
- [`jti_openconfig_telemetry`](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/jti_openconfig_telemetry/README.md) - Contributed by @ajhai
- [`mcrouter`](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/mcrouter/README.md) - Contributed by @cthayer
- [NVIDIA SMI (`nvidia_smi`)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/nvidia_smi/README.md) - Contributed by @jackzampolin
- [Syslog (`syslog`)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/syslog/README.md) - Contributed by @influxdata

### New processor plugins

- [converter](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/processors/converter/README.md) - Contributed by @influxdata
- [regex](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/processors/regex/README.md) - Contributed by @44px
- [topk](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/processors/topk/README.md) - Contributed by @mirath

### New output plugins

- [HTTP (`http`)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/http/README.md) - Contributed by @Dark0096
- [Application Insights (`application_insights`) output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/application_insights/README.md): Contribute by @karolz-ms

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

### Bug fixes

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
  For in depth recommendations on upgrading, see [Metric version](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/mysql#metric-version) in the MySQL input plugin documentation.

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

- [HTTP (`http`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/http/README.md) - Thanks to @grange74
- [Ipset (`ipset`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/ipset/README.md) - Thanks to @sajoupa
- [NATS Server Monitoring (`nats`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/nats/README.md) - Thanks to @mjs and @levex

### New processor plugins

- [Override (`override`) processor plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/processors/override/README.md) - Thanks to @KarstenSchnitter

### New parsers

- [Dropwizard input data format](https://github.com/influxdata/telegraf/blob/release-1.8/docs/DATA_FORMATS_INPUT.md#dropwizard) - Thanks to @atzoum

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
- [CrateDB (cratedb)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/cratedb) - Thanks to @felixge
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

Users of the windows [ping plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/ping) will need to drop or migrate their measurements to continue using the plugin.
The reason for this is that the windows plugin was outputting a different type than the linux plugin.
This made it impossible to use the `ping` plugin for both windows and linux machines.

#### Changes to the Ceph plugin

For the [Ceph plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/ceph), the `ceph_pgmap_state` metric content has been modified to use a unique field `count`, with each state expressed as a `state` tag.

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

The [Riemann output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/riemann) has been rewritten
and the [previous riemann plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/riemann_legacy) is _incompatible_ with the new one.
The reasons for this are outlined in issue [#1878](https://github.com/influxdata/telegraf/issues/1878).
The previous Riemann output will still be available using `outputs.riemann_legacy` if needed, but that will eventually be deprecated.
It is highly recommended that all users migrate to the new Riemann output plugin.

#### New Socket Listener and Socket Writer plugins

Generic [Socket Listener](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/socket_listener) and [Socket Writer](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/socket_writer) plugins have been implemented for receiving and sending UDP, TCP, unix, & unix-datagram data.
These plugins will replace [udp_listener](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/udp_listener) and [tcp_listener](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/tcp_listener), which are still available but will be deprecated eventually.

### Features

- Add SASL options for the [Kafka output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/kafka).
- Add SSL configuration for [HAproxy input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/haproxy).
- Add the [Interrupts input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/interrupts).
- Add generic [Socket Listener input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/socket_listener) and [socket writer output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/socket_writer).
- Extend the [HTTP Response input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/http_response) to support searching for a substring in response. Return 1 if found, else 0.
- Add userstats to the [MySQL input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/mysql).
- Add more InnoDB metric to the [MySQL input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/mysql).
- For the [Ceph input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/ceph), `ceph_pgmap_state` metric now uses a single field `count`, with PG state published as `state` tag.
- Use own client for improved through-put and less allocations in the [InfluxDB output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/influxdb).
- Keep -config-directory when running as Windows service.
- Rewrite the [Riemann output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/riemann).
- Add support for name templates and udev tags to the [DiskIO input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/system/DISK_README.md#diskio-input-plugin).
- Add integer metrics for [Consul](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/consul) check health state.
- Add lock option to the [IPtables input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/iptables).
- Support [ipmi_sensor input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/ipmi_sensor) querying local ipmi sensors.
- Increment gather_errors for all errors emitted by inputs.
- Use the official docker SDK.
- Add [AMQP consumer input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/amqp_consumer).
- Add pprof tool.
- Support DEAD(X) state in the [system input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/system).
- Add support for [MongoDB](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/mongodb) client certificates.
- Support adding [SNMP](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/snmp) table indexes as tags.
- Add [Elasticsearch 5.x output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/elasticsearch).
- Add json timestamp units configurability.
- Add support for Linux sysctl-fs metrics.
- Support to include/exclude docker container labels as tags.
- Add [DMCache input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/dmcache).
- Add support for precision in [HTTP Listener input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/http_listener).
- Add `message_len_max` option to the [Kafka consumer input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/kafka_consumer).
- Add [collectd parser](/telegraf/v1.3/concepts/data_formats_input/#collectd).
- Simplify plugin testing without outputs.
- Check signature in the [GitHub webhook input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/webhooks/github).
- Add [papertrail](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/webhooks/papertrail) support to webhooks.
- Change [jolokia input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/jolokia) to use bulk requests.
- Add [DiskIO input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/system/DISK_README.md#diskio-input-plugin) for Darwin.
- Add use_random_partitionkey option to the [Kinesis output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/kinesis).
- Add tcp keep-alive to [Socket Listener input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/socket_listener) and [Socket Writer output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/socket_writer).
- Add [Kapacitor input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/kapacitor).
- Use Go (golang) 1.8.1.
- Add documentation for the [RabbitMQ input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/rabbitmq).
- Make the [Logparser input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/logparser) check for newly-created files.

### Bug fixes

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

### Bug fixes

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

### Bug fixes

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

### Bug fixes

- Make snmptranslate not required when using numeric OID.
- Add a global snmp translation cache.

## v1.1.1 [2016-11-14]

### Bug fixes

- Fix issue parsing toml durations with single quotes.

## v1.1.0 [2016-11-07]

### Release Notes

- Telegraf now supports two new types of plugins: processors & aggregators.

- On systemd Telegraf will no longer redirect it's stdout to /var/log/telegraf/telegraf.log.
On most systems, the logs will be directed to the systemd journal and can be
accessed by `journalctl -u telegraf.service`. Consult the systemd journal
documentation for configuring journald. There is also a [`logfile` config option](https://github.com/influxdata/telegraf/blob/release-1.8/etc/telegraf.conf#L70)
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

### Bug fixes

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

### Bug fixes

- Prometheus output: Fix bug with multi-batch writes.
- Fix unmarshal of influxdb metrics with null tags.
- Add configurable timeout to influxdb input plugin.
- Fix statsd no default value panic.

## v1.0 [2016-09-08]

### Release Notes

**Breaking Change** The SNMP plugin is being deprecated in it's current form.
There is a [new SNMP plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/snmp)
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
- RabbitMQ input: made url parameter optional by using DefaultURL (`http://localhost:15672`) if not specified.
- Limit AWS GetMetricStatistics requests to 10 per second.
- RabbitMQ/Apache/InfluxDB inputs: made url(s) parameter optional by using reasonable input defaults if not specified.
- Refactor of flush_jitter argument.
- Add inactive & active memory to mem plugin.
- Official Windows service.
- Forking sensors command to remove C package dependency.
- Add a new SNMP plugin.

### Bug fixes

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
