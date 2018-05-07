---
title: Release Notes/Changelog
menu:
  enterprise_kapacitor_1_5:
    weight: 0
    parent: About the Project
---

# Changelog

## v1.4.1 [2018-03-14]

Includes bugfixes from Kapacitor 1.4.1

### Bug fixes

* Fix `load` service not working when authentication is enabled.

## v1.4.0 [2017-12-08]

The v1.4.0 release has many new features, here is a list of some of the highlights:

1. Load TICKscripts and alert handlers from a directory.
2. Structed Logging  with a logging API endpoints to be able to tail logs for given tasks.
3. Autoscale support for Docker Swarm and EC2 Autoscaling.
4. Sideload data into your TICKscript streams from external sources.
5. Fully customizable POST body for the alert POST handler and the httpPost node.

See the complete list of bug fixes and features below.

### Bugfixes

- [#1710](https://github.com/influxdata/kapacitor/issues/1710): Idle Barrier is dropping all messages when source has clock offset
- [#1719](https://github.com/influxdata/kapacitor/pull/1719): Fix oddly generated TOML for mqtt & httppost

## v1.4.0-rc3 [2017-12-04]

### Bugfixes

- [#1703](https://github.com/influxdata/kapacitor/pull/1703): Fix issues where log API checked the wrong header for the desired content type.

## v1.4.0-rc2 [2017-11-28]

### Features

- [#1622](https://github.com/influxdata/kapacitor/pull/1622): Add support for AWS EC2 autoscaling services.
- [#1566](https://github.com/influxdata/kapacitor/pull/1566): Add BarrierNode to emit BarrierMessage periodically

### Bugfixes

- [#1250](https://github.com/influxdata/kapacitor/issues/1250): Fix VictorOps "data" field being a string instead of actual JSON.
- [#1697](https://github.com/influxdata/kapacitor/issues/1697): Fix panic with MQTT toml configuration generation.

## v1.4.0-rc1 [2017-11-09]

### Features

- [#1408](https://github.com/influxdata/kapacitor/issues/1408): Add Previous state
- [#1575](https://github.com/influxdata/kapacitor/issues/1575): Add support to persist replay status after it finishes.
- [#1461](https://github.com/influxdata/kapacitor/issues/1461): alert.post and https_post timeouts needed.
- [#1413](https://github.com/influxdata/kapacitor/issues/1413): Add subscriptions modes to InfluxDB subscriptions.
- [#1436](https://github.com/influxdata/kapacitor/issues/1436): Add linear fill support for QueryNode.
- [#1345](https://github.com/influxdata/kapacitor/issues/1345): Add MQTT Alert Handler
- [#1390](https://github.com/influxdata/kapacitor/issues/1390): Add built in functions to convert timestamps to integers
- [#1425](https://github.com/influxdata/kapacitor/pull/1425): BREAKING: Change over internal API to use message passing semantics.
    The breaking change is that the Combine and Flatten nodes previously, but erroneously, operated across batch boundaries; this has been fixed.
- [#1497](https://github.com/influxdata/kapacitor/pull/1497): Add support for Docker Swarm autoscaling services.
- [#1485](https://github.com/influxdata/kapacitor/issues/1485): Add bools field types to UDFs.
- [#1549](https://github.com/influxdata/kapacitor/issues/1549): Add stateless now() function to get the current local time.
- [#1545](https://github.com/influxdata/kapacitor/pull/1545): Add support for timeout, tags and service template in the Alerta AlertNode
- [#1568](https://github.com/influxdata/kapacitor/issues/1568): Add support for custom HTTP Post bodies via a template system.
- [#1569](https://github.com/influxdata/kapacitor/issues/1569): Add support for add the HTTP status code as a field when using httpPost
- [#1535](https://github.com/influxdata/kapacitor/pull/1535): Add logfmt support and refactor logging.
- [#1481](https://github.com/influxdata/kapacitor/pull/1481): Add ability to load tasks/handlers from dir.
    TICKscript was extended to be able to describe a task exclusively through a tickscript.
      * tasks no longer need to specify their TaskType (Batch, Stream).
      * `dbrp` expressions were added to tickscript.
    Topic-Handler file format was modified to include the TopicID and HandlerID in the file.
    Load service was added; the service can load tasks/handlers from a directory.
- [#1606](https://github.com/influxdata/kapacitor/pull/1606): Update Go version to 1.9.1
- [#1578](https://github.com/influxdata/kapacitor/pull/1578): Add support for exposing logs via the API. API is released as a technical preview.
- [#1605](https://github.com/influxdata/kapacitor/issues/1605): Add support for {{ .Duration }} on Alert Message property.
- [#1644](https://github.com/influxdata/kapacitor/issues/1644): Add support for [JSON lines](https://en.wikipedia.org/wiki/JSON_Streaming#Line_delimited_JSON) for steaming HTTP logs.
- [#1637](https://github.com/influxdata/kapacitor/issues/1637): Add new node Sideload, that allows loading data from files into the stream of data. Data can be loaded using a hierarchy.
- [#1667](https://github.com/influxdata/kapacitor/pull/1667): Promote Alert API to stable v1 path.
- [#1668](https://github.com/influxdata/kapacitor/pull/1668): Change WARN level logs to INFO level.

### Bugfixes

- [#916](https://github.com/influxdata/kapacitor/issues/916): Crash of Kapacitor on Windows x64 when starting a recording
- [#1400](https://github.com/influxdata/kapacitor/issues/1400): Allow for `.yml` file extensions in `define-topic-handler`
- [#1402](https://github.com/influxdata/kapacitor/pull/1402): Fix http server error logging.
- [#1500](https://github.com/influxdata/kapacitor/pull/1500): Fix bugs with stopping running UDF agent.
- [#1470](https://github.com/influxdata/kapacitor/pull/1470): Fix error messages for missing fields which are arguments to functions are not clear
- [#1516](https://github.com/influxdata/kapacitor/pull/1516): Fix bad PagerDuty test the required server info.
- [#1581](https://github.com/influxdata/kapacitor/pull/1581): Add SNMP sysUpTime to SNMP Trap service
- [#1547](https://github.com/influxdata/kapacitor/issues/1547): Fix panic on recording replay with HTTPPostHandler.
- [#1623](https://github.com/influxdata/kapacitor/issues/1623): Fix k8s incluster master api dns resolution
- [#1630](https://github.com/influxdata/kapacitor/issues/1630): Remove the pidfile after the server has exited.
- [#1641](https://github.com/influxdata/kapacitor/issues/1641): Logs API writes multiple http headers.
- [#1657](https://github.com/influxdata/kapacitor/issues/1657): Fix missing dependency in rpm package.
- [#1660](https://github.com/influxdata/kapacitor/pull/1660): Force tar owner/group to be root.
- [#1663](https://github.com/influxdata/kapacitor/pull/1663): Fixed install/remove of kapacitor on non-systemd Debian/Ubuntu systems.
    Fixes packaging to not enable services on RHEL systems.
    Fixes issues with recusive symlinks on systemd systems.
- [#1662](https://github.com/influxdata/kapacitor/issues/1662): Fix invalid default MQTT config.

## v1.3.3 [2017-08-11]

### Bugfixes

- Bypass auth when `pprof` is enabled.

## v1.3.2 [2017-08-08]

### Bugfixes

- Use details field from alert node in PagerDuty.

## v1.3.1 [2017-06-20]

### Bugfixes

- Fix inconsistent naming of node vs member.

## v1.3.0 [2017-06-19]

### Release Notes

With this release, Kapacitor Enterprise can be clustered and will deduplicate alerts generated within the cluster.

### Bugfixes

- Expose HTTP API advertise address.
- Fix panic if alerts are triggering during startup.
- Fix `ENV` overrides not working for text Unmarshaler types.

## v1.3.0-rc3 [2017-06-13]

### Bugfixes

- Fix `build.sh` to copy build artifacts back out of docker data volume.

## v1.3.0-rc2 [2017-06-13]

### Bugfixes

- Expose Advertise Address properly.

## v1.3.0-rc1 [2017-06-09]

### Features

- Add Alert deduplication for a cluster of Kapacitor Enterprise nodes.
- Add support for subscription modes.

### Bugfixes

- Fix data race in rendezvous hash type.

## v1.2.2 [2017-04-14]

### Bugfixes

- Fix InfluxDB token client not opening.

## v1.2.1 [2017-04-13]

### Release Notes

No Kapacitor Enterprise-specific changes, only upgrading to Kapacitor 1.2.1.
Contains the fix for stale credentials when querying InfluxDB.

## v1.2.0 [2017-01-24]

### Release Notes

No Kapacitor Enterprise-specific changes, only upgrading to Kapacitor 1.2.0.

## v1.1.1 [2016-12-06]

### Release Notes

No Kapacitor Enterprise-specific changes, only upgrading to Kapacitor 1.1.1.

## v1.1.0 [2016-11-08]

### Release Notes

### Bugfixes

- Update to add Kapacitor dynamic config support.

## v1.0.2 [2016-10-06]

### Release Notes

Update to Kapacitor 1.0.2

### Bugfixes

- Fail on startup if saving cluster/server IDs fails.
- Update to Kapacitor fixes for #954

## v1.0.1 [2016-09-26]

### Release Notes

Update to Kapacitor 1.0.1
No Kapacitor Enterprise-specific changes.

## v1.0.0 [2016-09-02]

### Release Notes

Update to Kapacitor 1.0.0

### Features

- Upgrade to Kapacitor 1.0.0-rc3
    NOTE: rc3 and the final 1.0.0 release are identical.

## v0.1.0 [2016-08-29]

### Release Notes

Update to Kapacitor 1.0.0-rc2

### Features

- Upgrade to Kapacitor 1.0.0-rc2

## v0.0.5 [2016-08-12]

### Release Notes

Update to lastest Kapacitor for Subscription improvements.

### Bugfixes

- Remove default user, only add it for tests.

## v0.0.4 [2016-08-10]

### Release Notes

### Features

### Bugfixes

- Fix PM permission conversion error for generic read/write privileges to dbs.

## v0.0.3 [2016-08-03]

### Release Notes

### Features

- Add token-based authentication for InfluxDB communication.

### Bugfixes

## v0.0.2 [2016-07-27]

### Release Notes

### Features

- Add mechanism for subscription token-based auth.

### Bugfixes

## v0.0.1 [2016-07-25]

### Release Notes

First release of Kapacitor Enterprise with basic authentication/authorization support.

### Features

- Auth Service Implementation. Simple boltdb/bcrypt backed users/auth.
- Entitlements and Enterprise registration.
- BREAKING: Search for valid configuration on startup in `~/.kapacitor` and `/etc/kapacitor/`.
    This is so that the `-config` CLI flag is not required if the configuration is found in a standard location.
    The configuration file being used is always logged to `STDERR`.
- Add support for using InfluxDB Enterprise meta for users backend.
