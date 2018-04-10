---
title: Supported Service Inputs

menu:
  telegraf_1_4:
    name: Service Inputs
    identifier: services
    weight: 30
---

Telegraf is entirely input driven. It gathers all metrics from the inputs specified in the configuration file.

## Supported Inputs          

[HTTP Listener](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/http_listener)  
[Kafka Consumer](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/kafka_consumer)  
[MQTT Consumer](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/mqtt_consumer)  
[NATS Consumer](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/nats_consumer)  
[NSQ Consumer](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/nsq_consumer)  
[Logparser](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/logparser)  
[Statsd](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/statsd)  
[Socket Listener](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/socket_listener)  
[Tail](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/tail)  
[TCP Listener](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/tcp_listener)  
[UDP Listener](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/udp_listener)  
[Webhooks](https://github.com/influxdata/telegraf/tree/release-1.4/plugins/inputs/webhooks)  

## Usage Instructions

View usage instructions for each service input by running `telegraf --usage <service-input-name>`.
