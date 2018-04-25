---
title: Kapacitor guides and tutorials
description: Guides include examples of calculating rates across joined series + backfill, a live leaderboard of game scores, loading directories during Kapacitor booting, and custom anomaly detection.
aliases:
    - kapacitor/v1.4/examples/
menu:
  kapacitor_1_4:
    name: Guides
    weight: 0
---

The following is a list of examples in no particular order that demonstrate some of the features of Kapacitor.
These guides assume your are familiar with the basics of defining, recording, replaying and enabling tasks within Kapacitor.
See the [getting started](/kapacitor/v1.4/introduction/getting-started/) guide if you need a refresher.

### [Calculating rates across joined series + backfill](/kapacitor/v1.4/guides/join_backfill/)

Learn how to join two series and calculate a combined results, plus how to perform that operation on historical data.

### [Live leaderboard of game scores](/kapacitor/v1.4/guides/live_leaderboard/)

See how you can use Kapacitor to create a live updating leaderboard for a game.

### [Load directory service](/kapacitor/v1.4/guides/load_directory/)

Put TICKscripts, TICKscript templates, and handler definitions in a directory
from where they will be loaded when the Kapcitor daemon boots.

### [Custom anomaly detection with Kapacitor](/kapacitor/v1.4/guides/anomaly_detection/)

Integrate your custom anomaly detection algorithm with Kapacitor.

### [Using Kapacitor as a continuous query engine](/kapacitor/v1.4/guides/continuous_queries/)

See how to use Kapacitor as a continuous query engine.

### [Using socket-based user defined functions (UDFs)](/kapacitor/v1.4/guides/socket_udf/)

Learn how to write a simple socket-based user-defined function (UDF).

### [Using Kapacitor event handlers to send alert messages](/kapacitor/v1.4/guides/event-handler-setup/)

Configuring Kapacitor to send alert messages to a HipChat room using event handlers and TICKscripts

### [Using Kapacitor template tasks](/kapacitor/v1.4/guides/template_tasks/)

Use Kapacitor task templates to reduce the amount of TICKscripts you need to write.

### [Kapacitor TICKscript examples](/kapacitor/v1.4/guides/reference_scripts/)

Some examples of TICKscripts built using popular Telegraf plugins as data sources.
