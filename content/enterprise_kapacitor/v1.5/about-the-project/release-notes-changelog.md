---
title: Release Notes/Changelog
menu:
  enterprise_kapacitor_1_5:
    weight: 0
    parent: About the Project
---

## v1.5.8 [2020-1-27]

This Kapacitor Enterprise release builds on the Kapacitor OSS 1.5.8 release. For details on changes incorporated from the Kapacitor OSS release, see [Kapacitor OSS release notes](https://docs.influxdata.com/kapacitor/v1.5/about_the_project/releasenotes-changelog/).

## v1.5.7 [2020-10-26]

This Kapacitor Enterprise release builds on the Kapacitor OSS 1.5.7 release. For details on changes incorporated from the Kapacitor OSS release, see [Kapacitor OSS release notes](https://docs.influxdata.com/kapacitor/v1.5/about_the_project/releasenotes-changelog/).

## v1.5.6 [2020-07-17]

This Kapacitor Enterprise release builds on the Kapacitor OSS 1.5.6 release. For details on changes incorporated from the Kapacitor OSS release, see [Kapacitor OSS release notes](https://docs.influxdata.com/kapacitor/v1.5/about_the_project/releasenotes-changelog/).

## v1.5.5 [2020-04-22]

This Kapacitor Enterprise release builds on the Kapacitor OSS 1.5.5 release. For details on changes incorporated from the Kapacitor OSS release, see [Kapacitor OSS release notes](https://docs.influxdata.com/kapacitor/v1.5/about_the_project/releasenotes-changelog/).

### Breaking changes

- Update release checksums (used to verify release bits haven't been tampered with) from MD5 (Message Digest, 128-bit digest) to SHA-256 (Secure Hash Algorithm 2, 256-bit digest).

## v1.5.4 [2020-01-16]

This Kapacitor Enterprise release builds on the Kapacitor OSS 1.5.4 release. For details on changes incorporated from the Kapacitor OSS release, see [Kapacitor OSS release notes](https://docs.influxdata.com/kapacitor/v1.5/about_the_project/releasenotes-changelog/).

## Features

- Add support for custom Certificate Authority (CA) certificates when connecting to InfluxDB Enterprise meta node.
- Update to Kapacitor master, includes upgrade to Go 1.13.6 and updated release build.

## v1.5.3 [2019-06-18]

This Kapacitor Enterprise release builds on the Kapacitor OSS 1.5.3 release. For details on changes incorporated from the Kapacitor OSS release, see [Kapacitor OSS release notes](https://docs.influxdata.com/kapacitor/v1.5/about_the_project/releasenotes-changelog/).

### Breaking changes

**New topic handler behavior**

All topic owners must be available when a user attempts to create, update, or delete a topic handler. A liveness probe is performed on only the nodes that own the topic. If an owner node is unresponsive, then an error message like the following is generated:

```bash
$ kapacitor -skipVerify -url https://kapacitor:kapacitor@localhost:10092 define-topic-handler ../log.yaml

failed to create handler: could not verify liveness of topic owners: status of 4ab28f5e-b38e-4660-9073-b4a46b4f59f3 is left
```

## Features

- Ensure all owner nodes are alive before creating, updating, or deleting topic handlers. See note above.
- Support insecure TLS and auth when connecting to InfluxDB Enterprise meta node.

### Bug fixes

- Fix config start error from extra 'load' section
- Update build script to correctly change file ownership in order to make `rpm` verification pass on RH-based systems.

## v1.5.2 [2018-12-12]
*Includes features and bug fixes from [Kapacitor 1.5.3](https://docs.influxdata.com/kapacitor/v1.5/about_the_project/releasenotes-changelog/#v1-5-3-2019-06-18).*

### Features
- Ensure all owner nodes are alive before creating/updating/deleting topic handlers.
- Support insecure TLS and auth when connecting to Plutonium meta node.

### Bug fixes
- Fix config start error from extra 'load' section.
- Update build script to correctly change file ownership in order to make rpm verification pass on RH-based systems.

## v1.5.2 [2018-12-12]
*Includes features and bug fixes from [Kapacitor 1.5.2](https://docs.influxdata.com/kapacitor/v1.5/about_the_project/releasenotes-changelog/#v1-5-2-2018-12-12).*

## v1.5.1 [2018-08-06]
*Includes features and bug fixes from [Kapacitor 1.5.1](https://docs.influxdata.com/kapacitor/v1.5/about_the_project/releasenotes-changelog/#v1-5-1-2018-08-06).*

### Bug fixes

- Fix an issue to ensure alert deduplication is by topic.
  Previously, alert events were being erroneously deduplicated across the set of topics assigned to a node.
  Topic assignment changes with cluster size, so it is not a stable behavior.
  This change fixes the unintended behavior.

## v1.5.0 [2018-05-22]
*Includes features and bug fixes from [Kapacitor 1.5.0](https://docs.influxdata.com/kapacitor/v1.5/about_the_project/releasenotes-changelog/#v1-5-0-2018-05-17).*

### Bug fixes
- Fix match condition being lost through rpc layer.

## v1.4.1 [2018-03-14]
*Includes bug fixes from Kapacitor 1.4.1.*

### Bug fixes
- Fix `load` service not working when authentication is enabled.

## v1.4.0 [2017-12-08]
The v1.4.0 release has many new features, here is a list of some of the highlights:

- Load TICKscripts and alert handlers from a directory.
- Structed Logging  with a logging API endpoints to be able to tail logs for given tasks.
- Autoscale support for Docker Swarm and EC2 Autoscaling.
- Sideload data into your TICKscript streams from external sources.
- Fully customizable POST body for the alert POST handler and the httpPost node.

See the complete list of bug fixes and features below.

### Bug fixes
- Idle Barrier is dropping all messages when source has clock offset
- Fix oddly generated TOML for mqtt & httppost

## v1.4.0-rc3 [2017-12-04]

### Bug fixes
- Fix issues where log API checked the wrong header for the desired content type.

## v1.4.0-rc2 [2017-11-28]

### Features
- Add support for AWS EC2 autoscaling services.
- Add BarrierNode to emit BarrierMessage periodically

### Bug fixes
- Fix VictorOps "data" field being a string instead of actual JSON.
- Fix panic with MQTT toml configuration generation.

## v1.4.0-rc1 [2017-11-09]

### Features
- Add Previous state.
- Add support to persist replay status after it finishes.
- alert.post and https_post timeouts needed.
- Add subscriptions modes to InfluxDB subscriptions.
- Add linear fill support for QueryNode.
- Add MQTT Alert Handler
- Add built in functions to convert timestamps to integers
- BREAKING: Change over internal API to use message passing semantics.
  The breaking change is that the Combine and Flatten nodes previously, but erroneously, operated across batch boundaries; this has been fixed.
- Add support for Docker Swarm autoscaling services.
- Add bools field types to UDFs.
- Add stateless now() function to get the current local time.
- Add support for timeout, tags and service template in the Alerta AlertNode
- Add support for custom HTTP Post bodies via a template system.
- Add support for add the HTTP status code as a field when using httpPost
- Add logfmt support and refactor logging.
- Add ability to load tasks/handlers from dir.
  TICKscript was extended to be able to describe a task exclusively through a tickscript.
    * Tasks no longer need to specify their TaskType (Batch, Stream).
    * `dbrp` expressions were added to tickscript.
  Topic-Handler file format was modified to include the TopicID and HandlerID in the file.
  Load service was added; the service can load tasks/handlers from a directory.
- Update Go version to 1.9.1
- Add support for exposing logs via the API. API is released as a technical preview.
- Add support for {{ .Duration }} on Alert Message property.
- Add support for [JSON lines](https://en.wikipedia.org/wiki/JSON_streaming#Line-delimited_JSON) for steaming HTTP logs.
- Add new node Sideload, that allows loading data from files into the stream of data. Data can be loaded using a hierarchy.
- Promote Alert API to stable v1 path.
- Change WARN level logs to INFO level.

### Bug fixes
- Crash of Kapacitor on Windows x64 when starting a recording
- Allow for `.yml` file extensions in `define-topic-handler`
- Fix http server error logging.
- Fix bugs with stopping running UDF agent.
- Fix error messages for missing fields which are arguments to functions are not clear
- Fix bad PagerDuty test the required server info.
- Add SNMP sysUpTime to SNMP Trap service
- Fix panic on recording replay with HTTPPostHandler.
- Fix k8s incluster master api dns resolution
- Remove the pidfile after the server has exited.
- Logs API writes multiple http headers.
- Fix missing dependency in rpm package.
- Force tar owner/group to be root.
- Fixed install/remove of kapacitor on non-systemd Debian/Ubuntu systems.
  Fixes packaging to not enable services on RHEL systems.
  Fixes issues with recusive symlinks on systemd systems.
- Fix invalid default MQTT config.

## v1.3.3 [2017-08-11]

### Bug fixes
- Bypass auth when `pprof` is enabled.

## v1.3.2 [2017-08-08]

### Bug fixes
- Use details field from alert node in PagerDuty.

## v1.3.1 [2017-06-20]

### Bug fixes
- Fix inconsistent naming of node vs member.

## v1.3.0 [2017-06-19]

### Release Notes
With this release, Kapacitor Enterprise can be clustered and will deduplicate alerts generated within the cluster.

### Bug fixes
- Expose HTTP API advertise address.
- Fix panic if alerts are triggering during startup.
- Fix `ENV` overrides not working for text Unmarshaler types.

## v1.3.0-rc3 [2017-06-13]

### Bug fixes
- Fix `build.sh` to copy build artifacts back out of docker data volume.

## v1.3.0-rc2 [2017-06-13]

### Bug fixes
- Expose Advertise Address properly.

## v1.3.0-rc1 [2017-06-09]

### Features
- Add Alert deduplication for a cluster of Kapacitor Enterprise nodes.
- Add support for subscription modes.

### Bug fixes
- Fix data race in rendezvous hash type.

## v1.2.2 [2017-04-14]

### Bug fixes
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

### Bug fixes
- Update to add Kapacitor dynamic config support.

## v1.0.2 [2016-10-06]

### Release Notes
Update to Kapacitor 1.0.2

### Bug fixes
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

### Bug fixes
- Remove default user, only add it for tests.

## v0.0.4 [2016-08-10]

### Bug fixes
- Fix PM permission conversion error for generic read/write privileges to dbs.

## v0.0.3 [2016-08-03]

### Features
- Add token-based authentication for InfluxDB communication.

## v0.0.2 [2016-07-27]

### Features
- Add mechanism for subscription token-based auth.

### Bug fixes

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
