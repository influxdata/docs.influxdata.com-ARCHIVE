---
title: Guides
aliases:
    - kapacitor/v1.5/examples/
menu:
  kapacitor_1_5:
    name: Guides
    identifier: guides
    weight: 1
---

The following is a list of examples in no particular order that demonstrate some of the features of Kapacitor.
These guides assume your are familiar with the basics of defining, recording, replaying and enabling tasks within Kapacitor.
See the [getting started](/kapacitor/v1.5/introduction/getting-started/) guide if you need a refresher.

### [Calculating rates across joined series + backfill](/kapacitor/v1.5/guides/join_backfill/)

Learn how to join two series and calculate a combined results, plus how to perform that operation on historical data.

### [Live leaderboard of game scores](/kapacitor/v1.5/guides/live_leaderboard/)

See how you can use Kapacitor to create a live updating leaderboard for a game.

### [Load directory](/kapacitor/v1.5/guides/load_directory/)

Put TICKscripts, TICKscript templates, and handler definitions in a directory,
from where they will be loaded when the Kapcitor daemon boots.

### [Custom anomaly detection](/kapacitor/v1.5/guides/anomaly_detection/)

Integrate your custom anomaly detection algorithm with Kapacitor.

### [Continuous Queries](/kapacitor/v1.5/guides/continuous_queries/)

See how to use Kapacitor as a continuous query engine.

### [Socket-based UDF](/kapacitor/v1.5/guides/socket_udf/)

Learn how to write a simple socket-based user-defined function (UDF).

### [Template tasks](/kapacitor/v1.5/guides/template_tasks/)

Use task templates to reduce the amount of TICKscripts you need to write.

### [Reference TICKscripts](/kapacitor/v1.5/guides/reference_scripts/)

Some examples of TICKscripts built against common Telegraf plugin data.
