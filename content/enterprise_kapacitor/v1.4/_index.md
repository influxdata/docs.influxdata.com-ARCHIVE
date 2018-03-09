---
title: Kapacitor Enterprise 1.4 documentation

menu:
  enterprise_kapacitor:
    name: v1.4
    identifier: enterprise_kapacitor_1_4
    weight: 10
---

# Overview

Kapacitor Enterprise extends the open source version of Kapacitor with several key features.

1. Clustering - Enterprise Kapacitor is cluster-aware and can perform functions across a set of Kapacitor instances.
2. Authentication and Authorization - Enterprise Kapacitor has an authentication backend as well as some basic authorization permissions.


## Clustering

Enterprise Kapacitor clustering provides two basic features at this stage.

* High Availability - Run multiple redundant copies of tasks so that failures do not disrupt task behavior.
* Alert Deduplication - Deduplicate the alerts generated from the various tasks.

> ***Note:*** Enterprise Kapacitor is not completely cluster-aware at this release.
Some actions on the cluster need to be repeated for each member of the cluster while other actions need only communicate with a single instance.
For example, tasks need to be defined on each instance you wish to run the task, while alert handlers need only be defined on one instance and internally Kapacitor will take care of replicating that handler.


## Authentication and Authorization

Enterprise Kapacitor can use Enterprise InfluxDB meta nodes as its authentication backend.
This means users that are defined for Enterprise InfluxDB can be used with Enterprise Kapacitor.

This release contains basic permissions for users that turn on or off the ability to use Enterprise Kapacitor.


# Installation

See the [installation guide](/enterprise_kapacitor/v1.4/introduction/installation_guide/) for details on how to get up and running with Enterprise Kapacitor.
