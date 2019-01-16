---
title: How to use Flux in Chronograf dashboards
description: This guide walks through using Flux queries in Chronograf dashboard cells, what template variables are available, and how to use them.
menu:
  flux_0_7:
    name: Use Flux in dashboards
    parent: Guides
    weight: 7
---

[Chronograf](/chronograf/latest/) is the web user interface for managing for the
InfluxData platform that lets you create and customize dashboards that visualize your data.
Visualized data is retrieved using either an InfluxQL or Flux query.
This guide walks through using Flux queries in Chronograf dashboard cells.

## Using Flux in dashboard cells

---

_**Chronograf v1.7+** and **InfluxDB v1.7 with [Flux enabled](/flux/v0.7/introduction/installation)**
are required to use Flux in dashboards._

---

To use Flux in a dashboard cell, either create a new cell or edit an existing cell
by clicking the **pencil** icon in the top right corner of the cell.
To the right of the **Source dropdown** above the graph preview, select **Flux** as the source type.

![Flux in Chronograf dashboard cells](/img/flux/flux-dashboard-cell.png)

> The Flux source type is only available if your data source has
> [Flux enabled](/flux/v0.7/introduction/installation).

This will provide **Schema**, **Script**, and **Functions** panes.

### Schema pane
The Schema pane allows you to explore your data and add filters for specific
measurements, fields, and tags to your Flux script.

<img src="/img/flux/flux-dashboard-add-filter.png" style="max-width:316px" title="Add a filter from the Schema panel">

### Script pane
The Script pane is where you write your Flux script.
In its default state, the **Script** pane includes an optional [Script Wizard](/chronograf/v1.7/guides/querying-data/#explore-data-with-flux)
that uses selected options to build a Flux query for you.
The generated query includes all the relevant functions and [template variables](#template-variables-in-flux)
required to return your desired data.

### Functions pane
The Functions pane provides a list of functions available in your Flux queries.
Clicking on a function will add it to the end of the script in the Script pane.
Hovering over a function provides documentation for the function as well as links
to deep documentation.

### Dynamic sources
Chronograf can be configured with multiple data sources.
The **Sources dropdown** allows you to select a specific data source to connect to,
but a **Dynamic Source** options is also available.
With a dynamic source, the cell will query data from whatever data source to which
Chronograf is currently connected.
Connections are managed under Chronograf's **Configuration** tab.

### View raw data
As you're building your Flux scripts, each function processes or transforms your
data in ways specific to the function.
It can be helpful to view the actual data in order to see how it is being shaped.
The **View Raw Data** toggle above the data visualization switches between graphed
data and raw data shown in table form.

![View raw data](/img/flux/flux-dashboard-view-raw.png)

_The **View Raw Data** toggle is only available when using Flux._

## Template variables in Flux
Chronograf [template variables](/chronograf/latest/guides/dashboard-template-variables/)
allow you to alter specific components of cells’ queries using elements provided in the
Chronograf user interface.

In your Flux query, reference template variables just as you would reference defined Flux variables.
The following example uses Chronograf's [predefined template variables](#predefined-template-variables),
`dashboardTime`, `upperDashboardTime`, and `autoInterval`:

```js
from(bucket: "telegraf/autogen")
  |> filter(fn: (r) => r._measurement == "cpu")
  |> range(
    start: dashboardTime,
    stop: upperDashboardTime
  )
  window(every: autoInterval)
```

### Predefined template variables

#### dashboardTime
The `dashboardTime` template variable represents the lower time bound of ranged data.
It's value is controlled by the time dropdown in your dashboard.
It should be used to define the `start` parameter of the `range()` function.

```js
dataSet
  |> range(
    start: dashboardTime
  )
```

#### upperDashboardTime
The `upperDashboardTime` template variable represents the upper time bound of ranged data.
It's value is modified by the time dropdown in your dashboard when using an absolute time range.
It should be used to define the `stop` parameter of the `range()` function.

```js
dataSet
  |> range(
    start: dashboardTime,
    stop: upperDashboardTime
  )
```
> As a best practice, always set the `stop` parameter of the `range()` function to `upperDashboardTime` in cell queries.
> Without it, `stop` defaults to "now" and the absolute upper range bound selected in the time dropdown is not honored,
> potentially causing unnecessary load on InfluxDB.

#### autoInterval
The `autoInterval` template variable represents the refresh interval of the dashboard
and is controlled by the refresh interval dropdown.
It's typically used to align window intervals created in
[windowing and aggregation](/flux/v0.7/guides/windowing-aggregating) operations with dashboard refreshes.

```js
dataSet
  |> range(
    start: dashboardTime,
    stop: upperDashboardTime
  )
  |> aggregateWindow(
    every: autoInterval,
    fn: mean
  )
```

### Custom template variables
<dt>
Chronograf does not yet support the use of custom template variables in Flux queries.
</dt>

## Using Flux and InfluxQL
Within individual dashboard cells, the use of Flux and InfluxQL is mutually exclusive.
However, a dashboard may consist of different cells, each using Flux or InfluxQL.
