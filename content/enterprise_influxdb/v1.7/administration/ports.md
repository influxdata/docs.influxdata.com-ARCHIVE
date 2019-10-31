---
title: TCP and UDP ports used in InfluxDB Enterprise

menu:
  enterprise_influxdb_1_7:
    name: Configure TCP and UDP Ports
    weight: 120
    parent: Administration
---

## Enabled ports

### `8086`
The default port that runs the InfluxDB HTTP service.
[Configure this port](/enterprise_influxdb/v1.7/administration/config-data-nodes/#bind-address-8088)
in the data node configuration file.

**Resources** [API Reference](/influxdb/v1.7/tools/api/)

### 8088
The default port used for RPC calls used for inter-node communication and by the CLI for backup and restore operations (`influxdb backup` and `influxd restore`).
[Configure this port](/influxdb/v1.7/administration/config#bind-address-127-0-0-1-8088)
in the configuration file.

**Resources** [Backup and Restore](/influxdb/v1.7/administration/backup_and_restore/)

## Disabled ports

### 2003

The default port that runs the Graphite service.
[Enable and configure this port](/influxdb/v1.7/administration/config#bind-address-2003)
in the configuration file.

**Resources** [Graphite README](https://github.com/influxdata/influxdb/tree/1.7/services/graphite/README.md)

### 4242

The default port that runs the OpenTSDB service.
[Enable and configure this port](/influxdb/v1.7/administration/config#bind-address-4242)
in the configuration file.

**Resources** [OpenTSDB README](https://github.com/influxdata/influxdb/tree/1.7/services/opentsdb/README.md)

### 8089

The default port that runs the UDP service.
[Enable and configure this port](/influxdb/v1.7/administration/config#bind-address-8089)
in the configuration file.

**Resources** [UDP README](https://github.com/influxdata/influxdb/tree/1.7/services/udp/README.md)

### 25826

The default port that runs the Collectd service.
[Enable and configure this port](/influxdb/v1.7/administration/config#bind-address-25826)
in the configuration file.

**Resources** [Collectd README](https://github.com/influxdata/influxdb/tree/1.7/services/collectd/README.md)
