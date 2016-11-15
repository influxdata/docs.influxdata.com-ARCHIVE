---
title: Glossary of Terms
menu:
  telegraf_1_1:
    weight: 10
    parent: concepts
---

## agent

Agent is the core part of Telegraf that gathers metrics from the declared inputs and sends to the declared outputs, based on the plugins enabled by the given configuration.

## aggregator plugin 

Aggregator Plugins create aggregate metrics and run in between input and output plugins.

Related entries: 

## batch size 

The Telegraf agent will send metrics to outputs in batches. The batch size controls the size of writes that Telegraf sends to output plugins.

## collection interval

The global interval configured for the agent to collect data from all input plugins. The collection interval can be overridden by each individual plugin's configuration.

Related entries: 

## collection jitter

Collection jitter is used to introduce jitter to the metrics collection by a random amount.
Each plugin will sleep for a random time within jitter before collecting.
This can be used to avoid many plugins querying things at the same time, which can have a measurable effect on the system.

Related entries: 

## flush interval

The default flushing interval for all outputs. This values should not be set lower than the collection interval.

Related entries: [flush jitter](/telegraf/v1.1/concepts/glossary/#flush-jitter)

## flush jitter

A flush interval jitter, by a random amount of time. This helps avoid large write spikes for users running a large number of telegraf instances.

Related entries: 

## input plugin

Input plugins gather metrics and deliver them to the core agent. In order to activate an input plugin, it needs to be enabled and configured in the corresponding section in the given config file.

Related entries: 

## metric buffer

The Telegraf agent will individually cache metrics for each output when writes are failing for the output plugin. Telegraf will flush this buffer upon a successful write. Oldest metrics are dropped first when this buffer fills.

Related entries: 

## output plugin

Output plugins deliver metrics to their configured destination. In order to activate an output plugin, it needs to be enabled and configured in the corresponding section in the given config file.

Related entries: 

## precision

Precision is the timestamp order with valid values being "ns", "us" (or "µs"), "ms", "s".
Precision settings are not used for service input plugins.

Related entries: 

## processor plugin 

Processor Plugins transform, decorate, and/or filter metrics and run in between input and output plugins.

Related entries: 

## service input plugin

Service input plugins are a special type of input plugins that run in a backgrounded/detached mode while the Telegraf agent is up and running. They can implement a known protocol while listening for inputs on a socket, or actively apply their own logic to collect metrics and deliver them to the Telegraf agent at will.

Related entries: 

