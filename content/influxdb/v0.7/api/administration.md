---
title: Administration & Security
---

The following section details the endpoints in the HTTP API for administering the cluster and managing database security.

## Creating and Dropping Databases

There are two endpoints for creating or dropping databases. The requesting user must be a cluster administrator.

```bash
# create a database
curl -X POST 'http://localhost:8086/db?u=root&p=root' \
  -d '{"name": "site_development"}'

# drop a database
curl -X DELETE 'http://localhost:8086/db/site_development?u=root&p=root'
```

## Security

InfluxDB has three different kinds of users:

### cluster admin

A cluster admin can add and drop databases. Add and remove database
users and database admins to any database and change their read and
write access. A cluster admin can't query a database though. Below are
the endpoints specific to cluster admins:

```bash
# get list of cluster admins curl
curl 'http://localhost:8086/cluster_admins?u=root&p=root'

# add cluster admin
curl -X POST 'http://localhost:8086/cluster_admins?u=root&p=root' \
  -d '{"name": "paul", "password": "i write teh docz"}'

# update cluster admin password
curl -X POST 'http://localhost:8086/cluster_admins/paul?u=root&p=root' \
  -d '{"password": "new pass"}'

# delete cluster admin
curl -X DELETE 'http://localhost:8086/cluster_admins/paul?u=root&p=root'
```

### database admin

A database admin can add and remove databases admins and database
users and change their read and write permissions. It can't add
or remove users from a different database.

### database user

A database user can read and write data to the current database.
The user can't add or remove users or admins or read/write data
from/to time series that they don't have permissions for.

Below are examples of adding/removing databases users and database
admins:

```bash
# Database users, with a database name of site_dev

# add database user
curl -X POST 'http://localhost:8086/db/site_dev/users?u=root&p=root' \
  -d '{"name": "paul", "password": "i write teh docz"}'

# delete database user
curl -X DELETE 'http://localhost:8086/db/site_dev/users/paul?u=root&p=root'

# update user's password
curl -X POST 'http://localhost:8086/db/site_dev/users/paul?u=root&p=root' \
  -d '{"password": "new pass"}'

# get list of database users
curl 'http://localhost:8086/db/site_dev/users?u=root&p=root'

# add database admin privilege
curl -X POST 'http://localhost:8086/db/site_dev/users/paul?u=root&p=root' \
  -d '{"admin": true}'

# remove database admin privilege
curl -X POST 'http://localhost:8086/db/site_dev/users/paul?u=root&p=root' \
  -d '{"admin": false}'

```

### Limiting User Access

Database users have two additional arguments when creating or updating
their objects: `readFrom` and `writeTo`. Here's what a
default database user looks like when those arguments aren't specified
on create.

```json
{
  "name": "paul",
  "readFrom": ".*",
  "writeTo": ".*"
}
```

This example user has the ability to read and write from any time
series. If you want to restrict the user to only being able to write
data, update the user by `POST`ing to `db/site_dev/users/paul`.

```json
{
  "readFrom": "^$",
  "writeTo": ".*"
}
```

You have to specify both `readFrom` and `writeTo` when you update the
permissions of a user. Both are a regex that determine which time
series the user has permission to read from or write to.

## Forcefully removing a server from the cluster

You can forcefully remove a server from a running cluster with an API call. This will take it out of Raft and tell the rest of the servers that it is gone. No data will be copied from the server if it happens to still be up. This also doesn't require Raft consensus. **Use with caution!**

```
curl -X DELETE \
  'http://localhost:8086/cluster/servers/23?u=root&p=root'
```

Removes server with ID 23 from the cluster.

## Pretty-Printed Output

The Administration API supports pretty-printed JSON responses. To enable pretty-printed output, append `pretty=true` to the URL.
