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
