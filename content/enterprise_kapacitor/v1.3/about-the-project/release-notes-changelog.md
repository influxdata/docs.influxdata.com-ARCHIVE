---
title: Release notes/changelog
menu:
  enterprise_kapacitor_1_3:
    weight: 0
    parent: about-the-project
---

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

> ***Note:*** This release builds off of the 1.3 release of Kapacitor. Please see the [Kapacitor release
> notes](https://docs.influxdata.com/kapacitor/v1.3/about_the_project/releasenotes-changelog/) for more information about the Kapacitor release.

With this release, Kapacitor Enterprise can be clustered and will deduplicate alerts generated within the cluster.

### Features

- Add alert deduplication for a cluster of Kapacitor Enterprise nodes.
- Add support for subscription modes.

### Bug fixes

- Expose HTTP API advertise address.
- Fix panic if alerts are triggering during startup.
- Fix `ENV` overrides not working for text Unmarshaler types.
- Fix `build.sh` to copy build artifacts back out of docker data volume.
- Expose Advertise Address properly.
- Fix data race in rendezvous hash type.

## v1.2.2 [2017-04-14]

### Bug fixes

- Fix InfluxDB token client not opening.

## v1.2.1 [2017-04-13]

No Kapacitor Enterprise-specific changes, only upgrading to Kapacitor 1.2.1.

### Bug fixes

- Fix for stale credentials when querying InfluxDB.

## v1.2.0 [2017-01-24]

No Kapacitor Enterprise-specific changes, only upgrading to Kapacitor 1.2.0.

## v1.1.1 [2016-12-06]

No Kapacitor Enterprise-specific changes, only upgrading to Kapacitor 1.1.1.

## v1.1.0 [2016-11-08]

### Bug fixes

- Update to add Kapacitor dynamic config support.

## v1.0.2 [2016-10-06]

Update to Kapacitor 1.0.2

### Bug fixes

- Fail on startup if saving cluster/server IDs fails.
- Update to Kapacitor fixes for #954

## v1.0.1 [2016-09-26]

Update to Kapacitor 1.0.1
No Kapacitor Enterprise-specific changes.

## v1.0.0 [2016-09-02]

Update to Kapacitor 1.0.0

### Features

- Upgrade to Kapacitor 1.0.0-rc3
    NOTE: rc3 and the final 1.0.0 release are identical.

## v0.1.0 [2016-08-29]

Update to Kapacitor 1.0.0-rc2

### Features

- Upgrade to Kapacitor 1.0.0-rc2

## v0.0.5 [2016-08-12]

Update to lastest Kapacitor for Subscription improvements.

### Bug fixes

- Remove default user, only add it for tests.

## v0.0.4 [2016-08-10]

### Bugfixes

- Fix PM permission conversion error for generic read/write privileges to dbs.

## v0.0.3 [2016-08-03]

### Features

- Add token-based authentication for InfluxDB communication.

### Bug fixes

## v0.0.2 [2016-07-27]

### Features

- Add mechanism for subscription token-based auth.

### Bug fixes

## v0.0.1 [2016-07-25]

First release of Kapacitor Enterprise with basic authentication/authorization support.

### Features

- Auth Service Implementation. Simple boltdb/bcrypt backed users/auth.
- Entitlements and Enterprise registration.
- BREAKING: Search for valid configuration on startup in `~/.kapacitor` and `/etc/kapacitor/`.
    This is so that the `-config` CLI flag is not required if the configuration is found in a standard location.
    The configuration file being used is always logged to `STDERR`.
- Add support for using InfluxDB Enterprise meta for users backend.
