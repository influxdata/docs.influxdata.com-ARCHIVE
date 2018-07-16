---
title: Analyzing logs with Chronograph
description: placeholder
menu:
  chronograf_1_6:
    weight: 120
    parent: Guides
---

Chronograf gives you the ability to view, search, filter, visualize, and analyze log information from a variety of sources.
This helps to recognize and diagnose patterns, then quickly dive into logged events that lead up to events.


## Logging setup
Getting logs into InfluxDB.
This won't covered in this guide as it requires enabling appropriate [Telegraf](/telegraf/latest/) plugins.

<!-- Maybe a list of plugins -->

## Viewing logs in Chronograf
Chronograf's log viewer provides

![Log viewer in the left nav](#)

- Histogram
- Searchable log table

## Configuring the log viewer
- Selecting the InfluxDB instance, database, and retention policy
- Modifying colors
- Customizing columns
    - Providing an alias
    - Showing/hiding    
- Severity format
    - Dot | Dot + Text | Text


## Analyzing Logs
- Isolating windows of time
- Searching
- Filtering:
    - By keys in columns
    - Removing filters
- Selecting specific times

### Logs in dashboards
- Tie log activity to corresponding metric anomalies
- Visualizing correlation
- Use the table graph. Query logs from InfluxDB.

![Correlating logs with other metrics](#)
