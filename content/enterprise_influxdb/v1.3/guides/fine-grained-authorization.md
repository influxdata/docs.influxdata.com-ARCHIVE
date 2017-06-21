---
title: Fine Grained Authorization
alias:
  -/docs/v1.3/administration/fga
menu:
  enterprise_influxdb_1_3:
    weight: 10
    parent: Guides
---

## Controlling access to data with Enterprise's Fine-Grained Authorization

In open source InfluxDB, access control operates only at a database level.
In Enterprise, fine-grained authorization can be used to control access at a measurement or series level.

### Concepts

To use fine-grained authorization (hereafter "FGA"), you must first enable authentication in your configuration file.
Then the admin user needs to create users through the query API and grant those users explicit read and/or write privileges per database.
So far, this is the same as how you would configure authorization on an open source InfluxDB instance.

To continue setting up fine-grained authorization, the admin user must first set _restrictions_ which define a combination of database, measurement, and tags which cannot be accessed without an explicit _grant_.
A _grant_ enables access to series that were previously restricted.

Restrictions limit access to the series that match the database, measurement, and tags specified.
The different access permissions (currently just "read" and "write") can be restricted independently depending on the scenario.
Grants will allow access, according to the listed permissions, to restricted series for the users and roles specified.
Users are the same as the users created in InfluxQL, and roles, an Enterprise feature, are created separately through the Meta HTTP API.

### Modifying grants and restrictions

To configure FGA, you will need access to the meta nodes' HTTP ports (which run on port 8091 by default).
Note that in a typical cluster configuration, the data nodes' HTTP ports (8086 by default) are exposed to clients but the meta nodes' HTTP ports are not.
You may need to work with your network administrator to gain access to the meta nodes' HTTP ports.

### Scenario: partitioning access within a single measurement via users

We'll assume a schema of a database named `datacenters`, one measurement named `network` with a tag of `dc=east` or `dc=west`, and two fields, `bytes_in` and `bytes_out`.
Suppose you want to make sure that the client in the east datacenter can't read or write the west datacenter's metrics, and vice versa.

First, as an administrator, you would create the database and users and standard grants with InfluxQL queries:

```
CREATE DATABASE datacenters

CREATE USER east WITH PASSWORD 'east'
GRANT ALL ON datacenters TO east

CREATE USER west WITH PASSWORD 'west'
GRANT ALL ON datacenters TO west
```

At this point, the east and west users have unrestricted read and write access to the `datacenters` database.
We'll need to decide what restrictions to apply in order to limit their access.

#### Restrictions

##### Restriction option 1: the entire database

Restricting the entire database is a simple option, and in most cases it is the simplest option to reason about.
Moreover, because this is a very general restriction, it will have minimal impact on performance.

Assuming the meta node is running its HTTP service on localhost on the default port, you can run

```
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "permissions": ["read", "write"]
  }'
```

After applying this restriction and before applying any grants, the east and west users will not be authorized to read from or write to the database.

##### Restriction option 2: one measurement within the database

Restricting a single measurement will disallow reads and writes within that measurement, but access to other measurements within the database will be decided by standard permissions.

```
curl -L -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"]
  }'
```

Compared to the previous approach of restricting the entire database, this only restricts access to the measurement `network`.
In this state, the east and west users are free to read from and write to any measurement in the database `datacenters` besides `network`.

##### Restriction option 3: specific series in a database

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

This configuration would allow reads and writes from any measurement in `datacenters`; and when the measurement is `network`, it would only restrict when there is a tag `dc=east` or `dc=west`.
This is probably not what you want, as it would allow writes to `network` without tags or writes to `network` with a tag key of `dc` and a tag value of anything but `east` or `west`.

##### Restriction summary

These options were simple matchers on exact patterns.
Remember that you will achieve the best performance by having few, broad restrictions as opposed to many narrow restrictions.

We only used the matcher `exact` above, but you can also match with `prefix` if you want to restrict based on a common prefix on your database, measurements, or tags.

#### Grants

Now that you've applied your restrictions that apply to all users, you must apply grants to allow selected users to bypass the restrictions.
The structure of a POST body for a grant is identical to the POST body for a restriction, but with the addition of a `users` array.

##### Grant option 1: the entire database

This offers no guarantee that the users will write to the correct measurement or use the correct tags.

```
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "permissions": ["read", "write"],
    "users": [{"name": "east"}, {"name": "west"}]
  }'
```

##### Grant option 2: one measurement within the database

This guarantees that the users will only have access to the `network` measurement but it still does not guarantee that they will use the correct tags.

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

##### Grant option 3: specific tags on a database

This guarantees that the users will only have access to data with the corresponding `dc` tag but it does not guarantee that they will use the `network` measurement.

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

##### Grant option 4: specific series within the database

To guarantee that both users only have access to the `network` measurement and that the east user uses the tag `dc=east` and the west user uses the tag `dc=west`, we need to make two separate grant calls:

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

Now, when the east user writes to the `network` measurement, it must include the tag `dc=east`, and when the west user writes to `network`, it must include the tag `dc=west`.
Note that this is only the requirement of the presence of that tag; `dc=east,foo=bar` will also be accepted.

### Scenario: partitioning access via roles

Suppose that we have many individuals who need to write to our `datacenters` database in the previous example.
We wouldn't want them to all share one set of login credentials.
We can instead use _roles_, which are associate a set of users with a set of permissions.

We'll assume that we now have many users on the east and west teams, and we'll have an `ops` user who needs full access to data from both the east and west datacenters.
We will only create one user each for east and west, but the process would be the same for any number of users.

First we will set up the users.

```
CREATE DATABASE datacenters

CREATE USER e001 WITH PASSWORD 'e001'
CREATE USER w001 WITH PASSWORD 'w001'
CREATE USER ops WITH PASSWORD 'ops'
```

#### Creating the roles

We want one role for full access to any point in `datacenters` with the tag `dc=east` and another role for the tag `dc=west`.

First, we initialize the roles.

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

Next, let's specify that anyone belonging to those roles has general read and write access to the `datacenters` database.

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

#### Restrictions

Please refer to the previous scenario for directions on how to set up restrictions.

#### Grants and roles

Grants for a role function the same as grants for a user.
Instead of using the key `users` to refer to users, use the key `roles` to refer to roles.

##### Grant option 1: the entire database

This offers no guarantee that the users in the roles will write to the correct measurement or use the correct tags.

```
curl -s -L -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "datacenters"},
    "permissions": ["read", "write"],
    "roles": [{"name": "east"}, {"name": "west"}]
  }'
```

##### Grant option 2: one measurement within the database

This guarantees that the users in the roles will only have access to the `network` measurement but it still does not guarantee that they will use the correct tags.

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

##### Grant option 3: specific tags on a database

This guarantees that the users in the roles will only have access to data with the corresponding `dc` tag.
They will have access to any measurement in the `datacenters` database.

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

##### Grant option 4: specific series within the database

To guarantee that both roles only have access to the `network` measurement and that the east user uses the tag `dc=east` and the west user uses the tag `dc=west`, we need to make two separate grant calls:

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

Now, when a user in the east role writes to the `network` measurement, it must include the tag `dc=east`, and when the west user writes to `network`, it must include the tag `dc=west`.
Note that this is only the requirement of the presence of that tag; `dc=east,foo=bar` will also be accepted.

If a user is in both the east and west roles, they must write points with either `dc=east` or `dc=west`.
When they query data, they will be able to read points tagged with `dc=east` or `dc=west`.
