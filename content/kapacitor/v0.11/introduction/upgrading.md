---
title: Upgrading to Kapacitor v0.11

menu:
  kapacitor_011:
    weight: 30
    parent: introduction
---


There are two breaking changes from v0.10 that may require some work to upgrade from a v0.10 instance.
These changes were:

* Support for multiple InfluxDB clusters
* Changes to InfluxQL functions
* Changes to Email, Slack, HipChat global behavior

### Multiple InfluxDB Clusters

Now that Kapacitor support connecting to multiple InfluxDB clusters the configuration has changed slightly to allow configuring multiple clusters.
To upgrade your configuration to work with v0.11 change a previous configuration section like:

```
[influxdb]
  enabled = true
  ...
```

to this:

```
[[influxdb]]
  enabled = true
  default = true
  name = "localhost"
  ...
```

With the new configuration you can configure multiple clusters.
By giving each cluster a name you can specify which cluster to use when performing a batch query or writing results to InfluxDB, using the `.cluster` method.
See [BatchNode.Cluster](/kapacitor/v0.11/tick/batch_node#cluster) and [InfluxDBOut.Cluster](/kapacitor/v0.11/tick/influx_d_b_out_node#cluster) for more info.


### New InfluxQL Syntax

The `.mapReduce` method has been deprecated, and replaced by a simpler syntax.
If you have a TICKscript that looks like:

```javascript
stream.from()...
    .window()...
    .count('value')
```

then update it to look like this:

```javascript
stream.from()...
    .window()...
    .count('value')
```

We like the simplicity of this new syntax as it no longer exposes the map/reduce concept directly to the user and improves readability.
**The old syntax will continue to work for all v0.11 versions of Kapacitor but starting with v0.12 it will be removed.**

### Email, Slack, HipChat Global/StateChangesOnly

In previous releases setting Email, Slack, or HipChat globally in the configuration would also set `stateChangesOnly` globally.
This coupling caused significant confusion as the behavior of alerts changed as a result of enabling a handler.
Now there is an explicit setting to enable the `stateChangesOnly` only behavior for the globally configured alerts.
To preserve previous behavior add a `state-changes-only = true` option to any of these handlers you may have configured globally.

```
[slack]
    enabled = true
    ...
    global = true
    state-changes-only = true
```

With this change you can now control whether you want to receive alerts for all events or just state changes independent of a globally configured alert handler.
