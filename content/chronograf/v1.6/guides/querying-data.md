---
title: Querying data in Chronograf
description: This tutorial guides you quickly through the essential steps required to create custom Chronograf dashboards for use with InfluxDB and the InfluxData Platform.
menu:
  chronograf_1_6:
    name: Creating dashboards
    weight: 30
    parent: Guides
---

There are two ways you can create a query in Chronograf's Data Explorer.


Click the **Add a Query** button to create an [InfluxQL](/influxdb/latest/query_language/) query.
In query editor mode, use the builder to select from your existing data and allow Chronograf to format the query for you.
Alternatively, manually enter and edit a query.
Chronograf allows you to move seamlessly between using the builder and manually editing the query; when possible, the interface automatically populates the builder with the information from your raw query.

For our example, the query builder is used to generate a query that shows the average idle CPU usage grouped by host (in this case, there are three hosts).
By default, Chronograf applies the [`MEAN()` function](/influxdb/latest/query_language/functions/#mean) to the data, groups averages into auto-generated time intervals (`:interval:`), and shows data for the past hour (`:dashboardTime:`).
Those defaults are configurable using the query builder or by manually editing the query.

In addition, the time range (`:dashboardTime:`) is [configurable on the dashboard](#step-6-configure-your-dashboard).

![Build your query](/img/chronograf/v1.6/g-dashboard-builder.png)

1. Click the Data Explorer icon in the left sidebar menu.
2. Use the builder to select from your existing data and allow Chronograf to format the query for you:
  * In the **DB.RetentionPolicy** column, select the database you want to query.
  * In the **Measurements & Tags** column, selected
  * In the **Fields** column,
    * **Group By**
    * **Compare**
    * **Fill**
3.  
Alternatively, manually enter
