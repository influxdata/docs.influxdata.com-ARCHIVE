---
title: Using Alert Topics
aliases:
    - kapacitor/v1.4/examples/using_alert_topics/
menu:
  kapacitor_1_4:
    name: Alerts - Using Topics
    identifier: using_alert_topics
    weight: 4
    parent: work-w-kapacitor
---

Kapacitor's alert system allows a publish subscribe design pattern to be used.
Alerts are published to a `topic` and `handlers` subscribe to it.

This example will walk the reader through setting up a simple cpu threshold alert that sends alerts to Slack.

### Requirements

It is expected that the reader is already familiar the basics of Kapacitor
presented in the [Getting Started](/kapacitor/v1.4/introduction/getting_started/)
guide. The reader should also have a basic understanding of working with tasks
and [TICKscripts](/kapacitor/v1.4/tick/introduction/).

It is further expected that a working Telegraf and Kapacitor are installed to
walk through this example. If these are not installed, please take a second to
set up both of them.

## The Task

This walk-through is going to demonstrate how to set up a `cpu` alert topic and send alerts to that topic.

First define a simple cpu alert.

```go
dbrp "telegraf"."autogen"

stream
    |from()
        .measurement('cpu')
        .groupBy(*)
    |alert()
        .warn(lambda: "usage_idle" < 20)
        .crit(lambda: "usage_idle" < 10)
        // Send alerts to the `cpu` topic
        .topic('cpu')
```

The above TICKscript creates a threshold alert for cpu usage and sends the alerts to the `cpu` topic.

Save the above script as `cpu_alert.tick`.
Create and start the task by running the following commands:

```sh
$ kapacitor define cpu_alert -tick cpu_alert.tick
$ kapacitor enable cpu_alert
```

## The Slack handler

At this point a Kapacitor task which is generating alerts and sending them to
the `cpu` topic, but since the topic does not have any handlers nothing happens
with the alerts.

Confirm that there are no handlers by checking the topic:

```sh
$ kapacitor show-topic cpu
```

The output should look something like:

```
ID: cpu
Level: OK
Collected: 27
Handlers: []
Events:
Event                            Level    Message                                Date
cpu:cpu=cpu3,host=localhost      OK       cpu:cpu=cpu3,host=localhost is OK      23 Jan 17 14:04 MST
```

>NOTE: If the error message `unkown topic: "cpu"` is returned, please be aware,
that topics are created only when needed, as such if the task has not triggered an alert yet, the topic will not exist.
If this error about the topic not existing is returned, then, try and cause an alert to be triggered.
Either change the thresholds on the task or create some cpu load.

<!-- fixes defect 1003-->

To configure a handler first the handler binding must be defined.
A handler binding has a few parts:

* Topic - The topic ID.
* ID - The unique ID of the handler.
* Kind - The kind of handler, in this case it will be a `slack` handler
* Match - A lambda expression to filter matching alerts. By default all alerts match.
* Options - A map of values, differs by kind.

The slack handler binding can be defined in either yaml or json, here yaml is used:

```yaml
topic: cpu
id: slack
kind: slack
options:
  channel: '#alerts'
```

The above handler definition defines a handler that sends alerts to the slack channel `#alerts`.

Save the above text as `slack.yaml`.
Now the new handler can be bound to the topic via the `kapacitor` client.
To do this the `define-topic-handler` command is used.  It takes one argument.

```
$ kapacitor define-topic-handler
Usage: kapacitor define-topic-handler <path to handler spec file>
```

```sh
$ kapacitor define-topic-handler ./slack.yaml
```

Validate the handler was defined as expected:

```sh
$ kapacitor show-topic-handler cpu slack
```

Finally confirm the topic is configured as expected:

```sh
$ kapacitor show-topic cpu
```

The output should look something like:

```
ID: cpu
Level: OK
Collected: 27
Handlers: [slack]
Events:
Event                            Level    Message                                Date
cpu:cpu=cpu3,host=localhost      OK       cpu:cpu=cpu3,host=localhost is OK      23 Jan 17 14:04 MST
```

That is it!  Future alerts triggered by the `cpu_alert` task will be sent to Slack via the `cpu` topic.

## Summary

While it is simple to define alert handlers directly in the TICKscript, tracking and maintenance can become burdensome once many tasks have been created.
Using topics decouples the definition of the alert from the handling of the alert.
With topic and handler bindings defined, to change the slack channel is a single API call to update the slack handler. More importantly, no TICKscripts have to change.

## Going further

### Chaining topics

Topics can be chained together using the `publish` action handler.
This allows alerts to be further grouped into various topics.

For example the above task could be modified to send alerts to the `system` topic instead of the `cpu` topic.
This way all system related alerts can be handled in a consistent manner.

The new TICKscript:

```go
stream
    |from()
        .measurement('cpu')
        .groupBy(*)
    |alert()
        .warn(lambda: "usage_idle" < 20)
        .crit(lambda: "usage_idle" < 10)
        // Send alerts to the `system` topic
        .topic('system')
```

To send all system alerts to a new topic `ops_team`, create a new handler for the `system` topic.

```yaml
topic: system
id: publish-to-ops_team
kind: publish
options:
  topics:
    - ops_team
```

```sh
kapacitor define-topic-handler ./publish-to-ops_team.yaml
```

Since the operations team has an on-call rotation, handling of alerts on the `ops_team` topic can be set up accordingly.


```yaml
topic: ops_team
id: victorops
kind: victorops
options:
  routing-key: ops_team
```

```sh
kapacitor define-topic-handler ./victorops.yaml
```

Now all `system` related alerts get sent to the `ops_team` topic which in turn get handled in Victor Ops.

### Match Conditions

Match conditions can be applied to handlers.
Only alerts matching the conditions will be handled by that handler.

For example it is typical to only send Slack messages when alerts change state instead of every time an alert is evaluated.
Modifing the slack handler definition from the first example results in the following:

```yaml
topic: cpu
id: slack
kind: slack
match: changed() == TRUE
options:
  channel: '#alerts'
```


Now update the handler and only alerts that changed state will be sent to Slack.

```
kapacitor define-topic-handler ./slack.yaml
```


