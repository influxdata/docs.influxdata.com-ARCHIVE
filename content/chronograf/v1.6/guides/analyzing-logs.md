---
title: Analyzing logs with Chronograph
description: View, search, filter, visualize, and analyze log information using Chronograf and InfluxDB.
menu:
  chronograf_1_6:
    weight: 120
    parent: Guides
---

Chronograf gives you the ability to view, search, filter, visualize, and analyze log information from a variety of sources.
This helps to recognize and diagnose patterns, then quickly dive into logged events that lead up to events.

## Logging setup
Logs data is a first glass citizen in InfluxDB and is populated using available log-related [Telegraf input plugins](/telegraf/latest/plugins/inputs/):

[logparser](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/inputs/logparser)  
[syslog](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/inputs/syslog)  
[GrayLog](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/inputs/graylog)  
[tail](https://github.com/influxdata/telegraf/tree/release-1.7/plugins/inputs/tail)  

## Viewing logs in Chronograf
Chronograf has a dedicated log viewer accessed by clicking the "Log Viewer" button in the left navigation.

<img src="/img/chronograf/v1.6/logs-nav-log-viewer.png" alt="Log viewer in the left nav" style="width:100%;max-width:209px;"/>

The log viewer provides a detailed histogram showing the time-based distribution of log entries color-coded by log severity.
It also includes a live stream of logs that can be searched, filtered, and paused to analyze specific time ranges.

<img src="/img/chronograf/v1.6/logs-log-viewer.png" alt="Chronograf log viewer" style="width:100%;max-width:1016px;"/>

### Searching and filtering logs
Logs are searched using keywords or regular expressions.
They can also be filtered by severity and any tag values included with the log entry.

![Searching and filtering logs](/img/chronograf/v1.6/logs-search-filter.gif)

> **Note:** The log search field is case-sensitive.

To remove filters, click the `×` next to the tag key by which you no longer want to filter.

### Selecting specific times
In the log viewer, you can select time ranges from which to view logs.
By default, logs are stream and displayed relative to "now," but it is possible to view logs from a past window of time.
Timeframe selection is designed to allow you to go to to a specific event and see logs both preceding and following that event.
When viewing logs from previous time window, first select the target time, then select the offset.
The offset is used to define the upper and lower thresholds of the window from which logs are pulled.

![Selecting time ranges](/img/chronograf/v1.6/logs-time-range.gif)

## Configuring the log viewer
The log viewer can be customized to fit your specific needs.
Open the log viewer configuration options by clicking the gear button in the top right corner of the log viewer.

<img src="/img/chronograf/v1.6/logs-log-viewer-config-options.png" alt="Log viewer configuration options" style="width:100%;max-width:819px;"/>

### Severity colors
Every log severity is assigned a color which is used in the display of log entries.
To customize colors, select a color from the available color dropdown.
Once done, click the "Save" button to apply the changes.

### Table columns
Columns in the log viewer are auto-populated with all fields and tags associated with your log data.
Each column can be reordered, renamed, and hidden or shown.

### Severity format
"Severity Format" specifies how the severity of log entries is displayed in your log table.
Below are the options and how they appear in the log table:

| Severity Format | Display                                                                                                                                           |
| --------------- |:-------                                                                                                                                           |
| Dot             | <img src="/img/chronograf/v1.6/logs-serverity-fmt-dot.png" alt="Log serverity format 'Dot'" style="display:inline;max-height:24px;"/>             |
| Dot + Text      | <img src="/img/chronograf/v1.6/logs-serverity-fmt-dot-text.png" alt="Log serverity format 'Dot + Text'" style="display:inline;max-height:24px;"/> |
| Text            | <img src="/img/chronograf/v1.6/logs-serverity-fmt-text.png" alt="Log serverity format 'Text'" style="display:inline;max-height:24px;"/>           |


## Logs in dashboards
An incredibly powerful way to analyze log data is by creating dashboards that include log data.
This is possible by using the [Table graph type](/chronograf/v1.6/guides/visualization-types/#table) to display log data in your dashboard.

![Correlating logs with other metrics](/img/chronograf/v1.6/logs-dashboard-correlation.gif)

This type of visualization allows you to quickly identify anomalies in other metrics and see logs associated with those anomalies.
