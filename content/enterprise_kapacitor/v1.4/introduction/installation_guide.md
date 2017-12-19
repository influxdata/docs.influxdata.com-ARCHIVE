---
title: Installing Enterprise Kapacitor
menu:
  enterprise_kapacitor_1_4:
    weight: 20
    parent: introduction
---

# Overview

Enterprise Kapacitor installations are similar the single instance open source Kapacitor.
The main difference is that there are more instances to install and configure.

The basic installation steps are:

1. Set up the configuration.
2. Start each of the members.
3. Add the members into a single cluster.
4. Start using the cluster.

Enterprise Kapacitor has only a single type of member, meaning every member of a cluster is the same and performs the same functions.

## Terminology

The following terms are used frequently and need to be understood.

* Member - A member is an instance of the Enterprise Kapacitor process typically running in a host or in a container.
* Cluster - A set of members that are aware of each other.

## Elasticity

Before getting into the details of installing and running an Enterprise Kapacitor cluster, let's discuss some of the limitations of this release of clustering.
This release of Enterprise Kapacitor is not elastic. Adding and removing members from the cluster dynamically can cause the cluster to get out of sync with itself.
To prevent synchronization issues, decide in advance how many members you want to run.

<dt>
Define a clustered set of members before defining any tasks, alert handlers, etc.
</dt>

You can add or remove members once a cluster is running, but this must be done correctly. See step 4 for details.

## Step 1: Configuration

Configuring Enterprise Kapacitor is similar to the open source Kapacitor, with a few additional steps.

### Cluster Configuration

Enterprise Kapacitor uses a [gossip protocol](https://en.wikipedia.org/wiki/Gossip_protocol) to maintain cluster membership and communicate within the cluster.
In the Enterprise Kapactitor configuration file (`kapacitor.conf`), the additional `[cluster]` section includes options that are specific to clusters.
These options define the network settings and tunable parameters for the gossip protocol.
In most cases the defaults are sufficient.

| Name                 | Type     | Description                                                                                                                                                                                                                           |
| ----                 | ----     | -----------                                                                                                                                                                                                                           |
| bind-address         | string   | Bind-address is a host:port pair to bind to for the cluster gossip communitcation. Both a UDP and TCP address will be bound.                                                                                                          |
| advertise-address    | string   | Advertise-address is the address to advertise to other members of the cluster for this member.   Defaults to bind-address if empty.                                                                                                   |
| gossip-members       | int      | Gossip-members is the number of neighboring members to whom to send gossip messages. A higher count means faster convergence but more network bandwidth. The default value is designed for use within a typical LAN network.          |
| gossip-interval      | duration | Gossip-interval is the time between gossip messages. A shorter interval means faster convergence but more network bandwidth. The default value is designed for use within a typical LAN network.                                      |
| gossip-sync-interval | duration | Gossip-sync-interval is the time between full TCP state sync of the cluster gossip state. A shorter interval means faster convergence but more network bandwidth. The default value is designed for use within a typical LAN network. |

### Alerting Configuration

Enterprise Kapacitor can deduplicate alerts that are generated from duplicate running tasks.
The `[alert]` configuration section includes the following options.

| Name               | Type     | Description                                                                                                                                                                                                                                                                                                                                                                     |
| ----               | ----     | -----------                                                                                                                                                                                                                                                                                                                                                                     |
| redundancy         | int      | Redundancy is the number of redundant servers to assign ownership of each alert topic.                                                                                                                                                                                                                                                                                          |
| delay-per-member   | duration | Delay-per-member is the amount of time each member should be given to process an event. If this time elapses without receiving notification of event completion, then the next member in line will assume responsibility of the event. Decreasing the value reduces the long tail latency of alerts at the cost of a high probability of duplicated alerts. The default is 10s. |
| full-sync-interval | duration | Full-sync-interval is the time period in which full state is synced. This places an upper bound on the amount of drift that can occur.                                                                                                                                                                                                                                          |

Increasing redundancy means more work is duplicated within the cluster and decreases the probability of a failure causing the loss of an alert.
An alert is only dropped if all redundant members handling the alert fail together.
Increasing the `delay-per-member` helps to reduce the probability of duplicate alerts in the case of a partial failure, but also increases the duration at which an alert could arrive late.

### InfluxDB Configuration

The configuration section for InfluxDB has a new option `subscription-mode` which should be set to `server` when running Enterprise Kapacitor as a cluster.
This allows each server within the cluster to create its own subscriptions to InfluxDB so that each member receives all the data.

### Hostname Configuration

In order for Enterprise Kapacitor members to communicate with each other, they need to be able resolve each other's address.
The `hostname` setting for each Enterprise Kapacitor member is the DNS/IP of the member. All other Enterprise Kapacitor members need to be able to resolve and access that address.

If your network has members with different addresses for public and private networks, there are configuration settings for the `advertise-address` of each of the respecitve services.

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

Services marked `private` do not need to be exposed to any other systems, but only to other Kapacitor members.
In other words, private means private to the cluster.

### Starting the next member

Start another Kapacitor member, which we will call `serverB`.

```sh
serverB$ kapacitord -config /path/to/serverB/kapacitor.conf
```

Again, get the information for this new Kapacitor member.

```sh
serverB$ kapacitorctl member list
State: uninitialized
Cluster ID: 9acd33e6-ed88-4601-98df-6b73c1c78427
Local Member ID: 13eeefdd-41b5-453f-928e-cb9c55fd2a5d
Member ID                               Gossip Address RPC Address    API Address    Roles  Status
13eeefdd-41b5-453f-928e-cb9c55fd2a5d    serverB:9090   serverB:9091   serverB:9092   worker alive
```

## Step 3: Adding members to a cluster

Now that we have both serverA and serverB running independently, we need to add them together to form a single cluster.

On serverA, we want to add serverB to the cluster.
To do this, we tell serverA about serverB's RPC address.
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

Notice that the cluster state is `initialized` and that the cluster IDs are the same for both members.

### Beyond two members

You can add more members by calling the `add` method on any existing member of the cluster.

### Removing members

Instances can also be removed as needed.
When an member is removed from a cluster, the removed member enters the uninitialized state and becomes a cluster of one again.

To remove serverB in this example, run the following `kapacitorctl member remove` command on either serverA or serverB:

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

Now that you have a cluster of Enterprise Kapacitor members, how do you take advantage of its clustered features?
A clustered Kapacitor is designed to duplicate work in tasks and have the cluster deduplicate the alerts those tasks generate.
This allows for tasks to be highly available since if one member fails that is running a task, then there is already another member running the task to generate the alert.
This means that to leverage the high availability features you must define tasks to run on multiple members and then define alert handlers for those tasks.

Under normal operations alerts are sent out once. Under failure conditions alert may be duplicated. Only under catastrophic failure conditions, more than `redundancy` members fails together, will an alert be dropped.


### Cluster Awareness

This release of Enterprise Kapacitor is only partly cluster-aware, meaning that some commands on the cluster will be automatically replicated throughout the cluster while other commands need to be explicitly run on each member:

- Alert handler-related API calls and actions are cluster aware. Defining and alert handlers or queries about the state of topics only require a request to any single member within the cluster.
- Other API calls are not cluster aware. Tasks must be explicitly defined on each member that you want to run a task.

> ***Recommendation:*** Duplicate a task the same number of times as the `redundancy` configuration option of the alert section.
For example, if you set `redundancy` to 2, then each task that generates alerts should be defined on 2 members of the cluster.
>
>In this release, the cluster operator must define which 2 members should run the task.

### Eventual Consistency

Members of an Enterprise Kapacitor cluster communicate in an eventual consistent way, meaning that information starts at one of the members and then spreads out to the rest of the members of the cluster.
As a result, it is possible to query two different members at the same time and get different responses, because one of the members has not learned the information yet.
Under normal operation the time for the information to spread to the entire cluster is small and thus the probability of getting different responses is low.

If you find that information is fequently out of date on some of the members, than you can try modifying the `cluster` configuration options.
The following chnages to the options will result in information spreading faster throughout the cluster at the expense of additional bandwidth:

* Increase the `gossip-members` option.
* Decrease the `gossip-interval` option.
* Decrease the `gossip-sync-interval` option.
