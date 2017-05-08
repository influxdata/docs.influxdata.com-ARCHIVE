---
title: Using Alert Topics

menu:
  kapacitor_1_3:
    name: Using Alert Topics
    identifier: using_alert_topics
    weight: 60
    parent: examples
---

Kapacitor's alert system follows a publish subscribe design pattern.
Alerts are published to a `topic` and handlers subscribe to various topics.

This example will walk you through setting up a simple cpu threshold alert that sends alerts to Slack.

### Requirements

It is expected that you have a working Telegraf and Kapacitor install to walk through this example.
If you do not please take a second to setup both.


## The Task

We are going to demonstrate how to setup a `cpu` alert topic and send alerts to that topic.

First let's define our simple cpu alert.

```go
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
$ kapacitor define cpu_alert -type stream -tick cpu_alert.tick -dbrp telegraf.autogen
$ kapacitor enable cpu_alert
```

## The Slack handler

At this point we have a Kapacitor task which is generating alerts and sending them to the `cpu` topic, but since the topic does not have any handlers nothing happens with the alerts.

We can confirm there are no handlers by checking the topic:

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

>NOTE: Topics are created only when needed, as such if the task has not triggered an alert yet, the topic will not exist.
If you get an error about the topic not existing, cause an alert to be triggered.
Either change the thresholds on the task or create some cpu load.

To configure a handler we must first define the handler.
A handler definition has a few parts:

* ID - The unique ID of the handler.
* Kind - The kind of handler, in this case it will be a `slack` handler
* Match - A lambda expression to filter matching alerts. By default all alerts match.
* Options - A map of values to pass to the action, differs by kind.

The slack handler can be defined as either yaml or json, here we use yaml:

```yaml
kind: slack
options:
  channel: '#alerts'
```

The above handler definition defines a handler that sends alerts to the slack channel `#alerts`.

Save the above text as `slack.yaml`.
Now we can define our new handler via the `kapacitor` cli.
To do this we use the `define-topic-handler` command which takes three arguments.

```
$ kapacitor define-topic-handler
Usage: kapacitor define-topic-handler <topic id> <handler id> <path to handler spec file>
```

```sh
$ kapacitor define-topic-handler cpu slack ./slack.yaml
```

Validate the handler was defined as expected:

```sh
$ kapacitor show-topic-handler cpu slack
```

Finally confirm the topic is configured as expected:

```sh
$ kapacitor show-topic slack
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

We are done, future alerts triggered by the `cpu_alert` task will be send to Slack via the `cpu` topic.

## Conclusion

While it is simple to define alert handlers directly in the TICkscript it can become burdensome once you have many tasks.
Using topics decouples the definition of the alert from the handling of the alert.
Now to change the slack channel is a single API call to update the slack handler and no TICKscripts have to change.

## Going further

### Chaining topics

Topics can be chained together using the `publish` action.
This allows you to further group your alerts into various topics.

For example the above task could be modified to send alerts to the `system` topic instead of the `cpu` topic.
This way all system related alerts can be handled in a consitent manner.

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

To send all system alerts to Slack, create a new handler for the system topic.

```yaml
kind: publish
options:
  topics:
    - ops_team
```

```sh
kapacitor define-topic-handler system publish-to-ops_team ./publish-to-ops_team.yaml
```

Since the operations team has a on-call rotation you can setup handling of alerts on the `ops_team` topic accordingly.


```yaml
kind: victorops
options:
  routing-key: ops_team
```

```sh
kapacitor define-topic-handler ops_team victorops ./victorops.yaml
```

Now all `system` related alerts get sent to the `ops_team` topic which in turn get handled in Victor Ops.

### Match Conditions

Match conditions can be applied to handlers.
Only alerts matching the conditions will be handled by that handler.

For example it is typical to only send Slack messages when alerts change state instead of every time an alert is evaluated.
Modifing the slack handler definition from the first example we get:

```yaml
kind: slack
match: changed() == TRUE
options:
  channel: '#alerts'
```


Now update the handler and only alerts that changed state will be sent to Slack.

```
kapacitor define-topic-handler cpu slack ./slack.yaml
```

