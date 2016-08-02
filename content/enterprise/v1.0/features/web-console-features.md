---
title: Web Console
menu:
  enterprise_1_0:
    weight: 10
    parent: Features
---

The Web Console provides a user interface for interacting with your InfluxEnterprise Cluster. Use the Web Console to:

* View overall cluster health
* View and, if necessary, kill active queries
* Create new databases
* Create new retention policies
* Delete unwanted shards
* Control access with InfluxEnterprise’s users, permissions, and roles (more information below)
* Explore data and create graphs with the Data Explorer

## Users, Permissions, and Roles

### Users

A user has an email, username, and password. Users can have many permissions and can belong to multiple roles.

### Permissions

A permission is a grant for access. They can be global, cluster specific, or database specific. Permissions can be granted to roles and to users.

**Add/Remove Nodes**: The right to add and remove servers from a cluster.

**Copy Shard**: The right to copy shards.

**Create Databases**: The right to create databases and retention policies.

**Create Users and Roles**: The right to create users. Users with this permission can assign permissions and roles equal to their own permissions and roles.

**Drop Data**: The right to perform the `DROP MEASUREMENT` and `DROP SERIES` queries.

**Drop Databases**: The right to drop databases and retention policies.

**Manage Continuous Queries**: The right to create, list, and drop continuous queries.

**Manage Queries**: The right to SHOW and KILL queries.

**Manage Shards**: The right to SHOW and DROP shards.

**Manage Subscriptions**: The right to SHOW, ADD, and DROP subscriptions.

**Monitor**: The right to SHOW STATS and SHOW DIAGNOSTICS.

**Read Data**: The right to read data.

**Rebalance**: The right to rebalance the cluster.

**View Admin**: The right to view the admin screen and diagnostics dashboard.

**View Chronograf**: The right to view Chronograf/Data Explorer screens.

**Write Data**: The right to write data.

### Roles

A role is a collection of users and permissions. Users assigned to a role have all permission granted to that role.

#### Built-in Roles:

##### Global Admin
<br>
The Global Admin role includes every permission. All permissions in the Global Admin role are global; they are not scoped by cluster or database.

##### Admin
<br>
The Admin role includes every permission except the Manage Shards permission and the Add/Remove Nodes permission. All permissions in the Admin role are global; they are not scoped by cluster or database.

## Cluster rebalancing

The Web Console version 0.7.0+ allows users to easily rebalance data across all
data nodes in the InfluxEnterprise Cluster.
The `Rebalance` button is available on the `Tasks` page.

Rebalancing a cluster allocates existing
[shards](https://docs.influxdata.com/influxdb/v1.0/concepts/glossary/#shard)
such that each data node has roughly the same number of shards.
Perform a rebalance if you've recently added a data node to a cluster and would
like to evenly redistribute shards across that cluster.

Note that performing a rebalance can result in temporarily inconsistent data
across data nodes.
That inconsistency is not permanent and the cluster will resolve it over time.

## Features Under Development

* Additional support for raw InfluxQL queries
* A UI for setting up monitoring and alerting rules within Kapacitor
