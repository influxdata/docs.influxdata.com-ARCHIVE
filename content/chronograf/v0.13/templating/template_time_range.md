---
title: Time Range Template
newversionredirect: guides/dashboard-template-variables/
menu:
  chronograf_013:
    name: Time Range Template
    weight: 0
    parent: Templating
---

The following sections will show you how to create time range template on a
graph.
If you'd like to follow along, see [Getting Started with Telegraf](https://docs.influxdata.com/telegraf/v0.13/introduction/getting-started-telegraf/) to get the data we use in this section.

### Template time range with `tmplTime()`

Use the `tmplTime()` function to create a template variable that controls the query's time range.
This works for queries that use the query builder as well as manually entered queries.

**Example:**

Once you enter the query below, you can select alternative time ranges by clicking on the dropdown in the top right corner.

*Query:*
```
SELECT usage_idle FROM "telegraf"."default"."cpu" WHERE tmplTime()
```

*Chronograf visualization with a time template variable:*

![Time template](/img/chronograf/v0.11/time-template.gif)
