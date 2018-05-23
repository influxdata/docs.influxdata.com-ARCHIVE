---
title: Chronograf 1.5 documentation
aliases:
  - /influxdb/v1.5/chronograf/

menu:
  chronograf:
    name: v1.5
    identifier: chronograf_1_5
    weight: 0
---

Chronograf is InfluxData's open source web application.
Use Chronograf with the other components of the [TICK stack](https://www.influxdata.com/products/) to visualize your monitoring data and easily create alerting and automation rules.

![Chronograf Collage](/img/chronograf/v1.5/chronograf-collage.png)

## Key features

### Infrastructure monitoring

* View all hosts and their statuses in your infrastructure
* View the configured applications on each host
* Monitor your applications with Chronograf's [pre-created dashboards](/chronograf/latest/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf)

### Alert management

Chronograf offers a UI for [Kapacitor](https://github.com/influxdata/kapacitor), InfluxData's data processing framework for creating alerts, running ETL jobs, and detecting anomalies in your data.

* Generate threshold, relative, and deadman alerts on your data
* Easily enable and disable existing alert rules
* View all active alerts on an alert dashboard
* Send alerts to the supported event handlers, including Slack, PagerDuty, HipChat, and [more](/chronograf/v1.5/troubleshooting/frequently-asked-questions/#what-kapacitor-event-handlers-are-supported-in-chronograf)

### Data visualization

* Monitor your application data with Chronograf's [pre-created dashboards](/chronograf/v1.5/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf)
* Create your own customized dashboards complete with various graph types and [template variables](/chronograf/v1.5/guides/dashboard-template-variables/)
* Investigate your data with Chronograf's data explorer and query templates

### Database management

* Create and delete databases and retention policies
* View currently-running queries and stop inefficient queries from overloading your system
* Create, delete, and assign permissions to users (Chronograf supports [InfluxDB OSS](/influxdb/latest/query_language/authentication_and_authorization/#authorization) and InfluxEnterprise user management)


### Multi-organization and multi-user support

* Create organizations and assign users to those organizations
* Restrict access to administrative functions
* Allow users to setup and maintain unique dashboards for their organizations
