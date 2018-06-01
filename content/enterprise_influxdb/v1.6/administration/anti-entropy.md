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
Missing shards are automatically repaired without operator intervention.
This guide covers how AE works and some of the basic situations where it takes effect.

## Concepts

The anti-entropy service examines each node to see whether it has all the shards
the metastore says it should have.
If any shards are missing or out of sync, the service will copy existing shards
from other owners to the node that is missing the shard.
It also ensures replicated shards remain consistent by detecting inconsistencies
and syncing the necessary updates from other shards in the same shard group.

By default, the service checks every 30 seconds, as configured in the [`anti-entropy.check-interval`](/enterprise_influxdb/v1.6/administration/configuration/#check-interval-30s) setting.

The anti-entropy service can only address missing or inconsistent shards when
there is at least one copy of the shard available.
In other words, as long as new and healthy nodes are introduced, a replication
factor of 2 can recover from one missing or inconsistent node;
a replication factor of 3 can recover from two missing or inconsistent nodes, and so on.
A replication factor of 1 cannot be recovered by the anti-entropy service.

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

### Detecting an repairing entropy
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
remaining replicate in the cluster.

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
