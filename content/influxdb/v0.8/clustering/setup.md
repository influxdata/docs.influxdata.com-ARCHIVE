---
title: Cluster Setup
---

The current clustering implementation is experimental. We suggest using Influx in single server mode for the time being. However, if you're feeling adventurous, here's how you set up a cluster.

Ensure that the Raft and Protobuf ports are accessible between servers in the cluster. On the configs of every server, set the `hostname` setting. This should be a resolvable hostname or IP address.

Turn on the first server in the cluster. Note that you should not have anything for the `seed-servers` setting.

On the other servers. Shut down InfluxDB if it is running. Delete the raft directory (you shouldn't have created anything on this server so this shouldn't matter). Update the `seed-servers` setting to point to the server you already turned on (or any server in an existing cluster).

Start InfluxDB and go to the cluster tab to see if it can see the other servers.

Note that the `seed-servers` setting is only looked at the very first time you start InfluxDB. Once you've started it up and it has either created its own cluster or joined an existing one, seed-servers is ignored. If you want to reset things, delete the raft directory.