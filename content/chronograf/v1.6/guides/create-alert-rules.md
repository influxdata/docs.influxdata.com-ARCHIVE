---
title: Creating Chronograf alert rules
description: Creating Chronograf alert rules, specifying time series data and thresholds. Example sends alerts to a Slack channel.
aliases:
  - /chronograf/v1.6/guides/create-a-kapacitor-alert/
menu:
  chronograf_1_6:
    name: Creating alert rules
    weight: 60
    parent: Guides
---


Chronograf provides a user interface for [Kapacitor](/kapacitor/latest/), InfluxData's processing framework for creating alerts, ETL jobs (running extract, transform, load), and detecting anomalies in your data.
Chronograf alert rules correspond to Kapacitor tasks that trigger alerts whenever certain conditions are met.
Behind the scenes, these tasks are stored as [TICKscripts](/kapacitor/latest/tick/) that can be edited manually or through Chronograf.
Common alerting use cases that can be managed using Chronograf include:

* Thresholds with static ceilings, floors, and ranges.
* Relative thresholds based on unit or percentage changes.
* Deadman switches.

Complex alerts and other tasks can be defined directly in Kapacitor as TICKscripts, but can be viewed and managed within Chronograf.

This guide walks through creating a Chronograf alert rule that sends an alert message to an existing [Slack](https://slack.com/) channel whenever your idle CPU usage crosses the 80% threshold.

## Requirements

[Getting started with Chronograf](/chronograf/latest/introduction/getting-started/) offers step-by-step instructions for each of the following requirements:

* Downloaded and install the entire TICKstack (Telegraf, InfluxDB, Chronograf, and Kapacitor).
* Configure Telegraf to collect data using the InfluxDB [system statistics](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/system) input plugin and write data to your InfluxDB instance.
* [Create a Kapacitor connection in Chronograf](/chronograf/latest/introduction/getting-started/#4-connect-chronograf-to-kapacitor).
* Slack is available and configured as an [event handler](/chronograf/latest/troubleshooting/frequently-asked-questions/#what-kapacitor-event-handlers-are-supported-in-chronograf) in Chronograf.
See the [Configuring Kapacitor Event Handlers](/chronograf/latest/guides/configuring-alert-endpoints/) guide for detailed configuration instructions.

## Configuring Chronograf alert rules

Navigate to the **Manage Tasks** page under **Alerting** in the left navigation, then click **+ Build Alert Rule** in the top right corner.

![Navigate to Manage Tasks](/img/chronograf/v1.6/alerts-manage-tasks-nav.png)

The **Manage Tasks** page is used to create and edit your Chronograf alert rules.
The steps below guide you through the process of creating a Chronograf alert rule.

![Empty Rule Configuration](/img/chronograf/v1.6/alerts-rule-builder.png)

### Step 1: Name the alert rule

Under **Name this Alert Rule** provide a name for the alert.
For this example, use "Idle CPU Usage" as your alert name.

### Step 2: Select the alert type

Choose from three alert types under the **Alert Types** section of the Rule Configuration page:

_**Threshold**_  
Alert if data crosses a boundary.

_**Relative**_  
Alert if data changes relative to data in a different time range.

_**Deadman**_  
Alert if InfluxDB receives no relevant data for a specified time duration.

For this example, select the **Threshold** alert type.

### Step 3: Select the time series data

Choose the time series data you want the Chronograf alert rule to use.
Navigate through databases, measurements, fields, and tags to select the relevant data.

In this example, select the `telegraf` [database](/influxdb/latest/concepts/glossary/#database), the `autogen` [retention policy](/influxdb/latest/concepts/glossary/#retention-policy-rp), the `cpu` [measurement](/influxdb/latest/concepts/glossary/#measurement), and the `usage_idle` [field](/influxdb/latest/concepts/glossary/#field).

![Select your data](/img/chronograf/v1.6/alerts-time-series.png)

### Step 4: Define the rule condition

Define the threshold condition.
Condition options are determined by the [alert type](#step-2-select-the-alert-type).
For this example, the alert conditions are if `usage_idle` is less than `80`.

![Create a condition](/img/chronograf/v1.6/alerts-conditions.png)

The graph shows a preview of the relevant data and the threshold number.
By default, the graph shows data from the past 15 minutes.
Adjusting the graph's time range is helpful when determining a reasonable threshold number based on your data.

> We set the threshold number to `80` for demonstration purposes.
> Setting the threshold for idle CPU usage to a high number ensures that we'll be able to see the alert in action.
> In practice, you'd set the threshold number to better match the patterns in your data and your alerting needs.

### Step 5: Select and configure the alert handler

The **Alert Handler** section determines where the system sends the alert (the event handler)
Chronograf supports several event handlers.
Each handler has unique configurable options.

For this example, choose the **slack** alert handler and enter the desired options.

![Select the alert handler](/img/chronograf/v1.6/alerts-configure-handlers.png)

> Multiple alert handlers can be added to send alerts to multiple endpoints.

### Step 6: Configure the alert message

The alert message is the text that accompanies an alert.
Alert messages are templates that have access to alert data.
Available data templates appear below the message text field.
As you type your alert message, clicking the data templates will insert them at end of whatever text has been entered.

In this example, use the alert message, `Your idle CPU usage is {{.Level}} at {{ index .Fields "value" }}.`.

![Specify event handler and alert message](/img/chronograf/v1.6/alerts-message.png)

*View the Kapacitor documentation for more information about [message template data](/kapacitor/latest/nodes/alert_node/#message).*

### Step 7: Save the alert rule

Click **Save Rule** in the top right corner and navigate to the **Manage Tasks** page to see your rule.
Notice that you can easily enable and disable the rule by toggling the checkbox in the **Enabled** column.

![See the alert rule](/img/chronograf/v1.6/alerts-view-rules.png)

Next, move on to the section below to experience your alert rule in action.

## Viewing alerts in practice

### Step 1: Create some load on your system

The purpose of this step is to generate enough load on your system to trigger an alert.
More specifically, your idle CPU usage must dip below `80%`.
On the machine that's running Telegraf, enter the following command in the terminal to start some `while` loops:

```
while true; do i=0; done
```

Let it run for a few seconds or minutes before terminating it.
On most systems, kill the script by using `Ctrl+C`.

### Step 2: View the alerts

Go to the Slack channel that you specified in the previous section.
In this example, it's the `#chronocats` channel.

Assuming the first step was successful, `#ohnos` should reveal at least two alert messages:

* The first alert message indicates that your idle CPU usage was `CRITICAL`, meaning it dipped below `80%`.
* The second alert message indicates that your idle CPU usage returned to an `OK` level of `80%` or above.

![See the alerts](/img/chronograf/v1.6/alerts-slack-notifications.png)

You can also see alerts on the **Alert History** page available under **Alerting** in the left navigation.

![Chronograf alert history](/img/chronograf/v1.6/alerts-history.png)

That's it! You've successfully used Chronograf to configure an alert rule to monitor your idle CPU usage and send notifications to Slack.
