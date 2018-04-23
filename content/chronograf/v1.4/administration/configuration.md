---
title: Configuring Chronograf
description: Configuration of Chronograf, including custom default settings, security, multiple users, and multiple organizations.
menu:
  chronograf_1_4:
    name: Configuring
    weight: 20
    parent: Administration
---

Content

* [Starting the Chronograf service](#starting-the-chronograf-service)
* [Setting custom default Chronograf config options](#setting-custom-default-chronograf-config-options)
* [Configuring Chronograf to work with Kapacitor](#configuring-chronograf-to-work-with-kapacitor)
   * [Add a Kapacitor Instance](#add-a-kapacitor-instance)
   * [Managing Kapacitor from Chronograf](#managing-kapacitor-from-chronograf)
      * [Event Handlers](#event-handlers)
      * [Creating Alerts in Chronograf](#creating-alerts-in-chronograf)
      * [Managing tasks through Chronograf](#managing-tasks-through-chronograf)
* [Enabling security, multi-organization, and multi-user support](#nabling-security-multi-organization-and-multi-user-support)


Chronograf is configured by passing command line options when starting the Chronograf service.
However, it is also possible to set custom default configuration options in the filesystem so they don't have to be passed in when starting Chronograf.

## Starting the Chronograf service

Chronograf can be started using the default configuration options, but environment variables and command line options let you configure OAuth 2.0 authentication and other options based on your requirements.

**Linux:**

```bash
sudo systemctl start chronograf [OPTIONS]
```

**macOS:**

```bash
chronograf [OPTIONS]
```

`[OPTIONS]` are any of the available Chronograf command line options, separated by spaces. See the [Chronograf configuration options](/chronograf/v1.4/administration/config-options) documentation for details about configuration options, including command line options and corresponding environment variables.

## Setting custom default Chronograf config options

Custom default Chronograf configuration settings can be defined in `/etc/default/chronograf`.
This file consists of key-value pairs – the key being the environment variable for each configuration option outlined in the [Chronograf configuration options](/chronograf/v1.4/administration/config-options) documentation and the value being the desired setting for that option.

```conf
HOST=0.0.0.0
PORT=8888
TLS_CERTIFICATE=/path/to/cert.pem
TOKEN_SECRET=MySup3rS3cretT0k3n
LOG_LEVEL=info
```

> **Note:** `/etc/default/chronograf` is only created in Linux-based operating systems.
It is neither created nor used in macOS.

## Configuring Chronograf to work with Kapacitor

Kapacitor instances in Chronograf are associated with specific InfluxDB databases
which should already be bound to both Kapacitor and Chronograf.  To define an
InfluxDB database in Kapacitor, see [Getting started with Kapacitor](/kapacitor/v1.4/introduction/getting-started/)
or the [Configuring Kapacitor](/kapacitor/v1.4/administration/configuration/#influxdb)
guides. To define an InfluxDB database in Chronograf, see [InfluxDB setup](/chronograf/v1.4/introduction/getting-started/#influxdb-setup)
in the Chronograf documentation.

### Add a Kapacitor instance

To add a Kapacitor instance to Chronograf:

1. In the left navigation bar, click the **Configuration** icon (cog-wheel).  A
list of InfluxDB sources is loaded.
<br/><br/><img src="/img/chronograf/kapacitor/Configuration01.png" alt="conifguration-open" style="max-width: 225px;" />
1. Locate the InfluxDB source in the list and in the right most column under the
"Acitve Kapacitor" heading, click **Add Config**.  The Configure Kapacitor page
loads with default settings.
<br/><br/><img src="/img/chronograf/kapacitor/Configuration02.png" alt="conifguration-new" style="max-width: 820px;"/>
1. In the grouping "Connection Details" set the values for Kapacitor URL and a
Name for this Kapacitor, also add username and password credentials if necessary.
<br/><br/><img src="/img/chronograf/kapacitor/Configuration03.png" alt="conifguration-details" style="max-width: 306px;"/>
1. Click the **Connect** button. If the "Connection Details" are correct a
success message is displayed and a new section will appear "Configure Alert
Endpoints".
<br/><br/><img src="/img/chronograf/kapacitor/Configuration04.png" alt="conifguration-success" style="max-width: 929px;" />
1. If a third party alert service or SMTP is used, update, the third party
settings in the "Configure Alert Endpoints" section.
1. Return to the "Configuration" page by clicking on the **Configuration** icon
once more. The new Kapacitor instance should be listed under the "Active
Kapacitor" heading.
<br/><br/><img src="/img/chronograf/kapacitor/Configuration05.png" alt="conifguration-review" style="max-width: 807px;" />

### Managing Kapacitor from Chronograf

#### Event Handlers

One of key set of Kapacitor features that can be modified through Chronograf are
third party alert handlers.

##### To modify a third party alert handler:

1. In the Configuration table locate the Influxdata instance and its associated
Kapacitor instance, click the Kapacitor drop down menu and then the **edit icon**.
<br/><br/><img src="/img/chronograf/kapacitor/UpdateEndpoints01.png" alt="conifguration-open" style="max-width: 833px;" />
1. Click on the handler that needs to be changed. Its tab will become active.
<br/><br/><img src="/img/chronograf/kapacitor/UpdateEndpoints02.png" alt="conifguration-open" style="max-width: 898px;" />
1. Edit the relevant fields and click the **Update Config** button.
<br/><br/><img src="/img/chronograf/kapacitor/UpdateEndpoints03.png" alt="conifguration-open" style="max-width: 900px;" />
1. If the configuration properties are valid a success message will appear.
<br/><br/><img src="/img/chronograf/kapacitor/UpdateEndpoints04.png" alt="conifguration-open" style="max-width: 924px;" />
1. The updated configuration can be verified over the Kapacitor HTTP API.  For
example, to verify an updated SMTP configuration check the JSON document at the
endpoint `/kapacitor/v1/config/smtp`
(e.g. http<span>:</span><span>//</span>localhost<span>:</span>9092<span>/</span>kapacitor<span>/</span>v1<span>/</span>config<span>/</span>smtp).

For more information see the section [Configuration with the HTTP API](/kapacitor/v1.4/administration/configuration/#configuring-with-the-http-api).

### Creating Alerts in Chronograf

Alerts in Chronograf correspond to Kapacitor tasks designed specifically to
trigger alerts whenever the data stream values rise above or fall below
designated thresholds.  Please note that only the most common alerting use
cases are manageable through Chronograf.  These include:

* Thresholds with static ceilings, floors and ranges.
* Relative thresholds based on unit or percentage changes.
* Deadman switches.

More refined alerts and other tasks need to be defined directly in Kapacitor.

#### To create a basic static threshold alert based on the CPU measurements provided by Telegraf:

1. Open the Alert rules tab by clicking on the **Alerting** icon in the left
navigation bar and then on **Create** in the pop up menu. A table of alert
rules (Kapacitor tasks) will load. These are queried from Kapacitor.
<br/><br/><img src="/img/chronograf/kapacitor/CreateAlert01.png" alt="configuration-open" style="max-width: 189px;" />
1. Click on the **Create Rule** button. The Create/Edit rule page will load.
<br/><br/><img src="/img/chronograf/kapacitor/CreateAlert02.png" alt="configuration-open" style="max-width: 1210px;" />
1. Notice in the top left the rule name edit box with the string **Untitled Rule**.
Change this name to something sensible for the alert to be created.
<br/><br/><img src="/img/chronograf/kapacitor/CreateAlert03.png" alt="configuration-open" style="max-width: 328px;" />
1. In the section **Select a Time Series**, select a database, a measurement
and a field to be monitored.  Note that in the measurement one or more tags can
be selected.  However, selecting specific tags is not required. Note as well that
alongside each tag it is possible to select the tag for a _group by_ clause.
<br/><br/><img src="/img/chronograf/kapacitor/CreateAlert04.png" alt="configuration-open" style="max-width: 1219px;" />
1. In the section **Rule Conditions**, for this example, keep the tag
**Thresholds** selected.  In the drop down list box for the **is** clause, select
_less than_.  And, in the edit box for the quantity enter the value _80_, which
for this field means percent.
<br/><br/><img src="/img/chronograf/kapacitor/CreateAlert05.png" alt="configuration-open" style="max-width: 1212px;" />
1. In the section **Alert Message** keep the tab **smtp**.  Note that this
requires the SMTP handler to be correctly configured. Update the values for the
addressees and the message body.  Note as well that the bottom or _template_
text area accepts the template fields suggested just below it.  Click on a
template field to add it to the template.
<br/><br/><img src="/img/chronograf/kapacitor/CreateAlert06.png" alt="configuration-open" style="max-width: 1220px;" />
1. When the three key sections are correctly configured click the **Save Rule**
button. The rule list will load once again.
<br/><br/><img src="/img/chronograf/kapacitor/CreateAlert07.png" alt="configuration-open" style="max-width: 328px;" />
1. The new rule is visible in the list.  It can be opened for editing by
clicking on its name.
<br/><br/><img src="/img/chronograf/kapacitor/CreateAlert08.png" alt="configuration-open" style="max-width: 1216px;" />

The rule is also visible through the Kapacitor command line client.

**Example 1 &ndash; Viewing a Chronograf Alert in Kapacitor**

```
$ kapacitor list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
batch_load_test                                    batch     enabled   true      ["telegraf"."autogen"]
chronograf-v1-b12b2554-cf38-4d7e-af24-5b0cd3cecc54 stream    enabled   true      ["telegraf"."autogen"]
cpu_alert                                          stream    disabled  false     ["telegraf"."autogen"]
top_scores                                         stream    disabled  false     ["game"."autogen"]
```

Tasks (or alert rules) generated by Chronograf are listed with the `chronograf`
and version tokens (e.g. `v1`), followed by a UUID.

### Managing Tasks through Chronograf

Kapacitor tasks can be enabled, disabled and deleted using Chronograf.  This
applies even to tasks that were not generated as Chronograf alerts.



#### To enable a task through Chronograf:

1. Locate the task in the **Alert Rules** table.
1. In the column **Enabled**, toggle the state of the task from **disabled** to
**enabled** .  A message indicating the change of state will appear at the top of the page.

<br/><br/><img src="/img/chronograf/kapacitor/EnableDisableAlerts01.png" alt="enable-disable screenshot" style="max-width: 1208px;" />

The change of state can also be verified on the Kapacitor side by listing the
tasks with the command line client and checking the **Status** column.

**Example: Viewing a task enabled through Chronograf in Kapacitor**

```
$ kapacitor list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
batch_load_test                                    batch     enabled   true      ["telegraf"."autogen"]
chronograf-v1-b12b2554-cf38-4d7e-af24-5b0cd3cecc54 stream    enabled   true      ["telegraf"."autogen"]
chronograf-v1-fa28d99e-e875-4521-8bd2-463807522bbd stream    enabled   true      ["co2accumulator"."autogen"]
cpu_alert                                          stream    disabled  false     ["telegraf"."autogen"]
top_scores                                         stream    disabled  false     ["game"."autogen"]
```

#### To disable a task through Chronograf

1. Locate the task in the **Alert Rules** table.  See the screenshot above.
1. In the column **Enabled** toggle the state of the task from **enabled** to
**disabled**.  A message indicating the change of state will appear at the top of the page.

The change of state can also be verified on the Kapacitor side by listing the
tasks with the command line client and checking the _Status_ column.

**Example: Viewing a task disabled through Chronograf in Kapacitor**

```
$ kapacitor list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
batch_load_test                                    batch     enabled   true      ["telegraf"."autogen"]
chronograf-v1-b12b2554-cf38-4d7e-af24-5b0cd3cecc54 stream    enabled   true      ["telegraf"."autogen"]
chronograf-v1-fa28d99e-e875-4521-8bd2-463807522bbd stream    disabled  false     ["co2accumulator"."autogen"]
cpu_alert                                          stream    disabled  false     ["telegraf"."autogen"]
top_scores
```

#### To delete a task through Chronograf

1. Locate the task in the **Alert Rules** table.
1. Click on the **Delete** button in the final column of the table. A message
indicating that the task was deleted will appear at the top of the page.

<br/><br/><img src="/img/chronograf/kapacitor/DeleteRule01.png" alt="delete screenshot" style="max-width: 1208px;" />

The deletion can also be verified on the Kapacitor side by listing the tasks
with the command line client.

**Example: Verification of a task deleted through Chronograf**


```
$ kapacitor list tasks
ID                                                 Type      Status    Executing Databases and Retention Policies
batch_load_test                                    batch     enabled   true      ["telegraf"."autogen"]
chronograf-v1-b12b2554-cf38-4d7e-af24-5b0cd3cecc54 stream    enabled   true      ["telegraf"."autogen"]
cpu_alert                                          stream    disabled  false     ["telegraf"."autogen"]
top_scores                                         stream    disabled  false     ["game"."autogen"]
```

> Note: Please remember that all Kapacitor tasks are accessible through
Chronograf. When disabling, enabling and deleting tasks with Chronograf, be careful not to change, inadvertently, the state or existence of a task not
associated with the Chronograf alerts.

### Viewing alert tasks in Chronograf

Chronograf alerts are made visible in the Alert History page.

To view the page:

1. Click on the **Alerts** Icon in the left navigation bar. A menu will pop up.
2. In the pop-up menu select the item **History**.
<br/><br/><img src="/img/chronograf/kapacitor/ViewAlertHistory01.png" alt="delete screenshot" style="max-width: 197px;" />
3. The **Alert History** page will load with a table showing the alerts posted within the time frame defined by the dropdown filter in the top right corner of
the page.
<br/><br/><img src="/img/chronograf/kapacitor/ViewAlertHistory02.png" alt="delete screenshot" style="max-width: 1227px;" />


## Enabling security, multi-organization, and multi-user support

See [Managing security](/chronograf/latest/administration/managing-security) for details on configuring authentication options for Chronograf using the JWT and OAuth 2.0 authentication protocols.

After you configure OAuth 2.0 authentication in Chronograf, you can use the multi-organization and multi-user support described in detail here:

* [Managing organizations](/chronograf/latest/administration/managing-organizations)
* [Managing Chronograf users](/chronograf/latest/administration/managing-chronograf-users)


<!-- TODO ## Configuring Chronograf for InfluxDB Enterprise clusters) -->
