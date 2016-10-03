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

# Known Errors

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

## Why am I seeing `hinted handoff queue not empty` errors in my data node logs?

This error is informational only and does not necessarily indicate a problem in the cluster. It indiacates that the node handling the write request currently has data in its local [hinted handoff](/enterprise/v1.0/concepts/clustering/#hinted-handoff) queue for the destination node. Coordinating nodes will not attempt direct writes to other nodes until the hinted handoff queue for the destination node has fully drained. New data is instead appended to the hinted handoff queue. This helps data arrive in chronological order for consistency of graphs and alerts and also prevents unnecessary failed connection attempts between the data nodes. Until the hinted handoff queue is empty this message will continue to display in the logs. Monitor the size of the hinted handoff queues with `ls -lRh /var/lib/influxdb/hh` to ensure that they are decreasing in size.

Note that for some [write consistency](/enterprise/v1.0/concepts/clustering/#write-consistency) settings, InfluxDB may return a write error (500) for the write attempt, even if the points are successfully queued in hinted handoff. Some write clients may attempt to resend those points, leading to duplicate points being added to the hinted handoff queue and lengthening the time it takes for the queue to drain. If the queues are not draining, consider temporarily downgrading the write consistency setting, or pause retries on the write clients until the hinted handoff queues full drain.

## Why am I seeing `queue is full` errors in my data node logs?

This error indicates that the coordinating node that received the write cannot add the incoming write to the hinted handoff queue for the destination node because it would exceed the maximum size of the queue. This error typically indicates a catastrophic condition for the cluster - one data node may have been offline or unable to accept writes for an extended duration.

The controlling configuration settings are in the `[hinted-handoff]` section of the file. `max-size` is the total size in bytes per hinted handoff queue. When `max-size` is exceeded, all new writes for that node are rejected until the queue drops below `max-size`. `max-age` is the maximum length of time a point will persist in the queue. Once this limit has been reached, points expire from the queue. The age is calculated from the write time of the point, not the timestamp of the point. 
