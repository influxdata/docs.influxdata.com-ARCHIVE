---
title: Chronograf 1.3 documentation

menu:
  chronograf:
    name: v1.3
    identifier: chronograf_1_3
    weight: 20
---

Chronograf is InfluxData's open source web application.
Use Chronograf with the other components of the [TICK stack](https://www.influxdata.com/products/) to visualize your monitoring data and easily create alerting and automation rules.

![Chronograf Collage](/img/chronograf/v1.3/chronograf-collage.png)

## Key Features

### Infrastructure Monitoring

* View all hosts and their statuses in your infrastructure
* View the configured applications on each host
* Monitor your applications with Chronograf's [pre-created dashboards](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf)

### Alert Management

Chronograf offers a UI for [Kapacitor](https://github.com/influxdata/kapacitor), InfluxData's data processing framework for creating alerts, running ETL jobs, and detecting anomalies in your data.

* Generate threshold, relative, and deadman alerts on your data
* Easily enable and disable existing alert rules
* View all active alerts on an alert dashboard
* Send alerts to the supported event handlers, including Slack, PagerDuty, HipChat, and [more](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#what-kapacitor-event-handlers-are-supported-in-chronograf)

### Data Visualization

* Monitor your application data with Chronograf's [pre-created dashboards](/chronograf/v1.3/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf)
* Create your own customized dashboards complete with various graph types and [template variables](/chronograf/v1.3/guides/dashboard-template-variables/)
* Investigate your data with Chronograf's data explorer and query templates

### Database Management

* Create and delete databases and retention policies
* View currently-running queries and stop inefficient queries from overloading your system
* Create, delete, and assign permissions to users (Chronograf supports [InfluxDB OSS](/influxdb/v1.3/query_language/authentication_and_authorization/#authorization) and InfluxEnterprise user management)
