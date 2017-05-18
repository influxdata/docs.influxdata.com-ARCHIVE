---
title: User Management
menu:
  chronograf_1_3:
    weight: 0
    parent: Administration
---

Chronograf's `Admin` page includes a complete interface for database user management.
The `Admin` page supports both OSS InfluxDB users and [InfluxEnterprise](/enterprise_influxdb/v1.2/) users.

This page covers user management specific to OSS InfluxDB and InfluxEnterprise clusters.
See [Security Best Practices](/chronograf/v1.3/administration/security-best-practices/) for more information about Chronograf's authentication and user management features.

### Content

* [Enable Authentication](#enable-authentication)
* [OSS InfluxDB User Management](#oss-influxdb-user-management)
* [InfluxEnterprise User Management](#influxenterprise-user-management)

## Enable Authentication

Follow the steps below to enable authentication.
The steps are the same for OSS InfluxDB instances and InfluxEnterprise clusters.
Note that if you're working with an InfluxEnterprise cluster, you will need to repeat steps one through three for each data node in the cluster.

### Step 1: Enable authentication
Enable authentication in InfluxDB's configuration file.
For most installations, the configuration file is located in `/etc/influxdb/influxdb.conf`.

In the `[http]` section, uncomment the `auth-enabled` option and set it to `true`:

```
[http]
  # Determines whether HTTP endpoint is enabled.
  # enabled = true

  # The bind address used by the HTTP service.
  # bind-address = ":8086"

  # Determines whether HTTP authentication is enabled.
  auth-enabled = true #💥
```

### Step 2: Restart the process

Next, restart the InfluxDB process for your configuration changes to take effect:

```
~# sudo systemctl restart influxdb
```

### Step 3: Create an admin user
Because you enabled authentication, you must create an [admin user](/influxdb/v1.2/query_language/authentication_and_authorization/#user-types-and-privileges) before you can do anything else in the database.
Run the command below to create an admin user, replacing:

* `localhost` with the IP or hostname of your OSS InfluxDB instance or one of your InfluxEnterprise data nodes
* `chronothan` with your own username
* `supersecret` with your own password
(note that the password requires single quotes)

```
~# curl -XPOST "http://localhost:8086/query" --data-urlencode "q=CREATE USER chronothan WITH PASSWORD 'supersecret' WITH ALL PRIVILEGES"
```

A successful `CREATE USER` query returns a blank result:
```
{"results":[{"statement_id":0}]}   <--- Success!
```

### Step 4: Edit the database source in Chronograf

If you've already [connected your database to Chronograf](/chronograf/v1.3/introduction/getting-started/#3-connect-to-chronograf), update the connection configuration in Chronograf with your new username and password.
Edit existing database sources by navigating to the Chronograf's configuration page and clicking on the name of the source.

## OSS InfluxDB User Management

On the `Admin` page:

* View, create, and delete admin and non-admin users
* Change user passwords
* Assign admin and remove admin permissions to or from a user

![OSS InfluxDB user management](/img/chronograf/v1.3/admin-usermanagement-oss.png)

InfluxDB users are either admin users or non-admin users.
See InfluxDB's [authentication and authorization](/influxdb/v1.2/query_language/authentication_and_authorization/#user-types-and-privileges) documentation for more information about those user types.

Note that currently, Chronograf does not support assigning database `READ`or `WRITE` access to non-admin users.
This is a known issue.
As a workaround, grant `READ`, `WRITE`, or `ALL` (`READ` and `WRITE`) permissions to non-admin users with the following curl commands, replacing anything inside `< >` with your own values:

#### Grant `READ` permission:
```
~# curl -XPOST "http://<InfluxDB-IP>:8086/query?u=<username>&p=<password>" --data-urlencode "q=GRANT READ ON <database-name> TO <non-admin-username>"
```

#### Grant `WRITE` permission:
```
~# curl -XPOST "http://<InfluxDB-IP>:8086/query?u=<username>&p=<password>" --data-urlencode "q=GRANT WRITE ON <database-name> TO <non-admin-username>"
```

#### Grant `ALL` permission:
```
~# curl -XPOST "http://<InfluxDB-IP>:8086/query?u=<username>&p=<password>" --data-urlencode "q=GRANT ALL ON <database-name> TO <non-admin-username>"
```

In all cases, a successful `GRANT` query returns a blank result:
```
{"results":[{"statement_id":0}]}   <--- Success!
```
Remove `READ`, `WRITE`, or `ALL` permissions from non-admin users by replacing `GRANT` with `REVOKE` in the curl commands above.

## InfluxEnterprise User Management

On the `Admin` page:

* View, create, and delete users
* Change user passwords
* Assign and remove permissions to or from a user
* Create, edit, and delete roles
* Assign and remove roles to or from a user

![OSS InfluxDB user management](/img/chronograf/v1.3/admin-usermanagement-cluster.png)

### User Types

The admin user that you created when you enabled authentication, has the following permissions by default:

* [CreateDatabase](#createdatabase)
* [CreateUserAndRole](#createuserandrole)
* [DropData](#dropdata)
* [DropDatabase](#dropdatabase)
* [ManageContinuousQuery](#managecontinuousquery)
* [ManageQuery](#managequery)
* [ManageShard](#manageshard)
* [ManageSubscription](#managesubscription)
* [Monitor](#monitor)
* [ReadData](#readdata)
* [ViewAdmin](#viewadmin)
* [ViewChronograf](#viewchronograf)
* [WriteData](#writedata)

Non-admin users have no permissions by default.
Assign permissions and roles to both admin and non-admin users.

### Permissions

#### AddRemoveNode
Permission to add or remove nodes from a cluster.

**Relevant `influxd-ctl` arguments**:
[`add-data`](/enterprise_influxdb/v1.2/features/cluster-commands/#add-data),
[`add-meta`](/enterprise_influxdb/v1.2/features/cluster-commands/#add-meta),
[`join`](/enterprise_influxdb/v1.2/features/cluster-commands/#join),
[`remove-data`](/enterprise_influxdb/v1.2/features/cluster-commands/#remove-data),
[`remove-meta`](/enterprise_influxdb/v1.2/features/cluster-commands/#remove-meta), and
[`leave`](/enterprise_influxdb/v1.2/features/cluster-commands/#leave)

**Pages in Chronograf that require this permission**: NA

#### CopyShard
Permission to copy shards.

**Relevant `influxd-ctl` arguments**:
[copy-shard](/enterprise_influxdb/v1.2/features/cluster-commands/#copy-shard)

**Pages in Chronograf that require this permission**: NA

#### CreateDatabase
Permission to create databases, create [retention policies](/influxdb/v1.2/concepts/glossary/#retention-policy-rp), alter retention policies, and view retention policies.

**Relevant InfluxQL queries**:
[`CREATE DATABASE`](/influxdb/v1.2/query_language/database_management/#create-database),
[`CREATE RETENTION POLICY`](/influxdb/v1.2/query_language/database_management/#create-retention-policies-with-create-retention-policy),
[`ALTER RETENTION POLICY`](/influxdb/v1.2/query_language/database_management/#modify-retention-policies-with-alter-retention-policy), and
[`SHOW RETENTION POLICIES`](/influxdb/v1.2/query_language/schema_exploration/#show-retention-policies)

**Pages in Chronograf that require this permission**: Dashboards, Data Explorer, and DB Management on the Admin page 

#### CreateUserAndRole
Permission to manage users and roles; create users, drop users, grant admin status to users, grant permissions to users, revoke admin status from users, revoke permissions from users, change user's passwords, view user permissions, and view users and their admin status.

**Relevant InfluxQL queries**:
[`CREATE USER`](/influxdb/v1.2/query_language/authentication_and_authorization/#user-management-commands),
[`DROP USER`](/influxdb/v1.2/query_language/authentication_and_authorization/#general-admin-and-non-admin-user-management),
[`GRANT ALL PRIVILEGES`](/influxdb/v1.2/query_language/authentication_and_authorization/#user-management-commands),
[`GRANT [READ,WRITE,ALL]`](/influxdb/v1.2/query_language/authentication_and_authorization/#non-admin-user-management),
[`REVOKE ALL PRIVILEGES`](/influxdb/v1.2/query_language/authentication_and_authorization/#user-management-commands),
[`REVOKE [READ,WRITE,ALL]`](/influxdb/v1.2/query_language/authentication_and_authorization/#non-admin-user-management),
[`SET PASSWORD`](/influxdb/v1.2/query_language/authentication_and_authorization/#general-admin-and-non-admin-user-management),
[`SHOW GRANTS`](/influxdb/v1.2/query_language/authentication_and_authorization/#non-admin-user-management), and
[`SHOW USERS`](/influxdb/v1.2/query_language/authentication_and_authorization/#user-management-commands)

**Pages in Chronograf that require this permission**: Data Explorer, Dashboards, Users and Roles on the Admin page

#### DropData
Permission to drop data, in particular [series](/influxdb/v1.2/concepts/glossary/#series) and [measurements](/influxdb/v1.2/concepts/glossary/#measurement).

**Relevant InfluxQL queries**:
[`DROP SERIES`](/influxdb/v1.2/query_language/database_management/#drop-series-from-the-index-with-drop-series),
[`DELETE`](/influxdb/v1.2/query_language/database_management/#delete-series-with-delete), and
[`DROP MEASUREMENT`](/influxdb/v1.2/query_language/database_management/#delete-measurements-with-drop-measurement)

**Pages in Chronograf that require this permission**: NA

#### DropDatabase
Permission to drop databases and retention policies.

**Relevant InfluxQL queries**:
[`DROP DATABASE`](/influxdb/v1.2/query_language/database_management/#delete-a-database-with-drop-database) and
[`DROP RETENTION POLICY`](/influxdb/v1.2/query_language/database_management/#delete-retention-policies-with-drop-retention-policy)

**Pages in Chronograf that require this permission**: Data Explorer, Dashboards, DB Management on the Admin page 

#### KapacitorAPI
Permission to access the API for InfluxEnterprise Kapacitor.
This does not include configuration-related API calls.

**Pages in Chronograf that require this permission**: NA

#### KapacitorConfigAPI
Permission to access the configuration-related API calls for InfluxEnterprise Kapacitor.

**Pages in Chronograf that require this permission**: NA

#### ManageContinuousQuery
Permission to create, drop, and view [continuous queries](/influxdb/v1.2/concepts/glossary/#continuous-query-cq).

**Relevant InfluxQL queries**: 
[`CreateContinuousQueryStatement`](/influxdb/v1.2/query_language/continuous_queries/),
[`DropContinuousQueryStatement`](), and
[`ShowContinuousQueriesStatement`](/influxdb/v1.2/query_language/continuous_queries/#list-cqs)

**Pages in Chronograf that require this permission**: Data Explorer, Dashboards

#### ManageQuery
Permission to view and kill queries.

**Relevant InfluxQL queries**:
[`SHOW QUERIES`](/influxdb/v1.2/troubleshooting/query_management/#list-currently-running-queries-with-show-queries) and
[`KILL QUERY`](/influxdb/v1.2/troubleshooting/query_management/#stop-currently-running-queries-with-kill-query)

**Pages in Chronograf that require this permission**: Queries on the Admin page

#### ManageShard
Permission to copy, delete, and view [shards](/influxdb/v1.2/concepts/glossary/#shard).

**Relevant InfluxQL queries**:
[`DropShardStatement`](/influxdb/v1.2/query_language/database_management/#delete-a-shard-with-drop-shard),
[`ShowShardGroupsStatement`](/influxdb/v1.2/query_language/spec/#show-shard-groups), and
[`ShowShardsStatement`](/influxdb/v1.2/query_language/spec/#show-shards)

**Pages in Chronograf that require this permission**: NA

#### ManageSubscription
Permission to create, drop, and view [subscriptions](/influxdb/v1.2/concepts/glossary/#subscription).

**Relevant InfluxQL queries**:
[`CREATE SUBSCRIPTION`](/influxdb/v1.2/query_language/spec/#create-subscription),
[`DROP SUBSCRIPTION`](/influxdb/v1.2/query_language/spec/#drop-subscription), and
[`SHOW SUBSCRIPTIONS`](/influxdb/v1.2/query_language/spec/#show-subscriptions)

**Pages in Chronograf that require this permission**: Alerting

#### Monitor
Permission to run to view cluster statistics and diagnostics.

**Relevant InfluxQL queries**:
[`SHOW DIAGNOSTICS`](/influxdb/v1.2/troubleshooting/statistics/) and
[`SHOW STATS`](/influxdb/v1.2/troubleshooting/statistics/)

**Pages in Chronograf that require this permission**: Data Explorer, Dashboards

#### NoPermissions
This permission is deprecated.

#### ReadData
Permission to read data.

**Relevant InfluxQL queries**:
[`SHOW FIELD KEYS`](/influxdb/v1.2/query_language/schema_exploration/#show-field-keys),
[`SHOW MEASUREMENTS`](/influxdb/v1.2/query_language/schema_exploration/#show-measurements),
[`SHOW SERIES`](/influxdb/v1.2/query_language/schema_exploration/#show-series),
[`SHOW TAG KEYS`](/influxdb/v1.2/query_language/schema_exploration/#show-tag-keys), and
[`SHOW TAG VALUES`](/influxdb/v1.2/query_language/schema_exploration/#show-tag-values)

**Pages in Chronograf that require this permission**: Admin, Alerting, Dashboards, Data Explorer, Host List

#### Rebalance
This permission is deprecated.

#### ViewAdmin
This permission is deprecated and will be removed in a future release.

#### ViewChronograf
This permission is deprecated and will be removed in a future release.

#### WriteData
Permission to write data.

**Relevant InfluxQL queries**: NA

**Pages in Chronograf that require this permission**: NA

### Roles
Roles are groups of permissions.
Assign roles to one user or to more than one user.

For example, the image below contains three roles: `CREATOR`, `DESTROYER`, and `POWERLESS`.
`CREATOR` includes two permissions (`CreateDatbase` and `CreateUserAndRole`) and is assigned to one user (`chrononut`).
`DESTROYER` also includes two permissions (`DropDatabase` and `DropData`) and is assigned to two users (`chrononut` and `chronelda`).

![OSS InfluxDB user management](/img/chronograf/v1.3/admin-usermanagement-roles.png)




