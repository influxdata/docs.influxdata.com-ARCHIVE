---
title: Advanced Kapacitor usage
menu:
  chronograf_1_4:
    weight: 90
    parent: Guides
---

Chronograf provides a user interface for [Kapacitor](/kapacitor/latest/), InfluxData's processing framework for creating alerts, running ETL jobs, and detecting anomalies in your data.
This guide offers insights into how Kapacitor interacts with Chronograf and introduces advanced Kapacitor usage within Chronograf.

### Content

* [Alert History management](#alert-history-management)
* [TICKscript management](#tickscript-management)

## Alert History management

Chronograf stores the information on the Alert History page as time series data in InfluxDB.
It stores it in the `chronograf` database and in the `alerts` [measurement](/influxdb/latest/concepts/glossary/#measurement).
By default, those data are subject to an infinite [retention policy](/influxdb/latest/concepts/glossary/#retention-policy-rp) (RP), that is, InfluxDB stores them forever.
Users who expect to have a large number of alerts and users who do not want to store their alert history forever may want to shorten the [duration](/influxdb/latest/concepts/glossary/#duration) of that retention policy.

### Modifying the retention policy in Chronograf

Use the Chronograf Admin page to modify the retention policy in the `chronograf` database.
In the Databases tab:

#### Step 1: Locate the `chronograf` database and click on the infinity symbol (∞)

![RP in practice](/img/chronograf/v1.4/g-advkap-dur.png)

#### Step 2: Enter a different duration

The minimum allowable duration is one hour (`1h`) and the maximum is infinite (`INF`).
See the InfluxDB documentation for the list of [acceptable duration units](/influxdb/latest/query_language/spec/#duration-units).

#### Step 3: Click the green check mark to save your changes

InfluxDB only keeps data in the `chronograf` database that fall within that new duration; the system automatically deletes any data with timestamps that occur before the duration setting.

### Example

If you set the retention policy's duration to one hour (`1h`), InfluxDB automatically deletes any alerts that occurred before the past hour.
Those alerts no longer appear in your InfluxDB instance or on Chronograf's Alert History page.

Looking at the image below and assuming that the current time is 19:00 on April 27, 2017, only the first three alerts would appear in your alert history; they occurred within the previous hour (18:00 through 19:00).
The fourth alert, which occurred on the same day at 16:58:50, is outside the previous hour and would no longer appear in the InfluxDB `chronograf` database or on the Chronograf Alert History page.

![RP in practice](/img/chronograf/v1.4/g-advkap-rp.png)

## TICKscript management

Chronograf creates Kapacitor tasks using the information that you provide on the Rule Configuration page.
It uses that information to communicate with Kapacitor and populate Chronograf alert pages.
Pre-existing tasks, or [TICKscripts](/kapacitor/latest/tick/), that you created and enabled on your Kapacitor instance without using Chronograf, have limited functionality in the user interface.

In Chronograf, you can:

* View pre-existing tasks the Alert Rules page
* View pre-existing task activity on the Alert History page
* Enable and disable pre-existing tasks on the Alert Rules page (this is equivalent to the `kapacitor enable` and `kapacitor disable` commands)
* Delete pre-existing tasks the Alert Rules page (this is equivalent to the `kapacitor delete tasks` command)

You cannot edit pre-existing tasks on the Chronograf Alert Rules page.
The `mytick` task in the image below is a pre-existing task; its name appears on the Alert Rules page but you cannot click on it or edit its TICKscript in the interface.
Currently, you must manually edit your existing tasks and TICKscripts on your machine.

![Pre-existing task](/img/chronograf/v1.4/g-advkap-pretick.png)
