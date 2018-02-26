---
title: Managing alerts using Chronograf
menu:
  chronograf_1_4:
    name: Managing alerts using Chronograf
    weight: 25
    parent: Administration
---

Content

* Overview
* Creating Kapacitor instances
* Creating Kapacitor alerts
* Logging



# Overview

Chronograf provides a user interface for [Kapacitor](/kapacitor/latest/), InfluxData's processing framework for creating alerts, running ETL jobs, and detecting anomalies in your data.
Alerts in Chronograf correspond to Kapacitor tasks designed specifically to
trigger alerts whenever the data stream values rise above or fall below
designated thresholds.
Some of the most common alerting use cases can be managed using Chronograf, including:

* Thresholds with static ceilings, floors, and ranges.
* Relative thresholds based on unit or percentage changes.
* Deadman switches.

For more complex alerts and other tasks, you must define them directly in Kapacitor.
