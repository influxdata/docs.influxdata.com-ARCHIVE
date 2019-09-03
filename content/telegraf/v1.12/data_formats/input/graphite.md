---
title: Graphite input data format
description: Us the Graphite data format to translate Graphite dot buckets directly into Telegraf measurement names, with a single value field, and without any tags.
menu:
  telegraf_1_12:
    name: Graphite
    weight: 40
    parent: Input data formats
---

The Graphite data format translates Graphite *dot* buckets directly into
Telegraf measurement names, with a single value field, and without any tags.
By default, the separator is left as `.`, but this can be changed using the
`separator` argument. For more advanced options, Telegraf supports specifying
[templates](#templates) to translate graphite buckets into Telegraf metrics.

## Configuration

```toml
[[inputs.exec]]
  ## Commands array
  commands = ["/tmp/test.sh", "/usr/bin/mycollector --foo=bar"]

  ## measurement name suffix (for separating different commands)
  name_suffix = "_mycollector"

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "graphite"

  ## This string will be used to join the matched values.
  separator = "_"

  ## Each template line requires a template pattern. It can have an optional
  ## filter before the template and separated by spaces. It can also have optional extra
  ## tags following the template. Multiple tags should be separated by commas and no spaces
  ## similar to the line protocol format. There can be only one default template.
  ## Templates support below format:
  ## 1. filter + template
  ## 2. filter + template + extra tag(s)
  ## 3. filter + template with field key
  ## 4. default template
  templates = [
    "*.app env.service.resource.measurement",
    "stats.* .host.measurement* region=eu-east,agent=sensu",
    "stats2.* .host.measurement.field",
    "measurement*"
  ]
```

### templates

For information on creating templates, see [Template patterns](/telegraf/v1.12/data_formats/template-patterns/).
