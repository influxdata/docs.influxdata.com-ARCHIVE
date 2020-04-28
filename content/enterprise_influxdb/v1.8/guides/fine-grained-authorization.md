---
title: Fine-grained authorization in InfluxDB Enterprise
alias:
  -/docs/v1.5/administration/fga
menu:
  enterprise_influxdb_1_8:
    name: Fine-grained authorization
    weight: 10
    parent: Guides
---

Use fine-grained authorization (FGA) in InfluxDB Enterprise to control user access at the database, measurement, and series levels.

> **Note:** InfluxDB OSS controls access at the database level only.

You must have [admin permissions](/influxdb/v1.8/administration/authentication_and_authorization/#admin-user-management) to set up FGA.

## Set up fine-grained authorization

1. [Enable authentication](/influxdb/v1.8/administration/authentication_and_authorization/#set-up-authentication) in your InfluxDB configuration file.

2. Create users through the InfluxDB query API.

    ```sql
    CREATE USER username WITH PASSWORD 'password'
    ```

    For more information, see [User management commands](/influxdb/v1.8/administration/authentication_and_authorization/#user-management-commands).

3. Ensure that you can access the **meta node** API (port 8091 by default).

    > In a typical cluster configuration, the HTTP ports for data nodes
    > (8086 by default) are exposed to clients but the meta node HTTP ports are not.
    > You may need to work with your network administrator to gain access to the meta node HTTP ports.

4. _(Optional)_ [Create roles](#manage-roles).
   Roles let you grant permissions to groups of users assigned to each role.

    > For an overview of how users and roles work in InfluxDB Enterprise, see [InfluxDB Enterprise users](/enterprise_influxdb/v1.8/features/users/).

5. [Set up restrictions](#manage-restrictions).
   Restrictions apply to all non-admin users.

    > Permissions (currently "read" and "write") may be restricted independently depending on the scenario.

7. [Set up grants](#manage-grants) to remove restrictions for specified users and roles.

---

{{% note %}}
#### Notes about examples
The examples below use `curl`, a command line tool for transferring data, to send
HTTP requests to the Meta API, and `jq`, a command line JSON processor,
to make the JSON output easier to read.
Alternatives for each are available, but are not covered in this documentation.

All examples assume authentication is enabled in InfluxDB.
Admin credentials must be sent with each request.
Use the `curl -u` flag to pass authentication credentials:

```sh
curl -u `username:password` #...
```
{{% /note %}}

---

## Matching methods
The following matching methods are available when managing restrictions and grants to databases, measurements, or series:

- `exact` (matches only exact string matches)
- `prefix` (matches strings the begin with a specified prefix)

```sh
# Match a database name exactly
"database": {"match": "exact", "value": "my_database"}

# Match any databases that begin with "my_"
"database": {"match": "prefix", "value": "my_"}
```

{{% note %}}
#### Wildcard matching
Neither `exact` nor `prefix` matching methods allow for wildcard matching.
{{% /note %}}

## Manage roles
Roles allow you to assign permissions to groups of users.
The following examples assume the `user1`, `user2` and `ops` users already exist in InfluxDB.

### Create a role
To create a new role, use the InfluxDB Meta API `/role` endpoint with the `action`
field set to `create` in the request body.

The following examples create two new roles:

- east
- west

```sh
# Create east role
curl -s -L -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "create",
    "role": {
      "name": "east"
    }
  }'

# Create west role
curl -s -L -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "create",
    "role": {
      "name": "west"
    }
  }'
```

### Specify role permissions
To specify permissions for a role,
use the InfluxDB Meta API `/role` endpoint with the `action` field set to `add-permissions`.
Specify the [permissions](/chronograf/v1.8/administration/managing-influxdb-users/#permissions) to add for each database.

The following example sets read and write permissions on `db1` for both `east` and `west` roles.

```sh
curl -s -L -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-permissions",
    "role": {
      "name": "east",
      "permissions": {
        "db1": ["ReadData", "WriteData"]
      }
    }
  }'

curl -s -L -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-permissions",
    "role": {
      "name": "west",
      "permissions": {
        "db1": ["ReadData", "WriteData"]
      }
    }
  }'
```

### Remove role permissions
To remove permissions from a role, use the InfluxDB Meta API `/role` endpoint with the `action` field
set to `remove-permissions`.
Specify the [permissions](https://docs.influxdata.com/chronograf/latest/administration/managing-influxdb-users/#permissions) to remove from each database.

The following example removes read and write permissions from `db1` for the `east` role.

```sh
curl -s -L -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "remove-permissions",
    "role": {
      "name": "east",
      "permissions": {
        "db1": ["ReadData", "WriteData"]
      }
    }
  }'
```

### Assign users to a role
To assign users to role, set the `action` field to `add-users` and include a list
of users in the `role` field.

The following examples add user1, user2 and the ops user to the `east` and `west` roles.

```sh
# Add user1 and ops to the east role
curl -s -L -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-users",
    "role": {
      "name": "east",
      "users": ["user1", "ops"]
    }
  }'

# Add user1 and ops to the west role
curl -s -L -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-users",
    "role": {
      "name": "west",
      "users": ["user2", "ops"]
    }
  }'
```

### View existing roles
To view existing roles with their assigned permissions and users, use the `GET`
request method with the InfluxDB Meta API `/role` endpoint.

```sh
curl -L -XGET http://localhost:8091/role | jq
```

### Delete a role
To delete a role, the InfluxDB Meta API `/role` endpoint and set the `action`
field to `delete` and include the name of the role to delete.

```sh
curl -s -L -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "delete",
    "role": {
      "name": "west"
    }
  }'
```

{{% note %}}
Deleting a role does not delete users assigned to the role.
{{% /note %}}

## Manage restrictions
Restrictions restrict either or both read and write permissions on InfluxDB assets.
Restrictions apply to all non-admin users.
[Grants](#manage-grants) override restrictions.

> In order to run meta queries (such as `SHOW MEASUREMENTS` or `SHOW TAGS` ),
> users must have read permissions for the database and retention policy they are querying.

Manage restrictions using the InfluxDB Meta API `acl/restrictions` endpoint.

```sh
curl -L -XGET "http://localhost:8091/influxdb/v2/acl/restrictions"
```

- [Restrict by database](#restrict-by-database)
- [Restrict by measurement in a database](#restrict-by-measurement-in-a-database)
- [Restrict by series in a database](#restrict-by-series-in-a-database)
- [View existing restrictions](#view-existing-restrictions)
- [Update a restriction](#update-a-restriction)
- [Remove a restriction](#remove-a-restriction)

> **Note:** For the best performance, set up minimal restrictions.

### Restrict by database
In most cases, restricting the database is the simplest option, and has minimal impact on performance.
The following example restricts reads and writes on the `my_database` database.

```sh
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "permissions": ["read", "write"]
  }'
```

### Restrict by measurement in a database
The following example restricts read and write permissions on the `network`
measurement in the `my_database` database.
_This restriction does not apply to other measurements in the `my_database` database._

```sh
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"]
  }'
```

### Restrict by series in a database
The most fine-grained restriction option is to restrict specific tags in a measurement and database.
The following example restricts read and write permissions on the `datacenter=east` tag in the
`network` measurement in the `my_database` database.
_This restriction does not apply to other tags or tag values in the `network` measurement._

```sh
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"]
  }'
```

_Consider this option carefully, as it allows writes to `network` without tags or
writes to `network` with a tag key of `datacenter` and a tag value of anything but `east`._

##### Apply restrictions to a series defined by multiple tags
```sh
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [
      {"match": "exact", "key": "tag1", "value": "value1"},
      {"match": "exact", "key": "tag2", "value": "value2"}
    ],
    "permissions": ["read", "write"]
  }'
```

{{% note %}}
#### Create multiple restrictions at a time
There may be times where you need to create restrictions using unique values for each.
To create multiple restrictions for a list of values, use a bash `for` loop:

```sh
for value in val1 val2 val3 val4; do
  curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
    -u "admin-username:admin-password" \
    -H "Content-Type: application/json" \
    --data-binary '{
      "database": {"match": "exact", "value": "my_database"},
      "measurement": {"match": "exact", "value": "network"},
      "tags": [{"match": "exact", "key": "datacenter", "value": "'$value'"}],
      "permissions": ["read", "write"]
    }'
done
```
{{% /note %}}

### View existing restrictions
To view existing restrictions, use the `GET` request method with the `acl/restrictions` endpoint.

```sh
curl -L -u "admin-username:admin-password" -XGET "http://localhost:8091/influxdb/v2/acl/restrictions" | jq
```

### Update a restriction
_You can not directly modify a restriction.
Delete the existing restriction and create a new one with updated parameters._

### Remove a restriction
To remove a restriction, obtain the restriction ID using the `GET` request method
with the `acl/restrictions` endpoint.
Use the `DELETE` request method to delete a restriction by ID.

```sh
# Obtain the restriction ID from the list of restrictions
curl -L -u "admin-username:admin-password" \
  -XGET "http://localhost:8091/influxdb/v2/acl/restrictions" | jq

# Delete the restriction using the restriction ID
curl -L -u "admin-username:admin-password" \
  -XDELETE "http://localhost:8091/influxdb/v2/acl/restrictions/<restriction_id>"
```

## Manage grants
Grants remove restrictions and grant users or roles either or both read and write
permissions on InfluxDB assets.

Manage grants using the InfluxDB Meta API `acl/grants` endpoint.

```sh
curl -L -u "admin-username:admin-password" \
  -XGET "http://localhost:8091/influxdb/v2/acl/grants"
```

- [Grant permissions by database](#grant-permissions-by-database)
- [Grant permissions by measurement in a database](#grant-permissions-by-measurement-in-a-database)
- [Grant permissions by series in a database](#grant-permissions-by-series-in-a-database)
- [View existing grants](#view-existing-grants)
- [Update a grant](#update-a-grant)
- [Remove a grant](#remove-a-grant)

### Grant permissions by database
The following examples grant read and write permissions on the `my_database` database.

> **Note:** This offers no guarantee that the users will write to the correct measurement or use the correct tags.

##### Grant database-level permissions to users
```sh
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "permissions": ["read", "write"],
    "users": [
      {"name": "user1"},
      {"name": "user2"}
    ]
  }'
```

##### Grant database-level permissions to roles
```sh
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "permissions": ["read", "write"],
    "roles": [
      {"name": "role1"},
      {"name": "role2"}
    ]
  }'
```

### Grant permissions by measurement in a database
The following examples grant permissions to the `network` measurement in the `my_database` database.
These grants do not apply to other measurements in the `my_database` database nor
guarantee that users will use the correct tags.

##### Grant measurement-level permissions to users
```sh
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"],
    "users": [
      {"name": "user1"},
      {"name": "user2"}
    ]
  }'
```

To grant access for roles, run:

```sh
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"],
    "roles": [
      {"name": "role1"},
      {"name": "role2"}
    ]
  }'
```

### Grant permissions by series in a database

The following examples grant access only to data with the corresponding `datacenter` tag.
_Neither guarantees the users will use the `network` measurement._

##### Grant series-level permissions to users
```sh
# Grant user1 read/write permissions on data with the 'datacenter=east' tag set.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"],
    "users": [{"name": "user1"}]
  }'

# Grant user2 read/write permissions on data with the 'datacenter=west' tag set.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "west"}],
    "permissions": ["read", "write"],
    "users": [{"name": "user2"}]
  }'
```

##### Grant series-level permissions to roles
```sh
# Grant role1 read/write permissions on data with the 'datacenter=east' tag set.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role1"}]
  }'

# Grant role2 read/write permissions on data with the 'datacenter=west' tag set.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "west"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role2"}]
  }'
```

### Grant access to specific series in a measurement
The following examples grant read and write permissions to corresponding `datacenter`
tags in the `network` measurement.
_They each specify the measurement in the request body._

##### Grant series-level permissions in a measurement to users
```sh
# Grant user1 read/write permissions on data with the 'datacenter=west' tag set
# inside the 'network' measurement.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"],
    "users": [{"name": "user1"}]
  }'

# Grant user2 read/write permissions on data with the 'datacenter=west' tag set
# inside the 'network' measurement.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "west"}],
    "permissions": ["read", "write"],
    "users": [{"name": "user2"}]
  }'
```

##### Grant series-level permissions in a measurement to roles
```sh
# Grant role1 read/write permissions on data with the 'datacenter=west' tag set
# inside the 'network' measurement.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role1"}]
  }'

# Grant role2 read/write permissions on data with the 'datacenter=west' tag set
# inside the 'network' measurement.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "west"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role2"}]
  }'
```

Grants for specific series also apply to [meta queries](https://docs.influxdata.com/influxdb/v1.8/query_language/schema_exploration).
Results from meta queries are restricted based on series-level permissions.
For example, `SHOW TAG VALUES` only returns tag values that the user is authorized to see.

With these grants in place, a user or role can only read or write data from or to
the `network` measurement if the data includes the appropriate `datacenter` tag set.

{{% note %}}
Note that this is only the requirement of the presence of that tag;
`datacenter=east,foo=bar` will also be accepted.
{{% /note %}}

### View existing grants
To view existing grants, use the `GET` request method with the `acl/grants` endpoint.

```sh
curl -L -u "admin-username:admin-password" \
  -XGET "http://localhost:8091/influxdb/v2/acl/grants" | jq
```

### Update a grant
_You can not directly modify a grant.
Delete the existing grant and create a new one with updated parameters._

### Remove a grant
To delete a grant, obtain the grant ID using the `GET` request method with the
`acl/grants` endpoint.
Use the `DELETE` request method to delete a grant by ID.

```sh
# Obtain the grant ID from the list of grants
curl -L -u "admin-username:admin-password" \
  -XGET "http://localhost:8091/influxdb/v2/acl/grants" | jq

# Delete the grant using the grant ID
curl -L -u "admin-username:admin-password" \
  -XDELETE "http://localhost:8091/influxdb/v2/acl/grants/<grant_id>"
```
