---
title: Web Admin Interface

menu:
  influxdb_1_5:
    weight: 30
    parent: tools
---

<dt>
As of version 1.3, the web admin interface is no longer available in InfluxDB.
The interface does not run on port `8083` and InfluxDB ignores the `[admin]` section in the configuration file if that section is present.
[Chronograf](/chronograf/latest/) replaces the web admin interface with improved tooling for querying data, writing data, and database management.
See [Chronograf's transition guide](/chronograf/v1.3/guides/transition-web-admin-interface/) for more information.
</dt>
