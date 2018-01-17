---
title: Chronograf 1.4 documentation

menu:
  chronograf:
    name: v1.4
    identifier: chronograf_1_4
    weight: 1
---

Chronograf is InfluxData's open source web application.
Use Chronograf with the other components of the [TICK stack](https://www.influxdata.com/products/) to visualize your monitoring data and easily create alerting and automation rules.

![Chronograf Collage](/img/chronograf/v1.4/chronograf-collage.png)

## Key Features

### Infrastructure Monitoring

* View all hosts and their statuses in your infrastructure
* View the configured applications on each host
* Monitor your applications with Chronograf's [pre-created dashboards](/chronograf/latest/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf)

### Alert Management

Chronograf offers a UI for [Kapacitor](https://github.com/influxdata/kapacitor), InfluxData's data processing framework for creating alerts, running ETL jobs, and detecting anomalies in your data.

* Generate threshold, relative, and deadman alerts on your data
* Easily enable and disable existing alert rules
* View all active alerts on an alert dashboard
* Send alerts to the supported event handlers, including Slack, PagerDuty, HipChat, and [more](/chronograf/latest/troubleshooting/frequently-asked-questions/#what-kapacitor-event-handlers-are-supported-in-chronograf)

### Data Visualization

* Monitor your application data with Chronograf's [pre-created dashboards](/chronograf/latest/troubleshooting/frequently-asked-questions/#what-applications-are-supported-in-chronograf)
* Create your own customized dashboards complete with various graph types and [template variables](/chronograf/latest/guides/dashboard-template-variables/)
* Investigate your data with Chronograf's data explorer and query templates

### Database Management

* Create and delete databases and retention policies
* View currently-running queries and stop inefficient queries from overloading your system
* Create, delete, and assign permissions to users (Chronograf supports [OSS InfluxDB](/influxdb/latest/query_language/authentication_and_authorization/#authorization) and InfluxEnterprise user management)


### Multi-Organization and Multi-User Support

* Create organizations and assign users to those organizations
* Restrict access to administrative functions
* Allow users to setup and maintain unique dashboards for their organizations
