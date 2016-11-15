---
title: Glossary of Terms
menu:
  telegraf_1_1:
    weight: 10
    parent: concepts
---

## agent

An agent is the core part of Telegraf that gathers metrics from the declared inputs and sends to the declared outputs, based on the plugins enabled by the given configuration.

Related entries: [input plugin](/telegraf/v1.1/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.1/concepts/glossary/#output-plugin)

## aggregator plugin 

Aggregator Plugins receive raw metrics from input plugins and create aggregate metrics from them. 
The aggregate metrics are then passed to the configured output plugins.

Related entries: [input plugin](/telegraf/v1.1/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.1/concepts/glossary/#output-plugin), [processor plugin](/telegraf/v1.1/concepts/glossary/#processor-plugin)

## batch size 

The Telegraf agent sends metrics to outputs in batches, not individually. 
The batch size controls the size of each write batch that Telegraf sends to the output plugins.

Related entries: [output plugin](/telegraf/v1.1/concepts/glossary/#output-plugin)

## collection interval

The default global interval for collecting data from each input plugin. 
The collection interval can be overridden by each individual input plugin's configuration.

Related entries: [input plugin](/telegraf/v1.1/concepts/glossary/#input-plugin)

## collection jitter

Collection jitter is used to prevent every input plugin from collecting metrics simultaneously, which can have a measurable effect on the system.
Each collection interval, every input plugin will sleep for a random time between zero and the collection jitter before collecting the metrics.

Related entries: [collection interval](/telegraf/v1.1/concepts/glossary/#collection-interval), [input plugin](/telegraf/v1.1/concepts/glossary/#input-plugin)

## flush interval

The global interval for flushing data from each output plugin to its destination. 
This value should not be set lower than the collection interval.

Related entries: [collection interval](/telegraf/v1.1/concepts/glossary/#collection-interval), [flush jitter](/telegraf/v1.1/concepts/glossary/#flush-jitter), [output plugin](/telegraf/v1.1/concepts/glossary/#output-plugin)

## flush jitter

Flush jitter is used to prevent every output plugin from sending writes simultaneously, which can overwhelm some data sinks.
Each flush interval, every output plugin will sleep for a random time between zero and the flush jitter before emitting metrics. 
This helps smooth out write spikes when running a large number of telegraf instances.

Related entries: [flush interval](/telegraf/v1.1/concepts/glossary/#flush-interval), [output plugin](/telegraf/v1.1/concepts/glossary/#output-plugin)

## input plugin

Input plugins actively gather metrics and deliver them to the core agent, where aggregator, processor, and output plugins can operate on the metrics. 
In order to activate an input plugin, it needs to be enabled and configured in the Telegraf configuration file. 

Related entries: [aggregator plugin](/telegraf/v1.1/concepts/glossary/#aggregator-plugin), [collection interval](/telegraf/v1.1/concepts/glossary/#collection-interval), [output plugin](/telegraf/v1.1/concepts/glossary/#output-plugin), [processor plugin](/telegraf/v1.1/concepts/glossary/#processor-plugin)

## metric buffer

The metric buffer caches individual metrics when writes are failing for an output plugin. 
Telegraf will attempt to flush the buffer upon a successful write to the output. 
The oldest metrics are dropped first when this buffer fills.

Related entries: [output plugin](/telegraf/v1.1/concepts/glossary/#output-plugin)

## output plugin

Output plugins deliver metrics to their configured destination. In order to activate an output plugin, it needs to be enabled and configured in the corresponding section in the given config file.

Related entries: [aggregator plugin](/telegraf/v1.1/concepts/glossary/#aggregator-plugin), [flush interval](/telegraf/v1.1/concepts/glossary/#flush-interval), [input plugin](/telegraf/v1.1/concepts/glossary/#input-plugin), [processor plugin](/telegraf/v1.1/concepts/glossary/#processor-plugin)

## precision

Precision is the timestamp order with valid values being "ns", "us" (or "µs"), "ms", "s".
Precision settings are not used for service input plugins.

Related entries: 

## processor plugin 

Processor Plugins transform, decorate, and/or filter metrics collected by input plugins, passing the transformed metrics to output plugins.

Related entries: [aggregator plugin](/telegraf/v1.1/concepts/glossary/#aggregator-plugin), [input plugin](/telegraf/v1.1/concepts/glossary/#input-plugin), [output plugin](/telegraf/v1.1/concepts/glossary/#output-plugin)

## service input plugin

Service input plugins are input plugins that run in a passive collection mode while the Telegraf agent is running. 
Service input plugins listen on a socket for known protocol inputs, or actively apply their own logic to collect metrics and deliver them to the Telegraf agent at will.

Related entries: 
