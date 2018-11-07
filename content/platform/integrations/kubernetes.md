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

- [Monitor Kubernetes](#monitor-kubernetes)
- [Monitor applications running on Kubernetes](#monitor-kubernetes-apps)
- [Deploy the TICK stack on Kubernetes](#deploy-the-tick-stack-on-kubernetes-platform-installation-kubernetes)
- [Kubernetes recommendations](#kubernetes-recommendations)

## [Monitor Kubernetes](https://www.influxdata.com/blog/monitoring-kubernetes-architecture/)
The TICK stack is an easy and performant way to monitor the services that make up a Kubernetes cluster.

## Monitor applications running on Kubernetes
Discover how the TICK stack can be used to monitor applications running within a Kubernetes cluster.

## [Deploy the TICK stack on Kubernetes](https://github.com/influxdata/tick-charts)
Instructions for installing and configuring all components of the open source TICK stack – Telegraf, InfluxDB, Chronograf, and Kapacitor on Kubernetes.

## Kubernetes recommendations
While Kubernetes is rapidly becoming a stable deployment platform for stateful
applications like databases, there are still many sharp edges. We currently _do
not_ recommend running InfluxDB or InfluxDB Enterprise on Kubernetes in
production. While many have managed to run the database in Kubernetes
successfully, many InfluxDB users have also experienced issues including
significant downtime and even loss of data due to Kubernetes rescheduling pods
or problems with mounted volumes.

Still Kubernetes is an attractive deployment platform for applications of all types and InfluxData is working on several projects to make deployment on Kubernetes easier. These projects include:

- An InfluxDB operator for easier deployment and operation of all TICK stack components. 
- A comprehensive, tested configuration for monitoring Kubernetes with the TICK stack.
- Integrations of the TICK stack with other Kubernetes-native applications.

Documentation for these project will be added here over time.
