---
title: InfluxEnterprise Users
menu:
  enterprise_influxdb_1_0:
    weight: 0
    parent: Features
---

InfluxEnterprise users have functions that are either specific to the web
console or specific to the cluster:
```
Users              Web Console              Cluster

Penelope
   O    ---------> Admin                                           
  \|/                                                                 
   |    ----------------------------------> Dev Account ---> Manage Queries Permission
  / \                                                   ---> Monitor Permission                                 
                                                        ---> Add/Remove Nodes Permission
Jim
   O    ---------> Non-Admin
  \|/                                                            
   |    ----------------------------------> Marketing Account ---> View Admin
  / \                                                         ---> Graph Role ---> Read Permission
                                                                              ---> View Chronograf Permission                                                            
```

### Web Console User Information
In the web console, users can be Admin users or Non-Admin users.
In the diagram above, Penelope is an Admin web console user and Jim is
a Non-Admin web console user.

#### Admin Users
In addition to having access to the console, web console Admin users are able to:

* Invite users
* Manage web console users
* Manage cluster accounts
* Edit cluster names

#### Non-Admin Users
Web console Non-Admin users have access to the web console.

### Cluster User Information
In the cluster, individual users are assigned to an account.
Cluster accounts have permissions and roles.
Web console Admin users can create cluster accounts and assign permissions
and roles to those accounts.

In the diagram above, Penelope is assigned to the  Dev Account and
Jim is assigned to the Marketing Account.
The Dev Account includes the permissions to manage queries, monitor the
cluster, and add/remove nodes from the cluster.
The Marketing Account includes the permission to view and edit the admin screens
as well as the Graph Role which contains the permissions to read data and
view Chronograf.

#### Roles
Roles are groups of permissions.
A single role can belong to several cluster accounts.
Only web console Admin users can manage roles.

InfluxEnterprise clusters have two built-in roles:

##### Global Admin

The Global Admin role has all 16 [cluster permissions](#permissions).

##### Admin

The Admin role has all [cluster permissions](#permissions) except for the
permissions to:

* Add/Remove Nodes
* Copy Shard
* Manage Shards
* Rebalance

#### Permissions
InfluxEnterprise clusters have 16 permissions:

##### View Admin
Permission to view or edit admin screens.
##### View Chronograf
Permission to use Chronograf tools.
##### Create Databases
Permission to create databases.
##### Create Users & Roles
Permission to create users and roles.
##### Add/Remove Nodes
Permission to add/remove nodes from a cluster.
##### Drop Databases
Permission to drop databases.
##### Drop Data
Permission to drop measurements and series.
##### Read
Permission to read data.
##### Write
Permission to write data.
##### Rebalance
Permission to rebalance a cluster.
##### Manage Shards
Permission to copy and delete shards.
##### Manage Continuous Queries
Permission to create, show, and drop continuous queries.
##### Manage Queries
Permission to show and kill queries.
##### Manage Subscriptions
Permission to show, add, and drop subscriptions.
##### Monitor
Permission to show stats and diagnostics.
##### Copy Shard
Permission to copy shards.
