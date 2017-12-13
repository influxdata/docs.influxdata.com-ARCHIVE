---
title: Supported Protocols
---


InfluxData supports the following protocols for interacting with InfluxDB:

### [CollectD](https://github.com/influxdata/influxdb/blob/master/services/collectd/README.md)
Using the collectd input, InfluxDB can accept data transmitted in collectd native format. This data is transmitted over UDP.

### [Graphite](https://github.com/influxdata/influxdb/blob/master/services/graphite/README.md)
The Graphite plugin allows measurements to be saved using the Graphite line protocol. By default, enabling the Graphite plugin will allow you to collect metrics and store them using the metric name as the measurement.

### [OpenTSDB](https://github.com/influxdb/influxdb/blob/master/services/opentsdb/README.md)
InfluxDB supports both the telnet and HTTP OpenTSDB protocol.
This means that InfluxDB can act as a drop-in replacement for your OpenTSDB system.

### [Prometheus](/influxdb/v1.4/supported_protocols/prometheus)
InfluxDB provides native support for the Prometheus read and write API to convert remote reads and writes to InfluxDB queries and endpoints.

### [UDP](https://github.com/influxdata/influxdb/blob/master/services/udp/README.md)
UDP (User Datagram Protocol) can be used to write to InfluxDB. The CollectD input accepts data transmitted in collectd native format over UDP.
