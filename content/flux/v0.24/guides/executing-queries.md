---
title: Different ways to execute Flux queries
description:
menu:
  flux_0_24:
    name: Execute Flux queries
    parent: Guides
    weight: 1
---

There are multiple ways to execute Flux queries with InfluxDB and Chronograf v1.7+.
This guide covers the different options:

1. [Chronograf's Data Explorer](#chronograf-s-data-explorer)
2. [Influx CLI in "Flux mode"](#influx-cli-in-flux-mode)
3. [Influx CLI via parameter](#influx-cli-via-parameter)
4. [Influx CLI via STDIN](#influx-cli-via-stdin)
5. [InfluxDB API](#influxdb-api)

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

## InfluxDB API
Flux can be used to query InfluxDB through InfluxDB's `/api/v2/query` endpoint.
Queried data is returned in annotated CSV format.

In your request, set the following:

- `accept` header to `application/csv`
- `content-type` header to `application/vnd.flux`

This allows you to POST the Flux query in plain text and receive the annotated CSV response.

Below is an example `curl` command that queries InfluxDB using Flux:

{{< tab-labels >}}
{{% tabs %}}
[Multi-line](#)
[Single-line](#)
{{% /tabs %}}

{{< tab-content-container >}}

{{% tab-content %}}
```bash
curl localhost:8086/api/v2/query -XPOST -sS \
-H 'accept:application/csv' \
-H 'content-type:application/vnd.flux' \
-d 'from(bucket:"telegraf")
      |> range(start:-5m)
      |> filter(fn:(r) => r._measurement == "cpu")'
```
{{% /tab-content %}}

{{% tab-content %}}
```bash
curl localhost:8086/api/v2/query -XPOST -sS -H 'accept:application/csv' -H 'content-type:application/vnd.flux' -d 'from(bucket:"telegraf") |> range(start:-5m) |> filter(fn:(r) => r._measurement == "cpu")'
```
{{% /tab-content %}}

{{< /tab-content-container >}}
{{< /tab-labels >}}
