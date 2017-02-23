---
title: Event Handler Setup

menu:
  kapacitor_1_2:
    weight: 0
    parent: guides
---

Integrate Kapacitor into your monitoring system by sending [alert messages](/kapacitor/v1.2/nodes/alert_node/#message) to supported event handlers.
Currently, Kapacitor can send alert messages to specific log files and specific URLs, as well as to applications like [Slack](https://slack.com/) and [HipChat](https://www.hipchat.com/).


This document offers step-by-step instructions for setting up event handlers with Kapacitor, including the relevant configuration options and [TICKscript](/kapacitor/v1.2/tick/) syntax.
Currently, this document doesn't cover every supported event handler, but we will continue to add content to this page over time.
For a complete list of the supported event handlers and for additional information, please see the [event handler reference documentation](/kapacitor/v1.2/nodes/alert_node/).

<table style="width:100%">
  <tr>
    <td><a href="#hipchat-setup">HipChat Setup</a></td>
    <td><a href="#telegram-setup">Telegram Setup</a></td>
  </tr>
</table>



