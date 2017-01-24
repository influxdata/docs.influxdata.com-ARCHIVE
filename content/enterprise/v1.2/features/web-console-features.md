---
title: Web Console Features
menu:
  enterprise_1_2:
    weight: 30
    parent: Features
---

The Web Console provides a user interface for interacting with your InfluxEnterprise Cluster. Use the Web Console to:

* View overall cluster health
* View and, if necessary, kill active queries
* Create new databases
* Create new retention policies
* Delete unwanted shards
* Explore data and create graphs with the Data Explorer

## Cluster rebalancing

As of version 1.2, the `Rebalance` button on the Web Consoles `Tasks` page
is deprecated and no longer available.
We based this decision on customer and support feedback regarding the feature.
For the time being, you will need to rebalance clusters manually.
The [Cluster Rebalance](/enterprise/v1.2/guides/rebalance/) guide offers
detailed instructions for performing a manual rebalance of your InfluxEnterprise cluster.
Please contact support with any questions or concerns you may have about this
development.

## Features Under Development

* Additional support for raw InfluxQL queries
* A UI for setting up monitoring and alerting rules within Kapacitor
