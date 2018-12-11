---
title: Integrate the InfluxData Platform with Kubernetes
description: Deploy InfluxDB OSS in Kubernetes and monitor Kubernetes
menu:
  platform:
    name: Deploy InfluxData Platform in Kubernetes
    parent: Integrate
---

[Kubernetes](https://kubernetes.io/) is a container orchestration project that
has become a popular way to deploy and manage containers across multiple servers and cloud providers.

![InfluxDB Kubernetes Logos](/img/platform/flux-kube.png)

There are several ways use the InfluxData Platform (also known as the TICK
stack) can be used with Kubernetes:

- [Monitor Kubernetes](#monitor-kubernetes-https-www-influxdata-com-blog-monitoring-kubernetes-architecture)
- [Deploy the TICK stack on Kubernetes](#deploy-the-tick-stack-on-kubernetes-https-github-com-influxdata-tick-charts)
- [Frequently asked questions](#frequently-asked-questions)

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

## Deploy the TICK stack on Kubernetes
Instructions for installing and configuring all components of the open source TICK stack – Telegraf, InfluxDB, Chronograf, and Kapacitor on Kubernetes.

### Helm Charts

The [TICK Charts](https://github.com/influxdata/tick-charts) repository provides a set of [Helm charts](https://docs.helm.sh/) to deploy every component of the InfluxData Platform in Kubernetes.

[Learn how to deploy the InfluxData Platform using Helm Charts](https://github.com/influxdata/tick-charts/blob/master/README.md)

### K8s Operator

The [InfluxData operator](https://github.com/influxdata/influxdata-operator) is a [Kubernetes operator](https://coreos.com/operators/). The InfluxData operator can be used to deploy InfluxDB in Kubernetes and can handle operational tasks automatically, like creating a backup. The operator currently has been tested on [AWS's Elastic Kubernetes Service](https://aws.amazon.com/eks/) and [GCP's Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/).

[Deploy InfluxDB using the InfluxData operator](https://github.com/influxdata/influxdata-operator)

## Frequently asked questions

### Should I run InfluxDB in Kubernetes?

While Kubernetes is rapidly becoming a stable deployment platform for stateful
applications, like databases, Kuberenetes still introduces significant
complexity without many benefits.

We currently _do not_ recommend running InfluxDB or InfluxDB Enterprise on
Kubernetes in production. While many have managed to run the database in
Kubernetes successfully, many InfluxDB users have also experienced issues
including significant downtime and even loss of data due to Kubernetes
rescheduling pods or problems with mounted volumes.

> **Note:** The other InfluxData Platform components (Telegraf, Chronograf, Kapacitor) run well on Kubernetes. The above recommendation only applies to the database.

### How is the InfluxData Platform (TICK) different from Prometheus?

InfluxDB was purpose-built as a time series database. Overall, it is more flexible and can handle more use cases than Prometheus alone, such as irregular events and string data types.

Many InfluxDB users find it provides several advantages over Prometheus:
- Handles event data that comes in at irregular intervals, e.g. structured logs, application events, and trace data.
- Works well as a centralized long-term metrics store for federated Prometheus servers in multiple clusters.
