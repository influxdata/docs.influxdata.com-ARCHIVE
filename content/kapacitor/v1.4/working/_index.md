---
title: Working with Kapacitor
description: Covers Kapacitor API, alerts, topics, event handlers, and dynamic data scraping.
menu:
  kapacitor_1_4:
    name: Working with Kapacitor
    weight: 40
---

The documents in this section present the key features of the Kapacitor daemon
(`kapacitord`) and the Kapacitor client (`kapacitor`).

* [Using Kapacitor in Chronograf](/kapacitor/v1.4/working/kapa-and-chrono/)
  * Presents how Kapacitor is integrated with the Chronograf graphical user interface application for managing tasks and alerts.
* [Kapacitor HTTP API reference](/kapacitor/v1.4/working/api/)
  * Presents the HTTP API and how to use it to update tasks and the Kapacitor configuration.
* [Kapacitor command line client](/kapacitor/v1.4/working/cli_client/)
  *  Overview of the Kapacitor command line client, commands, data sampling, and working with topics and tasks.
* [Kapacitor alerts overview](/kapacitor/v1.4/working/alerts/)
  * Presents an overview of the Kapacitor alerting system.
* [Using Kapacitor alert topics](/kapacitor/v1.4/working/using_alert_topics/)
  * A walk-through on creating and using alert topics.
* [Using Kapacitor event handlers to send alert messages](/kapacitor/v1.4/working/event-handler-setup/)
  * Presents setting up event handlers for HipChat and Telegraf, which can serve as a blueprint for other event handlers.
* [Using Kapacitor template tasks](/kapacitor/v1.4/working/template_tasks/)
  * Use Kapacitor task templates to reduce the amount of TICKscripts you need to write
* [Discovering and scraping data with Kapacitor](/kapacitor/v1.4/working/scraping-and-discovery/)
  * Introduces the discovery and scraping features of Kapacitor, which allow metrics to be dynamically pulled into Kapacitor and then written to InfluxDB.
