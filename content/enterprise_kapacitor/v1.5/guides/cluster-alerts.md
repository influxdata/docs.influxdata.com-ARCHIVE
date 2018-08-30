---
title: Configure alerts in Kapacitor Enterprise clusters
menu:
  enterprise_kapacitor_1_5:
    name: Configure alerts in clusters
    weight: 20
    parent: Guides
---

## Importat things to know

### Terminology
Definitions for terms specific to this guide are defined below:

**Standalone event handler**  
"Standalone" event handlers are those added using an [event handler file](/kapacitor/v1.5/event_handlers/#handler-file)
that subscribes to a specified alert topic.
As alerts are published to that topic, the standalone event handler acts on that data.
How it acts depends on the particular `kind` of handler you are using.

**Inline event handler**  
"Inline" event handlers are those [used in TICKscripts](/kapacitor/v1.5/event_handlers/#tickscript)
that send alert data directly from the running task.

### Cluster awareness
Currently, Kapacitor Enterprise is only partially cluster-aware.
For example, Nodes in a Kapacitor cluster aren't aware of tasks and TICKscripts
running on other nodes in the cluster.
Tasks need to be defined on each instance you wish the task to run.
However, "standalone" alert handlers only need to be defined on one instance.
Kapacitor will manage the replication of that handler.

## Alert handlers in a cluster
Because nodes in a Kapacitor enterprise cluster are not aware of tasks running on
other nodes, alert data should **not** be sent directly from tasks (TICKscripts).
Doing so will result in duplicate notifications as each node will send the same alert.

![TICKscript alerts in a cluster](#)

Kapacitor Enterprise handles the replication of standalone handlers across the cluster.
As multiple nodes publish alerts a topic, Kapacitor deduplicates the alerts.
Standalone event handlers subscribed to topic see and act only the deduplicated alerts.

The diagram below illustrates the differences between the two approaches:

![Alerts in Kapacitor Enterprise clusters](#)

### Add alerts to a Kapacitor Enterprise cluster
In your TICKscript [AlertNodes](kapacitor/v1.5/nodes/alert_node/), use the `.topic()`
method to publish alert data to an alert topic.

_**TICKscript - Publish alerts to a topic**_
```js
|alert()
  // ...
  .topic('topic-name')
```

Since tasks are not replicated across nodes in the cluster, you need to define the
task on each node in the cluster.

```bash
# Pattern
kapacitor define <task-name> -tick <path-to-tickscript-file>

# Example
kapacitor define cpu-alert -tick cpu_alert.tick
```

_**post-handler.yml - Post alert handler that subscribes to the topic**_
```yaml
id: handler-id
topic: topic-name
kind: post
options:
  url: http://example.com/path
```

_**Add the post alert handler to Kapacitor**_
```bash
# From inside a running Kapacitor instance
kapacitor define-topic-handler path/to/post-handler.yml
```
