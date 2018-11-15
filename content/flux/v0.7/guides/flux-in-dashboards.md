---
title: How to use Flux in Chronograf dashboards
description: This guide walks through using Flux queries in Chronograf dashboard cells, what template variables are available, and how to use them.
menu:
  flux_0_7:
    name: Use Flux in dashboards
    parent: Guides
    weight: 7
---

[Chronograf](/chronograf/latest/) is InfluxData’s open source web interface for building
and customizing dashboards that visualize your data.
Visualized data is retrieved using either an InfluxQL or Flux query.
This guide walks through using Flux queries in Chronograf dashboard cells.

## Using Flux in dashboard cells

---

_**Chronograf v1.7+** is required to use Flux in dashboards._

---

To use Flux in a dashboard cell, either create a new cell or edit an existing cell
by clicking the **pencil** icon in the top right corner of the cell.
To the right of the dropdown above the graph preview, select **Flux** as the source type.

![Flux in Chronograf dashboard cells](/img/flux/flux-dashboard-cell.png)

This will provide **Schema**, **Script**, and **Functions** panes.
The Schema pane allows you to explore your data.
The Script pane is where you write your Flux script.
The Functions pane provides a list of functions available in your Flux queries.

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
