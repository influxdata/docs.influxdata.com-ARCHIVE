---
title: Tag Value Template
newversionredirect: guides/dashboard-template-variables/#tag-values
menu:
  chronograf_1_0:
    name: Tag Value Template
    weight: 10
    parent: Templating
---

The following section will show you how to create a tag value template on a
graph.
If you'd like to follow along, see [Getting Started with Telegraf](https://docs.influxdata.com/telegraf/v1.0/introduction/getting-started-telegraf/) to get the data we use in this section.

### Template tag values with `tmplTagValue()`

Use the `tmplTagValue()` function to create a template variable that allows you to change the value of the query's [tag key(s)](/influxdb/v1.0/concepts/glossary/#tag-key).

**Example:**

In the `FILTER BY` section of the Query Builder:

1.
Select the tag key that you want to template (here, we choose `cpu`).

2.
Select `Make Variable` as the Tag Value.

3.
Save the title of your template variable in the `Make Tag Value Variable` window (here, we name it `cpu`).

Now you can select alternative tag values of the tag key `cpu` in the `cpu` dropdown in the top right corner.

> **Note:** If you'd like to enter the `tmplTagValue()` function manually, place in the `WHERE` clause:
> ```
> <tag_key> = tmplTagValue('<tag_key>','<variable_name>')
> ```
> Where `variable_name` is the title of the dropdown that appears in the top right corner.

*Chronograf visualization with a tag template variable:*

![Tag template](/img/chronograf/v0.11/tag-template.gif)
