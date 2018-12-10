---
title: The InfluxData Platform and Kubernetes
description: Deploy the TICK stack on Kubernetes and monitor Kubernetes.
menu:
  platform:
    name: Kubernetes
    parent: Integrations
---

[Kubernetes](https://kubernetes.io/) is a container orchestration project that
has become a popular way to deploy and manage containers across multiple servers and cloud providers.

![InfluxDB Kubernetes Logos](/img/platform/flux-kube.png)

There are several ways use the InfluxData Platform (also known as the TICK
stack) can be used with Kubernetes:

- [Monitor Kubernetes](#monitor-kubernetes-https-www-influxdata-com-blog-monitoring-kubernetes-architecture)
- [Monitor applications running on Kubernetes](#monitor-applications-running-on-kubernetes)
- [Deploy the TICK stack on Kubernetes](#deploy-the-tick-stack-on-kubernetes-https-github-com-influxdata-tick-charts)
- [Frequently asked questions](#frequently-asked-questions)

## Monitor Kubernetes
The TICK stack is an easy and performant way to monitor the services that make up a Kubernetes cluster, whether or not you're running InfluxDB in a Kubernetes cluster or somewhere else.

### kube-influxdb

The [kube-influxdb](https://github.com/influxdata/kube-influxdb) project is a set of Helm charts to make collection and visualization of Kubernetes metrics easy. It uses Telegraf, the metrics collection agent is used as the primary agent to collect metrics and events 

[Read the kube-influxdb Getting Started guide.](https://github.com/influxdata/kube-influxdb/blob/master/docs/v1.0/getting_started.md)

### Prometheus remote read and write support

InfluxDB supports the Prometheus remote read and write API for clusters already using Prometheus for metrics collection, but need require a more flexible time series data store.

[Read about the Prometheus remote read and write API support in InfluxDB](https://docs.influxdata.com/influxdb/v1.7/supported_protocols/prometheus/)

## Monitor applications running on Kubernetes
Discover how the TICK stack can be used to monitor applications running within a Kubernetes cluster.

## Deploy the TICK stack on Kubernetes
Instructions for installing and configuring all components of the open source TICK stack – Telegraf, InfluxDB, Chronograf, and Kapacitor on Kubernetes.

### TICK Charts

The [TICK Charts](https://github.com/influxdata/tick-charts) repository provides a set of [Helm charts](https://docs.helm.sh/) to deploy every component of the InfluxData Platform in Kubernetes.

[Learn how to deploy the InfluxData Platform using Helm Charts](https://github.com/influxdata/tick-charts/blob/master/README.md)

### InfluxData Operator

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

### How is InfluxDB different from Prometheus?

InfluxDB was purpose-built as a time series database, not a metrics system. InfluxDB has better support for irregular events and string datatypes.

Many InfluxDB users find it provides several advantages over Prometheus:
- Handles event data that comes in at irregular intervals, e.g. structured logs, application events, and trace data.
- Works well as a centralized long-term metrics store for federated Prometheus servers in multiple clusters.
