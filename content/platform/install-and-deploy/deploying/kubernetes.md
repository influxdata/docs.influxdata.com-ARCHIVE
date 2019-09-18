---
title: Deploy InfluxData Platform components in Kubernetes
description: Deploy the InfluxData Platform components in Kubernetes
menu:
  platform:
    name: Deploy InfluxData Platform in Kubernetes
    parent: deploy-platform
    weight: 4
---

## Deploy the TICK stack in Kubernetes

Instructions for installing and configuring all components of the open source TICK stack – Telegraf, InfluxDB, Chronograf, and Kapacitor in Kubernetes.

### Use Helm Charts to deploy InfluxData Platform components

InfluxData recommends using the [Helm Stable](https://github.com/helm/charts/tree/master/stable) repository for installing the TICK stack.

- [Telegraf](https://github.com/helm/charts/tree/master/stable/telegraf)
- [InfluxDB](https://github.com/helm/charts/tree/master/stable/influxdb)
- [Chronograf](https://github.com/helm/charts/tree/master/stable/chronograf)
- [Kapacitor](https://github.com/helm/charts/tree/master/stable/kapacitor)

### Use the InfluxDB Operator

[InfluxDB operator](https://github.com/influxdata/influxdata-operator) is a [Kubernetes operator](https://coreos.com/operators/) that can be used to deploy InfluxDB OSS in Kubernetes. The InfluxDB operator can handle operational tasks, like creating a backup, automatically. The operator currently has been tested on [AWS's Elastic Kubernetes Service](https://aws.amazon.com/eks/) and [GCP's Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/).

[Deploy InfluxDB using the InfluxData operator](https://github.com/influxdata/influxdata-operator)
