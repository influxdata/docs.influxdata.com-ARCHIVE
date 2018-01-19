---
title: Kapacitor Enterprise 1.3 documentation

menu:
  enterprise_kapacitor:
    name: v1.3
    identifier: enterprise_kapacitor_1_3
    weight: 100
---

# Overview

Kapacitor Enterprise extends the open source version of Kapacitor with several key features.

1. Clustering - Kapacitor Enterprise is cluster aware and can perform functions across a set of Kapacitor instances.
2. Authentication and Authorization - Kapacitor Enterprise has an authentication backend as well as some basic authorization permissions.


## Clustering

Kapacitor Enterprise clustering provides two basic features at this stage.

* High Availability - Run multiple redundant copies of tasks so that failures do not disrupt task behavior.
* Alert Deduplication - Deduplicate the alerts generated from the various tasks.

>NOTE: Kapacitor Enterprise is not completely cluster aware at this release.
Some actions on the cluster need to be repeated for each member of the cluster while other actions need only communicate with a single instance.
For example, tasks need to be defined on each instance you wish to run the task, while alert handlers need only be defined on one instance and internally Kapacitor will take care of replicating that handler.


## Authentication and Authorization

Kapacitor Enterprise can use InfluxDB Enterprise meta nodes as its authentication backend.
This means users that are defined for InfluxDB Enterprise can be used with Kapacitor Enterprise.

This release contains basic permissions for users that turn on or off the ability to use Kapacitor Enterprise.


# Installation

See the [installation guide](/enterprise_kapacitor/v1.3/introduction/installation_guide/) for details on how to get up and running with Kapacitor Enterprise.
