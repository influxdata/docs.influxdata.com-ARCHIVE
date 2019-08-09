---
title: Fine-grained authorization in InfluxDB Enterprise
alias:
  -/docs/v1.5/administration/fga
menu:
  enterprise_influxdb_1_7:
    name: Fine-grained authorization
    weight: 10
    parent: Guides
---

Fine-grained authorization in InfluxDB Enterprise controls access at the database, measurement, and series level.

> **Note:** InfluxDB OSS controls access at the database level only.

## Set up fine-grained authorization (FGA)

To set up fine-grained authorization (FGA), you must have [admin permissions](/influxdb/v1.7/administration/authentication_and_authorization/#admin-user-management), and then complete the following steps.

1. [Enable authentication](/influxdb/v1.7/administration/authentication_and_authorization/#set-up-authentication) in your configuration file.

2. Create users (the same way you do for InfluxDB) through the query API and grant users explicit read and/or write privileges per database. For detail, see [User management commands](/influxdb/v1.7/administration/authentication_and_authorization/#user-management-commands) or see [example below](#create-and-grant-user-access-to-a-database).

3. Obtain access to the meta nodes' HTTP ports (8091 by default).

    > **Note:** In a typical cluster configuration, the data nodes' HTTP ports (8086 by default) are exposed to clients but the meta nodes' HTTP ports are not. You may need to work with your network administrator to gain access to the meta nodes' HTTP ports.

4. Create roles. To learn how to create a role, see the [roles](/enterprise_kapacitor/v1.5/administration/auth/#roles) documentation or the [example below](/enterprise_influxdb/v1.7/guides/fine-grained-authorization/#create-roles).

    > **Note:** For an overview of how users and roles work in InfluxDB Enterprise, see [InfluxDB Enterprise users](/enterprise_influxdb/v1.7/features/users/).

5. [Set up restrictions](#set-up-restrictions).

    > **Note:** Permissions (currently "read" and "write") may be restricted independently depending on the scenario.

7. [Set up grants](#set-up-grants) to remove restrictions for specified users and roles.
8. (Optional) [Modify a grant](#modify-a-grant) or [delete a grant](#delete-a-grant) for users and roles as needed.

## Example

Consider a `datacenters` database with one measurement named `network` with a tag for `dc=east` or `dc=west` and two fields, `bytes_in` and `bytes_out`.

### Create and grant user access to a database

To create and grant users access to a database, run the following InfluxQL queries:

```
CREATE DATABASE datacenters

CREATE USER east WITH PASSWORD 'east'
GRANT ALL ON datacenters TO east

CREATE USER west WITH PASSWORD 'west'
GRANT ALL ON datacenters TO west
```

Now, east and west users have unrestricted read and write access to the `datacenters` database.

### Set up restrictions

Set up restrictions to:

- [restrict a database](#restrict-a-database)
- [restrict a measurement in a database](#restrict-one-measurement-in-a-database)
- [restrict a specific series in a database](#restrict-specific-series-in-a-database)

> **Note:** For the best performance, set up minimal restrictions.

#### Restrict a database

In most cases, restricting the database is the simplest option, and has minimal impact on performance.

Assuming the meta node is running its HTTP service on localhost on the default port, run the following query:

```
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "permissions": ["read", "write"]
  }'
```

Now, the east and west users cannot read from or write to the database.

#### Restrict one measurement in a database

To restrict one measurement in the database, run the following:

```
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"]
  }'
```

Now, the east and west users are free to read from and write to any measurement in the database `datacenters` besides `network`.

#### Restrict specific series in a database

The most fine-grained restriction option is to restrict specific tags in a measurement and database.

```
for region in east west; do
  curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
    -H "Content-Type: application/json" \
    --data-binary '{
      "database": {"match": "exact", "value": "datacenters"},
      "measurement": {"match": "exact", "value": "network"},
      "tags": [{"match": "exact", "key": "dc", "value": "'$region'"}],
      "permissions": ["read", "write"]
    }'
done
```

This configuration allows reads and writes from any measurement in `datacenters`; and when the measurement is `network`, it only restricts access if there's a `dc=east` or `dc=west` tag.

Consider this option carefully, as it allows writes to `network` without tags or writes to `network` with a tag key of `dc` and a tag value of anything but `east` or `west`.

> **Note:** This example uses an `exact` match. To restrict databases, measurements or tags based on a common prefix, match on `prefix`.

### Set up grants

Set up grants to allow specified users and roles to bypass restrictions to:

- [access a database](#grant-access-to-a-database)
- [access one measurement in a database](#grant-access-to-a-database)
- [access to specific tags in a database](#grant-access-to-a-database)
- [access a specific series in a database](#grant-access-to-a-database)

The structure of a POST body for a grant is identical to the POST body for a restriction, but with the addition of a `users` or `roles` array.

#### Grant access to a database

> **Note:** This offers no guarantee that the users will write to the correct measurement or use the correct tags.

To grant access for users, run:

```
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "permissions": ["read", "write"],
    "users": [{"name": "east"}, {"name": "west"}]
  }'
```

To grant access for roles, run:
```
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "permissions": ["read", "write"],
    "roles": [{"name": "east"}, {"name": "west"}]
  }'
```

#### Grant access to one measurement in a database

This guarantees that the users will only have access to the `network` measurement but it still does not guarantee that they will use the correct tags.

To grant access for users, run:

```
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"],
    "users": [{"name": "east"}, {"name": "west"}]
  }'
```

To grant access for roles, run:

```
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"],
    "roles": [{"name": "east"}, {"name": "west"}]
  }'
```

#### Grant access to specific tags in a database

This guarantees that the users will only have access to data with the corresponding `dc` tag but it does not guarantee that they will use the `network` measurement.

To grant access for users, run:

```
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "tags": [{"match": "exact", "key": "dc", "value": "east"}],
    "permissions": ["read", "write"],
    "users": [{"name": "east"}]
  }'
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "tags": [{"match": "exact", "key": "dc", "value": "west"}],
    "permissions": ["read", "write"],
    "users": [{"name": "west"}]
  }'
```

To grant access for roles, run:

```
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "tags": [{"match": "exact", "key": "dc", "value": "east"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "east"}]
  }'
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "tags": [{"match": "exact", "key": "dc", "value": "west"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "west"}]
  }'
```

#### Grant access to specific series in a database

To guarantee that both users only have access to the `network` measurement and that the east user uses the tag `dc=east` and the west user uses the tag `dc=west`, we need to make two separate grant calls:

To grant access for users, run:

```
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "dc", "value": "east"}],
    "permissions": ["read", "write"],
    "users": [{"name": "east"}]
  }'
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "dc", "value": "west"}],
    "permissions": ["read", "write"],
    "users": [{"name": "west"}]
  }'
```

To grant access for roles, run:

```
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "dc", "value": "east"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "east"}]
  }'
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "dc", "value": "west"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "west"}]
  }'
```

Now, when a user (or specified role) in the east role writes to the `network` measurement, the query must include the tag `dc=east`, and when the user (or specified role) in the west writes to `network`, the query must include the tag `dc=west`.

Note that this is only the requirement of the presence of that tag; `dc=east,foo=bar` will also be accepted.

#### Modify a grant

To modify an existing grant, follow the steps to [set up a new grant](#set-up-grants), except use PATCH instead of POST. 

>**Note:** Supply all of the data from the existing grant, and specify the field(s) to update. The grant ID cannot be used to update a single field.

#### Delete a grant

To delete a grant, run the following command:

```js
curl -X "DELETE" "http://localhost:8091/influxdb/v2/acl/grants/<grant_id>
```

### Roles

If multiple individuals need to write to a database, we don't want them to share login credentials.
In this case, use roles to associate a set of users with a group of permissions.

In this example, we have the same number of users on the east and west teams, and we'll have an `ops` user who needs full access to data from both the east and west datacenters.
Below, we show how to create one user each for east and west, but the process would be the same for any number of users.

To set up users, run:

```
CREATE DATABASE datacenters

CREATE USER e001 WITH PASSWORD 'e001'
CREATE USER w001 WITH PASSWORD 'w001'
CREATE USER ops WITH PASSWORD 'ops'
```

#### Create roles

We want one role for full access to any point in `datacenters` with the tag `dc=east` and another role for the tag `dc=west`.

To initialize the roles, run:

```
curl -s -L -XPOST "http://localhost:8091/role" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "create",
    "role": {
      "name": "east"
    }
  }'
curl -s -L -XPOST "http://localhost:8091/role" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "create",
    "role": {
      "name": "west"
    }
  }'
```

Now, specify that anyone who belongs to the roles has general read and write access to the `datacenters` database.

```
curl -s -L -XPOST "http://localhost:8091/role" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-permissions",
    "role": {
      "name": "east",
      "permissions": {
        "datacenters": ["ReadData", "WriteData"]
      }
    }
  }'

curl -s -L -XPOST "http://localhost:8091/role" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-permissions",
    "role": {
      "name": "west",
      "permissions": {
        "datacenters": ["ReadData", "WriteData"]
      }
    }
  }'
```

Next, we need to associate users to the roles.
The `east` role gets the user from the east team, the `west` role gets the user from the west team, and both roles get the `ops` user.

```
curl -s -L -XPOST "http://localhost:8091/role" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-users",
    "role": {
      "name": "east",
      "users": ["e001", "ops"]
    }
  }'
curl -s -L -XPOST "http://localhost:8091/role" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-users",
    "role": {
      "name": "west",
      "users": ["w001", "ops"]
    }
  }'
```

### Set up restrictions

See [set up restrictions](#set-up-restrictions).

### Set up grants

See [set up grants](#set-up-grants).