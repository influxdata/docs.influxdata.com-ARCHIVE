---
title: Stability and compatibility
menu:
  influxdb_1_5:
    weight: 90
    parent: administration
---

## 1.x API compatibility and stability

One of the more important aspects of the 1.0 release is that this marks the stabilization of our API and storage format. Over the course of the last three years we’ve iterated aggressively, often breaking the API in the process. With the release of 1.0 and for the entire 1.x line of releases we’re committing to the following:

### No breaking HTTP API changes

When it comes to the HTTP API, if a command works in 1.0 it will work unchanged in all 1.x releases...with one caveat. We will be adding [keywords](/influxdb/v1.5/query_language/spec/#keywords) to the query language. New keywords won't break your queries if you wrap all [identifiers](/influxdb/v1.5/concepts/glossary/#identifier) in double quotes and all string literals in single quotes. This is generally considered best practice so it should be followed anyway. For users following that guideline, the query and ingestion APIs will have no breaking changes for all 1.x releases. Note that this does not include the Go code in the project. The underlying Go API in InfluxDB can and will change over the course of 1.x development. Users should be accessing InfluxDB through the [HTTP API](/influxdb/v1.5/tools/api/).

### Storage engine stability

The [TSM](/influxdb/v1.5/concepts/glossary/#tsm-time-structured-merge-tree) storage engine file format is now at version 1. While we may introduce new versions of the format in the 1.x releases, these new versions will run side-by-side with previous versions. What this means for users is there will be no lengthy migrations when upgrading from one 1.x release to another.

### Additive changes

The query engine will have additive changes over the course of the new releases. We’ll introduce new query functions and new functionality into the language without breaking backwards compatibility. We may introduce new protocol endpoints (like a binary format) and versions of the line protocol and query API to improve performance and/or functionality, but they will have to run in parallel with the existing versions. Existing versions will be supported for the entirety of the 1.x release line.

### Ongoing support

We’ll continue to fix bugs on the 1.x versions of the [line protocol](/influxdb/v1.5/concepts/glossary/#line-protocol), query API, and TSM storage format. Users should expect to upgrade to the latest 1.x.x release for bug fixes, but those releases will all be compatible with the 1.0 API and won’t require data migrations. For instance, if a user is running 1.2 and there are bug fixes released in 1.3, they should upgrade to the 1.3 release. Until 1.4 is released, patch fixes will go into 1.3.x. Because all future 1.x releases are drop in replacements for previous 1.x releases, users should upgrade to the latest in the 1.x line to get all bug fixes.
