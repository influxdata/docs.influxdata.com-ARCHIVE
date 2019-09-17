---
title: Kubernetes
description: Deploy InfluxDB OSS in Kubernetes and monitor Kubernetes
menu:
  platform:
    name: Kubernetes
    parent: integrate-platform
---

[Kubernetes](https://kubernetes.io/) is a container orchestration project that
has become a popular way to deploy and manage containers across multiple servers and cloud providers.

![InfluxDB Kubernetes Logos](/img/platform/flux-kube.png)

There are several ways use the InfluxData Platform (also known as the TICK
stack) with Kubernetes:

- [Monitor Kubernetes](#monitor-kubernetes)
  - [kube-influxdb Kubernetes monitoring project](#kube-influxdb-kubernetes-monitoring-project)
  - [Collect Kubernetes metrics with Telegraf](#collect-kubernetes-metrics-with-telegraf)
  - [Prometheus remote read and write support](#prometheus-remote-read-and-write-support)
- [Deploy the TICK stack in Kubernetes](#deploy-the-tick-stack-in-kubernetes)
  - [Helm Charts](#helm-charts)
  - [K8s Operator](#k8s-operator)
  - [Solutions for Kubernetes services](#solutions-for-kubernetes-services)
- [Frequently asked questions](#frequently-asked-questions)
  - [How is the InfluxData Platform (TICK) different from Prometheus?](#how-is-the-influxdata-platform-tick-different-from-prometheus)
  - [Should I run InfluxDB in Kubernetes?](#should-i-run-influxdb-in-kubernetes)

## Monitor Kubernetes

The TICK stack is an easy and performant way to monitor the services that make up a Kubernetes cluster, whether or not you're running InfluxDB in a Kubernetes cluster or somewhere else.

### kube-influxdb Kubernetes monitoring project

The [kube-influxdb](https://github.com/influxdata/kube-influxdb) project is a
set of Helm charts to make collection and visualization of Kubernetes metrics
easy. It uses Telegraf, the metrics collection agent, to collect metrics and
events and includes a set of pre-configured Chronograf dashboards.

See the [kube-influxdb Getting Started guide](https://github.com/influxdata/kube-influxdb/blob/master/docs/v1.0/getting_started.md).

### Collect Kubernetes metrics with Telegraf

The [Telegraf metrics collection agent](/telegraf/latest/introduction/getting-started/)
can collect many types of metrics in a Kubernetes cluster, like [Docker container metrics](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/docker/README.md)
and [stats from kubelets](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/kubernetes).
It can even scrape [Prometheus metrics API endpoints](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/prometheus).
Telegraf is used in the [kube-influxdb project](#kube-influxdb-kubernetes-monitoring-project)
to collect metrics.

See [Set up a Kubernetes monitoring architecture using Telegraf](https://www.influxdata.com/blog/monitoring-kubernetes-architecture/).

### Prometheus remote read and write support

InfluxDB supports the Prometheus remote read and write API for clusters already
using Prometheus for metrics collection. See the
[FAQ](#frequently-asked-questions) for more information on why a more flexible
time series data store is useful.

Read about [Prometheus remote read and write API support in InfluxDB](/influxdb/latest/supported_protocols/prometheus/).

## Deploy the TICK stack in Kubernetes
Instructions for installing and configuring all components of the open source
TICK stack – Telegraf, InfluxDB, Chronograf, and Kapacitor in Kubernetes.

> **Note:** Running InfluxDB in Kubernetes in production is not recommended. See
> the [FAQ](#frequently-asked-questions) for more info.

### Helm Charts

InfluxData recommends using the [Helm Stable](https://github.com/helm/charts/tree/master/stable) repository for installing the TICK stack.

- [Telegraf](https://github.com/helm/charts/tree/master/stable/telegraf)
- [InfluxDB](https://github.com/helm/charts/tree/master/stable/influxdb)
- [Chronograf](https://github.com/helm/charts/tree/master/stable/chronograf)
- [Kapacitor](https://github.com/helm/charts/tree/master/stable/kapacitor)

### K8s Operator

The [InfluxData operator](https://github.com/influxdata/influxdata-operator) is
a [Kubernetes operator](https://coreos.com/operators/). The InfluxData operator
can be used to deploy InfluxDB in Kubernetes and can handle operational tasks
automatically, like creating a backup. The operator currently has been tested on
[AWS's Elastic Kubernetes Service](https://aws.amazon.com/eks/) and [GCP's Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/).

[Deploy InfluxDB using the InfluxData
operator](https://github.com/influxdata/influxdata-operator)

### Solutions for Kubernetes services

InfluxData maintains ways to deploy the InfluxData Platform components to popular Kubernetes service providers.

- [TICK Stack on the AWS Container Marketplace](https://aws.amazon.com/marketplace/pp/B07KGM885K?qid=1544514373950&sr=0-18&ref_=srh_res_product_title)
- [Telegraf, InfluxDB, and Grafana on the GCP Marketplace](https://console.cloud.google.com/marketplace/details/influxdata-public/telegraf-influxdb-grafana?q=telegraf)

## Frequently asked questions

### How is the InfluxData Platform (TICK) different from Prometheus?

InfluxDB was purpose-built as a time series database. Overall, it is more
flexible and can handle more use cases than Prometheus alone, such as irregular
events and string data types.

Many InfluxDB users find it provides several advantages over Prometheus:
- Handles event data that comes in at irregular intervals, e.g. structured logs,
  application events, and trace data.
- Works well as a centralized long-term metrics store for federated Prometheus
  servers in multiple clusters.

### Should I run InfluxDB in Kubernetes?

While Kubernetes is rapidly becoming a stable deployment platform for stateful
applications, it still introduces significant complexity and few benefits for
database workloads.

Therefore, we _do not_ currently recommend running InfluxDB or InfluxDB
Enterprise on Kubernetes in production. While many users have managed to run the
databases in Kubernetes successfully, many InfluxDB users have also experienced
issues including significant downtime and even loss of data due to Kubernetes
rescheduling pods or problems with mounted volumes.

InfluxData provides several [ways to deploy InfluxDB in Kubernetes](/platform/install-and-deploy/deploying/kubernetes/),
which should be considered experimental and not for use in production. We
suggest exploring the [Terraform InfluxDB module](https://registry.terraform.io/modules/influxdata/influxdb/aws/1.0.4)
for a declarative way to deploy InfluxDB for production use.

> **Note:** The other InfluxData Platform components (Telegraf, Chronograf,
> Kapacitor) run well on Kubernetes. The above recommendation only applies to
> the database.
