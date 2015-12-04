---
title: Clustering
aliases:
  - /docs/v0.9/advanced_topics/clustering.html
---

_Note: Clustering is in alpha state right now and all clusters __must__ contain three and only three nodes._

In 0.9.1 and 0.9.2 clusters must be fully replicated, meaning all data is copied to all nodes. Retention policies must have replication set to 3 for a three node cluster.

The full replication requirement should be lifted in 0.9.3.

<!--
## Design

InfluxDB is designed to scale horizontally. This means that more machines can easily added to a cluster. This will increase data ingestion performance and reduce query response time.

There are two ways you can scale a cluster. Increasing hardware, such as memory and CPU (commonly referred to as scaling vertically), or by adding more machines or data centers (commonly referred to as scaling horizontally). Scaling horizontally can also add additional replication. Data replication provides high-availability, allowing a cluster to remain fully functional even when some nodes fail.

Each running instance of InfluxDB in a cluster 
-->

## Configuration

Configuring a cluster with three host machines A, B, and C:

1. Install InfluxDB on all three machines.
2. Generate a config file on each machine by running `influxd config > influxdb.conf`.
3. Update the `[meta]` section of the configuration file on all three hosts, replacing `localhost` with the hosts actual network IP.
4. Update the bind-address to another port if 8088 is not acceptable.
5. On all three machines add `peers = ["IP_address_A:bind_address_port_A", "IP_address_B:bind_address_port_B", "IP_address_C:bind_address_port_C"]` to the `[meta]` section of the config file. For example,
    
    ```
    peers = ["10.202.47.11:8088", "10.202.47.12:8088", "10.202.47.13:8088"]
    ```
6. On all three machines, add `replication = 3` in the `[retention]` section of the config file.
7. Launch `influxd` on hosts A, B, and C in any order.
