---
title: Telegraf data formats
description: Telegraf supports input data formats and output data formats for converting input and output data.
menu:
   telegraf_1_14:
     name: Data formats
     weight: 50
---
This section covers the input data formats and output data formats used in the Telegraf plugin-driven server agent component of the InfluxData time series platform.

## [Telegraf input data formats](/telegraf/v1.14/data_formats/input/)

[Telegraf input data formats](/telegraf/v1.14/data_formats/input/) (also known as parsers) supports parsing input data formats into metrics for InfluxDB Line Protocol, JSON, Graphite, Value, Nagios, Collectd, and Dropwizard.

## [Telegraf output data formats](/telegraf/v1.14/data_formats/output/)

[Telegraf output data formats](/telegraf/v1.14/data_formats/output/) (also known as serializers) can serialize metrics into output data formats for InfluxDB Line Protocol, JSON, and Graphite, Carbon2, ServiceNow Metrics, Splunk Metrics, and Wavefront.

## [Telegraf template patterns](/telegraf/v1.14/data_formats/template-patterns/)

[Telegraf template patterns](/telegraf/v1.14/data_formats/template-patterns/) are used to define templates for use with parsing and serializing data formats in Telegraf.
