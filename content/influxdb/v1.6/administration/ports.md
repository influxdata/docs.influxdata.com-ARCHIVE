---
title: InfluxDB ports

menu:
  influxdb_1_6:
    name: Ports
    weight: 50
    parent: administration
---

## Enabled ports

### `8086`
The default port that runs the InfluxDB HTTP service.
[Configure this port](/influxdb/v1.6/administration/config/#bind-address-8086)
in the configuration file.

**Resources** [API Reference](/influxdb/v1.6/tools/api/)

### 8088
The default port that runs the RPC service for backup and restore.
[Configure this port](/influxdb/v1.6/administration/config/#bind-address-127-0-0-1-8088)
in the configuration file.

**Resources** [Backup and Restore](/influxdb/v1.6/administration/backup_and_restore/)

## Disabled ports

### 2003

The default port that runs the Graphite service.
[Enable and configure this port](/influxdb/v1.6/administration/config/#bind-address-2003)
in the configuration file.

**Resources** [Graphite README](https://github.com/influxdata/influxdb/blob/master/services/graphite/README.md)

### 4242

The default port that runs the OpenTSDB service.
[Enable and configure this port](/influxdb/v1.6/administration/config/#bind-address-4242)
in the configuration file.

**Resources** [OpenTSDB README](https://github.com/influxdata/influxdb/blob/master/services/opentsdb/README.md)

### 8089

The default port that runs the UDP service.
[Enable and configure this port](/influxdb/v1.6/administration/config/#bind-address-8089)
in the configuration file.

**Resources** [UDP README](https://github.com/influxdata/influxdb/blob/master/services/udp/README.md)

### 25826

The default port that runs the Collectd service.
[Enable and configure this port](/influxdb/v1.6/administration/config/#bind-address-25826)
in the configuration file.

**Resources** [Collectd README](https://github.com/influxdata/influxdb/blob/master/services/collectd/README.md)
