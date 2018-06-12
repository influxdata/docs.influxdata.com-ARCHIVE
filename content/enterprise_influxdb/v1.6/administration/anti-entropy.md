---
title: Anti-entropy
aliases:
  - /enterprise_influxdb/v1.6/guides/anti-entropy/
menu:
  enterprise_influxdb_1_6:
    weight: 40
    parent: Administration
---

## Introduction

Shard entropy refers to inconsistency among shards in a shard group.
This can be due to the "eventually consistent" nature of data stored in InfluxDB
Enterprise clusters or due to missing or unreachable shards.
The anti-entropy (AE) service ensures that each data node has all the shards it
needs according to the metastore and that all shards in a shard group are consistent.
Missing shards are automatically repaired without operator intervention while
out-of-sync shards can be manually queued for repair.
This guide covers how AE works and some of the basic situations where it takes effect.

## Concepts

The anti-entropy service is part of the `influxd` process running on each data node
that ensures the node has all the shards the metastore says it should have and
that those shards are in sync with others in the same shard group.
If any shards are missing, the AE service will copy existing shards from other
shard owners.
If data inconsistencies are detected among shards in a shard group, you can
[envoke the AE process](#command-line-tools-for-managing-entropy) and queue the
out-of-sync shards for repair.
In the repair process, AE will sync the necessary updates from other shards
in the same shard group.

By default, the service checks every 30 seconds, as configured in the [`anti-entropy.check-interval`](/enterprise_influxdb/v1.6/administration/configuration/#check-interval-30s) setting.

The anti-entropy service can only address missing or inconsistent shards when
there is at least one copy of the shard available.
In other words, as long as new and healthy nodes are introduced, a replication
factor of 2 can recover from one missing or inconsistent node;
a replication factor of 3 can recover from two missing or inconsistent nodes, and so on.
A replication factor of 1 cannot be recovered by the anti-entropy service.

## Symptoms of entropy
The AE process automatically detects and fixes missing shards, but shard inconsistencies
must be [manually detected and queued for repair](#detecting-and-repairing-entropy).
There are symptoms of entropy that, if seen, would indicate an entropy repair is necessary.

### Different results for the same query
When running queries against an InfluxDB Enterprise cluster, each query may be routed to a different data node.
If entropy affects data within the queried range, the same query will return different
results depending on which node it is run against.

_**Query attempt 1**_
```
SELECT mean("usage_idle") WHERE time > '2018-06-06T18:00:00Z' AND time < '2018-06-06T18:15:00Z' GROUP BY time(3m) FILL(0)

name: cpu
time                  mean
----                  ----
1528308000000000000   99.11867392974537
1528308180000000000   99.15410822137049
1528308360000000000   99.14927494363032
1528308540000000000   99.1980535465783
1528308720000000000   99.18584290492262
```

_**Query attempt 2**_
```
SELECT mean("usage_idle") WHERE time > '2018-06-06T18:00:00Z' AND time < '2018-06-06T18:15:00Z' GROUP BY time(3m) FILL(0)

name: cpu
time                  mean
----                  ----
1528308000000000000   99.11867392974537
1528308180000000000   0
1528308360000000000   0
1528308540000000000   0
1528308720000000000   99.18584290492262
```

This indicates that data is missing in the queried time range and entropy is present.

### Flapping dashboards
A "flapping" dashboard means data visualizations changing when data is refreshed
and pulled from a node with entropy (inconsistent data).
It is the visual manifestation of getting [different results from the same query](#different-results-for-the-same-query).

<img src="/img/kapacitor/flapping-dashboard.gif" alt="Flapping dashboard" style="width:100%; max-width:800px">

## Technical details

### Repair order
Repairs between shard owners happen in a deterministic order.
This doesn't mean repairs always start on node 1 and then follow a specific node order.
Repairs are viewed at the shard level.
Each shard has a list of owners and the repairs for a particular shard will happen
in a deterministic order among its owners.

When the AE service on any data node receives a repair request for a shard, it determines which
owner node is the first in the deterministic order and forwards the request to that node.
The request is now queued on the first owner.

The first owner's repair processor pulls it from the queue, detects the differences
between the local copy of the shard with the copy of the same shard on the next
owner in the deterministic order, then generates a patch from that difference.
The first owner then makes an RPC call to the next owner instructing it to apply
the patch to its copy of the shard.

Once the next owner has successfully applied the patch, it adds that shard to its AE repair queue.
A list of "visited" nodes follows the repair through the list of owners.
Each owner will check the list to detect when the repair has cycled through all owners,
at which point the repair is finished.

### Hot shards
The AE service does its best to avoid hot shards (shards that are currently receiving writes)
because they change quickly.
While write replication between shard owner nodes (with a
[replication factor](/influxdb/v1.6/concepts/glossary/#replication-factor)
greater than 1) typically happens in milliseconds, this slight difference is
still enough to cause the appearance of entropy where there is none.
AE is designed and intended to repair cold shards.

This can sometimes have some unexpected effects. For example:

* A shard goes cold.
* AE detects entropy.
* Entropy reported by the AE `/status` API or with the `influxd-ctl entropy show` command.
* Shard takes a write, gets compacted, or something else causes it to go hot.
  _These actions are out of AE's control._
* A repair is requested, but ignored because the shard is now hot.

In the scenario above, you will have to periodically request a repair of the shard
until it either shows as being in the queue, being repaired, or no longer in the list of shards with entropy.

## Configuration

Anti-entropy configuration options are available in [`[anti-entropy]`](/enterprise_influxdb/v1.6/administration/configuration/#anti-entropy) section of your `influxdb.conf`.

## Command line tools for managing entropy
The `influxd-ctl entropy` command enables you to manage entropy among shards in a cluster.
It includes the following subcommands:

#### `show`
Lists shards that are in an inconsistent state and in need of repair as well as
shards currently in the repair queue.

```bash
influxd-ctl entropy show
```

#### `repair`
Queues a shard for repair.
It requires a Shard ID which is provided in the [`show`](#show) output.

```bash
influxd-ctl entropy repair <shardID>
```

Repairing entropy in a shard is an asynchronous operation.
This command will return quickly as it only adds a shard to the repair queue.
Queuing shards for repair is idempotent.
There is no harm in making multiple requests to repair the same shard even if
it is already queued, currently being repaired, or not in need of repair.

#### `kill-repair`
Removes a shard from the repair queue.
It requires a Shard ID which is provided in the [`show`](#show) output.

```bash
influxd-ctl entropy kill-repair <shardID>
```

This only applies to shards in the repair queue.
It does not cancel repairs on nodes that are in the process of being repaired.
Once a repair has started, requests to cancel it are ignored.

> Stopping a entropy repair for a **missing** shard operation is not currently supported.
> It may be possible to stop repairs for missing shards with the
> [`influxd-ctl kill-copy-shard`](/enterprise_influxdb/v1.6/features/cluster-commands/#kill-copy-shard) command.


## Scenarios

This section covers some of the common use cases for the anti-entropy service.

### Detecting and repairing entropy
Periodically, you may want to see if shards in your cluster have entropy or are
inconsistent with other shards in the shard group.
Use the `influxd-ctl entropy show` command to list all shards with detected entropy:

```
influxd-ctl entropy show

Entropy
==========
ID     Database  Retention Policy  Start                          End                            Expires                        Status
21179  statsdb   1hour             2017-10-09 00:00:00 +0000 UTC  2017-10-16 00:00:00 +0000 UTC  2018-10-22 00:00:00 +0000 UTC  diff
25165  statsdb   1hour             2017-11-20 00:00:00 +0000 UTC  2017-11-27 00:00:00 +0000 UTC  2018-12-03 00:00:00 +0000 UTC  diff
```

Then use the `influxd-ctl entropy repair` command to add the shards with entropy
to the repair queue:

```
influxd-ctl entropy repair 21179

Repair Shard 21179 queued

influxd-ctl entropy repair 25165

Repair Shard 25165 queued
```

Check on the status of the repair queue with the `influxd-ctl entropy show` command:

```
influxd-ctl entropy show

Entropy
==========
ID     Database  Retention Policy  Start                          End                            Expires                        Status
21179  statsdb   1hour             2017-10-09 00:00:00 +0000 UTC  2017-10-16 00:00:00 +0000 UTC  2018-10-22 00:00:00 +0000 UTC  diff
25165  statsdb   1hour             2017-11-20 00:00:00 +0000 UTC  2017-11-27 00:00:00 +0000 UTC  2018-12-03 00:00:00 +0000 UTC  diff

Queued Shards: [21179 25165]
```

### Replacing an unresponsive data node

If a data node suddenly disappears due to a catastrophic hardware failure or for any other reason, as soon as a new data node is online, the anti-entropy service will copy the correct shards to the new replacement node. The time it takes for the copying to complete is determined by the number of shards to be copied and how much data is stored in each.

_View the [Replacing Data Nodes](/enterprise_influxdb/v1.6/guides/replacing-nodes/#replacing-data-nodes) documentation for instructions on replacing data nodes in your InfluxDB Enterprise cluster._

### Replacing a machine that is running a data node

Perhaps you are replacing a machine that is being decommissioned, upgrading hardware, or something else entirely.
The anti-entropy service will automatically copy shards to the new machines.

Once you have successfully run the `influxd-ctl update-data` command, you are free
to shut down the retired node without causing any interruption to the cluster.
The anti-entropy process will continue copying the appropriate shards from the
remaining replicas in the cluster.

### Fixing entropy in active shards
In rare cases, the currently active shard, or the shard to which new data is
currently being written, may find itself with inconsistent data.
Because the AE process can't write to hot shards, you must stop writes to the new
shard using the [`influxd-ctl truncate-shards` command](/enterprise_influxdb/v1.6/administration/cluster-commands/#truncate-shards),
then add the inconsistent shard to the entropy repair queue:

```bash
# Truncate hot shards
influxd-ctl truncate-shards

# Show shards with entropy
influxd-ctl entropy show

Entropy
==========
ID     Database  Retention Policy  Start                          End                            Expires                        Status
21179  statsdb   1hour             2018-06-06 12:00:00 +0000 UTC  2018-06-06 23:44:12 +0000 UTC  2018-12-06 00:00:00 +0000 UTC  diff

# Add the inconsistent shard to the repair queue
influxd-ctl entropy repair 21179
```

## Troubleshooting

### Queued repairs are not being processed
The primary reason a repair in the repair queue isn't being processed is because
it went "hot" after the repair was queued.
AE can only repair cold shards, or shards that are not currently being written to.
If the shard is hot, AE will wait until it goes cold again before performing the repair.

If the shard is "old" and writes to it are part of a backfill process, you simply
have to wait the until the backfill process is finished. If the shard is the active
shard, you can `truncate-shards` to stop writes to active shards. This process is
outlined [above](#fixing-entropy-in-active-shards).

## Changes to the AE Service in v1.6

- New `entropy` command in the `influxd-ctl` cluster management utility that
  includes `show`, `repair`, and `kill-repair` subcommands.
- New `/repair` API _(Documentation Coming)_.
- New `/cancel-repair` API _(Documentation Coming)_.
- Updated `/status` API that now includes a list of shards waiting in the repair
  queue and a list of shards currently being repaired.
- New [repair order](#repair-order).
- Repairs are now "push" instead of "pull".
  In v1.5, repairs of missing shards were done with a "pull" of the shard from another node.
  The AE service would notice a shard missing and choose another owner to copy from.
  In 1.6, it happens in the deterministic order described [above](#repair-order).
