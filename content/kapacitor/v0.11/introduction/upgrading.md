---
title: Upgrading to Kapacitor v0.11

menu:
  kapacitor_011:
    weight: 30
    parent: introduction
---


There are two breaking changes from v0.10 that may require some work
to upgrade from a v0.10 instance.  These changes are:

* [Support for multiple InfluxDB clusters](#multiple-influxdb-clusters)
* [Changes to InfluxQL functions](#new-influxql-syntax)
* [Changes to Email, Slack, HipChat global behavior](#email-slack-hipchat-global-statechangesonly)

### Multiple InfluxDB Clusters

Now that Kapacitor supports connecting to multiple InfluxDB clusters,
the configuration has changed slightly. To upgrade your configuration
to work with v0.11, you will need to update the `[influxdb]` section
of your configuration from:

```
[influxdb]
  enabled = true
  ...
```

To:

```
[[influxdb]]
  enabled = true
  default = true
  name = "localhost"
  ...
```

With the new configuration, you can now alert on data from multiple
clusters.  By giving each cluster a name in your configuration, you
can now specify which cluster to use when performing a batch query or
writing results to InfluxDB by using the `.cluster` method.  

Please see [BatchNode.Cluster](/kapacitor/v0.11/nodes/batch_node#cluster) and
[InfluxDBOut.Cluster](/kapacitor/v0.11/nodes/influx_d_b_out_node#cluster)
for more information.


### New InfluxQL Syntax

The `.mapReduce` method has been deprecated, and replaced by a simpler
syntax.  As an example, using the current syntax:

```javascript
stream.from()...
    .window()...
    .mapReduce(influxql.count('value'))
```

Has been updated to:

```javascript
stream.from()...
    .window()...
    .count('value')
```

This new syntax no longer exposes the map/reduce concept directly to
the user, which makes the function calls simpler and improves overall
readability.

> **Note: The old syntax will continue to work for all v0.11 versions of
Kapacitor but will be removed starting with v0.12.**

### Email, Slack, HipChat Global/StateChangesOnly

In previous releases, setting `smtp`, `slack`, or `hipchat` globally
in the configuration would also set `stateChangesOnly` globally.  This
coupling caused significant confusion, as the behavior of alerts and
TICKscripts would change as a result of enabling/disabling a handler.
With v0.11, there is the `state-changes-only` setting, which
explicitly enables/disables the `stateChangesOnly` attribute for
globally configured alerts. For example:

```
[slack]
    enabled = true
    ...
    global = true
    state-changes-only = false
```

With this change you can now control whether you want to receive
alerts for all events or just state changes, regardless of a globally
configured alert handler.

> **Note: To preserve the legacy behavior, add a `state-changes-only =
true` option to any of the handlers that have been configured
globally.**
