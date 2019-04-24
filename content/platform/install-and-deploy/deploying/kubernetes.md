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

The [TICK Charts](https://github.com/influxdata/tick-charts) repository provides a set of [Helm charts](https://docs.helm.sh/) to deploy every component of the InfluxData Platform in Kubernetes.

[Learn how to deploy the InfluxData Platform using Helm Charts](https://github.com/influxdata/tick-charts/blob/master/README.md)

### Use the InfluxDB Operator

[InfluxDB operator](https://github.com/influxdata/influxdata-operator) is a [Kubernetes operator](https://coreos.com/operators/) that can be used to deploy InfluxDB OSS in Kubernetes. The InfluxDB operator can handle operational tasks, like creating a backup, automatically. The operator currently has been tested on [AWS's Elastic Kubernetes Service](https://aws.amazon.com/eks/) and [GCP's Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/).

[Deploy InfluxDB using the InfluxData operator](https://github.com/influxdata/influxdata-operator)
