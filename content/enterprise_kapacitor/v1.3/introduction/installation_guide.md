---
title: Installing Kapacitor Enterprise
menu:
  enterprise_kapacitor_1_3:
    weight: 20
    parent: introduction
---

# Overview

Installing Kapacitor Enterprise is similar to installing the single instance open source Kapacitor.
The main difference being that there are more instances to install and configure.

The basic steps to follow are:

1. Setup the configuration.
2. Start each of the members.
3. Add the members into a single cluster.
4. Start using the cluster.

Kapacitor Enterprise has only a single type of member, meaning every member of a cluster is the same and performs the same functions.

## Terminology

A quick primer on some terms that this document will use.

* Member - A member is an instance of the Kapacitor Enterprise process typically running in a host or in a container.
* Cluster - A set of members that are aware of each other.

## Elasticity

Before we get into the details of installing and running an Kapacitor Enterprise cluster we should first discuss some of the limitations of this first release of clustering.
This release of Kapacitor Enterprise is not elastic, meaning adding and removing members from the cluster dynamically can cause the cluster to get out of sync with itself.
This means that before hand you should decide on the number of members you want to run.
Only once you have a clustered set of members should you begin defining any tasks, alert handlers etc.

It is possible to add/remove members once the cluster is running but care must be taken to do so correctly, more details on this can be found in step 4.

## Step 1: Configuration

Kapacitor Enterprise configuration is the same as open source Kapacitor with a few additions.

### Cluster Configuration

Kapacitor Enterprise uses a gossip protocol to maintain cluster membership and otherwise communicate within the cluster.
There is a new `[cluster]` configuration section with the following options.
These options define the network settings and tunable paramerters for the gossip protocol.
In most cases the defaults will be sufficient.

| Name                 | Type     | Description                                                                                                                                                                                                                           |
| ----                 | ----     | -----------                                                                                                                                                                                                                           |
| bind-address         | string   | Bind-address is a host:port pair to bind to for the cluster gossip communitcation. Both a UDP and TCP address will be bound.                                                                                                          |
| advertise-address    | string   | Advertise-address is the address to advertise to other members of the cluster for this member.   Defaults to bind-address if empty.                                                                                                   |
| gossip-members       | int      | Gossip-members is the number of neighboring members to whom to send gossip messages. A higher count means faster convergence but more network bandwidth. The default value is designed for use within a typical LAN network.          |
| gossip-interval      | duration | Gossip-interval is the time between gossip messages. A shorter interval means faster convergence but more network bandwidth. The default value is designed for use within a typical LAN network.                                      |
| gossip-sync-interval | duration | Gossip-sync-interval is the time between full TCP state sync of the cluster gossip state. A shorter interval means faster convergence but more network bandwidth. The default value is designed for use within a typical LAN network. |

### Alerting Configuration

Kapacitor Enterprise can deduplicate alerts that are generated from duplicate running tasks.
There is a new `[alert]` configuration section with the following options.

| Name               | Type     | Description                                                                                                                                                                                                                                                                                                                                                                     |
| ----               | ----     | -----------                                                                                                                                                                                                                                                                                                                                                                     |
| redundancy         | int      | Redundancy is the number of redundant servers to assign ownership of each alert topic.                                                                                                                                                                                                                                                                                          |
| delay-per-member   | duration | Delay-per-member is the amount of time each member should be given to process an event. If this time elapses without receiving notification of event completion, then the next member in line will assume responsibility of the event. Decreasing the value reduces the long tail latency of alerts at the cost of a high probability of duplicated alerts. The default is 10s. |
| full-sync-interval | duration | Full-sync-interval is the time period in which full state is synced. This places an upper bound on the amount of drift that can occur.                                                                                                                                                                                                                                          |

Increasing redundancy means more work is duplicated within the cluster and decreases the probability of a failure causing the loss of an alert.
Alert will only be dropped if all redundant members handling the alert fail together.
Increasing the delay-per-member helps to reduce the probability of duplicate alerts in the case of a partial failure, but also increases the duration at which an alert could arrive late.

### InfluxDB Configuration

The configuration section for InfluxDB has a new option `subscription-mode` which should be set to `server` when running Kapacitor Enterprise as a cluster.
This allows each server within the cluster to create its own subscriptions to InfluxDB so that each member receives all the data.

### Hostname Configuration

In order for Kapacitor members to be able to communicate with each other they need to be able resolve each other's addresses.
The `hostname` setting for each Kapacitor member is the DNS/IP of the member, all other Kapacitor members need to be able to resolve and access that address.

If your network is such that members have different addresses for public vs private networks there are configuration settings for the advertise address of each of the respecitve services.

## Step 2: Starting members

The following commands setup a two members and joins them together.
This process can be easily extended to more than two members.

Start a Kapacitor member, we will call this member `serverA`.

```sh
serverA$ kapacitord -config /path/to/serverA/kapacitor.conf
```

List the members of the cluster for that member.
The list should only have one entry of itself.

```sh
serverA$ kapacitorctl member list
State: uninitialized
Cluster ID: 876ddfb4-1879-4f40-87e2-4080c04d3096
Local Member ID: f74f3547-efaf-4e6e-8b05-fb12b19f8287
Member ID                               Gossip Address RPC Address    API Address    Roles  Status
f74f3547-efaf-4e6e-8b05-fb12b19f8287    serverA:9090   serverA:9091   serverA:9092   worker alive
```

Notice that there are three addresses associated with the member.
Each address exposes a service.
Below is a table laying out the purpose for each service.

| Service | Public/Private | Default Port | Network Protocol | Description                                                                                           |
| ------- | -------------- | ------------ | ---------------- | ----------                                                                                            |
| Gossip  | Private        | 9090         | TCP and UDP      | Kapacitor uses a gossip protocol to maintain cluster membership and otherwise communicate.            |
| RPC     | Private        | 9091         | TCP              | Kapacitor uses the RPC service for peer to peer communication between members.                      |
| API     | Public         | 9092         | TCP              | Kapacitor exposes an HTTP REST API, all external systems communicate with Kapacitor via this service. |

Services that are marked private need not be exposed to any other systems, but only to other Kapacitor members.
In other words private means, private to the cluster.

### Starting the next member

Start another Kapacitor member, we will call this member `serverB`.

```sh
serverB$ kapacitord -config /path/to/serverB/kapacitor.conf
```

Again get the information for this new Kapacitor member.

```sh
serverB$ kapacitorctl member list
State: uninitialized
Cluster ID: 9acd33e6-ed88-4601-98df-6b73c1c78427
Local Member ID: 13eeefdd-41b5-453f-928e-cb9c55fd2a5d
Member ID                               Gossip Address RPC Address    API Address    Roles  Status
13eeefdd-41b5-453f-928e-cb9c55fd2a5d    serverB:9090   serverB:9091   serverB:9092   worker alive
```

## Step 3: Adding members to a cluster

Now that we have both serverA and serverB running independently we need to add them together to form a single cluster.

On serverA we want to add serverB to the cluster.
To do this we tell serverA about serverB's RPC address.
ServerA will then initiate a connection to serverB over the RPC service and begin the process of joining the cluster.

```sh
serverA$ kapacitorctl member add serverB:9091
```

Check that both members know about each other.

```sh
serverA$ kapacitorctl member list
State: initialized
Cluster ID: 876ddfb4-1879-4f40-87e2-4080c04d3096
Local Member ID: f74f3547-efaf-4e6e-8b05-fb12b19f8287
Member ID                               Gossip Address RPC Address    API Address    Roles  Status
f74f3547-efaf-4e6e-8b05-fb12b19f8287    serverA:9090   serverA:9091   serverA:9092   worker alive
13eeefdd-41b5-453f-928e-cb9c55fd2a5d    serverB:9090   serverB:9091   serverB:9092   worker alive
```

```sh
serverB$ kapacitorctl member list
State: initialized
Cluster ID: 876ddfb4-1879-4f40-87e2-4080c04d3096
Local Member ID: f74f3547-efaf-4e6e-8b05-fb12b19f8287
Member ID                               Gossip Address RPC Address    API Address    Roles  Status
f74f3547-efaf-4e6e-8b05-fb12b19f8287    serverA:9090   serverA:9091   serverA:9092   worker alive
13eeefdd-41b5-453f-928e-cb9c55fd2a5d    serverB:9090   serverB:9091   serverB:9092   worker alive
```

Notice now that the cluster state is `initialized` and that the cluster IDs are the same for both members.

### Beyond two members

You can add more members by calling the add method on any existing member of the cluster.

### Removing members

Instances can also be remove as needed.
When an member is removed from a cluster, the removed member enters the uninitialized state and becomes a cluster of one again.

As an example to remove serverB run this command on serverA or serverB:

```sh
serverA$ kapacitorctl member remove 13eeefdd-41b5-453f-928e-cb9c55fd2a5d
```

Now serverB is in an uninitialized state with a new cluster ID.

```sh
serverB$ kapacitorctl member list
State: uninitialized
Cluster ID: bcaf2098-f79a-4a62-96e4-e2cf83441561
Local Member ID: 13eeefdd-41b5-453f-928e-cb9c55fd2a5d
Member ID                               Gossip Address RPC Address    API Address    Roles  Status
13eeefdd-41b5-453f-928e-cb9c55fd2a5d    serverB:9090   serverB:9091   serverB:9092   worker alive
```

## Step 4: Start using the cluster

Now that you have a cluster of Kapacitor Enterprise members how do you take advantage of its clustered features?
The basic design of clustered Kapacitor is to duplicate work in tasks and have the cluster deduplicate the alerts those tasks generate.
This allows for tasks to be highly available since if one member fails that is running a task, then there is already another member running the task to generate the alert.
This means that to leverage the high availability features you must define tasks to run on multiple members and then define alert handlers for those tasks.

Under normal operation alerts are sent out once, under failure conditions alert may be duplicated. Only under catastrophic failure conditions, more than `redundancy` members fails together, will an alert be dropped.


### Cluster Awareness

This release of Kapacitor Enterprise is only partly cluster aware, meaning that some commands on the cluster will be automatically replicated through out the cluster while other commands need to be explicitly run on each member.

All the alert handler related API calls and actions are cluster aware, this means that defining and alert handlers or queries about the state of topics need only make a request to any single member within the cluster.

All other API calls are not cluster aware, this means that tasks must be explicitly defined on each member you wish to run the task.
It is a recommended to duplicate a task the same number of times as the `redundancy` configuration option of the alert section.
For example, if you set `redundancy` to 2 then each task that generates alerts should be defined on 2 members of the cluster.
In this release it is up to the operator of the cluster to define which 2 members should run the task.

### Eventual Consistency

Members of an Kapacitor Enterprise cluster communicate in an eventual consistent way, meaning that information starts at one of the members and then spreads out to the rest of the members of the cluster.
As a result, it is possible to query two different members at the same time and get different responses, because one of the members has not learned the information yet.
Under normal operation the time for the information to spread to the entire cluster is small, and so the probability of getting different responses is low.

If you find that frequently information is out of date on some of the members, than you can try changing the `cluster` configuration options.
Changing each of these options will make information spread faster throughout the cluster at the cost of more bandwidth.

* Increase the `gossip-members` option.
* Decrease the `gossip-interval` option.
* Decrease the `gossip-sync-interval` option.
