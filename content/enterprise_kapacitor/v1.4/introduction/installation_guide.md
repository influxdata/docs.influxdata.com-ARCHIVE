---
title: Installing Kapacitor Enterprise
menu:
  enterprise_kapacitor_1_4:
    name: Installing
    weight: 20
    parent: Introduction
---

# Overview

Kapacitor Enterprise installations are similar to the single instance open source Kapacitor.
The main difference is that there are more instances to install and configure.

The basic installation steps are:

1. Set up the configuration.
2. Start each of the members.
3. Add the members into a single cluster.
4. Start using the cluster.

Kapacitor Enterprise has only a single type of member, meaning every member of a cluster is the same and performs the same functions.

## Terminology

The following terms are used frequently and need to be understood.

* Member - A member is an instance of the Kapacitor Enterprise process typically running in a host or in a container.
* Cluster - A set of members that are aware of each other.

## Elasticity

Before getting into the details of installing and running an Kapacitor Enterprise cluster, let's discuss some of the limitations of this release of clustering.
This release of Kapacitor Enterprise is not elastic. Adding and removing members from the cluster dynamically can cause the cluster to get out of sync with itself.
To prevent synchronization issues, decide in advance how many members you want to run.

<dt>
Define a clustered set of members before defining any tasks, alert handlers, etc.
</dt>

You can add or remove members once a cluster is running, but this must be done correctly. See step 4 for details.

## Step 1: Configure Kapacitor Enterprise.

Configuring Kapacitor Enterprise is similar to the open source Kapacitor, with a few additional steps.

### Cluster configuration

Kapacitor Enterprise uses a [gossip protocol](https://en.wikipedia.org/wiki/Gossip_protocol) to maintain cluster membership and communicate within the cluster.
In the Enterprise Kapactitor configuration file (`kapacitor.conf`), the additional `[cluster]` section includes options that are specific to clusters.
These options define the network settings and tunable parameters for the gossip protocol.
In most cases the defaults are sufficient.

| Name                 | Type     | Description                                                                                                                                                                                                                           |
| ----                 | ----     | -----------                                                                                                                                                                                                                           |
| `bind-address`         | string   | The `bind-address` setting is a host:port pair to bind to for the cluster gossip communication. Both a UDP and TCP address will be bound.                                                                                                          |
| `advertise-address`    | string   | The `advertise-address` setting is the address to advertise to other members of the cluster for this member.   Defaults to `bind-address` if empty.                                                                                                   |
| `gossip-members`       | int      | The `gossip-members` setting is the number of neighboring members to whom to send gossip messages. In the configuration file, the default setting of `gossip-members = 0` results in a default value designed for use within a typical LAN network to be used (currently `3`). A higher count results in faster convergence but also increases network bandwidth.           |
| `gossip-interval`      | duration | The `gossip-interval` setting is the time between gossip messages. In the configuration file, the default setting of `gossip=interval = 0s` results in a default value designed for use within a typical LAN network to be used (currently `200ms`). A shorter interval means faster convergence but increased network bandwidth.                                       |
| `gossip-sync-interval` | duration | The `gossip-sync-interval` setting is the time between full TCP state sync of the cluster gossip state. In the configuration file, the default setting of `gossip-sync-interval = "0s"` results in a default value designed for use within a typical LAN network to be used (currently `30s`). A shorter interval means faster convergence but more network bandwidth. |

### Alerting configuration

Kapacitor Enterprise can deduplicate alerts that are generated from duplicate running tasks.
The `[alert]` configuration section includes the following options.

| Name               | Type     | Description                                                                                                                                                                                                                                                                                                                                                                     |
| ----               | ----     | -----------                                                                                                                                                                                                                                                                                                                                                                     |
| `redundancy`         | int      | The `redundancy` setting is the number of redundant servers to be assigned ownership of each alert topic. The default value is `0`.                                                                                                                                                                                                                                                                                         |
| `delay-per-member`   | duration | The `delay-per-member` setting indicates the duration, or amount of time, each member should be given to process an event. If the specified duration elapses without receiving notification of event completion, then the next member in line assumes responsibility of the event. The default is `10s`. Decreasing the value reduces the long tail latency of alerts with the cost of a high probability of duplicated alerts. |
| `full-sync-interval` | duration | The `full-sync-interval` setting is the duration, or time period, in which full state is synced. The duration value specifies an upper bound on the amount of drift that can occur. The default value is `5m0s`.                                                                                                                                                                                                                                          |

Increasing `redundancy` means more work is duplicated within the cluster and decreases the likelihood of a failure causing an alert to be lost.
An alert is only dropped if all redundant members handling the alert fail together.
Increasing the `delay-per-member` can reduce the probability of duplicate alerts in the case of a partial failure, but it also increases the duration at which an alert could arrive late.

### InfluxDB configuration

The configuration section for InfluxDB has a new option `subscription-mode` which should be set to `server` when running Kapacitor Enterprise as a cluster.
This allows each server within the cluster to create its own subscriptions to InfluxDB so that each member receives all the data.

### Hostname configuration

In order for Kapacitor Enterprise members to communicate with each other, they need to be able resolve each other's address.
The `hostname` setting for each Kapacitor Enterprise member is the DNS/IP of the member. All other Kapacitor Enterprise members need to be able to resolve and access that address.

If your network has members with different addresses for public and private networks, there are configuration settings for the `advertise-address` of each of the respecitve services.

## Step 2: Start members.

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

## Step 3: Add members to a cluster.

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

## Step 4: Start using the cluster.

Now that you have a cluster of Kapacitor Enterprise members, how do you take advantage of its clustered features?
A clustered Kapacitor is designed to duplicate work in tasks and have the cluster deduplicate the alerts those tasks generate.
This allows for tasks to be highly available since if one member fails that is running a task, then there is already another member running the task to generate the alert.
This means that to leverage the high availability features you must define tasks to run on multiple members and then define alert handlers for those tasks.

Under normal operations alerts are sent out once. Under failure conditions alert may be duplicated. Only under catastrophic failure conditions, more than `redundancy` members fails together, will an alert be dropped.


### Cluster awareness

This release of Kapacitor Enterprise is only partly cluster-aware, meaning that some commands on the cluster will be automatically replicated throughout the cluster while other commands need to be explicitly run on each member:

- Alert handler-related API calls and actions are cluster-aware. Defining and alert handlers or queries about the state of topics only require a request to any single member within the cluster.
- Other API calls are not cluster-aware. Tasks must be explicitly defined on each member that you want to run a task.

> ***Recommendation:*** Duplicate a task the same number of times as the `redundancy` configuration option of the alert section.
For example, if you set `redundancy` to 2, then each task that generates alerts should be defined on 2 members of the cluster.
>
>In this release, the cluster operator must define which 2 members should run the task.

### Eventual consistency

Members of an Kapacitor Enterprise cluster communicate in an eventual consistent way, meaning that information starts at one of the members and then spreads out to the rest of the members of the cluster.
As a result, it is possible to query two different members at the same time and get different responses, because one of the members has not learned the information yet.
Under normal operation the time for the information to spread to the entire cluster is small and thus the probability of getting different responses is low.

If you find that information is fequently out of date on some of the members, than you can try modifying the `cluster` configuration options.
The following chnages to the options will result in information spreading faster throughout the cluster at the expense of additional bandwidth:

* Increase the `gossip-members` option.
* Decrease the `gossip-interval` option.
* Decrease the `gossip-sync-interval` option.
