---
title: Authentication and Authorization
draft: true

menu:
  enterprise_kapacitor_1_4:
    weight: 7
    parent: Administration
---

# TBD

## Overview of Authentication and Authorization in the TICK stack

![TICKArch01.png](/img/enterprise/kapacitor/TICKArch01.png)

N.B. This is likely to be superseded by JWT

Kapacitor authorization and authentication involves three elements of the
enterprise TICK stack: Influx Meta nodes, Enterprise Kapacitor and to aid in
the creation of users and roles Chronograf and its InfluxDB Admin console.  

Influx-Meta provides the API for the user and permission store.  This API makes
available standard operations such as Creating, Retrieving, Updating and Deleting
users and roles.  When retrieving users for other TICK components, it becomes
the TICK authentication service, returning a JSON document describing the user,
if the user exists, to the requesting component.  To save time and calls,
components, such as Kapacitor, can cache user documents in their local data
stores.  

The Influx-Meta schema includes a limited set of predefined permissions.  Among
these are `KapacitorAPI` and `KapacitorConfigAPI`.  These permissions can be
assigned directly to the user or to a role, which the user can then be assigned
in turn.

With authentication enabled for the Kapacitor HTTP service, when a Kapacitor
user seeks to use the Kapacitor API directly or to use the command line client,
credentials need to be supplied as part of the URL.  When processing the request,
Kapacitor will strip out the credentials and send them to the Influx-Meta API.
The Influx-Meta server will then return the user details JSON document, which the
Kapacitor server will in turn inspect for the correct privileges (permissions).
If the document shows the user has the correct permissions, Kapacitor completes
the requested transaction.  If the user does not have the proper privileges, the
transaction is aborted and Kapacitor returns 403 and a message like the following:

```
{"error":"user <USER> does not have \"read\" privilege for API endpoint \"/kapacitor/v1/tasks\""}
```

Managing users, roles and permissions is easiest using the Chronograf IndfluxDB
Admin console.  However authentication and authorization entities can also be
managed directly over the Influx-Meta API.

The rest of this document introduces these two approaches.

## User and Permission Management

### Managing users with Chronograf

### Managing users over the Influxd-meta API

```
curl -v -d '{"action":"create","user":{"name":"tux","password":"changeit"}}' http://admin:changeit@e172.17.0.2:8091/user
curl -v -d '{"action":"add-permissions","user":{"name":"tux","permissions":{"":["KapacitorAPI","KapacitorConfigAPI"]}}}' http://admin:changeit@172.17.0.2:8091/user
curl -v -d '{"action":"create","role":{"name":"penguin"}}' http://admin:changeit@172.17.0.2:8091/role
curl -v -d '{"action":"add-permissions","role":{"name":"penguin","permissions":{"":["KapacitorAPI","KapacitorConfigAPI"]}}}' http://admin:changeit@172.17.0.2:8091/role


{"action":"change-password","user":{"name":"straka","password":"noname"}}

{"action":"delete","user":{"name":"straka"}}

{"action":"delete","role":{"name":"delete-me-role"}}

curl -v -d '{"action":"add-users","role":{"name":"test-role","users":["sova"]}}'  http://admin:changeit@ec2-13-57-192-165.us-west-1.compute.amazonaws.com:8091/role -H "Content-Type: application/json"
curl -v -d '{"action":"remove-users","role":{"name":"test-role","users":["tucnak"]}}' http://admin:changeit@ip-172-31-16-140.us-west-1.compute.internal:8091/role
```
