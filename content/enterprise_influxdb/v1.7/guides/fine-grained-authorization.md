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

Fine-grained authorization (FGA) in InfluxDB Enterprise controls access at the database, measurement, and series level.

> **Note:** InfluxDB OSS controls access at the database level only.

## Set up fine-grained authorization

To set up fine-grained authorization (FGA), you must have
[admin permissions](/influxdb/v1.7/administration/authentication_and_authorization/#admin-user-management),
and then complete the following steps.

1. [Enable authentication](/influxdb/v1.7/administration/authentication_and_authorization/#set-up-authentication) in your InfluxDB configuration file.

2. Create users through the InfluxDB query API.

    ```sql
    CREATE USER username WITH PASSWORD 'password'
    ```

    For detail, see [User management commands](/influxdb/v1.7/administration/authentication_and_authorization/#user-management-commands).

3. Obtain access to the **meta** nodes' HTTP API (port 8091 by default).

    > **Note:** In a typical cluster configuration, the data nodes' HTTP ports
    > (8086 by default) are exposed to clients but the meta nodes' HTTP ports are not.
    > You may need to work with your network administrator to gain access to the meta nodes' HTTP ports.

4. _(Optional)_ [Create roles](#roles). Roles let you grant permissions to groups of users assigned to each role.
   To learn how to create a role, see the [roles](/enterprise_kapacitor/v1.5/administration/auth/#roles) documentation or the [example below](/enterprise_influxdb/v1.7/guides/fine-grained-authorization/#create-roles).

    > **Note:** For an overview of how users and roles work in InfluxDB Enterprise, see [InfluxDB Enterprise users](/enterprise_influxdb/v1.7/features/users/).

5. [Set up restrictions](#manage-restrictions). Restrictions apply to all non-admin users.

    > **Note:** Permissions (currently "read" and "write") may be restricted independently depending on the scenario.

7. [Set up grants](#manage-grants) to remove restrictions for specified users and roles.

## Matching methods
As you manage restrictions and grants to databases, measurements, or seriesusing matching methods.
The following matching methods are available:

- **exact**: Matches only exact string matches.
- **prefix**: Matches strings the begin with a specified prefix.

```sh
# Match a database name exactly
"database": {"match": "exact", "value": "my_database"}

# Match any databases that begin with "my_"
"database": {"match": "prefix", "value": "my_"}
```

## Manage restrictions and grants
Restrictions and grants are managed through the InfluxDB Enterprise Meta API.

- [Manage restrictions](#manage-restrictions)
- [Manage grants](#manage-grants)

> #### Tools used in examples
>
> The examples below use `curl`, a command line tool for transferring data, to send
> HTTP requests to the Meta API, and `jq`, a command line JSON processor,
> to make the JSON output easier to read.
> Alternatives for each are available, but are not covered in this documentation.

### Manage restrictions
Restrictions restrict either or both read and write permissions on InfluxDB assets.
Restrictions apply to all non-admin users.
[Grants](#manage-grants) override restrictions.

Manage restrictions using the InfluxDB Meta API `acl/restrictions` endpoint.

```sh
curl -L -XGET "http://localhost:8091/influxdb/v2/acl/restrictions"
```

- [Restrict by database](#restrict-by-database)
- [Restrict by measurement in a database](#restrict-by-measurement-in-a-database)
- [Restrict by series in a database](#restrict-by-series-in-a-database)
- [Update a restriction](#update-a-restriction)
- [Remove a restriction](#remove-a-restriction)

> **Note:** For the best performance, set up minimal restrictions.

#### Restrict by database
In most cases, restricting the database is the simplest option, and has minimal impact on performance.
The following example restricts reads and writes on the `my_database` database.

```sh
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "permissions": ["read", "write"]
  }'
```

#### Restrict by measurement in a database
The following example restricts read and write permissions on the `network`
measurement in the `my_database` database.
_This restriction does not apply to other measurements in the `my_database` database._

```sh
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"]
  }'
```

#### Restrict by series in a database
The most fine-grained restriction option is to restrict specific tags in a measurement and database.
The following example restricts read and write permissions on the `datacenter=east` tag in the
`network` measurement in the `my_database` database.
_This restriction does not apply to other tags or tag values in the `network` measurement._

```sh
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
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

#### Update a restriction
_You can not directly modify a restriction.
Delete the existing restriction and create a new one with updated parameters._

#### Remove a restriction
To remove a restriction, obtain the restriction ID using the `GET` request method
with the `acl/restrictions` endpoint.
Use the `DELETE` request method to delete a restriction by ID.

```sh
# Obtain the restriction ID from the list of restrictions
curl -L -XGET "http://localhost:8091/influxdb/v2/acl/restrictions" | jq

# Delete the restriction using the restriction ID
curl -L -XDELETE "http://localhost:8091/influxdb/v2/acl/restrictions/<restriction_id>"
```

### Manage grants
Grants remove restrictions and grant users or roles either or both read and write
permissions on InfluxDB assets.

Manage grants using the InfluxDB Meta API `acl/grants` endpoint.

```sh
curl -L -XGET "http://localhost:8091/influxdb/v2/acl/grants"
```

- [Grant permissions by database](#grant-permissions-by-database)
- [Grant permissions by measurement in a database](#grant-permissions-by-measurement-in-a-database)
- [Grant permissions by series in a database](#grant-permissions-by-series-in-a-database)
- [Update a grant](#update-a-grant)
- [Remove a grant](#remove-a-grant)

#### Grant permissions by database
The following examples grant read and write permissions on the `my_database` database.

> **Note:** This offers no guarantee that the users will write to the correct measurement or use the correct tags.

##### Grant database-level permissions to users
```sh
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
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

#### Grant permissions by measurement in a database
The following examples grant permissions to the `network` measurement in the `my_database` database.
These grants do not apply to other measurements in the `my_database` database nor
guarantee that users will use the correct tags.

##### Grant measurement-level permissions to users
```sh
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
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

#### Grant permissions by series in a database

The following examples grant access only to data with the corresponding `datacenter` tag.
_Neither guarantees the users will use the `network` measurement._

##### Grant series-level permissions to users
```sh
# Grant user1 read/write permissions on data with the 'datacenter=east' tag set.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"],
    "users": [{"name": "user1"}]
  }'

# Grant user2 read/write permissions on data with the 'datacenter=west' tag set.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
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
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role1"}]
  }'

# Grant role2 read/write permissions on data with the 'datacenter=west' tag set.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "west"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role2"}]
  }'
```

#### Grant access to specific series in a measurement
The following examples grant read and write permissions to corresponding `datacenter`
tags in the `network` measurement.
_They each specify the measurement in the request body._

##### Grant series-level permissions in a measurement to users
```sh
# Grant user1 read/write permissions on data with the 'datacenter=west' tag set
# inside the 'network' measurement.
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
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
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "west"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role2"}]
  }'
```

With these grants in place, a user or role can only read or write data from or to
the `network` measurement if the data includes the apropriate `datacenter` tag set.

{{% note %}}
Note that this is only the requirement of the presence of that tag;
`datacenter=east,foo=bar` will also be accepted.
{{% /note %}}

#### Modify a grant
_You can not directly modify a grant.
Delete the existing grant and create a new one with updated parameters._

#### Delete a grant
To delete a grant, obtain the grant ID using the `GET` request method with the
`acl/grants` endpoint.
Use the `DELETE` request method to delete a grant by ID.

```sh
# Obtain the grant ID from the list of grants
curl -L -XGET "http://localhost:8091/influxdb/v2/acl/grants" | jq

# Delete the grant using the grant ID
curl -L -XDELETE "http://localhost:8091/influxdb/v2/acl/grants/<grant_id>"
```

## Roles

If multiple individuals need to write to a database, we don't want them to share login credentials.
In this case, use roles to associate a set of users with a group of permissions.

In this example, we have the same number of users on the east and west teams, and we'll have an `ops` user who needs full access to data from both the east and west datacenters.
Below, we show how to create one user each for east and west, but the process would be the same for any number of users.

To set up users, run:

```sql
CREATE DATABASE datacenters

CREATE USER e001 WITH PASSWORD 'e001'
CREATE USER w001 WITH PASSWORD 'w001'
CREATE USER ops WITH PASSWORD 'ops'
```

#### Create roles

We want one role for full access to any point in `datacenters` with the tag `datacenter=east` and another role for the tag `datacenter=west`.

To initialize the roles, run:

```sh
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

```sh
curl -s -L -XPOST "http://localhost:8091/role" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-permissions",
    "role": {
      "name": "east",
      "permissions": {
        "my_database": ["ReadData", "WriteData"]
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
        "my_database": ["ReadData", "WriteData"]
      }
    }
  }'
```

Next, we need to associate users to the roles.
The `east` role gets the user from the east team, the `west` role gets the user from the west team, and both roles get the `ops` user.

```sh
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
