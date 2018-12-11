---
title: Monitor Kubernetes using the InfluxData Platform
description: Use the InfluxData TICK stack to monitor Kubernetes.
menu:
  platform:
    name: Monitor Kubernetes
    weight: 3
    parent: Monitor containers
    draft: false
---
## Monitor Kubernetes
The TICK stack is an easy and performant way to monitor the services that make up a Kubernetes cluster, whether or not you're running InfluxDB in a Kubernetes cluster or somewhere else.

Why use the InfluxData

### kube-influxdb Kubernetes monitoring project

The [kube-influxdb](https://github.com/influxdata/kube-influxdb) project is a set of Helm charts to make collection and visualization of Kubernetes metrics easy. It uses Telegraf, the metrics collection agent is used as the primary agent to collect metrics and events

[Read the kube-influxdb Getting Started guide.](https://github.com/influxdata/kube-influxdb/blob/master/docs/v1.0/getting_started.md)

### Collect Kubernetes metrics with Telegraf

The [Telegraf metrics collection agent](https://docs.influxdata.com/telegraf/v1.9/introduction/getting-started/) can collect many types of metrics in a Kubernetes cluster, like [Docker container metrics](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/docker/README.md) and [stats from kubelets](https://github.com/influxdata/telegraf/tree/release-1.9/plugins/inputs/kubernetes). It can even scrape [Prometheus metrics API endpoints](https://github.com/influxdata/telegraf/tree/release-1.9/plugins/inputs/prometheus). Telegraf is used in the [kube-influxdb project](#kube-influxdb-kubernetes-monitoring-project) to collect metrics.

[Read about setting up a Kubernetes monitoring architecture using Telegraf](https://www.influxdata.com/blog/monitoring-kubernetes-architecture/)

### Prometheus remote read and write support

InfluxDB supports the Prometheus remote read and write API for clusters already using Prometheus for metrics collection, but need require a more flexible time series data store.

[Read about the Prometheus remote read and write API support in InfluxDB](https://docs.influxdata.com/influxdb/v1.7/supported_protocols/prometheus/)
