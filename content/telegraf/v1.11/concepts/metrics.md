---
title: Telegraf metrics
description: Telegraf metrics are internal representations used to model data during processing and are based on InfluxDB's data model. Each metric component includes the measurement name, tags, fields, and timestamp.
menu:
  telegraf_1_11:
    name: Metrics
    weight: 10
    parent: Concepts
---

Telegraf metrics are the internal representation used to model data during
processing.  These metrics are closely based on InfluxDB's data model and contain
four main components:

- **Measurement name**: Description and namespace for the metric.
- **Tags**: Key/Value string pairs and usually used to identify the
  metric.
- **Fields**: Key/Value pairs that are typed and usually contain the
  metric data.
- **Timestamp**: Date and time associated with the fields.

This metric type exists only in memory and must be converted to a concrete
representation in order to be transmitted or viewed. Telegraf provides [output data formats][output data formats] (also known as *serializers*) for these conversions.  Telegraf's default serializer converts to [InfluxDB Line
Protocol][line protocol], which provides a high performance and one-to-one
direct mapping from Telegraf metrics.

[output data formats]: /telegraf/v1.11/data_formats/output/
[line protocol]: /telegraf/v1.11/data_formats/output/influx/
