---
title: Alerts

menu:
  kapacitor_1_3:
    identifier: alerts
    weight: 15
---


In addition to defining alert handler in TICKscript Kapacitor supports an alert system that follows a publish subscribe design pattern.
Alerts are published to a `topic` and `handlers` subscribe to a topic.

## Topics

An alert topic is simply a namespace where alerts are grouped.
When an alert event fires it is assigned to a topic.
Multiple handlers can be defined on a topic and all handlers process each alert event for the topic.

## Handlers

A handler takes action on incoming alert events for a specific topic.
Each handler operates on exactly one topic.

A handler definition has a few properties:

* ID - The unique ID of the handler.
* Kind - The kind of handler, see [handlers](./handlers) for a list of available kinds.
* Match - A lambda expression to filter matching alerts. By default all alerts match, see [matching](./match) for details on the match expression.
* Options - A map of values, differs by kind.

## Example

See the [Using Alert Topics](/kapacitor/v1.3/guides/using_alert_topics) example for a walk through defining and using alert topics.
