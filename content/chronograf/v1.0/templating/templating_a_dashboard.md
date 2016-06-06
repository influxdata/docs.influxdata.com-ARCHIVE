---
title: Templating a Dashboard

menu:
  chronograf_1:
    name: Templating a Dashboard
    weight: 20
    parent: Templating
---

Chronograf's template variables also work on dashboards.
Note that only visualizations that specify the relevant [`tmplTime()`](/chronograf/v1.0/templating/template_time_range/) and/or
[`tmplTagValue()`](/chronograf/v1.0/templating/template_tag_values/) will work with the template variables.

*Chronograf dashboard with template variables:*

![Tag template](/img/chronograf/v0.11/template-dashboard.gif)
