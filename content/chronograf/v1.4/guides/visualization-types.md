---
title: Visualization types in Chronograf
menu:
  chronograf_1_4:
    name: Visualization types
    weight: 20
    parent: Guides
---

## Visualization types supported in Chronograf

Chronograf's dashboards support seven visualization types, shown together in the **Visualization Type** selection view like this:

![Visualization Type selection view](/img/chronograf/chrono-visualization-types.png)


### Line Graph
Show time series in a line graph.

![Cluster connection details](/img/chronograf/v1.4/faq-viz-line.png)

### Stacked Graph
Show time series arranged on top of each other.

![Cluster connection details](/img/chronograf/v1.4/faq-viz-stacked.png)

### Step-Plot Graph
Show time series in a staircase graph.

![Ste-Plot Graph](/img/chronograf/v1.4/faq-viz-step.png)

### Single Stat
Show the most recent value of a time series.

![Single Stat screenshot](/img/chronograf/v1.4/faq-viz-single.png)

If a cell's query includes a [`GROUP BY` tag](/influxdb/latest/query_language/data_exploration/#group-by-tags) clause, Chronograf sorts the different [series](/influxdb/latest/concepts/glossary/#series) lexicographically and shows the most recent [field value](/influxdb/latest/concepts/glossary/#field-value) associated with the first series.
For example, if a query groups by the `name` [tag key](/influxdb/latest/concepts/glossary/#tag-key) and `name` has two [tag values](/influxdb/latest/concepts/glossary/#tag-value) (`chronelda` and `chronz`), Chronograf shows the most recent field value associated with the `chronelda` series.

If a cell's query includes more than one [field key](/influxdb/latest/concepts/glossary/#field-key) in the [`SELECT` clause](/influxdb/latest/query_language/data_exploration/#select-clause), Chronograf returns the most recent field value associated with the first field key in the `SELECT` clause.
For example, if a query's `SELECT` clause is `SELECT "chronogiraffe","chronelda"`, Chronograf shows the most recent field value associated with the `chronogiraffe` field key.

### Line Graph + Single Stat
Show time series in a line graph and overlay the time series' single most recent value.

![Cluster connection details](/img/chronograf/v1.4/faq-viz-linesingle.png)

### Bar Graph
Show time series in a bar chart.

![Cluster connection details](/img/chronograf/v1.4/faq-viz-bar.png)

### Gauge
Shows a single value in a gauge view.

![Cluster connection details](/img/chronograf/v1.4/gauge.png)
