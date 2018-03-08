---
title: Release Notes/Changelog
menu:
  enterprise_kapacitor_1_4:
    weight: 0
    parent: About the Project
---

# Changelog

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
