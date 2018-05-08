---
title: Managing InfluxDB Enterprise users
aliases:
    - /enterprise/v1.5/features/users/
menu:
  enterprise_influxdb_1_5:
    weight: 0
    parent: Enterprise features
---

InfluxDB Enterprise users have functions that are either specific to the web
console or specific to the cluster:
```
Users                            Cluster              Permissions

Penelope
   O
  \|/
   |    ----------------------> Dev Account  --------> Manage Queries
  / \                                        --------> Monitor
                                             --------> Add/Remove Nodes
Jim
   O
  \|/
   |    ----------------------> Marketing Account ---> View Admin
  / \                                             ---> Graph Role ---> Read
                                                  ---> View Chronograf
```

## Cluster user information
In the cluster, individual users are assigned to an account.
Cluster accounts have permissions and roles.

In the diagram above, Penelope is assigned to the  Dev Account and
Jim is assigned to the Marketing Account.
The Dev Account includes the permissions to manage queries, monitor the
cluster, and add/remove nodes from the cluster.
The Marketing Account includes the permission to view and edit the admin screens
as well as the Graph Role which contains the permissions to read data and
view Chronograf.

### Roles
Roles are groups of permissions.
A single role can belong to several cluster accounts.

InfluxEnterprise clusters have two built-in roles:

#### Global Admin

The Global Admin role has all 16 [cluster permissions](#permissions).

#### Admin

The Admin role has all [cluster permissions](#permissions) except for the
permissions to:

* Add/Remove Nodes
* Copy Shard
* Manage Shards
* Rebalance

### Permissions
InfluxEnterprise clusters have 16 permissions:

#### View Admin
Permission to view or edit admin screens.
#### View Chronograf
Permission to use Chronograf tools.
#### Create Databases
Permission to create databases.
#### Create Users & Roles
Permission to create users and roles.
#### Add/Remove Nodes
Permission to add/remove nodes from a cluster.
#### Drop Databases
Permission to drop databases.
#### Drop Data
Permission to drop measurements and series.
#### Read
Permission to read data.
#### Write
Permission to write data.
#### Rebalance
Permission to rebalance a cluster.
#### Manage Shards
Permission to copy and delete shards.
#### Manage Continuous Queries
Permission to create, show, and drop continuous queries.
#### Manage Queries
Permission to show and kill queries.
#### Manage Subscriptions
Permission to show, add, and drop subscriptions.
#### Monitor
Permission to show stats and diagnostics.
#### Copy Shard
Permission to copy shards.

### Permission to Statement
The following table describes permissions required to execute the associated database statement.  It also describes whether these permissions apply just to InfluxDB (Database) or InfluxDB Enterprise (Cluster).

|Permission|Statement|
|---|---|
|CreateDatabasePermission|AlterRetentionPolicyStatement, CreateDatabaseStatement, CreateRetentionPolicyStatement, ShowRetentionPoliciesStatement|
|ManageContinuousQueryPermission|CreateContinuousQueryStatement, DropContinuousQueryStatement, ShowContinuousQueriesStatement|
|ManageSubscriptionPermission|CreateSubscriptionStatement, DropSubscriptionStatement, ShowSubscriptionsStatement|
|CreateUserAndRolePermission|CreateUserStatement, DropUserStatement, GrantAdminStatement, GrantStatement, RevokeAdminStatement, RevokeStatement, SetPasswordUserStatement, ShowGrantsForUserStatement, ShowUsersStatement|
|DropDataPermission|DeleteSeriesStatement, DeleteStatement, DropMeasurementStatement, DropSeriesStatement|
|DropDatabasePermission|DropDatabaseStatement, DropRetentionPolicyStatement|
|ManageShardPermission|DropShardStatement,ShowShardGroupsStatement, ShowShardsStatement|
|ManageQueryPermission|KillQueryStatement, ShowQueriesStatement|
|MonitorPermission|ShowDiagnosticsStatement, ShowStatsStatement|
|ReadDataPermission|ShowFieldKeysStatement, ShowMeasurementsStatement, ShowSeriesStatement, ShowTagKeysStatement, ShowTagValuesStatement, ShowRetentionPoliciesStatement|
|NoPermissions|ShowDatabasesStatement|
|Determined by type of select statement|SelectStatement|

### Statement to Permission
The following table describes database statements and the permissions required to execute them.  It also describes whether these permissions apply just to InfluxDB (Database) or InfluxEnterprise (Cluster).

|Statment|Permissions|Scope|
|---|---|---|
|AlterRetentionPolicyStatement|CreateDatabasePermission|Database|
|CreateContinuousQueryStatement|ManageContinuousQueryPermission|Database|
|CreateDatabaseStatement|CreateDatabasePermission|Cluster|
|CreateRetentionPolicyStatement|CreateDatabasePermission|Database|
|CreateSubscriptionStatement|ManageSubscriptionPermission|Database|
|CreateUserStatement|CreateUserAndRolePermission|Database|
|DeleteSeriesStatement|DropDataPermission|Database|
|DeleteStatement|DropDataPermission|Database|
|DropContinuousQueryStatement|ManageContinuousQueryPermission|Database|
|DropDatabaseStatement|DropDatabasePermission|Cluster|
|DropMeasurementStatement|DropDataPermission|Database|
|DropRetentionPolicyStatement|DropDatabasePermission|Database|
|DropSeriesStatement|DropDataPermission|Database|
|DropShardStatement|ManageShardPermission|Cluster|
|DropSubscriptionStatement|ManageSubscriptionPermission|Database|
|DropUserStatement|CreateUserAndRolePermission|Database|
|GrantAdminStatement|CreateUserAndRolePermission|Database|
|GrantStatement|CreateUserAndRolePermission|Database|
|KillQueryStatement|ManageQueryPermission|Database|
|RevokeAdminStatement|CreateUserAndRolePermission|Database|
|RevokeStatement|CreateUserAndRolePermission|Database|
|SelectStatement|Determined by type of select statement|n/a|
|SetPasswordUserStatement|CreateUserAndRolePermission|Database|
|ShowContinuousQueriesStatement|ManageContinuousQueryPermission|Database|
|ShowDatabasesStatement|NoPermissions|Cluster|The user's grants determine which databases are returned in the results.|
|ShowDiagnosticsStatement|MonitorPermission|Database|
|ShowFieldKeysStatement|ReadDataPermission|Database|
|ShowGrantsForUserStatement|CreateUserAndRolePermission|Database|
|ShowMeasurementsStatement|ReadDataPermission|Database|
|ShowQueriesStatement|ManageQueryPermission|Database|
|ShowRetentionPoliciesStatement|CreateDatabasePermission|Database|
|ShowSeriesStatement|ReadDataPermission|Database|
|ShowShardGroupsStatement|ManageShardPermission|Cluster|
|ShowShardsStatement|ManageShardPermission|Cluster|
|ShowStatsStatement|MonitorPermission|Database|
|ShowSubscriptionsStatement|ManageSubscriptionPermission|Database|
|ShowTagKeysStatement|ReadDataPermission|Database|
|ShowTagValuesStatement|ReadDataPermission|Database|
|ShowUsersStatement|CreateUserAndRolePermission|Database|
