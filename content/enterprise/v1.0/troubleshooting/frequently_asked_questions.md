---
title: Frequently Asked Questions
menu:
  enterprise_1_0:
    weight: 0
    parent: Troubleshooting
---

## How do I make a web console user an admin web console user?

Web console users can be admin users or non-admin users.
In addition to having access to the web console, admin users are able to invite
users, manage web console users, manage cluster accounts, and edit cluster names.

By default, new web console users are non-admin users.
To make a web console user an admin user, visit the `Users` page located in the
`WEB ADMIN` section in the sidebar and click on the name of the relevant user.
In the `Account Details` section, select the checkbox next to `Admin` and click
`Update User`.

![Web Console Admin User](/img/enterprise/admin_user_1.png)

## Why am I seeing a `503 Service Unavailable` error in my meta node logs?

This is the expected behavior if you haven't joined the meta node to the
cluster.
The `503` errors should stop showing up in the logs once you
[join](/enterprise/v1.0/introduction/meta_node_installation/#join-the-meta-nodes-to-the-cluster)
the meta node to the cluster.

## Why am I seeing a `409` error in some of my data node logs?

When you create a
[Continuous Query (CQ)](/influxdb/v1.0/concepts/glossary/#continuous-query-cq)
on your cluster every data node will ask for the CQ lease.
Only one data node can accept the lease.
That data node will have a `200` in its logs.
All other data nodes will be denied the lease and have a `409` in their logs.
This is the expected behavior.

Log output for a data node that is denied the lease:
```
[meta-http] 2016/09/19 09:08:53 172.31.4.132 - - [19/Sep/2016:09:08:53 +0000] GET /lease?name=continuous_querier&node_id=5 HTTP/1.1 409 105 - InfluxDB Meta Client b00e4943-7e48-11e6-86a6-000000000000 380.542µs
```
Log output for the data node that accepts the lease:
```
[meta-http] 2016/09/19 09:08:54 172.31.12.27 - - [19/Sep/2016:09:08:54 +0000] GET /lease?name=continuous_querier&node_id=0 HTTP/1.1 200 105 - InfluxDB Meta Client b05a3861-7e48-11e6-86a7-000000000000 8.87547ms
```
