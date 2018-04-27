---
title: Event handler setup

menu:
  kapacitor_1_5:
    name: Alerts - Event handler setup
    weight: 5
    parent: work-w-kapacitor
---

Kapacitor can be integrated into a monitoring system by sending
[alert messages](/kapacitor/v1.5/nodes/alert_node/#message) to supported event
handlers. Currently, Kapacitor can send alert messages to specific log files and
specific URLs, as well as to many third party applications like
[Slack](https://slack.com/) and [HipChat](https://www.hipchat.com/).

This document offers step-by-step instructions for setting up event handlers
with Kapacitor, including the relevant configuration options and
[TICKscript](/kapacitor/v1.5/tick/) syntax.  Currently, this document does not
cover every supported event handler, but additional content should be added to
this page over time.  For a complete list of the supported event handlers and for
additional information, please see the event handler presentation in the
[Alert node](/kapacitor/v1.5/nodes/alert_node/#description) documentation.

* [HipChat setup](#hipchat-setup)
* [Telegram setup](#telegram-setup)
