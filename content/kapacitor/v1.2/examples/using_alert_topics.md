---
title: Using Alert Topics

menu:
  kapacitor_1_2:
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

We are going to demonstrate how to setup a `slack` alert topic and send alerts to that topic.

First let's define our simple cpu alert.

```go
stream
    |from()
        .measurement('cpu')
        .groupBy(*)
    |alert()
        .warn(lambda: "usage_idle" < 20)
        .crit(lambda: "usage_idle" < 10)
        // Send alerts to the `slack` topic
        .topic('slack')
```

The above TICKscript creates a threshold alert for cpu usage and sends the alerts to the `slack` topic.

Save the above script as `cpu_alert.tick`.
Create and start the task by running the following commands:

```sh
$ kapacitor define cpu_alert -type stream -tick cpu_alert.tick -dbrp telegraf.autogen
$ kapacitor enable cpu_alert
```

## The Slack handler

At this point we have a Kapacitor task which is generating alerts and sending them to the `slack` topic, but since the topic does not have any handlers nothing happens with the alerts.

We can confirm there are no handlers by checking the topic:

```sh
$ kapacitor show-topic slack
```

The output should look something like:

```
ID: slack
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
A handler definition has three parts:

* ID - The unique ID of the handler.
* Topics - The list of topics the handler subscribes to.
* Actions - The list of actions to take.

Each action has two properties:

* Kind - The kind of action, in this case `slack`.
* Options - A map of values to pass to the action, differs by kind.

The slack handler can be defined as either yaml or json, here we use yaml:

```yaml
id: slack

topics:
  - slack

actions:
  - kind: slack
    options:
      channel: '#alerts'
```

Save the above text as `slack.yaml`.
Now we can define our new handler via the `kapacitor` cli:

```sh
$ kapacitor define-handler slack.yaml
```

Validate the handler was defined as expected:

```sh
$ kapacitor show-handler slack
```

Finally confirm the topic is configured as expected:

```sh
$ kapacitor show-topic slack
```

The output should look something like:

```
ID: slack
Level: OK
Collected: 27
Handlers: [slack]
Events:
Event                            Level    Message                                Date
cpu:cpu=cpu3,host=localhost      OK       cpu:cpu=cpu3,host=localhost is OK      23 Jan 17 14:04 MST
```

We are done, future alerts triggered by the `cpu_alert` task will be send to Slack.

## Conclusion

While it is simple to define alert handlers directly in the TICkscript it can become burdensome once you have many tasks.
Using topics decouples the definition of the alert from the handling of the alert.
Now to changing the slack channel is a single API call to update the slack handler and no TICKscripts have to change.

## Going further

### Chaining topics

Topics can be chained together using the `publish` action.
This allows you to further group your alerts into various topics.

For example the above task could be modified to send alerts to the `system` topic instead of the `slack` topic.
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
id: system

topics:
  - system

actions:
  - kind: publish
    options:
      topics:
        - slack
```

Alternatively you could modify the `slack` handler to listen to the `system` topic, instead of creating a separate system handler.

```yaml
id: slack

topics:
  - slack
  - system

actions:
  - kind: slack
    options:
      channel: '#alerts'
```

### Chaining actions

More than one action can be defined for a given handler.
Typically a user would configure a slack handler to only notify a user of state changes.
By making use of the `stateChangesOnly` action, we can modify the definition of the slack handler to always use the state changes only behavior.

```yaml
id: slack

topics:
  - slack

actions:
  - kind: stateChangesOnly
  - kind: slack
    options:
      channel: '#alerts'
```

Now the `stateChangesOnly` behavior is defined along side the action to send alerts to slack.
This decoupling of the alert definitions from handlers  enables making small atmoic changes without needing to worry about side effects.

