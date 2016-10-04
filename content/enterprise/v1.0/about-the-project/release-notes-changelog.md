---
title: Release Notes/Changelog
menu:
  enterprise_1_0:
    weight: 0
    parent: About the Project
---

The following sections describe the new features available in InfluxEnterprise
1.0.1.

## Clustering

This release builds off of the 1.0.1 OSS release of InfluxDB.
Please see the [OSS release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v101-2016-09-26)
for specific changes.

#### Cluster-specific Bugfixes

* Balance shards correctly with a restore
* Fix panic in hinted handoff: `runtime error: invalid memory address or nil pointer dereference`
* Ensure meta node redirects to leader when removing data node
* Fix panic in hinted handoff: `runtime error: makeslice: len out of range`
* Update sample config for data nodes

## Web Console

#### Features

* Log error messages from the InfluxEnterprise cluster

#### Bugfixes

* Fix bug where users cannot log out of the web Console
