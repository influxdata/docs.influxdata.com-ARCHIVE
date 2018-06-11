---
title: Telegraf glossary of terms
description: This section includes definitions of important terms for related to Telegraf, the plug-in driven server agent component of the InfluxData time series platform.
menu:
  telegraf_1_7:
    name: Glossary of terms
    weight: 40
    parent: Concepts
---

## agent

An agent is the core part of Telegraf that gathers metrics from the declared input plugins and sends metrics to the declared output plugins, based on the plugins enabled by the given configuration.

Related entries: [input plugin](/telegraf/v1.6/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.6/concepts/glossary/#output-plugin)

## aggregator plugin

Aggregator plugins receive raw metrics from input plugins and create aggregate metrics from them.
The aggregate metrics are then passed to the configured output plugins.

Related entries: [input plugin](/telegraf/v1.6/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.6/concepts/glossary/#output-plugin), [processor plugin](/telegraf/v1.6/concepts/glossary/#processor-plugin)

## batch size

The Telegraf agent sends metrics to output plugins in batches, not individually.
The batch size controls the size of each write batch that Telegraf sends to the output plugins.

Related entries: [output plugin](/telegraf/v1.6/concepts/glossary/#output-plugin)

## collection interval

The default global interval for collecting data from each input plugin.
The collection interval can be overridden by each individual input plugin's configuration.

Related entries: [input plugin](/telegraf/v1.6/concepts/glossary/#input-plugin)

## collection jitter

Collection jitter is used to prevent every input plugin from collecting metrics simultaneously, which can have a measurable effect on the system.
Each collection interval, every input plugin will sleep for a random time between zero and the collection jitter before collecting the metrics.

Related entries: [collection interval](/telegraf/v1.6/concepts/glossary/#collection-interval), [input plugin](/telegraf/v1.6/concepts/glossary/#input-plugin)

## flush interval

The global interval for flushing data from each output plugin to its destination.
This value should not be set lower than the collection interval.

Related entries: [collection interval](/telegraf/v1.6/concepts/glossary/#collection-interval), [flush jitter](/telegraf/v1.6/concepts/glossary/#flush-jitter), [output plugin](/telegraf/v1.6/concepts/glossary/#output-plugin)

## flush jitter

Flush jitter is used to prevent every output plugin from sending writes simultaneously, which can overwhelm some data sinks.
Each flush interval, every output plugin will sleep for a random time between zero and the flush jitter before emitting metrics.
This helps smooth out write spikes when running a large number of Telegraf instances.

Related entries: [flush interval](/telegraf/v1.6/concepts/glossary/#flush-interval), [output plugin](/telegraf/v1.6/concepts/glossary/#output-plugin)

## input plugin

Input plugins actively gather metrics and deliver them to the core agent, where aggregator, processor, and output plugins can operate on the metrics.
In order to activate an input plugin, it needs to be enabled and configured in Telegraf's configuration file.

Related entries: [aggregator plugin](/telegraf/v1.6/concepts/glossary/#aggregator-plugin), [collection interval](/telegraf/v1.6/concepts/glossary/#collection-interval), [output plugin](/telegraf/v1.6/concepts/glossary/#output-plugin), [processor plugin](/telegraf/v1.6/concepts/glossary/#processor-plugin)

## metric buffer

The metric buffer caches individual metrics when writes are failing for an output plugin.
Telegraf will attempt to flush the buffer upon a successful write to the output.
The oldest metrics are dropped first when this buffer fills.

Related entries: [output plugin](/telegraf/v1.6/concepts/glossary/#output-plugin)

## output plugin

Output plugins deliver metrics to their configured destination. In order to activate an output plugin, it needs to be enabled and configured in Telegraf's configuration file.

Related entries: [aggregator plugin](/telegraf/v1.6/concepts/glossary/#aggregator-plugin), [flush interval](/telegraf/v1.6/concepts/glossary/#flush-interval), [input plugin](/telegraf/v1.6/concepts/glossary/#input-plugin), [processor plugin](/telegraf/v1.6/concepts/glossary/#processor-plugin)

## precision

The precision configuration setting determines how much timestamp precision is retained in the points received from input plugins. All incoming timestamps are truncated to the given precision.
Telegraf then pads the truncated timestamps with zeros to create a nanosecond timestamp; output plugins will emit timestamps in nanoseconds.
Valid precisions are `ns`, `us` or `µs`, `ms`, and `s`.

For example, if the precision is set to `ms`, the nanosecond epoch timestamp `1480000000123456789` would be truncated to `1480000000123` in millisecond precision and then padded with zeroes to make a new, less precise nanosecond timestamp of `1480000000123000000`.
Output plugins do not alter the timestamp further. The precision setting is ignored for service input plugins.

Related entries:  [aggregator plugin](/telegraf/v1.6/concepts/glossary/#aggregator-plugin), [input plugin](/telegraf/v1.6/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.6/concepts/glossary/#output-plugin), [processor plugin](/telegraf/v1.6/concepts/glossary/#processor-plugin), [service input plugin](/telegraf/v1.6/concepts/glossary/#service-input-plugin)

## processor plugin

Processor plugins transform, decorate, and/or filter metrics collected by input plugins, passing the transformed metrics to the output plugins.

Related entries: [aggregator plugin](/telegraf/v1.6/concepts/glossary/#aggregator-plugin), [input plugin](/telegraf/v1.6/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.6/concepts/glossary/#output-plugin)

## service input plugin

Service input plugins are input plugins that run in a passive collection mode while the Telegraf agent is running.
They listen on a socket for known protocol inputs, or apply their own logic to ingested metrics before delivering them to the Telegraf agent.

Related entries: [aggregator plugin](/telegraf/v1.6/concepts/glossary/#aggregator-plugin), [input plugin](/telegraf/v1.6/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.6/concepts/glossary/#output-plugin), [processor plugin](/telegraf/v1.6/concepts/glossary/#processor-plugin)
