---
title: Users, Permissions, and Roles
menu:
  enterprise_1b:
    weight: 0
    parent: administration
---

## Users

A user has an email, username, and password.
Users can have many permissions and can belong to multiple roles.
```
User A
  O      ---> Role X ---> Permission A, Permission B, Permission C          
 /|\     ---> Role Y ---> Permission D, Permission E      
 / \     ---> Permission F
```

## Permissions

A permission is a grant for access.
They can be global, cluster specific, or database specific.
Permissions can be granted to roles and to users.

*TODO: Confirm*

| Permission | Description | Global | Cluster Specific | Database Specific
| :--------- | :---------- | :----- | :--------------- | :---------------- |
| Add/Remove Nodes | The right to add and remove servers from a cluster. | | | |
| Create Databases | The right to create [databases](/influxdb/v1.0/concepts/glossary/#database) and [retention policies](/influxdb/v1.0/concepts/glossary/#retention-policy-rp). | X | X |  |
| Create Users and Roles | The right to create users. Users with this permission can assign permissions and roles equal to their own permissions and roles. | | | |
| Drop Data | The right to perform the `DROP MEASUREMENT` and `DROP SERIES` queries. | | X | X |
| Drop Databases | The right to drop [databases](/influxdb/v1.0/concepts/glossary/#database) and [retention policies](/influxdb/v1.0/concepts/glossary/#retention-policy-rp). | X | X | |
| Manage Continuous Queries | The right to create, list, and drop [continuous queries](/influxdb/v1.0/concepts/glossary/#continuous-query-cq). | X | X | X |
| Manage Queries | The right to `SHOW` and `KILL` queries. | | | |
| Manage Shards | The right to `SHOW` and `DROP` shards. | | | |
| Manage Subscriptions | The right to `SHOW`, `ADD`, and `DROP` subscriptions. | | | |
| Monitor | The right to `SHOW STATS` and `SHOW DIAGNOSTICS`. | | | |
| Read Data | The right to read data. | X | X | X |
| View Admin | The right to view the admin screen and diagnostics dashboard. | NA | NA | NA |
| View Chronograf | The right to view Chronograf screens. | NA | NA | NA |
| Write Data | The right to write data. | X | X | X |

### Negative permissions

Disallow a permission by negatively assigning that permission to a user or role.

If a user is both assigned a permission and negatively assigned a permission,
the user will not be able to perform that permission.

For example, User A is assigned to the R/W role which comes with the
Read Data and Write Data permissions.
User A is also assigned a negative Write Data permission.
In this case, and in all similar cases, the negative permission holds and User A
cannot write data.
```
User A
  O      ---> Role R/W ---> Permission to Read Data ✅, Permission to Write Data ❌      
 /|\        
 / \     ---> Negative Permission to Write Data ✅
```

## Roles

A role is a collection of users and permissions.
Users assigned to a role have all permission granted to that role.

### Built-in Roles

InfluxEnterprise comes with two built-in roles.

##### Global Admin
<br>
The Global Admin role includes every [permission](#permissions).
All permissions in the Global Admin role are global, they are not scoped by
cluster or database.

##### Admin
<br>
The Admin role includes every [permission](#permissions) except the Manage
Shards permission and the Add/Remove Nodes permission.
All permissions in the Admin role are global, they are not scoped by cluster
or database.
