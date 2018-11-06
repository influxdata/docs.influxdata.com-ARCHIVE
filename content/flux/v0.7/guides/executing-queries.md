---
title: Different ways to execute Flux queries
description:
menu:
  flux_0_7:
    name: Execute Flux queries
    parent: Guides
    weight: 5
---

There are multiple ways to execute Flux queries with InfluxDB and Chronograf v1.7+.
This guide covers the different options:

1. [Chronograf's Data Explorer](#chronograf-s-data-explorer)
2. [Influx CLI in "Flux mode"](#influx-cli-in-flux-mode)
3. [Influx CLI via parameter](#influx-cli-via-parameter)
4. [Influx CLI via STDIN](#influx-cli-via-stdin)

> Before attempting these methods, make sure Flux is enabled by setting
> `flux-enabled = true` in the `[http]` section of your InfluxDB configuration file.

## Chronograf's Data Explorer
Chronograf v1.7+ supports Flux in its Data Explorer.
Flux queries can be built, executed, and visualized from within the Chronograf user interface.

![Chronograf Data Explorer with Flux](/img/flux/flux-builder-start.gif)

## Influx CLI in "Flux mode"
InfluxDB v1.7+'s `influx` CLI includes a `-type` option which allows you specify
what type of interactive session to start.
`-type=flux` will start an interactive read-eval-print-loop (REPL) that supports Flux.

```bash
influx -type=flux
```

Any Flux query can be executed within the REPL.

## Influx CLI via parameter
Flux queries can also be passed to the Flux REPL as a parameter using the `influx` CLI's `-type=flux` option and the `-execute` parameter.
The accompanying string is executed as a Flux query and results are output in your terminal.

```bash
influx -type=flux -execute '<flux query>'
```

## Influx CLI via STDIN
Flux queries an be piped into the `influx` CLI via STDIN.
Query results are otuput in your terminal.

```bash
echo '<flux query>' | influx -type=flux
```
