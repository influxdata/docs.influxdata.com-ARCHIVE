---
title: Working with Kapacitor

menu:
  kapacitor_1_5:
    name: Working with Kapacitor
    identifier: work-w-kapacitor
    weight: 3
---

The documents in this section present the key features of the Kapacitor daemon
(`kapacitord`) and the Kapacitor client (`kapacitor`).

* [Kapacitor and Chronograf](/kapacitor/v1.5/working/kapa-and-chrono/) &ndash; presents how Kapacitor is integrated with the Chronograf graphical user interface application for managing tasks and alerts.
* [Kapacitor API Reference documentation](/kapacitor/v1.5/working/api/) &ndash; presents the HTTP API and how to use it to update tasks and the Kapacitor configuration.
* [Alerts - Overview](/kapacitor/v1.5/working/alerts/) &ndash; presents an overview of the Kapacitor alerting system.
* [Alerts - Using topics](/kapacitor/v1.5/working/using_alert_topics/) &ndash; a walk-through on creating and using alert topics.
* [Alerts - Event handler setup](/kapacitor/v1.5/working/event-handler-setup/) &ndash; presents setting up event handlers for HipChat and Telegraf, which can serve as a blueprint for other event handlers.
* [Dynamic data scraping](/kapacitor/v1.5/working/scraping-and-discovery/) &ndash; introduces the discovery and scraping features, which allow metrics to be dynamically pulled into Kapacitor and then written to InfluxDB.
